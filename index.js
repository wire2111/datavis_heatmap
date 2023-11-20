import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import { mydata } from "./data.js";
import { getData } from "./getData.js";

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
//const DATA = await getData(URL);
const DATA = mydata;


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


const xMin = d3.min(DATA.monthlyVariance, data => data.year); // 1753
const xMax = d3.max(DATA.monthlyVariance, data => data.year); // 2015
const vMin = d3.min(DATA.monthlyVariance, data => data.variance); // -6.976
const vMax = d3.max(DATA.monthlyVariance, data => data.variance); // 5.228
const baseTemp = DATA.baseTemperature; // 8.66
 
//#endregion

//#region scaling and axis stuff  

const xScale = d3.scaleLinear()
  .domain([xMin, xMax])
  .range([P, W - P])

const yScale = d3.scaleTime()
  .domain([new Date(2023, 0), new Date(2023, 11)])
  .range([P + (barHeight / 2), (H - P) - (barHeight / 2)]);
  
const vScale = d3.scaleLinear()
  .domain([vMin, -6, -4, -2, 0, 1, 2, 4, vMax])
  .range([
    "rgb(69, 117, 180)",
    "rgb(116, 173, 209)",
    "rgb(171, 217, 233)",
    "rgb(224, 243, 248)",
    "rgb(255, 255, 191)",
    "rgb(254, 224, 144)",
    "rgb(253, 174, 97)",
    "rgb(244, 109, 67)",
    "rgb(215, 48, 39)",
  ]);

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


//#endregion

//#region render stuff  

var tooltip = d3.select("#vis")
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

svg.selectAll("rect")
  .data(DATA.monthlyVariance)
  .enter()
  .append("rect")
    .attr("class", "cell")
    .attr("x", d => xStart(d))
    .attr("y", d => yStart(d))
    .attr("width", barWidth)
    .attr("height", barHeight)
    .attr("fill", d => vScale(d.variance))
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
      console.log(e)
      tooltip.style("top", e.pageY - 100 + "px")
      tooltip.style("left", e.pageX - 30 + "px")
      tooltip.style("visibility", "visible")
      tooltip.attr("data-year", e.target.dataset.year)
    })
    .on("mouseout", e => tooltip.style("visibility", "hidden"))

//#endregion