const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeRequest, requestKey } = require("./lib");

test("normalizes a valid chat request", () => {
    const result = normalizeRequest({ message: "  Why plywood?  ", history: [], sessionId: "session-1234" });
    assert.equal(result.message, "Why plywood?");
    assert.equal(result.sessionId, "session-1234");
});

test("rejects empty and oversized messages", () => {
    assert.throws(() => normalizeRequest({ message: " " }));
    assert.throws(() => normalizeRequest({ message: "x".repeat(601) }));
});

test("keeps only the latest six safe history items", () => {
    const history = Array.from({ length: 8 }, (_, index) => ({ role: index % 2 ? "assistant" : "user", content: `turn ${index}` }));
    const result = normalizeRequest({ message: "Next", history, sessionId: "session-1234" });
    assert.equal(result.history.length, 6);
    assert.equal(result.history[0].content, "turn 2");
});

test("hashes request identifiers consistently", () => {
    assert.equal(requestKey("127.0.0.1"), requestKey("127.0.0.1"));
    assert.notEqual(requestKey("127.0.0.1"), requestKey("127.0.0.2"));
});
