
let cur_year = 1901
let pause = true
let delay_time = 250
let tooltipcountries = "China";
async function load_data(year) {
    // load_data(year) => the sorted top 15 countries's populaton in a list
    let data = await d3.csv("assets/po"+year+".csv");
    let dataset = data.map(d => parseInt(d.population));
    return dataset;
}

async function load(year) {
    // load_data(year) => the sorted top 15 countries's populaton in a list
    let data = await d3.csv("assets/po"+year+".csv");
    return data;
}

async function load_country(year) {
    // load_data(year) => the sorted top 15 countries name in a list
    let data = await d3.csv("assets/po"+year+".csv");
    let dataset = data.map(d => d.country);
    return dataset;
}
async function updateTooltop(cur_year,country) {
    console.log(cur_year)
    let lineData = await d3.csv("assets/po"+country+".csv");
    let populationData = lineData.map(d => +d.population)
    console.log(lineData.slice(0,cur_year-1901))
    //console.log(populationData)
    //console.log(d3.max(populationData))
    var tooltipyScale1 = d3.scaleLinear()
        .domain([0, d3.max(populationData)*1])
        .range([300,0]);
    var tooltipyAxis1 = d3.axisLeft(tooltipyScale1);
    var tooltipxScale = d3.scaleLinear() 
        .domain([1900,2022])
        .range([0,500]);
    d3.select("#tooltipyaxis").transition().call(tooltipyAxis1)
    d3.select("#toolline")
      .datum(lineData.slice(0,cur_year - 1901))
      .transition()
      .attr("fill", "none")
      .attr("stroke", function(){
        if (country == "India"){
            return "black"
        } else{
        return "rgb(255,255,255)"}
    })
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return tooltipxScale(d.year)+390 })
        .y(function(d) { return tooltipyScale1(d.population)+160 })
        )
    d3.select("#toolline2")
        .datum(lineData)
        .transition()
        .attr("fill", "none")
        .attr("opacity",0.3)
        .attr("stroke", function(){
          if (country == "India"){
              return "black"
          } else{
          return "rgb(255,255,255)"}
      })
        .attr("stroke-width", 3)
        .attr("d", d3.line()
          .x(function(d) { return tooltipxScale(d.year)+390 })
          .y(function(d) { return tooltipyScale1(d.population)+160 })
          )
    d3.select("#countrylabel").text(tooltipcountries).attr("x",550).attr("y",450).style("font-size", "45px").style("fill",
    function(){
        if (country == "Germany"|| country == "United Kingdom"){
            return "rgb(255,255,255)"
        } else{
        return "black"}
    })

    return lineData
}
async function updateTooltip(cur_year,country) {
    while (true){
        await updateTooltop(cur_year,country)
        await new Promise(resolve => setTimeout(resolve, 300))

    }


}

async function update(){
    let old_data = await load(1900)
    let old_population = await load_data(1900);
    let old_countries = await load_country(1900)
    let new_data = await load(cur_year)
    let dataset = await load_data(cur_year);
    let countries = await load_country(cur_year)
    var marge = {top: 10, bottom: 10, left: 10, right: 10}; //set the margin
    var svg = d3.select("svg");
    var width = +svg.attr("width"); // width of svg
    var height = +svg.attr("height"); // height of svg
    
    var xScale = d3.scaleLinear() 
        .domain([0, d3.max(dataset)*1.3])
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

    g = d3.select("svg").select("g#outline").select("g#xaxis")
    g.transition().delay(delay_time).call(xAxis)
    
    var gridlines = d3.select("#gridlines");
    gridlines.selectAll("line")
        .data(xScale.ticks())
        .join("line")
        .transition()
        .attr("stroke-width", 1)
        .attr("x1", function(d) { return xScale(d); })
        .attr("x2", function(d) { return xScale(d); })
        .attr("y1", 0)
        .attr("y2", height - marge.top - marge.bottom)
        .attr("stroke", "#BEBEBE")
        .attr("stroke-width", 1)
        .attr("opacity", 0.75);
        var gs = g.selectAll(".datatag")
        gs.data(new_data)
        var bar = d3.selectAll("rect.bar")
        var text_word = d3.selectAll("text.bar")
        var new_data1 = []
        old_data.forEach(d =>{
            if (countries.includes(d.country)){
                new_data1.push(d)
            }
        })

        bar.data(new_data).transition().delay(delay_time)
        .attr("width", function(d) {
            return xScale(d.population);
        })
        .attr("fill",function(d){return d.color})
        text_word.data(new_data).transition().delay(delay_time)
        .attr("x", function(d) {
        return xScale(d.population);
        }).text(function(d) {
         return d.country +" ("+ (d.population/1000000).toFixed(2) + "M" + ")"
        })
        updateTooltop(cur_year,tooltipcountries)
        cur_year += 1;
        d3.select("#label").text(cur_year-1)
        var v1 = document.getElementById('slider');
        v1.value = v1.value + 1;
        if (cur_year >= 2023) {
            d3.select('#player').text("replay")
        } else {
            d3.select('#player').text(" play ")
        }
}

async function Animation() {
    for(let i=cur_year;i<=2022;i++){
        await update()
        await new Promise(resolve => setTimeout(resolve, delay_time));
        if (pause) {
            return;
        }
    }
}

async function ButtonP() {
    if (pause === false) {
        if (cur_year > 2022){
            cur_year = 1900
            var v1 = document.getElementById('slider');
            v1.value = 0;
        }
        pause = true;

    } else {
        pause = false
        await Animation()
        
    }
    
}





