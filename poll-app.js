document.addEventListener("DOMContentLoaded", () => {
    const options = [...document.querySelectorAll(".poll-option")];
    const status = document.getElementById("poll-status");
    const totalElement = document.getElementById("poll-total");
    const message = document.getElementById("poll-message");
    const config = window.FIREBASE_CONFIG;
    const voteKey = "dcm-setting-poll-v1";
    const localCountsKey = "dcm-setting-poll-local-counts-v1";
    const emptyCounts = { workspace: 0, dining: 0, reading: 0, gallery: 0 };
    let localMode = false;

    if (!options.length) return;

    const isConfigured = config
        && config.apiKey
        && config.databaseURL
        && !Object.values(config).some(value => String(value).includes("REPLACE_WITH"));

    if (!isConfigured) {
        startLocalMode("Shared results are unavailable; your response will stay on this device.");
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
        startLocalMode("Shared results are unavailable; your response will stay on this device.");
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
                startLocalMode("The network is unavailable; your response was saved only on this device.");
                saveLocalVote(choice);
            }
        });
    });

    // Do not leave the engagement component in a permanent connecting state.
    window.setTimeout(() => {
        if (status.textContent === "Offline" || status.textContent === "Connecting…") {
            startLocalMode("Shared results are unavailable; your response will stay on this device.");
        }
    }, 4500);

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

    function startLocalMode(text) {
        if (localMode) return;
        localMode = true;
        status.textContent = "Local mode";
        status.classList.remove("is-live");
        status.classList.add("is-error");
        message.textContent = text;
        renderCounts(readLocalCounts());
        const existing = localStorage.getItem(voteKey);
        options.forEach(option => {
            option.disabled = Boolean(existing);
            option.onclick = () => {
                if (!localStorage.getItem(voteKey)) saveLocalVote(option.dataset.choice);
            };
        });
        if (existing) setVotedState(existing);
    }

    function readLocalCounts() {
        try { return { ...emptyCounts, ...JSON.parse(localStorage.getItem(localCountsKey) || "{}") }; }
        catch (_) { return { ...emptyCounts }; }
    }

    function saveLocalVote(choice) {
        const counts = readLocalCounts();
        counts[choice] = (Number(counts[choice]) || 0) + 1;
        localStorage.setItem(localCountsKey, JSON.stringify(counts));
        localStorage.setItem(voteKey, choice);
        renderCounts(counts);
        setVotedState(choice);
    }

    function renderCounts(counts) {
        const total = options.reduce((sum, option) => sum + (Number(counts[option.dataset.choice]) || 0), 0);
        options.forEach(option => {
            const count = Number(counts[option.dataset.choice]) || 0;
            const percent = total ? Math.round((count / total) * 100) : 0;
            option.querySelector(".poll-count").textContent = count;
            option.querySelector(".poll-percent").textContent = `${percent}%`;
            option.querySelector(".poll-bar").style.setProperty("--poll-width", `${percent}%`);
        });
        totalElement.textContent = total;
    }
});
