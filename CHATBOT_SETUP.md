# Seat Guide setup

Seat Guide uses a Firebase callable Cloud Function so the OpenAI API key never appears in browser code or Git history. The function also validates requests, limits each network address to eight requests per minute, and stores question/response records in the existing Firebase Realtime Database under the server-only `chatbot` path.

## One-time configuration

1. Install dependencies: `npm --prefix functions install`
2. Sign in to Firebase: `firebase login`
3. Store the secret: `firebase functions:secrets:set OPENAI_API_KEY`
4. Deploy the function and database rules: `firebase deploy --only functions,database`

The secret command prompts for the OpenAI API key without adding it to a project file. Do not put the key in `firebase-config.js`, `chat-app.js`, `.env`, or any committed file.

## Local checks

- Run the function tests: `npm --prefix functions test`
- Run lint: `npm --prefix functions run lint`
- Serve the site from the repository root with a local web server; opening `index.html` as a `file://` URL can prevent Firebase requests.

The browser calls `chatWithSeatGuide` in Firebase region `us-central1`. If the function region changes, update the region in `chat-app.js` to match.
