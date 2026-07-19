// Assignment 5: CSV-based relational structure using the course node/edge schemas.
const relationalColors = {
    object: "#232323",
    part: "#C79A63",
    material: "#D7B98B",
    process: "#9BA69E",
    use: "#B88F85"
};

Promise.all([
    d3.csv("data/chair-nodes.csv"),
    d3.csv("data/chair-edges.csv")
]).then(([nodeRows, edgeRows]) => {
    const nodes = nodeRows.map(d => ({ ...d, age:+d.age, friends:+d.friends, size:+d.size }));
    const links = edgeRows.map(d => ({ ...d, since:+d.since, strength:+d.strength }));
    const categories = ["object", "part", "material", "process", "use"];

    d3.select("#relational-legend")
        .selectAll("span")
        .data(categories)
        .join("span")
        .attr("class", "relational-legend-item")
        .html(d => `<i class="relational-swatch" style="background:${relationalColors[d]}"></i>${d}`);

    const host = document.querySelector("#relational-canvas");
    host.replaceChildren();
    const width = host.clientWidth;
    const height = host.clientHeight;
    const svg = d3.select(host).append("svg").attr("viewBox", `0 0 ${width} ${height}`);
    const scene = svg.append("g");
    const zoom = d3.zoom().scaleExtent([.55, 3]).on("zoom", event => scene.attr("transform", event.transform));
    svg.call(zoom);

    const defs = svg.append("defs");
    defs.append("marker")
        .attr("id", "relational-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#4a4742")
        .attr("opacity", .55);

    const link = scene.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("class", "relational-link")
        .attr("stroke-width", d => 1 + d.strength * 2.2)
        .attr("marker-end", d => d.type === "directed" ? "url(#relational-arrow)" : null);

    const node = scene.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("class", "relational-node")
        .attr("r", d => d.size * .72)
        .attr("fill", d => d.color);

    const label = scene.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("class", "relational-label")
        .attr("text-anchor", "middle")
        .attr("dy", d => d.size * .72 + 17)
        .text(d => d.name);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(d => 138 + (1 - d.strength) * 80).strength(.72))
        .force("charge", d3.forceManyBody().strength(-780))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => d.size + 28).iterations(2));

    const tooltip = d3.select("body").append("div").attr("class", "relational-tooltip");
    const connected = (edge, datum) => edge.source.id === datum.id || edge.target.id === datum.id;
    const adjacent = (candidate, datum) => links.some(edge => connected(edge, datum) && (edge.source.id === candidate.id || edge.target.id === candidate.id));

    node.on("pointerenter", (event, d) => {
        const count = links.filter(edge => connected(edge, d)).length;
        link.style("stroke-opacity", edge => connected(edge, d) ? .86 : .05);
        node.style("opacity", candidate => candidate.id === d.id || adjacent(candidate, d) ? 1 : .14);
        label.style("opacity", candidate => candidate.id === d.id || adjacent(candidate, d) ? 1 : .14);
        tooltip
            .style("opacity", 1)
            .style("left", `${event.clientX + 15}px`)
            .style("top", `${event.clientY + 15}px`)
            .html(`${d.role.toUpperCase()} · ${d.department.toUpperCase()}<strong>${d.name}</strong>${count} direct relationship${count === 1 ? "" : "s"}`);
    }).on("pointermove", event => tooltip
        .style("left", `${event.clientX + 15}px`)
        .style("top", `${event.clientY + 15}px`)
    ).on("pointerleave", () => {
        link.style("stroke-opacity", null);
        node.style("opacity", 1);
        label.style("opacity", 1);
        tooltip.style("opacity", 0);
    }).call(d3.drag()
        .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(.25).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }));

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("cx", d => d.x).attr("cy", d => d.y);
        label.attr("x", d => d.x).attr("y", d => d.y);
    });

    d3.select("#relational-reset").on("click", () => svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity));
}).catch(error => {
    const host = document.querySelector("#relational-canvas");
    host.innerHTML = '<p class="relational-status is-error">Unable to load the network. Refresh the page to try again.</p>';
    console.error(error);
});
