// JavaScript Document
var svgHeight = 700;
var svgWidth = 800;
var svg = d3.select("#svgContainer").append("svg");
svg.attr("width",svgWidth)
    .attr("height",svgHeight)
    .style("background-color", "rgba(230,230,230,100)");
var margin = {top:50,left:50,right:50,bottom:50};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var y,x;
var parser = d3.timeParse("%d/%m/%Y");
var parser2 = d3.timeParse("%m/%Y");
var colors = d3.scaleOrdinal(d3.schemeCategory10);
var colors1 = [3,2,0], bname = ["Confirm","Discharge","Death"];

var isclick = 0;

var url = "https://api.data.gov.hk/v1/historical-archive/get-file?url=http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Flatest_situation_of_reported_cases_covid_19_eng.csv&time=20210421-0923";
	
var data=[],dataL ;

var result;

d3.csv(url).then(function(lastestCase){
	console.log("lastestCase.length");
	console.log(lastestCase);
	
		result = new Array(lastestCase.length);
	//data.date = lastestCase["As of date"]	;
	//data[0]=[{date:"08/01/2020",confirm:0,death:0,discharge:0,newConfirm:0,newDeath:0,disCharge:0}];
	for(var i = 0; i < lastestCase.length;i++){
		//data[i]=[{date:0,confirm:0,death:0,discharge:0,newConfirm:0,newDeath:0,disCharge:0}];
		result[i]=new Array();
		result[i].data = (d3.timeFormat("%m/%Y"))(parser(lastestCase[i]["As of date"]));
		result[i].confirm =+ lastestCase[i]["Number of confirmed cases"];
		result[i].death =+ lastestCase[i]["Number of death cases"];
		result[i].discharge =+ lastestCase[i]["Number of discharge cases"];
	}
console.log(result)
	
result.forEach(function (a) {
    if (!this[a.data]) {
        this[a.data] = { data: a.data, confirm: 0, death: 0, discharge: 0, newConfirm: 0, newDeath: 0, newDisCharge: 0 };
        data.push(this[a.data]);
    }
    this[a.data].confirm = Math.max(this[a.data].confirm, a.confirm);
    this[a.data].death = Math.max(this[a.data].death, a.death);
    this[a.data].discharge = Math.max(this[a.data].discharge, a.discharge);
})

console.log(data);
	for(var i = 1; i < data.length;i++){
		data[i].newConfirm = data[i].confirm - data[i-1].confirm;
		data[i].newDeath = data[i].death - data[i-1].death;
		data[i].newDisCharge = data[i].discharge - data[i-1].discharge;
	}
console.log(data);
	
	
	
	dataL = data.length;
	
	var maxValue = d3.max(data, d => d.confirm);
	
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	x = d3.scaleTime().domain([d3.min(data, d => parser2(d.data)),d3.max(data, d => parser2(d.data))]).range([0,width]);
	
	svg.append("g")
			.attr("id","yaxis")
		.attr("transform",function(){
		var translate = [margin.left,0];
		return "translate("+translate+")";
	}).call(d3.axisLeft(y));
	
	
svg.append('g')
	.call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%m/%y')))
	.attr("transform",function(){
			var translate = [margin.left,svgHeight - margin.bottom];
			return "translate("+translate+")";})
	.selectAll("text")
	//置右
	.style("text-anchor","end")
		.attr("transform","rotate(-50)");
	
	TC();
})