async function main() {
    let data = await load(1900)
    let dataset = await load_data(1900);
    let label = await load_country(1900);
    var marge = {top: 10, bottom: 10, left: 10, right: 10}; //set the margin
    var svg = d3.select("svg"); // Select the SVG element
    var width = +svg.attr("width"); // width of svg
    var height = +svg.attr("height"); // height of svg
    var g = svg.append("g") // keep the g
        .attr("transform", "translate(" + (marge.left+10) + "," + (marge.top-10) + ")").attr("id","outline");

    // set the scale of axis
    var xScale = d3.scaleLinear() 
        .domain([0, d3.max(dataset)*1.3])
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
    //add mouse listener
    d3.selectAll("svg").on("click", (event) =>{ 
    const [x, y] = d3.pointer(event);
    })

    // set the x,y axis
    g.append("g").attr("id","xaxis")
        .attr("transform", "translate(0," + (height - marge.top - marge.bottom) + ")")
        .call(xAxis);
    g.append("g").attr("id","yaxis")
        .call(yAxis);
    
    // add gridline
    var gridlines = g.append("g")
        .attr("id", "gridlines");
    gridlines.selectAll("line")
        .data(xScale.ticks())
        .join("line")
        .attr("x1", function(d) { return xScale(d); })
        .attr("x2", function(d) { return xScale(d); })
        .attr("y1", 0)
        .attr("y2", height - marge.top - marge.bottom)
        .attr("stroke", "#BEBEBE")
        .attr("stroke-width", 1)
        .attr("opacity", 0.75);
    var gs = g.selectAll(".datatag")
    .data(data)
    .join("g").attr("class","datatag");

    gs.append("rect").attr("class","bar")
        .attr("y", function(d, i) {
            return yScale(i);
        })    
        .attr("x", 0)
        .attr("width", 0)
        .attr("height", yScale.bandwidth())
        .attr("opacity",0.8)
        .attr("fill",function(d){return d.color})
        .transition() // Add a transition
        .duration(1000) // Duration of the transition
        .delay(function(d, i) {
            return i * 100; // Delay the transition for each bar
        })
        .attr("width", function(d) {
            return xScale(d.population);
        })
    d3.selectAll(".datatag").on("mouseover",function(){
        d3.select(this).select("rect").attr("opacity",0.3)
    })
    d3.selectAll(".datatag").on("mouseout",function(){
        d3.select(this).select("rect").attr("opacity",0.8)
    })
    var tooltip = d3.select('svg')
    .append('g').attr("id","tooltip").style('visibility', 'hidden').append("rect").attr("id","toolback")
    .attr("x",390)
    .attr("y",160)
    .attr("width",500)
    .attr("height",300);





    //add tooltip scale
    var tooltipxScale = d3.scaleLinear() 
        .domain([1900,2022])
        .range([0,500]);
    var tooltipxAxis = d3.axisBottom(tooltipxScale)

    tooltipxAxis.tickFormat(function(d) {
        return String(d)
    })

    var tooltipyScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)*1.3])
        .range([300,0]);
    var tooltipyAxis = d3.axisLeft(tooltipyScale);
    //tooltipyAxis.ticks(14)


    tooltipyAxis.tickFormat(function(d) {
        return d/1000000 + "M";
    })

    d3.select("#tooltip").append("g").append("path").attr("id","toolline")
    d3.select("#tooltip").append("g").append("path").attr("id","toolline2")
    d3.select("#tooltip").append("g").append("text").attr("id","countrylabel")


    d3.select("#tooltip").append("g").attr("transform", "translate(390," + (460) + ")")
        .attr("id","tooltipxaxis")
        .call(tooltipxAxis).attr("fill","rgb(255,255,255)");

    d3.select("#tooltip").append("g").attr("transform", "translate(390," + (160) + ")")
        .attr("id","tooltipyaxis")
        .call(tooltipyAxis).attr("fill","rgb(255,255,255)");

    d3.selectAll(".datatag").on("click",async function(){
        var x = await d3.select(this).select("text")
        console.log(x.text().split(" (")[0])
        var countries_name = x.text().split(" (")[0]
        console.log(d3.select("#tooltip").style('visibility'))
        if(countries_name === tooltipcountries &&d3.select("#tooltip").style('visibility') == "visible"){
            d3.select("#tooltip").style('visibility', 'hidden')
            return;
        }
        tooltipcountries = x.text().split(" (")[0]
        updateTooltop(cur_year,tooltipcountries)
        d3.select("#tooltip").style('visibility', 'visible').attr("fill",d3.select(this).select("rect").attr("fill")).attr("opacity",0.85)
        //updateTooltop(cur_year,x.attr("id"))
        
    })


    gs.append("text").attr("class","bar")
        .attr("y", function(d, i) {
            return yScale(i) + yScale.bandwidth() / 2;
        })
        .attr("x", 0)
        .attr("dx", "0.35em")
        .attr("dy", "0.35em")
        .text(function(d) {
            return d.country +" ("+ (d.population/1000000).toFixed(2) + "M" + ")";
        })
        .transition()
        .duration(1000)
        .delay(function(d, i) {
            return i * 100;
        })
        .attr("x", function(d) {
            return xScale(d.population);
        }).attr("text-align","center");
    
    svg.append("g").append("text").attr("id","label").text(cur_year-1)
    .attr("x",830)
    .attr("y",550)
    .style("font-size", "45px")


    svg.append("g").append("rect").attr("id","background")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#BBFFFF").attr("opacity",0.1).attr("pointer-events", "none");
    // set the background color
    
}

main()
Animation()