// Setting up the svg chart height and width
var svgWidth = 960;
var svgHeight = 500;

// Setting up the margins
var margin = {
    top: 20, 
    right: 40,
    bottom: 60, 
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper and appending SVG group "chart" that will hold chart then shift by top and left margins
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Importing the data from the assets folder
d3.csv("assets/data/data.csv").then(function(state_data) {
   

    // Parsing the data/Cast as numbers for entry
    state_data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Creating the scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([5, d3.max(state_data, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(state_data, d => d.healthcare)])
        .range([height, 0]);

    // Creating the axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Appending axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Creating the circles and adding state abbreviations to each circle
    var circlesGroup = chartGroup.selectAll("circle")
        .data(state_data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "yellow")
        .attr("opacity", ".5")
        .attr("stroke", "black")
    
        // Creating the text elements for each circle
        chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "8px")
        .selectAll("tspan")
        .data(state_data)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare -.02);
        })
        .text(function(data) {
            return data.abbr
        });
            
    // Initializing the tooltip selector
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br> Amount of Population In Poverty %: ${d.poverty}<br> Population Without Healthcare %: ${d.healthcare}`)
        });
        
    // Calling the tooltip in the chart
    chartGroup.call(toolTip);

    // Creating event listeners to display and hide tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

    // Creating event listeners to mouseout of tooltip
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Creating the axes labels for the y portion of the graph  
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 1.30))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Population Without Healthcare %");

    // Creating the axes labels for the x portion of the graph
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Amount of Population In Poverty %");
});