function TC(){
	
	var maxValue = d3.max(data, d => d.confirm);
	//console.log("maxValue");
	
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	
	
	svg.select("#yaxis").call(d3.axisLeft(y));
	
	var rect = svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(parser2(d.data))})
		.attr("y",function(d){ return y(d.confirm)})
		//.attr("width", x.bandwidth())
		.attr("width", 14)
		.attr("height",function(d,i){ return svgHeight - y(d.confirm) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-21,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(3)})	
         .on("mousemove",function(d){
			d3.select(this).attr("stroke","gold")
            var xPosition = d3.mouse(this)[0];
            var yPosition = d3.mouse(this)[1];

            d3.select("#tooltips").remove();
            d3.select("#bg").remove();

            svg.append("text")
                .attr("id","tooltips")
                .attr("x",xPosition+45)
                .attr("y",yPosition-30)
                .attr("text-anchor","middle")
                .attr("fill","black")
                .attr("font-size","20px")
                .text( "Data : " +d.data+  ", Confirm :"+ d.confirm );
            })
            .on("mouseout",function(){
			 	d3.select(this).attr("stroke","none")
                d3.select("#tooltips").remove();
                d3.select("#bg").remove();
            });
	
	
	var rect = svg.selectAll("rect2")
		.data(data)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(parser2(d.data))})
		.attr("y",function(d){ return y(d.discharge)})
		//.attr("width", x.bandwidth())
		.attr("width", 14)
		.attr("height",function(d,i){ return svgHeight - y(d.discharge) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-7,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(2)})
         .on("mousemove",function(d){
			 		d3.select(this).attr("stroke","gold")
            var xPosition = d3.mouse(this)[0];
            var yPosition = d3.mouse(this)[1];

            d3.select("#tooltips").remove();
            d3.select("#bg").remove();
			 
            svg.append("text")
                .attr("id","tooltips")
                .attr("x",xPosition+45)
                .attr("y",yPosition-30)
                .attr("text-anchor","middle")
                .attr("fill","black")
                .attr("font-size","20px")
                .text( "Data : " +(d.data)+  ", Discharge :"+ d.discharge );
            })
            .on("mouseout",function(){
			 		d3.select(this).attr("stroke","none")
                d3.select("#tooltips").remove();
                d3.select("#bg").remove();
            });
	
	
	var rect = svg.selectAll("rect3")
		.data(data)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(parser2(d.data))})
		.attr("y",function(d){ return y(d.death)})
		//.attr("width", x.bandwidth())
		.attr("width", 14)
		.attr("height",function(d,i){ return svgHeight - y(d.death) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left+7,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(0)})
         .on("mousemove",function(d){
			 		d3.select(this).attr("stroke","gold")
            var xPosition = d3.mouse(this)[0];
            var yPosition = d3.mouse(this)[1];

            d3.select("#tooltips").remove();
            d3.select("#bg").remove();

            svg.append("text")
                .attr("id","tooltips")
                .attr("x",xPosition+45)
                .attr("y",yPosition-30)
                .attr("text-anchor","middle")
                .attr("fill","black")
                .attr("font-size","20px")
                .text( "Data : " +(d.data)+  ", Death :"+ d.death );
            })
            .on("mouseout",function(){
			 		d3.select(this).attr("stroke","none")
                d3.select("#tooltips").remove();
                d3.select("#bg").remove();
            });
	
	svg.select("#topic").remove();
		
		svg.append("g")
			.attr("id","topic")
			.append("text")
			.attr("x",svgWidth/2)
			.attr("y",50)
			.attr("text-anchor", "middle")
			.attr("font-size", 30)
			.text("Covid-19 of Hong Kong (Monthly)");
	leg();
}

function leg(){
	var legend = svg.selectAll("legend")
  .data(colors1)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) {
	  return "translate(30," + i * 30 + ")"; 
  });
 
legend.append("rect")
  .attr("x",  margin.left)
  .attr("y", 15)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill",function(d,i) {
	return colors(d);
});
 
legend.append("text")
.attr("id","Lname")
  .attr("x", margin.left+30)
  .attr("y", 24)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d, i) { return bname[i];
  });
}



function newCf(){
	
	d3.selectAll("rect").remove();
	
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	if(isclick==1){
		TC();
		isclick = 0;
	}else{
		isclick = 1;
	
	var maxValue = d3.max(data, d => d.newConfirm);
	//console.log(maxValue);
	
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	
	
svg.select("#yaxis").call(d3.axisLeft(y));
	
	var rect = svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(parser2(d.data))})
		.attr("y",function(d){ return y(d.newConfirm)})
		//.attr("width", x.bandwidth())
		.attr("width", 20)
		.attr("height",function(d,i){ return svgHeight - y(d.newConfirm) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-10,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(3)})
			 .on("mousemove",function(d){
			 		d3.select(this).attr("stroke","gold")
                    var xPosition = d3.mouse(this)[0];
                    var yPosition = d3.mouse(this)[1];
			 
					d3.select("#tooltips").remove();
                    d3.select("#bg").remove();
                    
                    svg.append("text")
                        .attr("id","tooltips")
                        .attr("x",xPosition+45)
                        .attr("y",yPosition-30)
                        .attr("text-anchor","middle")
                        .attr("fill","black")
                        .attr("font-size","20px")
                        .text("Data : " +(d.data)+  ", new Confirm :"+ d.newConfirm );
                })
                .on("mouseout",function(){
			 		d3.select(this).attr("stroke","none")
                    d3.select("#tooltips").remove();
                    d3.select("#bg").remove();
                });
		
	
	svg.select("#topic").remove();
		
		svg.append("g")
			.attr("id","topic")
			.append("text")
			.attr("x",svgWidth/2)
			.attr("y",50)
			.attr("text-anchor", "middle")
			.attr("font-size", 30)
			.text("New Comfirm of Covid-19 (Monthly)");
	
	}
}


