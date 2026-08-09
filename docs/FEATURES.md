# Feature plan

## Completed for the final

- Reframed the project around exactly seven required digital objects.
- Added a persistent chapter navigation and scroll-progress indicator.
- Combined the three early p5.js exercises into one coherent 2D chapter.
- Added contextual statements, technology notes, interaction prompts, and data disclosures to every object.
- Added a responsive editorial design system and accessible semantic structure.
- Kept a D3/GeoJSON map fallback when no Mapbox token is configured.
- Added a disclosed local-only poll mode when Firebase cannot connect.
- Added a disclosed local knowledge guide when the cloud agent cannot respond.
- Documented repository structure, setup, style, privacy, and submission requirements.

## External-service configuration

### Mapbox

The richer Mapbox basemap is optional. Add a public browser token to `mapbox-config.js`. Without it, `geospatial.js` renders the same route and locations with local GeoJSON and D3.

### Firebase poll

The browser configuration lives in `firebase-config.js`. Realtime Database rules live in `database.rules.json`. When the network is unavailable, votes are labeled **Local mode** and remain on the visitor’s device.

### Seat Guide

Deployment steps are documented in `CHATBOT_SETUP.md`. The OpenAI key must stay in Firebase Secret Manager and must never be committed. If the function is unavailable, the interface labels itself **Local guide** and uses a small on-device knowledge response set.

## Future extensions

- Replace synthetic chair-use data with an opt-in observation diary.
- Expand the geographic study to material extraction, labor, shipping, resale, and museum circulation.
- Add model annotations that connect 3D parts directly to nodes in the relational graph.
- Conduct keyboard and screen-reader user testing with multiple participants.
