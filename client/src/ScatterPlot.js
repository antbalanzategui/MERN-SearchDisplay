import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import React, { useEffect} from "react";
import { getTooltip } from './utils.js'
import './App.css'


/**
 * Antonio Balanzategui, 4/25/2023
 */

    let svg;

    // ScatterPlot Component Responsible for ScatterPlot, takes in rowSelectionModel and rows
    // as props to use for logic when creating circles
    const ScatterPlot = ({ width, height, rowSelectionModel, rows}) => {
        useEffect(() => {
            const searchDataString = localStorage.getItem("searchData");
            if (searchDataString) {
                const searchData = JSON.parse(searchDataString).searchData;

                //This portion is to remove the current iteration of scatter plot on screen, as the handleResize does not
                //do so, if this was not present then multiple plots would be rendered (this is present in each render method)
                d3.select("#scatter-plot svg").remove();

                //Creates "svg" for scatter-plot
                svg = d3.select("#scatter-plot")
                    .append("svg")
                    .attr("viewBox", `0 0 ${width + 30} ${height + 50}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .append("g")
                    .attr("transform", `translate(${25},${25})`);

                //scaleTime operates on date objects, which we are able to receive from localStorage searchData of d.Week
                const xScale = d3.scaleTime()
                    .domain(d3.extent(searchData, d => d3.timeParse("%Y-%m-%d")(d.Week)))
                    .range([0, width]);

                //yScale only goes from 0 to 110, as shown in mp4 of assignment details
                const yScale = d3.scaleLinear()
                    .domain([0, 110])
                    .range([height, 0]);

                /**
                 * Next three constants
                 * create lines at particular locations for each
                 * object, python, java, javascript respectively
                 * not responsible for displaying, that is within
                 * "svg.append"
                 */
                const pythonLine = d3.line()
                    .x(d => xScale(new Date(d.Week)))
                    .y(d => yScale(d.python));

                const javaLine = d3.line()
                    .x(d => xScale(new Date(d.Week)))
                    .y(d => yScale(d.java));

                const javascriptLine = d3.line()
                    .x(d => xScale(new Date(d.Week)))
                    .y(d => yScale(d.javascript));

                // Tooltip which is responsible for the on hover effects, which
                // display statistics about the particular point, or even a line
                const tooltip = getTooltip("#scatter-plot")

                /**
                 * Next three "svg.append"
                 * are responsible for displaying lines
                 * which locations were established before
                 * in previous constants
                 */
                svg.append("path")
                    .datum(searchData)
                    .attr("class", "python-line")
                    .attr("d", pythonLine)
                    .attr("fill", "none")
                    .attr("stroke", "#e23e57")
                    .attr("stroke-width", 2)
                    .on("mouseover", (event, d) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("Python")
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px")
                            .style("position", "absolute");
                    })
                    .on("mouseout", () => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                svg.append("path")
                    .datum(searchData)
                    .attr("class", "java-line")
                    .attr("d", javaLine)
                    .attr("fill", "none")
                    .attr("stroke", "#522546")
                    .attr("stroke-width", 2)
                    .on("mouseover", (event, d) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("Java")
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px")
                            .style("position", "absolute");
                    })
                    .on("mouseout", () => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                svg.append("path")
                    .datum(searchData)
                    .attr("class", "javascript-line")
                    .attr("d", javascriptLine)
                    .attr("fill", "none")
                    .attr("stroke", "#88304e")
                    .attr("stroke-width", 2)
                    .on("mouseover", (event, d) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("JavaScript")
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px")
                            .style("position", "absolute");
                    })
                    .on("mouseout", () => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0)
                    });
                /**
                 * Next three select all, are responsible for creating circles
                 * on the graph
                 */
                svg.selectAll(".python")
                    .data(searchData)
                    .join("circle")
                    .attr("class", "python")
                    .attr("cx", d => {
                        return xScale(new Date(d.Week));
                    })
                    .attr("cy", d => yScale(d.python))
                    .attr("r", 3)
                    .attr("fill", d => {
                        // This piece of logic will be used within all three circles, Python, Java, and JavaScript
                        // Essentially it is using the information from the props ScatterPlot was passed to evaluate whether or
                        // not the current dot being drawn is one of the selected weeks, if it is, then the color will be as such
                        if (rowSelectionModel.some((selection_index) => rows[selection_index - 1].Week === d.Week)) {
                            return "#d9faff"; 
                        } else {
                            return "#e23e57";
                        }
                    })
                    .on("mouseover", (event, d) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("Python: " + d.python + "<br>" + "Week " + d.Week)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px")
                            .style("position", "absolute");

                    })
                    .on("mouseout", () => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                svg.selectAll(".java")
                    .data(searchData)
                    .join("circle")
                    .attr("class", "java")
                    .attr("cx", d => xScale(new Date(d.Week)))
                    .attr("cy", d => yScale(d.java))
                    .attr("r", 3)
                    .attr("fill", d => {
                        if (rowSelectionModel.some((selection_index) => rows[selection_index - 1].Week === d.Week)) {
                            return "#d9faff"; 
                        } else {
                            return "#522546";
                        }
                    })

                    .on("mouseover", (event, d) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("Java: " + d.java + "<br>" + "Week " + d.Week)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px")
                            .style("position", "absolute");
                    })
                    .on("mouseout", () => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                svg.selectAll(".javascript")
                    .data(searchData)
                    .join("circle")
                    .attr("class", "javascript")
                    .attr("cx", d => xScale(new Date(d.Week)))
                    .attr("cy", d => yScale(d.javascript))
                    .attr("r", 3)
                    .attr("fill", d => {
                        if (rowSelectionModel.some((selection_index) => rows[selection_index - 1].Week === d.Week)) {
                            return "#d9faff"; 
                        } else {
                            return "#88304e";
                        }
                    })
                    .on("mouseover", (event, d) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("JavaScript: " + d.javascript + "<br>" + "Week " + d.Week)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px")
                            .style("position", "absolute");
                    })
                    .on("mouseout", () => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%Y"));

                svg.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .call(xAxis);

                const yAxis = d3.axisLeft(yScale)
                    .tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110])
                    .tickFormat(d3.format("d"));

                svg.append("g")
                    .call(yAxis);

                // Title of graph
                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", 5 / 2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "2vw")
                    .style("fill", "#FFFFFF")
                    .text("Python/Java/JavaScript ScatterPlot");

            } else {
                console.error("No search data found in localStorage.");
            }

        }, [width, height, rowSelectionModel, rows]);

        return (
            <div id="scatter-plot"></div>
        );
    };
    export default ScatterPlot
