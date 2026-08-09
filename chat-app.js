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
    let localMode = false;

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
            localMode = true;
            thinking.querySelector("p").textContent = localGuideResponse(message);
            thinking.classList.remove("is-thinking");
            history.push({ role: "assistant", content: thinking.querySelector("p").textContent });
            status.textContent = "Local guide";
            status.classList.remove("is-live");
            status.classList.add("is-error");
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

    function localGuideResponse(message) {
        const question = message.toLowerCase();
        if (question.includes("plywood") || question.includes("seat") || question.includes("back")) {
            return "Look at the seat and back as two separate, gently curved shells. Molded plywood allowed the Eameses to use thin layers for strength while shaping each surface to meet the body. Notice how the gap between them lets the frame stay visually light.";
        }
        if (question.includes("frame") || question.includes("support") || question.includes("steel")) {
            return "The welded steel frame works like a quiet diagram of forces: front and rear legs rise to support the seat, then continue toward the back. Its thin profile makes the heavier plywood shells appear to float. Rotate the 3D study and follow one tube through the structure.";
        }
        if (question.includes("1946") || question.includes("history") || question.includes("innovative")) {
            return "The DCM joined wartime experiments in molded plywood to an affordable postwar domestic chair. Separating the seat and back made the curves easier to produce and allowed each shell to respond to the body. Compare that economy of parts with the network study above.";
        }
        if (question.includes("comfort") || question.includes("body") || question.includes("ergonomic")) {
            return "Comfort comes from several small decisions rather than upholstery: a scooped seat, a curved back, a slight recline, and rubber shock mounts between shell and frame. In the 3D view, inspect how these angles support different postures without making the chair look heavy.";
        }
        return "Start with one detail: the gap between the two plywood shells, the continuous steel frame, or the chair’s slight backward lean. Each reveals how the DCM balances efficient manufacture with bodily comfort. Which of those details do you want to investigate?";
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
