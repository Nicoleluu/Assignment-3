# Take a Seat

**Take a Seat** is an interactive computational study of Charles and Ray Eames’s 1946 DCM (Dining Chair Metal). The final site examines one familiar object through seven digital structures rather than presenting seven unrelated exercises.

## Live project

- [Visit the website](https://nicoleluu.github.io/CDW-Final/)
- [View the public repository](https://github.com/Nicoleluu/CDW-Final)

## Seven digital objects

| # | Structure | Project chapter | Technology |
|---|---|---|---|
| 01 | 2D spatial canvas | Learning the chair by drawing it | p5.js |
| 02 | 3D spatial canvas | Form changes as you move | Three.js, WebGL, GLB |
| 03 | Temporal structure | A day measured in occupied time | D3.js, CSV |
| 04 | Relational structure | A chair is a network | D3 force simulation, CSV |
| 05 | Geospatial structure | Designed here, made there | Mapbox GL JS, D3, GeoJSON |
| 06 | Engagement component | Where would you sit? | Firebase Realtime Database |
| 07 | Agent | Ask the chair what to notice | OpenAI API, Firebase Functions |

Each chapter includes a contextual statement describing its intent, interaction, data, and references. The map, poll, and agent include local fallbacks so the site remains meaningful when a third-party service is unavailable.

## Run locally

Serve the repository root with a local web server. Opening `index.html` directly as a `file://` page can block dataset and model requests.

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

```text
.
├── index.html                 # Seven-chapter page structure and content
├── style.css                  # Responsive visual system
├── script.js                  # Navigation, progress, and reveal behavior
├── p5/                        # 2D observational and assembly studies
├── three/                     # 3D model viewer
├── data/                      # CSV and GeoJSON datasets
├── models/                    # GLB model assets
├── temporal.js                # Timeline visualization
├── relational.js              # Force-directed network
├── geospatial.js              # Mapbox map and D3 fallback
├── poll-app.js                # Shared poll and local fallback
├── chat-app.js                # Cloud agent and local guide fallback
├── functions/                 # Secure Firebase/OpenAI backend
└── docs/                      # Design and planning context
```

## Data and privacy

- The temporal and relational datasets are small, synthetic study datasets created for this project.
- The geospatial chapter uses U.S. state boundaries from PublicaMundi and three manually selected institutional locations.
- The poll stores aggregate choice counts only. It does not request names, emails, location, or demographics.
- The agent keeps the OpenAI key in a Firebase secret, validates input, and rate-limits requests. See [CHATBOT_SETUP.md](CHATBOT_SETUP.md).

## Documentation

- [Visual direction](docs/STYLE.md)
- [Feature plan](docs/FEATURES.md)
- [Project ideas and rationale](docs/PROJECT-IDEAS.md)
- [Submission checklist](SUBMISSION.md)

## Credits

Designed and built by Nicole Lu for Computational Design Workflows. The project is an educational study of the Eames DCM; product and institution names belong to their respective owners.