function newDC(){
	
	d3.selectAll("rect").remove();
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	if(isclick==2){
		TC();
		isclick = 0;
	}else{
		isclick = 2;
	
	//d3.select("g").selectAll("rect").remove();
	var maxValue = d3.max(data, d => d.newDisCharge);
	//console.log(maxValue);
	
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	
svg.select("#yaxis").call(d3.axisLeft(y));
	
	
	
	var rect = svg.append("g").selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(parser2(d.data))})
		.attr("y",function(d){ return y(d.newDisCharge)})
		//.attr("width", x.bandwidth())
		.attr("width", 20)
		.attr("height",function(d,i){ return svgHeight - y(d.newDisCharge) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-10,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(2)})
			 .on("mousemove",function(d){
			 		d3.select(this).attr("stroke","gold")
                    var xPosition = d3.mouse(this)[0];
                    var yPosition = d3.mouse(this)[1];
			 
					d3.select("#tooltips").remove();
                    d3.select("#bg").remove();
                    
                    svg.append("text")
                        .attr("id","tooltips")
                        .attr("x",xPosition+45)
                        .attr("y",yPosition-30)
                        .attr("text-anchor","middle")
                        .attr("fill","black")
                        .attr("font-size","20px")
                		.text( "Data : " +(d.data)+  ", new DisCharge :"+ d.newDisCharge );
                })
                .on("mouseout",function(){
			 		d3.select(this).attr("stroke","none")
                    d3.select("#tooltips").remove();
                    d3.select("#bg").remove();
                });
	
	
	svg.select("#topic").remove();
		
		svg.append("g")
			.attr("id","topic")
			.append("text")
			.attr("x",svgWidth/2)
			.attr("y",50)
			.attr("text-anchor", "middle")
			.attr("font-size", 30)
			.text("New Discharge of Covid-19 (Monthly)");
	}
}


function newD(){
	
	d3.selectAll("rect").remove();
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	if(isclick==3){
		TC();
		isclick = 0;
	}else{
		isclick = 3;
	
	var maxValue = d3.max(data, d => d.newDeath);
	//console.log(maxValue);
	
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	
svg.select("#yaxis").call(d3.axisLeft(y));
	
	
	var rect = svg.append("g").selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(parser2(d.data))})
		.attr("y",function(d){ return y(d.newDeath)})
		//.attr("width", x.bandwidth())
		.attr("width", 20)
		.attr("height",function(d,i){ return svgHeight - y(d.newDeath) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-10,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(0)})
			 .on("mousemove",function(d){
			 		d3.select(this).attr("stroke","gold")
                    var xPosition = d3.mouse(this)[0];
                    var yPosition = d3.mouse(this)[1];
			 
					d3.select("#tooltips").remove();
                    d3.select("#bg").remove();
                    
                    svg.append("text")
                        .attr("id","tooltips")
                        .attr("x",xPosition+45)
                        .attr("y",yPosition-30)
                        .attr("text-anchor","middle")
                        .attr("fill","black")
                        .attr("font-size","20px")
                		.text( "Data : " +(d.data)+  ", new Death :"+ d.newDeath );
                })
                .on("mouseout",function(){
			 		d3.select(this).attr("stroke","none")
                    d3.select("#tooltips").remove();
                    d3.select("#bg").remove();
                });
	
	svg.select("#topic").remove();
		
		svg.append("g")
			.attr("id","topic")
			.append("text")
			.attr("x",svgWidth/2)
			.attr("y",50)
			.attr("text-anchor", "middle")
			.attr("font-size", 30)
			.text("New Death of Covid-19 (Monthly)");
	}
}



















