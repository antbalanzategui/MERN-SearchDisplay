import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import React, { useEffect } from "react";
import { getTooltip } from './utils.js'
import { getAverages } from './utils.js'
import './App.css';

let svg;

/**
 * Antonio Balanzategui, 4/25/2023
 */
const Histogram = ({ width, height }) => {
    useEffect(() => {
        // Receives search data string from localStorage
        const searchDataString = localStorage.getItem("searchData");
        // Checks to see whether or not searchDataString exists
        if (searchDataString) {
            const keys = ["javascript", "python", "java"];
            const colorScale = d3.scaleOrdinal()
                .domain(keys)
                .range(["#88304e", "#e23e57", "#522546"]);

            // calculate the mean for each key
            const meanData = getAverages();

            // Removes previous chart, implementation same as others previously
            d3.select("#histogram-chart svg").remove();

            // Establishes svg
            svg = d3.select("#histogram-chart")
                .append("svg")
                .attr("width", width + 50)
                .attr("height", height + 20)
                .append("g")
                .attr("transform", "translate(" + 50 + "," + 2 + ")");

            // Gives horizontal position of bars
            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(keys);

            // Normal scale, linear upwards
            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(Object.values(meanData))]);

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));

            // Gets tooltip for use
            const tooltip = getTooltip("#histogram-chart");

            window.addEventListener("resize", function() {
                if (window.innerWidth < 768) {
                  tooltip.style("top", "0");
                } else {
                  tooltip.style("top", null);
                }
              });

            // Responsible for Rectangles on Graph
            svg.selectAll("rect")
                .data(keys)
                .enter()
                .append("rect")
                .attr("x", d => x(d) + (x.bandwidth() - x.bandwidth() * 0.7) / 2)
                .attr("y", d => y(meanData[d]))
                .attr("width", x.bandwidth() * 0.7)
                .attr("height", d => height - y(meanData[d]))
                .attr("fill", d => colorScale(d))
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .on("mouseover", (event, d) => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    // Capitalizes first python: 68 -> Python: 68
                    tooltip.html(`${d.substring(0, 1).toUpperCase()}${d.substring(1)}: ${meanData[d]}`)
                        .style("left", (event.pageX + width/10) + "px")
                        .style("top", (event.pageY - height/10) + "px")
                        .style("position", "absolute");
                })
                .on("mouseout", () => {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0)
                });
                

        } else {
            console.error("No search data found in localStorage.");
        }

    },);

    return (
        <div id="histogram-chart"></div>
    );
};

export default Histogram;