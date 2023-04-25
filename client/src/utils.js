import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


/**
 * Antonio Balanzategui, 4/25/2023
 */

// This function is used to create a tooltip for a particular 
// plot, it is used within all three plotting functions
export function getTooltip(element) {
    const tooltip = d3.select(element)
        .append("div")
        .attr("class", "tooltip")
        .style("color", "#B3B3B3")
        .style("opacity", 0);
    return tooltip;
}
// This function is used to receive the averages of the data which was put into the localStorage
// Specifically only used for the Pie Chart and Histogram
export function getAverages() {
    const searchDataString = localStorage.getItem("searchData");
    const data = JSON.parse(searchDataString).searchData;
    const keys = ["javascript", "python", "java"];
    const dataMean = {};
    keys.forEach(key => {
        dataMean[key] = Math.round(d3.mean(data, d => d[key]));
    });
    return dataMean;
}

