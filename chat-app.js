document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("chat-form");
    if (!form) return;

    const input = document.getElementById("chat-input");
    const send = document.getElementById("chat-send");
    const messagesElement = document.getElementById("chat-messages");
    const status = document.getElementById("chat-status");
    const clear = document.getElementById("chat-clear");
    const suggestions = [...document.querySelectorAll(".chat-suggestions button")];
    const history = [];
    const sessionId = getSessionId();

    let chatWithSeatGuide;

    try {
        const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.FIREBASE_CONFIG);
        const functions = app.functions("us-central1");
        chatWithSeatGuide = functions.httpsCallable("chatWithSeatGuide", { timeout: 30000 });
        status.textContent = "Ready";
        status.classList.add("is-live");
    } catch (error) {
        setUnavailable("Seat Guide could not connect to Firebase.");
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const message = input.value.trim();
        if (!message || !chatWithSeatGuide || send.disabled) return;

        addMessage("You", message, "is-user");
        history.push({ role: "user", content: message });
        input.value = "";
        setBusy(true);
        const thinking = addMessage("Seat Guide", "Looking closely…", "is-guide is-thinking");

        try {
            const result = await chatWithSeatGuide({
                message,
                history: history.slice(-7, -1),
                sessionId
            });
            const response = result.data && result.data.response;
            if (!response) throw new Error("Empty response");
            thinking.querySelector("p").textContent = response;
            thinking.classList.remove("is-thinking");
            history.push({ role: "assistant", content: response });
            status.textContent = "Ready";
        } catch (error) {
            thinking.querySelector("p").textContent = friendlyError(error);
            thinking.classList.remove("is-thinking");
            thinking.classList.add("is-error");
            history.pop();
            status.textContent = "Try again";
        } finally {
            setBusy(false);
            input.focus();
        }
    });

    input.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    suggestions.forEach(button => {
        button.addEventListener("click", () => {
            input.value = button.textContent;
            form.requestSubmit();
        });
    });

    clear.addEventListener("click", () => {
        history.length = 0;
        messagesElement.querySelectorAll(".chat-message").forEach((message, index) => {
            if (index > 0) message.remove();
        });
        input.focus();
    });

    function addMessage(author, text, className) {
        const article = document.createElement("article");
        article.className = `chat-message ${className}`;
        const label = document.createElement("span");
        const body = document.createElement("p");
        label.textContent = author;
        body.textContent = text;
        article.append(label, body);
        messagesElement.append(article);
        messagesElement.scrollTop = messagesElement.scrollHeight;
        return article;
    }

    function setBusy(busy) {
        input.disabled = busy;
        send.disabled = busy;
        suggestions.forEach(button => button.disabled = busy);
        status.textContent = busy ? "Thinking…" : status.textContent;
    }

    function setUnavailable(message) {
        status.textContent = "Unavailable";
        status.classList.add("is-error");
        input.disabled = true;
        send.disabled = true;
        addMessage("Seat Guide", message, "is-guide is-error");
    }

    function friendlyError(error) {
        if (error.code === "functions/resource-exhausted") return "The guide has reached its request limit. Please wait a minute and try again.";
        if (error.code === "functions/invalid-argument") return "Please shorten or revise that question and try again.";
        if (error.code === "functions/failed-precondition") return "Seat Guide is not fully configured yet.";
        return "I couldn’t answer just now. Please try again in a moment.";
    }

    function getSessionId() {
        const key = "dcm-seat-guide-session-v1";
        let value = sessionStorage.getItem(key);
        if (!value) {
            value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            sessionStorage.setItem(key, value);
        }
        return value;
    }
});
