

async function load() {
    let data = await d3.csv("/assets/po1900.csv");
    let dataset = data.map(d => parseInt(d.population));
    return dataset;
}

async function load_country() {
    let data = await d3.csv("/assets/po1900.csv");
    let dataset = data.map(d => d.country);
    return dataset;
}
async function update() {
    let dataset = await load();
    let label = await load_country();

}



(async () => {
    let dataset = await load();
    let label = await load_country();
    console.log(dataset);
    console.log(label);
    // Continue with further processing using the dataset here
    var marge = {top: 10, bottom: 10, left: 10, right: 10}; //set the margin
    var svg = d3.select("svg"); // Select the SVG element
    var width = +svg.attr("width")-100; // Get the width of the SVG
    var height = +svg.attr("height"); // Get the height of the SVG
    var g = svg.append("g")
        .attr("transform", "translate(" + (marge.left+100) + "," + (marge.top-10) + ")"); //transform set the position

    // Horizontal bar plot: x-axis for the population, y-axis for the index
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, width - marge.left - marge.right]);
    var xAxis = d3.axisBottom(xScale);

    xAxis.tickFormat(function(d) {
        return d/1000000 + "M";
    })


    var yScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, height - marge.top - marge.bottom])
        .padding(0.1);
    var yAxis = d3.axisLeft(yScale);

    yAxis.tickFormat(function(d) {
        return label[d];
    })

    g.append("g").attr("id","xAxis")
        .attr("transform", "translate(0," + (height - marge.top - marge.bottom) + ")")
        .call(xAxis);

    g.append("g").attr("id","yAxis")
        .call(yAxis);

    var gs = g.selectAll(".rect")
        .data(dataset)
        .enter()
        .append("g");

    gs.append("rect")
        .attr("y", function(d, i) {
            return yScale(i);
        })    
        .attr("x", 0)
        .attr("width", 0)
        .attr("height", yScale.bandwidth())
        .attr("fill", "blue")
        .attr("opacity",0.5)
        .transition() // Add a transition
        .duration(1000) // Duration of the transition
        .delay(function(d, i) {
            return i * 100; // Delay the transition for each bar
        })
        .attr("width", function(d) {
            return xScale(d);
        });

    gs.append("text")
        .attr("y", function(d, i) {
            return yScale(i) + yScale.bandwidth() / 2;
        })
        .attr("x", 0)
        .attr("dx", "0.35em")
        .attr("dy", "0.35em")
        .text(function(d) {
            return (d/1000000).toFixed(2) + "M";
        })
        .transition()
        .duration(1000)
        .delay(function(d, i) {
            return i * 100;
        })
        .attr("x", function(d) {
            return xScale(d)/2;
        }).attr("text-align","center");
})();







  

 
