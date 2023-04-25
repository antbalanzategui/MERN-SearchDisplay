import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import React, { useEffect } from "react";
import { getTooltip } from './utils.js'
import { getAverages } from './utils.js'
import './App.css'


/**
 * Antonio Balanzategui, 4/25/2023
 */
let svg;
const PieChart = ({ width, height }) => {
    useEffect(() => {
        const searchDataString = localStorage.getItem("searchData");
        if (searchDataString) {
            const keys = ["javascript", "python", "java"];

            //Call to method which receives averages as an object
            const meanData = getAverages();


            const pie = d3.pie()
                .value(d => d.value)
                .sort(null);

            // Creates arc or rather each "ARC" for EACH part of "PIE"" for respective attributes
            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(Math.min(width, height) / 3);

            // Color keys which line up with the previous keys of JavaScript, Python, Java
            const color = d3.scaleOrdinal()
                .domain(keys)
                .range(["#88304e", "#e23e57", "#522546"]);

            //Establishes a tooltip
            const tooltip = getTooltip("#pie-chart");

            // Removes pie chart on graph or rather the previous, prevents
            // generations of multiple charts
            d3.select("#pie-chart svg").remove();

            window.addEventListener("resize", function() {
                if (window.innerWidth < 768) {
                  tooltip.style("top", "0");
                } else {
                  tooltip.style("top", null);
                }
              });


            // Established svg
            svg = d3.select("#pie-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`);

            // Creates slices using previous arc attributes
            // along with color keys
            const slices = svg.selectAll("path")
                .data(pie(keys.map(key => ({key, value: meanData[key]}))))
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", d => color(d.data.key))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .on("mouseover", (event, d) => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    // Displays the tooltip as uppercase python: 68 -> Python: 68
                    tooltip.html(`${d.data.key.substring(0, 1).toUpperCase()}${d.data.key.substring(1)}: ${d.data.value}`)
                        .style("left", (event.pageX + width/10) + "px")
                        .style("top", (event.pageY - width/10) + "px")
                        .style("position", "absolute");
                })
                .on("mouseout", () => {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            // Creates legend for pie chart, once again
            const legend = svg.selectAll(".legend")
                // Uses .map to effect all items within "keys", uppercase once again
                .data(keys.map(key => key.charAt(0).toUpperCase() + key.slice(1)))
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${width / 2 - 125},${i * 20 - height / 2 + 20})`)
                .style("fill", "#B3B3B3");

            legend.append("rect")
                .attr("width", width/50)
                .attr("height", height/20)
                .attr("fill", d => color(d));

            legend.append("text")
                .text(d => d)
                .style("font-size", "1vw")
                .attr("x", 36)
                .attr("y", 12);
        } else {
            console.error("No search data found in localStorage.");
        }
    },);

    return (
        <div id="pie-chart"></div>
    );
};

export default PieChart;