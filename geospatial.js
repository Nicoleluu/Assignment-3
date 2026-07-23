/*
 * Eames DCM geospatial study
 * Structure adapted from the course's mapBox_Sketch_03.js example.
 * Base geography: PublicaMundi U.S. states GeoJSON
 * https://github.com/PublicaMundi/MappingAPI
 */
(function initGeospatialStudy() {
    const container = document.getElementById("mapbox-canvas");
    const token = window.MAPBOX_ACCESS_TOKEN;
    const hasToken = Boolean(token && !token.includes("PASTE_YOUR"));

    if (!container || typeof mapboxgl === "undefined") return;

    const places = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    order: "01",
                    city: "Los Angeles, CA",
                    title: "Eames Office",
                    role: "Design",
                    date: "1946",
                    note: "Charles and Ray Eames developed the DCM through experiments in molding plywood into compound curves."
                },
                geometry: { type: "Point", coordinates: [-118.4695, 33.9951] }
            },
            {
                type: "Feature",
                properties: {
                    order: "02",
                    city: "Zeeland, MI",
                    title: "Herman Miller",
                    role: "Production",
                    date: "1946 onward",
                    note: "Herman Miller brought the molded-plywood chair into serial production and distribution."
                },
                geometry: { type: "Point", coordinates: [-86.0186, 42.8125] }
            },
            {
                type: "Feature",
                properties: {
                    order: "03",
                    city: "New York, NY",
                    title: "Museum of Modern Art",
                    role: "Collection",
                    date: "Design canon",
                    note: "Museum collection and exhibition placed the chair within a wider history of modern design."
                },
                geometry: { type: "Point", coordinates: [-73.9776, 40.7614] }
            }
        ]
    };

    const journey = {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            properties: { name: "DCM design journey" },
            geometry: {
                type: "LineString",
                coordinates: places.features.map(feature => feature.geometry.coordinates)
            }
        }]
    };

    if (!hasToken) {
        renderLocalPreview(container, places, journey);
        document.getElementById("map-reset")?.setAttribute("disabled", "");
        return;
    }

    mapboxgl.accessToken = token;

    const initialView = {
        center: [-96.2, 38.7],
        zoom: 3.15,
        bearing: 0,
        pitch: 0
    };

    const map = new mapboxgl.Map({
        container: "mapbox-canvas",
        style: hasToken ? "mapbox://styles/mapbox/light-v11" : {
            version: 8,
            sources: {},
            layers: [{ id: "paper", type: "background", paint: { "background-color": "#e7e2d8" } }]
        },
        ...initialView,
        attributionControl: false
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", async () => {
        const response = await fetch("data/us-states.geojson");
        if (!response.ok) throw new Error(`Could not load state boundaries (${response.status})`);
        const states = await response.json();

        map.addSource("states", { type: "geojson", data: states });
        map.addLayer({
            id: "states-fill",
            type: "fill",
            source: "states",
            paint: {
                "fill-color": [
                    "case",
                    ["in", ["get", "name"], ["literal", ["California", "Michigan", "New York"]]],
                    "#d5b889",
                    "#ece7de"
                ],
                "fill-opacity": [
                    "case",
                    ["in", ["get", "name"], ["literal", ["California", "Michigan", "New York"]]],
                    0.48,
                    0.22
                ]
            }
        });
        map.addLayer({
            id: "states-outline",
            type: "line",
            source: "states",
            paint: { "line-color": "#b7afa3", "line-width": 0.7, "line-opacity": 0.7 }
        });

        map.addSource("journey", { type: "geojson", data: journey });
        map.addLayer({
            id: "journey-line-shadow",
            type: "line",
            source: "journey",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#f8f6f2", "line-width": 7, "line-opacity": 0.92 }
        });
        map.addLayer({
            id: "journey-line",
            type: "line",
            source: "journey",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#b66545", "line-width": 2.5, "line-dasharray": [1.5, 1.4] }
        });

        map.addSource("places", { type: "geojson", data: places });
        map.addLayer({
            id: "place-halos",
            type: "circle",
            source: "places",
            paint: { "circle-radius": 12, "circle-color": "#f8f6f2", "circle-opacity": 0.94 }
        });
        map.addLayer({
            id: "place-points",
            type: "circle",
            source: "places",
            paint: {
                "circle-radius": 6,
                "circle-color": "#232323",
                "circle-stroke-color": "#c79a63",
                "circle-stroke-width": 2
            }
        });
        if (hasToken) {
            map.addLayer({
                id: "place-labels",
                type: "symbol",
                source: "places",
                layout: {
                    "text-field": ["format", ["get", "order"], { "font-scale": 0.72 }, "\n", {}, ["get", "city"], {}],
                    "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                    "text-size": 12,
                    "text-offset": [0, 1.65],
                    "text-anchor": "top",
                    "text-letter-spacing": 0.08,
                    "text-allow-overlap": true
                },
                paint: {
                    "text-color": "#232323",
                    "text-halo-color": "#f8f6f2",
                    "text-halo-width": 2
                }
            });
        } else {
            places.features.forEach(feature => {
                const label = document.createElement("div");
                label.className = "map-place-label";
                label.innerHTML = `<small>${feature.properties.order}</small>${feature.properties.city}`;
                new mapboxgl.Marker({ element: label, anchor: "top", offset: [0, 15] })
                    .setLngLat(feature.geometry.coordinates)
                    .addTo(map);
            });
        }

        map.on("mouseenter", "place-points", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "place-points", () => { map.getCanvas().style.cursor = ""; });
        map.on("click", "place-points", event => {
            const feature = event.features[0];
            const details = feature.properties;
            new mapboxgl.Popup({ offset: 18, closeButton: false, maxWidth: "290px" })
                .setLngLat(feature.geometry.coordinates)
                .setHTML(`
                    <div class="map-popup">
                        <span>${details.order} · ${details.role} · ${details.date}</span>
                        <h4>${details.title}</h4>
                        <p>${details.note}</p>
                    </div>
                `)
                .addTo(map);
        });
    });

    map.on("error", event => {
        if (event.error) console.error("Mapbox:", event.error.message);
    });

    document.getElementById("map-reset")?.addEventListener("click", () => {
        map.easeTo({ ...initialView, duration: 900 });
    });

    async function renderLocalPreview(target, pointData, lineData) {
        const response = await fetch("data/us-states.geojson");
        const states = await response.json();
        const width = 1100;
        const height = 610;
        const svg = d3.select(target).append("svg")
            .attr("class", "map-fallback")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("aria-label", "Preview of the DCM design journey across the United States");
        const projection = d3.geoAlbersUsa().fitExtent([[45, 55], [width - 45, height - 70]], states);
        const path = d3.geoPath(projection);
        const selected = new Set(["California", "Michigan", "New York"]);

        svg.selectAll("path.state")
            .data(states.features)
            .join("path")
            .attr("class", "state")
            .attr("d", path)
            .attr("fill", feature => selected.has(feature.properties.name) ? "#d5b889" : "#ece7de")
            .attr("fill-opacity", feature => selected.has(feature.properties.name) ? .72 : .5)
            .attr("stroke", "#b7afa3")
            .attr("stroke-width", .8);

        const line = d3.line()
            .x(coordinate => projection(coordinate)?.[0])
            .y(coordinate => projection(coordinate)?.[1]);
        svg.append("path")
            .attr("d", line(lineData.features[0].geometry.coordinates))
            .attr("fill", "none")
            .attr("stroke", "#f8f6f2")
            .attr("stroke-width", 8)
            .attr("stroke-linecap", "round");
        svg.append("path")
            .attr("d", line(lineData.features[0].geometry.coordinates))
            .attr("fill", "none")
            .attr("stroke", "#b66545")
            .attr("stroke-width", 2.5)
            .attr("stroke-dasharray", "8 7")
            .attr("stroke-linecap", "round");

        const locations = svg.selectAll("g.location")
            .data(pointData.features)
            .join("g")
            .attr("class", "location")
            .attr("transform", feature => `translate(${projection(feature.geometry.coordinates)})`);
        locations.append("circle").attr("r", 12).attr("fill", "#f8f6f2");
        locations.append("circle").attr("r", 6).attr("fill", "#232323").attr("stroke", "#c79a63").attr("stroke-width", 2);
        locations.append("text").attr("y", 25).attr("text-anchor", "middle").attr("class", "fallback-order").text(feature => feature.properties.order);
        locations.append("text").attr("y", 40).attr("text-anchor", "middle").attr("class", "fallback-city").text(feature => feature.properties.city);
    }
})();
