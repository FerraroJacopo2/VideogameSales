function pca(color){
    var margin = { top: 15, right: 300, bottom: 30, left: 30 },
    outerWidth = 800, 
    outerHeight = 410,
    width = 680,
    height = 350,
    legend_x_axis_text_position = margin.bottom + 10,
    legend_y_axis_text_position = -15,
    scatter_start_x_axis = -1,
    scatter_start_y_axis = -1
    
    //scala x e y
    
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    
    
    //possibili generi
    //var diz = {
    //    'Sports':1,'Racing':2,'Platform':3,'Misc':4,'Party':5,'Action':6,'Shooter':7,
    //    'Action-Adventure':8,'Fighting':9,'Simulation':10,'Role-Playing':11,
    //    'Strategy':12,'Adventure':13,'MMO':14,'Music':15,'Puzzle':16,'Board Game':17,
    //    'Education':18,'Visual Novel':19
    //}
    //
    ////colori dei generi
    //var color = d3v4.scaleOrdinal(d3v4.schemeCategory10)
    //var color_domain = color.domain(diz)

    d3.csv("static/csv/vgsales-pca.csv", function (data) {
        
        //trovo max e min per fare il dominio
        var xMax = d3.max(data, function (d) { return +d.x; }) * 1.05,
        xMin = d3.min(data, function (d) { return +d.x; }),
        xMin = xMin > 0 ? 0 : xMin + scatter_start_x_axis,
        yMax = d3.max(data, function (d) { return +d.y; }) * 1.05,
        yMin = d3.min(data, function (d) { return +d.y; }),
        yMin = yMin > 0 ? 0 : yMin + scatter_start_y_axis;
        
        x.domain([xMin, xMax]);
        y.domain([yMin, yMax]);
        
        
        //asse x
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height);
        
        //asse y
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(-width);
            
        //creo il tip delle bolle
        var tip = d3.select("#pca").append("div")
            .attr('class', 'd3-tip')
            .style('display', 'none');   
            
        //variabile per zoommare
        var zoommer = d3.behavior.zoom()
            .x(x)
            .y(y)
            .scaleExtent([0, 500])
            .on("zoom", zoom);
            
        //if (flag == false) {
        
        //creo svg e chiamo lo zoom
        var svg = d3.select("#pca")
            .append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoommer);
        
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill","transparent")
            .style("shape-rendering","crispEdges");
        
        
        //appendo asse x
        svg.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .classed("label", true)
            .attr("x", width)
            .attr("y", legend_x_axis_text_position)
            .style("text-anchor", "end")
            .text("x");
        
        //appendo asse y
        svg.append("g")
            .classed("y axis", true)
            .call(yAxis)
            .append("text")
            .classed("label", true)
            //.attr("transform", "rotate(-90)")
            .attr("x", -10)
            .attr("y", legend_y_axis_text_position)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("y");
            
        var objects = svg.append("svg")
            .classed("objects", true)
            .attr("width", width)
            .attr("height", height);
        
        objects.append("svg:line")
            .classed("axisLine hAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0," + height + ")");
        
        objects.append("svg:line")
            .classed("axisLine vAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height);
            
        //creo i dots
        objects.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .classed("dot", true)
            //raggio in base a quante unita ha venduto globalmente
            .attr("r", function (d) { return 6 * Math.sqrt(+d.Global_Sales / Math.PI); })
            .attr("transform", transform)
            .style("fill", "#61a3a9")
            .style("opacity", 0.5)
            .style("fill", function (d) { return color(d.Genre); })
            .on("mouseover", function(d) {
                wx = d3.event.screenX;
                wy = d3.event.screenY;
                
                //mostra i dati del dot cliccato
                tip.style("top", (wy+260)+"px");
                tip.style("left", (wx)+"px"); 
                tip.html("Name: " + d.Name + "<br>" + "Genre: " + d.Genre + "<br>" + "Global Sales: " + d.Global_Sales + "<br>" + "Critic Score: " + d.Critic_Score + "<br>" + "User Score: " + d.User_Score + "<br>" + "Year: " + d.Year);
                tip.style("display", "inline");
                
            })
            .on("mouseout", function(d) {
                tip.html("")
                tip.style("display", "none");
            })
        /*}
        // pca che si aggiorna con slider
        
        else {
            console.log("eo")
            
            //elimino i vecchi dati
            var objects = d3.select("#pca").select("g").select("svg")
            objects.selectAll(".dot")
            .transition()
            .delay(function (d) {return Math.random()*500;})
            .duration(1000)
            .remove()
            
            data = data.filter( function(d) {
                return Number(d.Year) == year
            })
            
            console.log(year, data.length)
            
            objects.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .classed("dot", true)
            .attr("r", function (d) { return 6 * Math.sqrt(+d.Global_Sales / Math.PI); })
            .attr("transform", transform)
            .style("fill", "#61a3a9")
            .style("opacity", 0.5)
            .style("fill", function (d) { return color(d.Genre); })
            .on("mouseover", function(d) {
                wx = d3.event.x;
                wy = d3.event.y;
                tip.style("top", (wy)+"px");
                tip.style("left", (wx)+"px"); 
                tip.html("Name: " + d.Name + "<br>" + "Genre: " + d.Genre + "<br>" + "Global Sales: " + d.Global_Sales + "<br>" + "Critic Score: " + d.Critic_Score + "<br>" + "User Score: " + d.User_Score + "<br>" + "Year: " + d.Year);
                tip.style("display", "inline");
                })
            .on("mouseout", function(d) {
                tip.html("")
                tip.style("display", "none");
            })
            .transition()
            .delay((function (d) {return Math.random()*1500;}))
            .duration(2000)
            console.log("finito")
            
        */
        
        //zoom 
        function zoom() {
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            svg.selectAll(".dot")
                .attr("transform", transform);
        }

        //sposto il dot nella nuova posizione corretta
        function transform(d) {
            return "translate(" + x(+d.x) + "," + y(+d.y) + ")";
        }
    
            
    })
    
}