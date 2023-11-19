import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { mydata } from "./data.js";
import { getData } from "./getData.js";

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
//const DATA = await getData(URL);
const DATA = mydata;


//#region global vars

let NUM_PER_MONTH_RENDERED = [
  "make this 1 indexed",
  0,0,0,0,
  0,0,0,0,
  0,0,0,0
]

const W = 1000;
const H = 600;
const P = 40;

const xMin = d3.min(DATA.monthlyVariance, data => data.year); // 1753
const xMax = d3.max(DATA.monthlyVariance, data => data.year); // 2015
const yMin = d3.min(DATA.monthlyVariance, data => data.month); // 1
const yMax = d3.max(DATA.monthlyVariance, data => data.month); // 12
const vMin = d3.min(DATA.monthlyVariance, data => data.variance); // -6.976
const vMax = d3.max(DATA.monthlyVariance, data => data.variance); // 5.228

const baseTemp = DATA.baseTemperature; // 8.66

const dataPoints = DATA.monthlyVariance.length;

// there will be 12 rows of bars, one for each month
const barWidth = (W * 12) / dataPoints;
const barHeight = H / 12;
 
//#endregion

//#region scaling and axis stuff

const xScale = d3.scaleTime()
  .domain([xMin, xMax])
  .range([P, W - P]);

const yScale = d3.scaleTime()
  .domain([yMin, yMax])
  .range([P, H - P]);

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

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

function xStart(d) {
  const x = NUM_PER_MONTH_RENDERED[d.month] * barWidth;
  NUM_PER_MONTH_RENDERED[d.month] += 1;
  return x
}

function yStart(d) {
  const y = (d.month - 1) * barHeight
  return y
}

//#endregion

//#region render stuff

const svg = d3.select("#vis")
  .append("svg")
    .attr("id", "svg")
    .attr("width", W)
    .attr("height", H);

svg.selectAll("rect")
  .data(DATA.monthlyVariance)
  .enter()
  .append("rect")
    .attr("x", d => xStart(d))
    .attr("y", d => yStart(d))
    .attr("width", barWidth)
    .attr("height", barHeight)
    .attr("fill", d => vScale(d.variance))
    .attr("data-month", d => d.month)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => baseTemp + d.variance);

//#endregion