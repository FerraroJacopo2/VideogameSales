function cosinesim(A,B){
    var dotproduct=0;
    var mA=0;
    var mB=0;
    for(i = 0; i < A.length; i++){ 
        dotproduct += (A[i] * B[i]);
        mA += (A[i]*A[i]);
        mB += (B[i]*B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct)/((mA)*(mB)) 
    return similarity;
}

function similarity(v) {
    d3.select('.similarity').html(['']);
    var final_data;
    
    var esbr_rating_map = new Map([["NP",0],["E",1],["E10",2],["T",3],["M",4]]);
    var esbr_rating_map_reversed = new Map([[0,"NP"],[1,"E"],[2,"E10"],[3,"T"],[4,"M"]]);
    
    var selected_videogame={}
    
    d3.csv("static/csv/vgsales_total.csv", function(data) {
        data.map(function(d) {
            if(d.Name== v) {
                selected_videogame["Name"]=d.Name;
                selected_videogame["Genre"]=d.Genre;
                selected_videogame["Critic_Score"]=d.Critic_Score;
                selected_videogame["User_Score"]=d.User_Score;
                selected_videogame["ESRB_Rating"]= esbr_rating_map.get(d.ESRB_Rating);
            }        
        });
        //qua me esce un dizionario del selected_videogame scelto: nome, genere, violenza, critica, recensioni utente
        d3.csv("/static/csv/vgsales_map.csv", function(data) {
            var genere = selected_videogame["Genre"];
            var simil={};

            //filteredGenreData contiene tutti i giochi di quel genere
            filteredGenreData = data.filter(function(row) {
                return row['Genre'] == genere;
            });
            

            filteredGenreData.map(function(d) { 
                simil[d.Name]={Critic_Score: d.Critic_Score, User_Score: d.User_Score, ESRB_Rating: d.ESRB_Rating, Year: d.Year | 0};//, Global_Sales: d.Global_Sales};
            });  

            var array1=[];
            var array2=[];
            var critic_score;
            var user_score;;
            var rating;
            var old_rating;
            var similarity;
            var result=new Map([]);

            for (const [name, property] of Object.entries(simil)) {        
                array1.push(selected_videogame["Critic_Score"]);
                array1.push(selected_videogame["User_Score"]);
                array1.push(selected_videogame["ESRB_Rating"]);
                
                critic_score=property["Critic_Score"];
                user_score=property["User_Score"];
                old_rating=property["ESRB_Rating"];
                rating = esbr_rating_map.get(old_rating)

                //ignoriamo se la critica è zero
                if(array1[0]==0.0) {
                   array1.splice(0,1);
                }
                else {
                    array2.push(critic_score);
                }

                //ignoriamo se le recensioni utenti è 0
                if(array1[1]==0.0) {
                    array1.splice(1,1);
                }
                else {
                    array2.push(user_score);
                }
                
                array2.push(rating);
                similarity=cosinesim(array1,array2)
                        
                if(!Number.isNaN(similarity) && name!=selected_videogame["Name"]) {
                    x = [name,genere,critic_score,user_score,rating,property["Year"]]
                    result.set(x,similarity)
                }
                array1=[]
                array2=[];           
            } 
            
            sorted = new Map([...result.entries()].sort((a, b) => b[1] - a[1]));   
            sorted = Array.from(sorted)   
            
            if(sorted.length > 0) {
                final_data=[
                    {Name: sorted[0][0][0], Genre: sorted[0][0][1], Rating: esbr_rating_map_reversed.get(sorted[0][0][4]), Year: sorted[0][0][5]},
                    {Name: sorted[1][0][0], Genre: sorted[1][0][1], Rating: esbr_rating_map_reversed.get(sorted[1][0][4]), Year: sorted[1][0][5]},
                    {Name: sorted[2][0][0], Genre: sorted[2][0][1], Rating: esbr_rating_map_reversed.get(sorted[2][0][4]), Year: sorted[2][0][5]},
                    {Name: sorted[3][0][0], Genre: sorted[3][0][1], Rating: esbr_rating_map_reversed.get(sorted[3][0][4]), Year: sorted[3][0][5]},
                    {Name: sorted[4][0][0], Genre: sorted[4][0][1], Rating: esbr_rating_map_reversed.get(sorted[4][0][4]), Year: sorted[4][0][5]}
                ];
                tabulate(final_data, ["Name","Genre","Rating","Year"]);
            }
            
            else {
                d3.select('.similarity').html("No enough data to find a similar game");
                d3.select('.similarity_table thead').remove();
                d3.select('.similarity_table tbody').remove();           
            }      
        });               
    });   

    function tabulate(data, columns) {
        d3.select('.similarity').html(['']);
        d3.select('.similarity').html(["Games similar to: "+v+""]);
        
        d3.select('.similarity_table thead').remove();
        d3.select('.similarity_table tbody').remove();
        var table = d3.select('.similarity_table')
        var thead = table.append('thead')
        var	tbody = table.append('tbody');
        
        thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')        
        .text(function (column) { 
            return column; 
        })
        .attr("class", function( column ){ 
            if (column == "Name" || column == "Genre" || column == "Rating") {
                return "mdl-data-table__cell--non-numeric";    
            }
            else {
                return "mdl-data-table__cell";
        }})
        
        var rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr');
        
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
            if (d.column == "Sales" || d.column == 'Year') {
                return "mdl-data-table__cell";
            }
            else {
                return "mdl-data-table__cell--non-numeric";
            }
        })
        .text(function (d) { 
            return d.value; 
        });
    }    
}