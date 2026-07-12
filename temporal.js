// Adapted from the course events.csv temporal example.
// The CSV schema remains exactly: name,start,end,category.
const useColors = {
    Vacant: "#DDD7CE",
    Dining: "#C79A63",
    Rest: "#9DA9A3",
    Work: "#444444",
    Social: "#A7664B"
};

const formatHour = hour => {
    const wholeHour = Math.floor(hour);
    const minutes = Math.round((hour - wholeHour) * 60);
    const displayHour = wholeHour % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${wholeHour < 12 || wholeHour === 24 ? "AM" : "PM"}`;
};

d3.csv("data/chair-use.csv", row => ({
    ...row,
    start: +row.start,
    end: +row.end
})).then(data => {
    const categories = [...new Set(data.map(d => d.category))];

    d3.select("#temporal-legend")
        .selectAll("span")
        .data(categories)
        .join("span")
        .attr("class", "temporal-legend-item")
        .html(category => `<i class="temporal-swatch" style="background:${useColors[category]}"></i>${category}`);

    const width = 920;
    const height = 520;
    const margin = { top: 58, right: 34, bottom: 64, left: 142 };
    const rowHeight = 27;

    const x = d3.scaleLinear()
        .domain([0, 24])
        .range([margin.left, width - margin.right]);

    const svg = d3.select("#temporal-canvas")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const axis = d3.axisBottom(x)
        .tickValues(d3.range(0, 25, 3))
        .tickFormat(hour => String(hour).padStart(2, "0"))
        .tickSize(-(height - margin.top - margin.bottom));

    svg.append("g")
        .attr("class", "temporal-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(axis);

    svg.append("text")
        .attr("class", "temporal-axis-note")
        .attr("x", margin.left)
        .attr("y", height - 18)
        .text("HOUR OF DAY  →");

    const rows = svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (_, index) => `translate(0,${margin.top + index * rowHeight})`);

    rows.append("text")
        .attr("class", "temporal-row-label")
        .attr("x", margin.left - 14)
        .attr("y", 14)
        .attr("text-anchor", "end")
        .text(d => d.name);

    rows.append("rect")
        .attr("class", "temporal-event")
        .attr("x", d => x(d.start))
        .attr("y", 0)
        .attr("width", d => Math.max(2, x(d.end) - x(d.start)))
        .attr("height", 18)
        .attr("fill", d => useColors[d.category]);

    rows.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", 22)
        .attr("y2", 22)
        .attr("stroke", "#DDD7CE")
        .attr("stroke-width", .7);

    const tooltip = d3.select("body").append("div").attr("class", "temporal-tooltip");

    rows.select(".temporal-event")
        .on("mousemove", (event, d) => {
            tooltip
                .style("opacity", 1)
                .style("left", `${event.clientX + 16}px`)
                .style("top", `${event.clientY + 16}px`)
                .html(`<strong>${d.name}</strong>${formatHour(d.start)} — ${formatHour(d.end)}<br>${d.category}`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));
}).catch(error => {
    d3.select("#temporal-canvas").append("p").text("Unable to load temporal data. Run this site with Live Server.");
    console.error(error);
});
