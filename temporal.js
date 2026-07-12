const temporalColors = {
    vacant: "#5f6c65",
    dining: "#e9b95e",
    rest: "#77a5df",
    work: "#d8ff62",
    social: "#ea725f"
};

const toMinutes = value => {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
};

const displayTime = value => {
    const [hour, minute] = value.split(":").map(Number);
    const hour12 = hour % 12 || 12;
    return `${hour12}:${String(minute).padStart(2, "0")} ${hour < 12 || hour === 24 ? "AM" : "PM"}`;
};

d3.csv("data/chair-use.csv", row => ({
    ...row,
    startMinute: toMinutes(row.start),
    endMinute: toMinutes(row.end),
    intensity: +row.intensity
})).then(data => {
    const categories = [...new Set(data.map(d => d.category))];

    d3.select("#temporal-legend")
        .selectAll("div")
        .data(categories)
        .join("div")
        .attr("class", "temporal-legend-item")
        .html(category => `<i class="temporal-swatch" style="background:${temporalColors[category]}"></i>${category}`);

    const size = 680;
    const center = size / 2;
    const innerRadius = 160;
    const outerRadius = 262;
    const angle = d3.scaleLinear().domain([0, 1440]).range([0, Math.PI * 2]);
    const radius = d3.scaleLinear().domain([1, 10]).range([innerRadius + 12, outerRadius]);

    const svg = d3.select("#temporal-canvas")
        .append("svg")
        .attr("viewBox", `0 0 ${size} ${size}`);

    const chart = svg.append("g").attr("transform", `translate(${center},${center})`);

    chart.selectAll(".temporal-guide")
        .data(d3.range(2, 11, 2))
        .join("circle")
        .attr("r", d => radius(d))
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,.09)");

    const hours = d3.range(0, 24, 2);

    chart.selectAll(".temporal-tick")
        .data(hours)
        .join("line")
        .attr("x1", d => Math.sin(angle(d * 60)) * (innerRadius - 5))
        .attr("y1", d => -Math.cos(angle(d * 60)) * (innerRadius - 5))
        .attr("x2", d => Math.sin(angle(d * 60)) * (outerRadius + 8))
        .attr("y2", d => -Math.cos(angle(d * 60)) * (outerRadius + 8))
        .attr("stroke", "rgba(255,255,255,.12)");

    chart.selectAll(".temporal-hour")
        .data(hours)
        .join("text")
        .attr("class", "temporal-hour")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("x", d => Math.sin(angle(d * 60)) * (outerRadius + 28))
        .attr("y", d => -Math.cos(angle(d * 60)) * (outerRadius + 28))
        .text(d => String(d).padStart(2, "0"));

    const arc = d3.arc()
        .startAngle(d => angle(d.startMinute))
        .endAngle(d => angle(d.endMinute))
        .innerRadius(innerRadius)
        .outerRadius(d => radius(d.intensity))
        .padAngle(.012)
        .cornerRadius(4);

    const tooltip = d3.select("body").append("div").attr("class", "temporal-tooltip");

    chart.selectAll(".temporal-activity")
        .data(data)
        .join("path")
        .attr("class", "temporal-activity")
        .attr("d", arc)
        .attr("fill", d => temporalColors[d.category])
        .attr("stroke", "#1c2923")
        .attr("stroke-width", 1.5)
        .on("mousemove", (event, d) => {
            tooltip
                .style("opacity", 1)
                .style("left", `${event.clientX + 16}px`)
                .style("top", `${event.clientY + 16}px`)
                .html(`<strong>${d.activity}</strong>${displayTime(d.start)} — ${displayTime(d.end)}<br>intensity ${d.intensity}/10`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));

    chart.append("circle")
        .attr("r", innerRadius - 15)
        .attr("fill", "#25332c")
        .attr("stroke", "rgba(255,255,255,.14)");

    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -34)
        .attr("fill", "#89958e")
        .style("font", "10px IBM Plex Mono")
        .style("letter-spacing", ".12em")
        .text("TOTAL CYCLE");

    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 16)
        .attr("fill", "#f4f1e9")
        .style("font", "500 54px Inter")
        .text("24h");

    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 45)
        .attr("fill", "#89958e")
        .style("font", "11px IBM Plex Mono")
        .text("duration × intensity");
}).catch(error => {
    d3.select("#temporal-canvas").append("p").text("Unable to load temporal data. Run this site with Live Server.");
    console.error(error);
});
