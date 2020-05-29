function heatmap(genres, platforms, flag){
    dostuff(genres, platforms, flag)
    
    var pulsante = d3v4.select('.PCbutton')
        .on("click", function(d) { 
            if (flag == true) {
                flag=false;
                dostuff(genres,platforms,flag);
            }
            else  {
                flag=true;
                dostuff(genres,platforms,flag);
            }
        })
    
    function dostuff(genres, platforms, flag) {
        var margin = {top: 20, right: 0, bottom: 20, left: 40}, width = 650, height = 350;
        d3v4.select("#HeatMapDiv").html("");
        
        var svg = d3v4.select("#HeatMapDiv")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        csv = "static/csv/vgsales-heatmap-no-pc.csv";
        if (flag==true) {
            d3v4.select('.PCbutton').text("Rimuovi PC")
            platforms.push("PC")
            csv = "static/csv/vgsales-heatmap-pc.csv";
        }
        else {
            d3v4.select('.PCbutton').text("Inserisci PC")
            if (platforms.includes("PC")) {
                platforms.pop();
            }
        }
        
        
        // Build X scales and axis:
        var x = d3v4.scaleBand().range([ 0, width ]).domain(genres).padding(0.03);
        svg.append("g").attr("transform", "translate(0," + height + ")").call(d3v4.axisBottom(x))
        
        // Build X scales and axis:
        var y = d3v4.scaleBand().range([ 0, height ]).domain(platforms).padding(0.03);
        svg.append("g").call(d3v4.axisLeft(y));
        
        // Build color scalez
        var myColor = d3v4.scaleSequential().domain([1,500]).interpolator(d3v4.interpolateBlues);
                                     
        d3v4.csv(csv, function(data) {
            var rect = svg.selectAll()
                .data(data)
                .enter();

            rect.append("rect")
                .attr("x", function(d){ return x(d.Genre);})
                .attr("y", function(d){ return y(d.Platform);})
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function(d) { return myColor(d.tot)});

            rect.append("text")
                .style("fill", function(d) {
                    if (d.tot>150) {
                        return "white";}
                    else {
                        return "black";
                    }
                })
            .style("font-size", "10px")
            .style("mix-blend-mode", "burn")
            .attr("dy", ".35em")
            .attr("x", function (d) { return x(d.Genre)+15; })
            .attr("y", function (d) { return y(d.Platform)+10; })
            .style("style", "label")
            .text(function (d) { return d.tot; 
            });
        });  
    }
    
    
}