function parallel(selected_year, flag, color) {
    var margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
        
    //se e la prima volta appendo svg e g    
    if (flag) {
        d3.select("#parallel").html("");
        
        var svg = d3.select("#parallel")
            .append("svg")
            .attr("width", width+ margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")"); 
    }
    
    //altrimenti seleziono il grafico gia creato
    else {
        var svg= d3.select('#parallel').select("svg").select("g")
    }

    var tip = d3.select("#parallel").append("div")
        .attr('class', 'd3-tip')
        .style('display', 'none');
        
    

    // Highlight the specie that is hovered
  var highlight = function(d){

    selected_specie = d.Genre

    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_specie)
      .transition().duration(200)
      .style("stroke", color(selected_specie))
      .style("opacity", "1")


    wx = d3.event.screenX;
    wy = d3.event.screenY;
                    
    var region = d3.select(this);
    tip.style("top", (wy+260)+"px");
    tip.style("left", (wx)+"px");
    tip.style("display", "inline");
    region.style("opacity", 1);
    tip.html(region.attr('class2'));

  }

  // Unhighlight
  var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function(d){ return( color(d.Genre))} )
      .style("opacity", "1")

    tip.html("")
    tip.style("display", "none");
  }
    
        
    // Parse the Data
    d3.csv("/static/csv/vgsales_total.csv", function(data) {
        
        //se è stato selezionato un anno filtro i dati
        if (selected_year != "") {
            data = data.filter( function(d) {
                return d.Year == selected_year
            })
        }
        
        //se non è stato selezionato (quindi prima volta o reset)
        else {
            //filtro solo i primi 5000 giochi per vendita
            data = data.sort(function(a, b) {
                   return parseFloat(b.Global_Sales) - parseFloat(a.Global_Sales);
                 });
            data = data.slice(0, 5000);
        }
        
        //dimensioni scelte
        dimensions = ["Critic_Score","User_Score", "Global_Sales", "NA_Sales","PAL_Sales","JP_Sales","Other_Sales"]

        //scala lineare per ogni dimensione
        var y = {}
        for (i in dimensions) {
            name = dimensions[i]
            y[name] = d3v4.scaleLinear()
                .domain( d3.extent(data, function(d) { 
                    return +d[name]; 
                }) )
                .range([height, 0])
        }
    
        // Build the X scale -> it find the best position for each Y axis
        x = d3v4.scalePoint().range([0, width]).domain(dimensions);
    
        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3v4.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
        }

        //se è la prima volta appendo un container che conterrà tutte le linee
        if (flag) {
            svg.append("g")
                .attr("class", "container")
                .selectAll("myPath")
                .data(data)
                .enter()  
                .append("path")
                .attr("class", function (d) { return "line " + d.Genre } )
                .attr("class2", function (d) { return d.Genre } ) 
                .attr("d",  path)
                .style("fill", "none" )
                .style("stroke", function(d){ 
                    return( color(d.Genre))
                }) 
                .style("opacity", 0.6)
                .on("mouseover", highlight)
                .on("mouseleave", doNotHighlight )
              
            
            //disegno gli assi
            svg.selectAll("myAxis")
                .data(dimensions).enter()
                .append("g")
                .attr("class", "axis")
                // I translate this element to its right position on the x axis
                .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                // And I build the axis with the call function
                .each(function(d) { d3v4.select(this).call(d3v4.axisLeft().ticks(10).scale(y[d])); })
                // Add axis title
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; })
                .style("fill", "black")
            
        }
        
        //se non è la prima volta
        else {
            //elimino tutte le linee
            svg.selectAll(".container").selectAll("path")
            .transition()
            .delay(function (d) {return Math.random()*200;})
            .duration(1000)
            .remove()
            
            //elimino i tick delle scale lineari (i numeri delle righe sulle varie y)
            svg.selectAll(".tick")
            .transition()
            .delay(function (d) {return Math.random()*200;})
            .duration(1000)
            .remove()
            
            console.log(color)
            
            //dopo un timeout (cosi di sicuro ha eliminato tutte le righe ripopolo
            setTimeout(function(){
                //aggiungo le righe
                svg.select("g")
                .selectAll("myPath")
                .data(data)
                .enter()  
                .append("path")
                .attr("class", function (d) { return "line " + d.Genre } )
                .attr("class2", function (d) { return d.Genre } )
                .on("mouseover", highlight)
                .on("mouseleave", doNotHighlight)
                .style("fill", "none" )
                .style("stroke", function(d){ 
                    return( color(d.Genre))
                }) 
                .style("opacity", 0.6) 
                .transition()
                .delay(function (d) {return Math.random()*1000;})
                .duration(2000)
                .attr("d",  path)

            
                
                //aggiungo gli assi
                svg.selectAll(".axis")
                .data(dimensions)
                .each(function(d) { d3v4.select(this).call(d3v4.axisLeft().ticks(10).scale(y[d])); })
                
            }, 1300);
        }
        
        
        //creo una legenda 
        
        var genres = ['Sports','Racing','Platform','Misc','Party','Action','Shooter',
            'Action-Adventure','Fighting','Simulation','Role-Playing',
            'Strategy','Adventure','MMO','Music','Puzzle','Board Game',
            'Education','Visual Novel']
            
        if (flag) {
            var SVG = d3.select("#legendario-div").select("#containerl").append("svg")
                .attr("width", 150)
                .attr("height", 300)

            // Add one dot in the legend for each name.
            var size = 12
            SVG.selectAll("mydots")
              .data(genres)
              .enter()
              .append("rect")
                .attr("x", 0)
                .attr("y", function(d,i){ return i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", function(d){ return color(d)})

            // Add one dot in the legend for each name.
            SVG.selectAll("mylabels")
              .data(genres)
              .enter()
              .append("text")
                .attr("x",  size*1.2)
                .attr("y", function(d,i){ return i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return color(d)})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        }
    })
}