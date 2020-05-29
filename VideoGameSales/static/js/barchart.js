function barchart(color){
    var margin = {top: 20, right: 0, bottom: 20, left: 60}, width = 650, height = 350;
    d3v4.select("#TopGenre").html("");
        
    var svg = d3v4.select("#TopGenre")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "original")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    update("tot", svg, true, color)

}

//funzione per ottenere i dati nel formato corretto
function sistema_dati(object, genres){
    data=[]
    miss_na = 3
    miss_pal = 3
    miss_jp = 3
    
    for (var i = 0; i < object.length; i++) {
        d = object[i]
        if (d.NA != 0) {
            game = {
                Genre: d.Genre,
                Type: "NA",
                Value: d.NA
            }
            miss_na-=1
            data.push(game)
        }
        if (d.PAL != 0) {
            game = {
                Genre: d.Genre,
                Type: "PAL",
                Value: d.PAL
            }
            miss_pal-=1
            data.push(game)
        }
        if (d.JP != 0) {
            game = {
                Genre: d.Genre,
                Type: "JP",
                Value: d.JP
            }
            miss_jp-=1
            data.push(game)
        }
    }
    for (var i = 0; i < miss_na; i++) {
        game = {
                Genre: "UND",
                Type: "NA",
                Value: 0
        }
        data.push(game)
    }
    for (var i = 0; i < miss_pal; i++) {
        game = {
                Genre: "UND",
                Type: "PAL",
                Value: 0
        }
        data.push(game)
    }
    for (var i = 0; i < miss_jp; i++) {
        game = {
                Genre: "UND",
                Type: "JP",
                Value: 0
        }
        data.push(game)
    }
    return after_sistema_dati(data)
}

//funzione per ottenere i dati nel formato corretto pt.2
function after_sistema_dati(data, genres) {
    types = ['NA','PAL','JP']
    finald=[]
    
    for (var i=0; i<3; i++) {
        type = types[i]
        counter=0
        
        object = {
            Type: type,
            Values : []
        }
        
        for (var j=0; j< data.length; j++) {
            d = data[j]
            
            if (type == d.Type) {
                x = {
                    Genre: d.Genre,
                    Value: d.Value,
                    Position: counter
                }
                counter+=1
                object.Values.push(x)
            }
        }
        
        for (counter; counter < 3; counter++) {
            game = {
                    Genre: "UND",
                    Value: 0,
                    e: counter
            }
            object.Values.push(game)
        }
        finald.push(object)
    }
    return finald
    
}

function update(selected_year, svg, first_time){

    width = 630, height = 350;
    
    d3v4.csv("static/csv/vgsales-barchart.csv", function(data) {
        
        object = data.map(function(d) {
            return { Genre: d.Genre, NA: d.NA_Sales, PAL: d.PAL_Sales, JP: d.JP_Sales, Year: d.Year}
        });

        
        //solo oggetti dell'anno scelto
        object = object.filter(function (d) {
            if (d['Year'] == selected_year) {
                return true;
            }
        })
        
        //scelgo le categorie e solo i generi attualmente utilizzati
        var categoriesNames = ['NA','PAL','JP']
        var genresNames = object.map(function(d) {
            if (!(d.NA == 0 && d.PAL == 0 && d.JP ==0)) {
                return d.Genre
            }})
            
        //inserisco il genere undefined se ho avuto vendite relative a meno di tre generi (il filtro elimina i nan)
        genresNamesColors  = genresNames.filter(Boolean)
        genresNames.push("UND")

        //trovo il massimo
        max = d3v4.max(object, function(d) {
            return Math.max(d.NA, d.PAL, d.JP)
        })
        
        //faccio sistemare i dati in modo conforme con quanto mi serve
        games = sistema_dati(object, genresNames)
        
        //altezza in base al massimo del momento
        var y = d3v4.scaleLinear().domain([0, max]).range([height, 0]);
        var yAxis = d3v4.axisLeft(y)
        
        var x0 = d3v4.scaleBand().rangeRound([0, width]).paddingInner(0.1).paddingOuter(0.1);
        var x1 = d3v4.scaleBand().paddingOuter(0.25).paddingInner(0.15);
        
        //le possibili categorie quindi NA o PAL o JP
        x0.domain(categoriesNames)
        
        //il dominio del x1 sono le diverse posizioni dei generi delle tre barre (quindi o posizione 0 o 1 o 2)
        x1.domain([0,1,2]).rangeRound([0, x0.bandwidth()])
        
        //se non è la prima volta
        if (first_time==false){
            
            //rimuovo il vecchio asse x e la legenda
            svg.selectAll('g').filter('.y-axis').remove()
            svg.selectAll('g').filter('.legend').remove()
            
            //inserisco i dati nella selection 
            //appendo nan non so il motivo ma se lo levo carica i dati solo della prima categoria letto su internet
            var selection = svg.selectAll("g").filter('.divz')
            selection
                .data(games)
                .enter()
                .append("nan")
                
            //applico una transizione a tutti i rettangoli che cambia il colore e l'altezza con i nuovi dati    
            selection.selectAll("rect")
                .data(function(d) { return d.Values })
                .transition()
                .delay(function (d) {return Math.random()*1000;})
                .duration(1000)
                .attr("y", function(d) { return y(d.Value); })
                .attr("height", function(d) { return height - y(d.Value); })
                .attr("fill", function(d) { return color(d.Genre) })
                
        }
        //se è la prima volta
        else {
            var selection = svg.selectAll("g")
                .data(games)
                .enter()
                .append("g")
                .attr("transform", d => "translate(" + x0(d.Type) + ",0)" )
                .attr('class','divz')
                
            selection.selectAll("rect")
                .data(function(d){ return d.Values})
                .enter()
                .append("rect")
                    .attr("x", d => x1(d.Position))
                    .attr("y", d => y(d.Value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d=> height- y(d.Value) )
                    .attr("fill", function(d) { return color(d.Genre) })
        
        }
        
        //aggiungo asse x
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3v4.axisBottom(x0))
            .selectAll(".tick text")
        
        //aggiungo asse y
        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis)
            .append("text")
            .classed("label", true)
            .attr("x", 0)
            .attr("y", -17)
            .attr("dy", ".71em")
            .attr("font-size", "13px")
            .attr("fill", "#000")
            .style("text-anchor", "end")
            .text("Sales");
            
        //idenitfy zero line on the y axis.
        svg.append("line")
            .attr("y1", y(0))
            .attr("y2", y(0))
            .attr("x1", 0)
            .attr("x2", width)
            
        //inserisco la legenda
        var legend = svg.selectAll(".legend")
            .data(genresNamesColors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
            
        legend.append("rect")
            .attr("x", width - 10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d) { return color(d); });
        
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".10em")
            .style("text-anchor", "end")
            .text(function(d) {return d; });    
    })
}