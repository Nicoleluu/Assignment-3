const crypto = require("node:crypto");

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_ITEMS = 6;

function normalizeRequest(data) {
    if (!data || typeof data.message !== "string") throw new Error("Message is required.");
    const message = data.message.trim();
    if (!message || message.length > MAX_MESSAGE_LENGTH) throw new Error("Message must be between 1 and 600 characters.");

    const history = Array.isArray(data.history) ? data.history.slice(-MAX_HISTORY_ITEMS) : [];
    const cleanHistory = history
        .filter(item => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
        .map(item => ({ role: item.role, content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH) }))
        .filter(item => item.content);

    const sessionId = typeof data.sessionId === "string" && /^[a-zA-Z0-9-]{8,80}$/.test(data.sessionId)
        ? data.sessionId
        : crypto.randomUUID();

    return { message, history: cleanHistory, sessionId };
}

function requestKey(ip) {
    return crypto.createHash("sha256").update(ip || "unknown").digest("hex").slice(0, 24);
}

module.exports = { MAX_MESSAGE_LENGTH, normalizeRequest, requestKey };
