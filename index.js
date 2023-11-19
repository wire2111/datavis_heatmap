import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { mydata } from "./data.js";
import { getData } from "./getData.js";

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
//const DATA = await getData(URL);
const DATA = mydata;

const W = 1000;
const H = 600;
const P = 40;
const xMin = d3.min(DATA.monthlyVariance, data => data.year);
const xMax = d3.max(DATA.monthlyVariance, data => data.year);
const yMin = d3.min(DATA.monthlyVariance, data => data.month);
const yMax = d3.max(DATA.monthlyVariance, data => data.month);
const vMin = d3.min(DATA.monthlyVariance, data => data.variance);
const vMax = d3.max(DATA.monthlyVariance, data => data.variance);
const baseTemp = DATA.baseTemperature;


const xScale = d3.scaleTime()
  .domain([xMin, xMax])
  .range([P, W - P]);

const yScale = d3.scaleTime()
  .domain([yMin, yMax])
  .range([P, H - P]);

const vScale = d3.scaleLinear()
  .domain([vMin, vMax])
  .range(["blue", "red"]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);


console.log(DATA)