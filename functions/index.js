const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase, ServerValue } = require("firebase-admin/database");
const OpenAI = require("openai");
const { normalizeRequest, requestKey } = require("./lib");

initializeApp();

const openAIKey = defineSecret("OPENAI_API_KEY");
const WINDOW_MS = 60 * 1000;
const REQUESTS_PER_WINDOW = 8;

const instructions = `You are Seat Guide, a concise and thoughtful design-education companion embedded in an interactive study of Charles and Ray Eames's DCM chair. Help visitors observe and understand the chair's molded plywood seat and back, tubular steel frame, rubber shock mounts, ergonomics, manufacturing, 1946 context, use, and legacy. Connect answers to close looking and material reasoning. Use plain language, answer in no more than three short paragraphs, and invite observation when useful. Distinguish established facts from interpretation. If a question is unrelated to the DCM, briefly redirect it toward furniture, materials, design history, or the visitor's experience of the chair. Never claim to see the visitor or the live page.`;

exports.chatWithSeatGuide = onCall({
    region: "us-central1",
    secrets: [openAIKey],
    timeoutSeconds: 45,
    memory: "256MiB",
    cors: true,
    maxInstances: 5
}, async request => {
    let input;
    try {
        input = normalizeRequest(request.data);
    } catch (error) {
        throw new HttpsError("invalid-argument", error.message);
    }

    await enforceRateLimit(request.rawRequest.ip);

    if (!openAIKey.value()) {
        throw new HttpsError("failed-precondition", "OpenAI is not configured.");
    }

    try {
        const client = new OpenAI({ apiKey: openAIKey.value() });
        const response = await client.responses.create({
            model: "gpt-5.6",
            reasoning: { effort: "low" },
            instructions,
            input: [...input.history, { role: "user", content: input.message }],
            max_output_tokens: 350
        });

        const text = response.output_text && response.output_text.trim();
        if (!text) throw new Error("OpenAI returned no text.");

        await getDatabase().ref(`chatbot/sessions/${input.sessionId}`).push({
            question: input.message,
            response: text,
            createdAt: ServerValue.TIMESTAMP
        });

        return { response: text };
    } catch (error) {
        console.error("Seat Guide request failed", { name: error.name, status: error.status, message: error.message });
        throw new HttpsError("internal", "Seat Guide could not answer right now.");
    }
});

async function enforceRateLimit(ip) {
    const now = Date.now();
    const reference = getDatabase().ref(`chatbot/rateLimits/${requestKey(ip)}`);
    let allowed = false;

    await reference.transaction(current => {
        allowed = false;
        if (!current || now - current.windowStartedAt >= WINDOW_MS) {
            allowed = true;
            return { count: 1, windowStartedAt: now };
        }
        if (current.count >= REQUESTS_PER_WINDOW) return;
        allowed = true;
        return { count: current.count + 1, windowStartedAt: current.windowStartedAt };
    }, undefined, false);

    if (!allowed) throw new HttpsError("resource-exhausted", "Please wait before asking another question.");
}
