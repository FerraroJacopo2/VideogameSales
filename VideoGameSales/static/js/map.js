var y="total";
var PAL_dict={};
var JP_dict={};
var NA_dict={};
var Other_dict={};
var selected_NA;
var selected_JP;
var selected_PAL;
var selected_Other;
var NA_mostSold;
var JP_mostSold;
var PAL_mostSold;
var Other_mostSold;

function mappa(color){ 
    d3.csv("static/csv/vgsales_map.csv", function(data) {
    
    NA_mostSold = data.map(function(d) {
        return { Name: d.Name, Platform: d.Platform, Sales: d.NA_Sales}
    });
    JP_mostSold = data.map(function(d) {
        return {Name: d.Name,Platform: d.Platform, Sales: d.JP_Sales }
    }); 
    PAL_mostSold = data.map(function(d) {
        return {Name: d.Name,Platform: d.Platform, Sales: d.PAL_Sales }
    }); 
    Other_mostSold = data.map(function(d) {
        return {Name: d.Name, Platform: d.Platform,Sales: d.Other_Sales }
    }); 
    
    NA_mostSold.sort(function(a, b) {
        return parseFloat(b.Sales) - parseFloat(a.Sales);
    });
    NA_mostSold=NA_mostSold.slice(0,10);

    PAL_mostSold.sort(function(a, b) {
        return parseFloat(b.Sales) - parseFloat(a.Sales);
    });
    PAL_mostSold=PAL_mostSold.slice(0,10);

    JP_mostSold.sort(function(a, b) {
        return parseFloat(b.Sales) - parseFloat(a.Sales);
    });
    JP_mostSold=JP_mostSold.slice(0,10);

    Other_mostSold.sort(function(a, b) {
        return parseFloat(b.Sales) - parseFloat(a.Sales);
    });
    Other_mostSold=Other_mostSold.slice(0,10);
    
    tabulate(NA_mostSold, ['Name','Platform', 'Sales']);
    filtered_PAL=PAL_mostSold;
    filtered_NA=NA_mostSold;
    filtered_Other=Other_mostSold;
    filtered_JP=JP_mostSold;
    
    d3.csv("/static/csv/vgsales_map.csv", function(error, data) {
        var data = d3.nest().key(function(d) {
            return d.Year | 0;
        }).rollup(function(d) {
            return d3.sum(d, function(g) {
                return g.NA_Sales ;
            });
        }).entries(data);

        data.forEach(function(d) {
            NA_dict[d.key]=d.values;  
        });
    });

    d3.csv("/static/csv/vgsales_map.csv", function(error, data) {
        var data = d3.nest().key(function(d) {
            return d.Year | 0;
        }).rollup(function(d) {
            return d3.sum(d, function(g) {
                return g.JP_Sales ;
            });
        }).entries(data);

        data.forEach(function(d) {
            JP_dict[d.key]=d.values;  
        });
    });

    d3.csv("/static/csv/vgsales_map.csv", function(error, data) {
        var data = d3.nest().key(function(d) { 
            return d.Year | 0;
        }).rollup(function(d) { 
            return d3.sum(d, function(g) {
                return g.PAL_Sales ; 
            });
        }).entries(data);

        data.forEach(function(d) {
            PAL_dict[d.key]=d.values;  });
        });

    d3.csv("/static/csv/vgsales_map.csv", function(error, data) {
        var data = d3.nest().key(function(d) {
            return d.Year | 0;
        }).rollup(function(d) {
            return d3.sum(d, function(g) {
                return g.Other_Sales ;
            });
        }).entries(data);

        data.forEach(function(d) {
            Other_dict[d.key]=d.values;  
        });
    }); 

    var years_temp = data.map(function(d) { 
        return d.Year 
    });
    var years_N = years_temp.map(function (x) { 
        return parseInt(x, 10); 
    });
    var years = years_N.filter(function (value) {
        return !Number.isNaN(value);
    });

    years.sort();
    years=years.slice(3,years.length);
    years = Array.from(new Set(years))
    
    var totalSum = [d3.sum(data.map(function(d){ return d.NA_Sales})),d3.sum(data.map(function(d){ return d.PAL_Sales})),d3.sum(data.map(function(d){ return d.JP_Sales})), d3.sum(data.map(function(d){ return d.Other_Sales}))];
    var result = totalSum.map(function (x) { 
        return parseInt(x, 10); 
    })
    
    var dict = {};
    dict["North America"] = result[0];
    NA_dict["total"] = result[0];
    dict["Europe"] = result[1];
    PAL_dict["total"] = result[1];
    dict["Japan"] = result[2];
    JP_dict["total"] = result[2];
    dict["Others"] = result[3];
    Other_dict["total"] = result[3];

    var width = 450,
    height = 260;

    var projection = d3.geo.kavrayskiy7()
        .scale(80)
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var graticule = d3.geo.graticule();

    var tip = d3.select("#map").append("div")
        .attr('class', 'd3-tip')
        .style('display', 'none');      
    
    var svg = d3.select("#map")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin")
        .attr("width", width)
        .attr("height", height)
        .append("g");
            
    svg.append("defs").append("path")
        .datum({type: "Sphere"})
        .attr("id", "sphere")
        .attr("d", path);

    svg.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

    svg.append("use")
        .attr("class", "fill")
        .attr("xlink:href", "#sphere");

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);
                     
    var sets = [
        {name: 'Europe', set: d3.set(['531','534','020', '008', '040', '248', '070', '056', '100', '112', '756', '203', '276', '208', '233', '724', '246', '234', '250', '826', '831', '292', '300', '191', '348', '372', '833', '352', '380', '832', '438', '440', '442', '428', '492', '498', '499', '807', '470', '528', '578', '616', '620', '642', '688', '643', '752', '705', '744', '703', '674', '792', '804', '336'])},
        {name: 'North America',set: d3.set(['028', '660', '533', '052', '652', '060', '044', '084', '124', '188', '192', '212', '214', '308', '304', '312', '320', '340', '332', '388', '659', '136', '662', '663', '474', '500', '484', '558', '591', '666', '630', '222', '796', '780', '840', '670', '092', '850'])},
        {name: 'Others', set:  d3.set(['024', '854','728', '108', '204', '072', '180', '140', '178', '384', '120', '132', '262', '012', '818', '732', '232', '231', '266', '288', '270', '324', '226', '624', '404', '174', '430', '426', '434', '504', '450', '466', '478', '480', '454', '508', '516', '562', '566', '638', '646', '690', '729', '654', '694', '686', '706', '678', '748', '148', '768', '788', '834', '800', '175', '710', '894', '716', '010', '074', '239', '334', '260', '784', '004', '051', '031', '050', '048', '096', '064', '166', '156', '162', '196', '268', '344', '360', '376', '356', '086', '368', '364', '400', '417', '116', '408', '410', '414', '398', '418', '422', '144', '104', '496', '446', '462', '458', '524', '512', '608', '586', '275', '634', '682', '702', '760', '764', '762', '626', '795', '158', '860', '704', '887', '016', '036', '184', '242', '583', '316', '296', '584', '580', '540', '574', '520', '570', '554', '258', '598', '612', '585', '090', '772', '776', '798', '581', '548', '876', '882', '032', '068', '076', '152', '170', '218', '238', '254', '328', '604', '600', '740', '858', '862'])},
        {name: 'Japan', set: d3.set(['392'])}
    ]
    
    d3.json("static/json/countries-110m.json", function (error, world) {
        if (error) throw error;

        for (var i = 0; i < sets.length; i++) {
            svg.append("path").datum(topojson.merge(world, world.objects.countries.geometries.filter(function (d) {
                return sets[i].set.has(d.id);
            })))
            .attr('class', sets[i].name)
            .attr("d", path)
            .attr({'data-name': sets[i].name})
            .style("opacity", 0.7)
            .style("stroke", "000")
            
            .style("fill", function() {
                var max = Math.max((PAL_dict[y]|0),(NA_dict[y]|0),(JP_dict[y]|0),(Other_dict[y]|0));
                var colorScale = d3v4.scaleLinear().domain([0,max]).range(["#E0E0E0","#02386F"]);

                var r = d3.select(this)
                if (r.attr('data-name')=="Europe"){
                    return colorScale(PAL_dict[y] | 0);}
                if (r.attr('data-name')=="North America"){
                    return colorScale(NA_dict[y] | 0);}
                if (r.attr('data-name')=="Japan"){
                    return colorScale(JP_dict[y] | 0);}
                if (r.attr('data-name')=="Others"){
                    return colorScale(Other_dict[y] | 0);}   
               })
               
            .on('mousemove', function (d,i) {
                //Coordinate del mouse
                var wx = d3.event.x;
                wy = d3.event.y;
                tip.style("top", (wy-45)+"px");
                tip.style("left", (wx-12)+"px");      
            })

            .on('mouseover', function () {
                var region = d3.select(this);
                tip.style("display", "inline");
                region.style("opacity", 1);

                if(region.attr('data-name')=="Europe") {
                    tip.html(region.attr('data-name')+": " +  (PAL_dict[y]|0)+ ' Billions sold');
                    tabulate(filtered_PAL, ['Name','Platform','Sales']);}

                if(region.attr('data-name')=="North America") {
                    tip.html(region.attr('data-name')+": " +  (NA_dict[y]|0) + ' Billions sold');
                    tabulate(filtered_NA, ['Name','Platform','Sales']);}

                if(region.attr('data-name')=="Japan") {
                    tip.html(region.attr('data-name')+": " +  (JP_dict[y]|0) + ' Billions sold');
                    tabulate(filtered_JP, ['Name','Platform','Sales']);}

                if(region.attr('data-name')=="Others") {
                    tip.html(region.attr('data-name')+": " +  (Other_dict[y]|0) + ' Billions sold');
                    tabulate(filtered_Other, ['Name','Platform','Sales']);}

            })
            .on('mouseout', function () {
                tip.style("display", "none");
                var region = d3.select(this);
                region.style("opacity", 0.7);
            });
        }
    
        var sliderTime = d3v4
            .sliderHorizontal()
            .min(years[0])
            .max(years[years.length-2])
            .step(1)
            .width(420)
            .on('onchange', selected_year => {
                y = selected_year.toString();
                //pca(true, selected_year)
                
                d3.csv("/static/csv/vgsales_map.csv", function(data) {
                    filteredData = data.filter(function(row) {
                        return row['Year'] == selected_year;
                    });
                
                    filtered_NA = filteredData.map(function(d) { 
                        return { Name: d.Name, Platform: d.Platform, Sales: d.NA_Sales}
                    }); 
                
                    filtered_PAL= filteredData.map(function(d) { 
                        return {Name: d.Name, Platform: d.Platform, Sales: d.PAL_Sales}
                    }); 
                
                    filtered_JP= filteredData.map(function(d) { 
                        return {Name: d.Name, Platform: d.Platform, Sales: d.JP_Sales}
                    }); 
            
                    filtered_Other = filteredData.map(function(d) { 
                        return {Name: d.Name, Platform: d.Platform, Sales: d.Other_Sales}
                    }); 
                    
                    filtered_NA.sort(function(a, b) {
                        return parseFloat(b.Sales) - parseFloat(a.Sales);
                    });
                    filtered_NA=filtered_NA.slice(0,10);

                    filtered_PAL.sort(function(a, b) {
                        return parseFloat(b.Sales) - parseFloat(a.Sales);
                    });
                    filtered_PAL=filtered_PAL.slice(0,10);

                    filtered_JP.sort(function(a, b) {
                        return parseFloat(b.Sales) - parseFloat(a.Sales);
                    });
                    filtered_JP=filtered_JP.slice(0,10);

                    filtered_Other.sort(function(a, b) {
                        return parseFloat(b.Sales) - parseFloat(a.Sales);
                    });
                    filtered_Other=filtered_Other.slice(0,10);
                });
                
                //update barchart function
                update(selected_year,d3v4.select("#TopGenre").select("svg").select("g"), false, color)
                
                var max = Math.max((PAL_dict[y]|0),(NA_dict[y]|0),(JP_dict[y]|0),(Other_dict[y]|0));
                var colorScale = d3v4.scaleLinear().domain([0,max]).range(["#E0E0E0","#02386F"]);
                
                svg.selectAll("path").attr("d", path).style("fill", function() {
                    var r = d3.select(this)
                    if (r.attr('data-name')=="Europe"){
                        return colorScale(PAL_dict[y] | 0);}
                    if (r.attr('data-name')=="North America"){
                        return colorScale(NA_dict[y] | 0);}
                    if (r.attr('data-name')=="Japan"){
                        return colorScale(JP_dict[y] | 0);}
                    if (r.attr('data-name')=="Others"){
                        return colorScale(Other_dict[y] | 0);} 
                });
                parallel(selected_year,false, color);
                
            });
        
        var gTime = d3v4
            .select('div#slider-time')
            .append('svg')
            .attr('width', 550)
            .attr('height', 70)
            .append('g')
            .attr('transform', 'translate(30,30)');
        
        gTime.call(sliderTime);
    
    });
    })
}

function tabulate(data, columns) {
    //in una riga elimino le vecchie tabelle cioè quello che facevi te in venti righe
    d3.select('.tabellagiochi tbody').remove();
    
    var table = d3.select('.tabellagiochi')
    var	tbody = table.append('tbody');
    
    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
    
    // create a cell in each row for each column
    var cells = rows.selectAll('td')
    .data(function (row) {
        return columns.map(function (column) {
            return {
                column: column, 
                value: row[column]
            };
        });
    })
    .enter()
    .append('td').attr("class", function( d ){ 
        if (d.column == "Sales") {
            return "mdl-data-table__cell";
        }
        else {
            return "mdl-data-table__cell--non-numeric";
        }
    }).on("click", function(d) { similarity(d.value); })
    .text(function (d) { 
        return d.value; 
    });
    return table;
}