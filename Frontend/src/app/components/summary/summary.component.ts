import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import * as d3 from 'd3';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  data: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.fetchSolarGrowthData();
  }

  // Fetch data from the API
  fetchSolarGrowthData(): void {
    const token = localStorage.getItem('token');  // Retrieve the token from localStorage

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://138.197.126.184:3000/api/solarGrowth', {
      headers: {
        'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
      }
    }).then((response) => {
        // Clean data before passing to D3 chart creation function
        this.data = response.data.map((item: any) => ({
          year: Number(item.year),  // Ensure 'year' is a number
          capacity_gw: Number(item.capacity_gw)  // Ensure 'capacity_gw' is a number
        })).filter((item: any) => !isNaN(item.year) && !isNaN(item.capacity_gw));  // Filter out invalid data

        this.createLineChart(this.data);  // Call the function to create chart
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Show an alert if the status is 401
          alert('Token Expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/'; 
        }
        console.error('Error fetching solar growth data:', error);
      });
  }

  createLineChart(data: any): void {
    console.log(data);
    // Set the dimensions of the chart
    const svg = d3.select('#line-chart')
                  .attr('width', 800)
                  .attr('height', 400);

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    // Set the x and y scales
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Create a line function
    const line = d3.line()
                   .x((d: any) => x(d.year))  // X-axis maps to year
                   .y((d: any) => y(d.capacity_gw));  // Y-axis maps to capacity_gw

    // Create an SVG group element for the chart
    const g = svg.append('g')
                 .attr('transform', `translate(${margin.left},${margin.top})`);

    // Manually calculate min and max values for year and capacity_gw
    const minYear = Math.min(...data.map((d: any) => d.year));
    const maxYear = Math.max(...data.map((d: any) => d.year));
    const minCapacity = Math.min(...data.map((d: any) => d.capacity_gw));
    const maxCapacity = Math.max(...data.map((d: any) => d.capacity_gw));

    // Set the domain for the x and y axes using calculated min/max values
    x.domain([minYear, maxYear]);
    y.domain([minCapacity, maxCapacity]);

    // Add x-axis
    g.append('g')
     .attr('class', 'x-axis')
     .attr('transform', `translate(0,${height})`)
     .call(d3.axisBottom(x));

    // Add y-axis
    g.append('g')
     .attr('class', 'y-axis')
     .call(d3.axisLeft(y));

    // Add the line path
    g.append('path')
     .data([data])
     .attr('class', 'line')
     .attr('d', line)
     .style('fill', 'none')
     .style('stroke', 'steelblue')
     .style('stroke-width', 2);
     // Add X-axis label
  svg.append('text')
  .attr('transform', `translate(${width / 2 + margin.left}, ${height + margin.top + 40})`)
  .style('text-anchor', 'middle')
  .text('Year');

// Add Y-axis label
svg.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 0 - margin.left + 50)
  .attr('x', 0 - height / 2 - margin.top)
  .style('text-anchor', 'middle')
  .text('Capacity (GW)');
  }  

  }
