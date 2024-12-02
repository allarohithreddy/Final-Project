import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  data: any[] = [];  // The data fetched from API
  private svg: any;
  private margin = 40;
  private width = 600 - this.margin * 2;
  private height = 400 - this.margin * 2;

  constructor() { }

  ngOnInit(): void {
    this.fetchSolarAdoptionData();
  }

  // Fetch data from the API for the report page
  fetchSolarAdoptionData(): void {
    const token = localStorage.getItem('token');  // Retrieve the token from localStorage

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://138.197.126.184:3000/api/solarAdoption', {
      headers: {
        'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
      }
    }).then((response) => {
        this.data = response.data;
        console.log(this.data)
        this.createSvg();
        this.drawBars(this.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Show an alert if the status is 401
          alert('Token Expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/'; 
        }
        console.error('Error fetching solar adoption data:', error);
      });
  }

  private createSvg(): void {
    this.svg = d3.select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + 20 + this.margin * 2)
      .append('g')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);
  }

  private drawBars(data: any[]): void {
    // Create the X-axis scale (based on the regions)
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.region))
      .padding(0.2);

    this.svg.append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis scale (percentage of adoption)
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.percentage)])  // Dynamic Y axis max based on the data
      .range([this.height, 0]);

    this.svg.append('g')
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: { region: string }) => x(d.region))
      .attr('y', (d: { percentage: number }) => y(d.percentage))
      .attr('width', x.bandwidth())
      .attr('height', (d: { percentage: number }) => this.height - y(d.percentage))
      .attr('fill', '#69b3a2');
  }
  

}
