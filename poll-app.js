document.addEventListener("DOMContentLoaded", () => {
    const options = [...document.querySelectorAll(".poll-option")];
    const status = document.getElementById("poll-status");
    const totalElement = document.getElementById("poll-total");
    const message = document.getElementById("poll-message");
    const config = window.FIREBASE_CONFIG;
    const voteKey = "dcm-setting-poll-v1";

    if (!options.length) return;

    const isConfigured = config
        && config.apiKey
        && config.databaseURL
        && !Object.values(config).some(value => String(value).includes("REPLACE_WITH"));

    if (!isConfigured) {
        status.textContent = "Setup needed";
        status.classList.add("is-error");
        message.textContent = "Add your Firebase configuration to firebase-config.js.";
        options.forEach(option => option.disabled = true);
        return;
    }

    let database;

    try {
        const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(config);
        database = app.database();
    } catch (error) {
        showError("Firebase could not start. Check the project configuration.");
        return;
    }

    const pollReference = database.ref("polls/dcm-setting/options");

    database.ref(".info/connected").on("value", snapshot => {
        const connected = snapshot.val() === true;
        status.textContent = connected ? "Live" : "Offline";
        status.classList.toggle("is-live", connected);
        status.classList.toggle("is-error", !connected);
    });

    pollReference.on("value", snapshot => {
        const counts = snapshot.val() || {};
        const total = options.reduce((sum, option) => {
            return sum + (Number(counts[option.dataset.choice]) || 0);
        }, 0);

        options.forEach(option => {
            const count = Number(counts[option.dataset.choice]) || 0;
            const percent = total ? Math.round((count / total) * 100) : 0;
            option.querySelector(".poll-count").textContent = count;
            option.querySelector(".poll-percent").textContent = `${percent}%`;
            option.querySelector(".poll-bar").style.setProperty("--poll-width", `${percent}%`);
        });

        totalElement.textContent = total;
    }, () => {
        showError("The poll cannot read Firebase. Check your Realtime Database rules.");
    });

    const existingVote = localStorage.getItem(voteKey);
    if (existingVote) setVotedState(existingVote);

    options.forEach(option => {
        option.addEventListener("click", async () => {
            if (localStorage.getItem(voteKey)) return;

            const choice = option.dataset.choice;
            options.forEach(button => button.disabled = true);
            message.textContent = "Saving your response…";

            try {
                await pollReference.child(choice).transaction(current => {
                    return (Number(current) || 0) + 1;
                });
                localStorage.setItem(voteKey, choice);
                setVotedState(choice);
            } catch (error) {
                options.forEach(button => button.disabled = false);
                showError("Your response was not saved. Please try again.");
            }
        });
    });

    function setVotedState(choice) {
        options.forEach(option => {
            option.disabled = true;
            option.classList.toggle("is-selected", option.dataset.choice === choice);
        });
        message.textContent = "Thank you. Your anonymous response was added.";
    }

    function showError(text) {
        status.textContent = "Unavailable";
        status.classList.remove("is-live");
        status.classList.add("is-error");
        message.textContent = text;
    }
});
