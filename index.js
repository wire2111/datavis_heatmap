import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import { mydata } from "./data.js";
import { getData } from "./getData.js";

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
const DATA = await getData(URL);
//const DATA = mydata;


//#region global vars  

let NUM_PER_MONTH_RENDERED = [
  0,0,0,0,
  0,0,0,0,
  0,0,0,0
]

// there will be 12 rows of bars, one for each month
const dataPoints = DATA.monthlyVariance.length;
const dataPointsPerRow = Math.ceil(dataPoints / 12)
const barWidth = 6;
const barHeight = 35;
const P = 70;
const W = P + (barWidth * dataPointsPerRow) + P;
const H = P + (barHeight * 12) + P;
const legendWidth = 400;
const legendHeight = 30;
const xMin = d3.min(DATA.monthlyVariance, data => data.year); // 1753
const xMax = d3.max(DATA.monthlyVariance, data => data.year); // 2015
const vMin = d3.min(DATA.monthlyVariance, data => data.variance); // -6.976
const vMax = d3.max(DATA.monthlyVariance, data => data.variance); // 5.228
const baseTemp = DATA.baseTemperature; // 8.66
const minTemp = baseTemp + vMin; // 1.684
const maxTemp = baseTemp + vMax; // 13.888
const rangeTemp = maxTemp - minTemp;
const stepsTemp = rangeTemp / 9 // 1.356
const TEMP_DOMAIN = [minTemp]

for (let i = 1; i < 10; i++) {
  TEMP_DOMAIN.push(minTemp + (i * stepsTemp))
}

//#endregion

//#region scaling and axis stuff  

const xScale = d3.scaleLinear()
  .domain([xMin, xMax])
  .range([P, W - P])

const yScale = d3.scaleTime()
  .domain([new Date(2023, 0), new Date(2023, 11)])
  .range([P + (barHeight / 2), (H - P) - (barHeight / 2)]);

const xAxis = d3.axisBottom(xScale).ticks(20, "d");
const yAxis = d3.axisLeft(yScale).ticks(12, "%B")

function xStart(d) {
  const x = NUM_PER_MONTH_RENDERED[d.month - 1] * barWidth + P;
  NUM_PER_MONTH_RENDERED[d.month - 1] += 1;
  return x
}

function yStart(d) {
  const y = (d.month - 1) * barHeight + P;
  return y
}

const legendX = d3.scaleLinear()
  .domain([minTemp, maxTemp])
  .range([0, legendWidth])

const vScale = d3.scaleThreshold()
  .domain(TEMP_DOMAIN)
  .range([
    "#4575b4",
    "#74add1",
    "#abd9e9",
    "#e0f3f8",
    "#ffffbf",
    "#fee090",
    "#fdae61",
    "#f46d43",
    "#d73027",
  ]);

const legendXAxis = d3.axisBottom()
  .scale(legendX)
  .tickValues(vScale.domain())
  .tickFormat(d3.format(".1f"))

//#endregion

//#region render stuff  

const tooltip = d3.select("#vis")
  .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .attr("id", "tooltip")
    .text("");

const svg = 

d3.select("#vis")
  .append("svg")
    .attr("id", "svg")
    .attr("width", W)
    .attr("height", H);

svg.append("g")
  .attr("id", "x-axis")
  .attr("transform", `translate(0, ${H-P})`)
  .call(xAxis);

svg.append("g")
  .attr("id", "y-axis")
  .attr("transform", `translate(${P}, 0)`)
  .call(yAxis);

const legend = svg
  .append("g")
  .attr("transform", "translate(20, 40)")
  .attr("id", "legend")
  .call(legendXAxis)

legend
  .append("g")
  .selectAll("rect")
  .data(vScale.range())
  .enter()
  .append("rect")
  .style("fill", d => d)
  .attr("x", (d, i) => {return legendWidth / 9 * i})
  .attr("y", -legendHeight)
  .attr("width", legendWidth / 9)
  .attr("height", legendHeight)

svg.selectAll("rect")
  .data(DATA.monthlyVariance)
  .enter()
  .append("rect")
    .attr("class", "cell")
    .attr("x", d => xStart(d))
    .attr("y", d => yStart(d))
    .attr("width", barWidth)
    .attr("height", barHeight)
    .attr("fill", d => vScale(d.variance + baseTemp))
    .attr("data-month", d => d.month - 1) // needs to be 0-11 to pass fcc tests
    .attr("data-year", d => d.year)
    .attr("data-temp", d => baseTemp + d.variance)
    .attr("data-variance", d=> d.variance)
    .on("mouseover", e => {
      tooltip.html(`
        <p>Year: ${e.target.dataset.year}</p>
        <p>Month: ${e.target.dataset.month}</p>
        <p>Temp: ${e.target.dataset.temp}</p>
        <p>Variance: ${e.target.dataset.variance}</p>
      `)
      tooltip.style("top", e.pageY - 100 + "px")
      tooltip.style("left", e.pageX - 30 + "px")
      tooltip.style("visibility", "visible")
      tooltip.attr("data-year", e.target.dataset.year)
    })
    .on("mouseout", e => tooltip.style("visibility", "hidden"))

//#endregion