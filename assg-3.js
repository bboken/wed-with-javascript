// JavaScript Document
var svgHeight = 700;
var svgWidth = 1400;
var svg = d3.select("#svgContainer").append("svg");
svg.attr("width",svgWidth)
    .attr("height",svgHeight)
    .style("background-color", "rgba(230,230,230,100)");
var margin = {top:50,left:50,right:50,bottom:50};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var colors = d3.scaleOrdinal(d3.schemeCategory10);

var url = "https://api.data.gov.hk/v1/historical-archive/get-file?url=http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Fenhanced_sur_covid_19_eng.csv&time=20210421-0922";
var data,ageChart=[],DageChart=[],genderChart=[];

d3.csv(url).then(function(DetailCase){
	//console.log(DetailCase.length);
	//console.log(DetailCase);
	data = new Array(DetailCase.length);
	for(var i = 0; i < DetailCase.length;i++){
		//data[i]=[{data:0,confirm:0,death:0,discharge:0,newConfirm:0,newDeath:0,disCharge:0}];
		data[i]=new Array();
		data[i].caseNo =+ DetailCase[i]["Case no."];
		data[i].gender = DetailCase[i]["Gender"];
		data[i].resident = DetailCase[i]["HK/Non-HK resident"];
		data[i].age = DetailCase[i]["Age"];
		
	}
	console.log(data);
	
	data.forEach(function (a) {
		if (!this[a.gender]) {
			this[a.gender] = { gender: a.gender, count: 0};
			genderChart.push(this[a.gender]);
		}
		this[a.gender].count = this[a.gender].count + 1;

	})
	//console.log(genderChart);
	
	
	for(var i =0;i<=100;i++){
		ageChart[i]=new Array();
		ageChart[i].age = i;
		ageChart[i].count = 0;
	}
	
	data.forEach(function (a) {
		ageChart[a.age].count = ageChart[a.age].count + 1;
	})
	
	//console.log(ageChart);
	for(var i =0;i<10;i++){
		DageChart[i]=new Array();
		DageChart[i].age =(i+1)*10;
		DageChart[i].count = 0;
		switch(i){
			case 0:
				DageChart[i].dec = "Under 10 Year-old"; break;
			case 1:
				DageChart[i].dec = "11 - 20 Year-old"; break;
				
			case 2:
				DageChart[i].dec = "21 - 30 Year-old"; break;
				
			case 3:
				DageChart[i].dec = "31 - 40 Year-old"; break;
				
			case 4:
				DageChart[i].dec = "41 - 50 Year-old"; break;
				
			case 5:
				DageChart[i].dec = "51 - 60 Year-old"; break;
				
			case 6:
				DageChart[i].dec = "61 - 70 Year-old"; break;
				
			case 7:
				DageChart[i].dec = "71 - 80 Year-old"; break;
				
			case 8:
				DageChart[i].dec = "81 - 90 Year-old"; break;
				
			case 9:
				DageChart[i].dec = "91 - 100 Year-old"; break;
		}
		for(var j = 0;j<10;j++){
			if(i==0&&j==0){
				DageChart[0].count = DageChart[0].count + ageChart[0].count;
			}
			var k = i*10+j+1;
			DageChart[i].count = DageChart[i].count + ageChart[k].count;
		}
		
	}
	//console.log(DageChart);
	
	Gender();
	
})

	
function Age(){
	svg.select("#yaxis").remove();
	svg.select("#xaxis").remove();
	svg.selectAll("rect").remove();
	svg.selectAll("#gen").remove();
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	
	
	var maxValue = d3.max(ageChart, d => d.count);
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	x = d3.scaleLinear().domain([-0.75,d3.max(ageChart, d => d.age)]).range([0,width]);
	
	svg.append("g")
		.attr("id","yaxis")
		.attr("transform",function(){
			var translate = [margin.left,0];
			return "translate("+translate+")";
			})
		.call(d3.axisLeft(y));
	
	svg.append('g')
		.call(d3.axisBottom(x))
		.attr("id","xaxis")
		.attr("transform",function(){
			var translate = [margin.left,svgHeight - margin.bottom];
			return "translate("+translate+")";})
		.selectAll("text")
		//置右
		.style("text-anchor","end")
		.attr("transform","rotate(-50)");
	
	
	
	var rect = svg.selectAll("rect")
		.data(ageChart)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(d.age)})
		.attr("y",function(d){ return y(d.count)})
		//.attr("width", x.bandwidth())
		.attr("width", 10)
		.attr("height",function(d,i){ return svgHeight - y(d.count) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-5,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(i)})
        .on("mousemove",function(d){
			 		d3.select(this).attr("stroke","gold")
            var xPosition = d3.mouse(this)[0];
            var yPosition = d3.mouse(this)[1];

            d3.select("#tooltips").remove();

            svg.append("text")
                .attr("id","tooltips")
                .attr("x",xPosition+45)
                .attr("y",yPosition-30)
                .attr("text-anchor","middle")
                .attr("fill","black")
                .attr("font-size","20px")
                .text("age : " +(d.age)+  ", Count :"+ d.count );
            })
          .on("mouseout",function(){
			 		d3.select(this).attr("stroke","none")
                d3.select("#tooltips").remove();
            });
		
	
	svg.select("#topic").remove();
		
    svg.append("g")
        .attr("id","topic")
        .append("text")
        .attr("x",svgWidth/2)
        .attr("y",50)
        .attr("text-anchor", "middle")
        .attr("font-size", 30)
        .text("Age of Covid-19");
	
}

function DAge(){
	
	var maxValue = d3.max(DageChart, d => d.count);
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	x = d3.scaleLinear().domain([0,d3.max(DageChart, d => d.age)]).range([0,800]);
	
	
	svg.select("#yaxis").remove();
	svg.select("#xaxis").remove();
	svg.selectAll("rect").remove();
	svg.selectAll("#gen").remove();
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	
	
	
	var rect = svg.selectAll("rect")
		.data(DageChart)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(d.age)})
		.attr("y",function(d){ return y(d.count)})
		//.attr("width", x.bandwidth())
		.attr("width", 80)
		.attr("height",function(d,i){ return svgHeight - y(d.count) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-80,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(i)})
			 .on("mousemove",function(d){
			 		d3.select(this).attr("stroke","gold")
                    var xPosition = d3.mouse(this)[0];
                    var yPosition = d3.mouse(this)[1];
			 
					d3.select("#tooltips").remove();
                    
                    svg.append("text")
                        .attr("id","tooltips")
                        .attr("x",xPosition+45)
                        .attr("y",yPosition-30)
                        .attr("text-anchor","middle")
                        .attr("fill","black")
                        .attr("font-size","20px")
                        .text(d.dec+  ", Count :"+ d.count );
                })
                .on("mouseout",function(){
			 		d3.select(this).attr("stroke","none")
                    d3.select("#tooltips").remove();
                });
		
	
	svg.select("#topic").remove();
		
		svg.append("g")
			.attr("id","topic")
			.append("text")
			.attr("x",svgWidth/2)
			.attr("y",50)
			.attr("text-anchor", "middle")
			.attr("font-size", 30)
			.text("Age of Covid-19 ( every 10 year-old )");
	
	svg.append("g")
			.attr("id","yaxis")
		.attr("transform",function(){
		var translate = [margin.left,0];
		return "translate("+translate+")";
	}).call(d3.axisLeft(y));
	
	
svg.append('g')
	.call(d3.axisBottom(x))
	.attr("id","xaxis")
	.attr("transform",function(){
			var translate = [margin.left,svgHeight - margin.bottom];
			return "translate("+translate+")";})
	.selectAll("text")
	//置右
	.style("text-anchor","end")
		.attr("transform","rotate(-50)");
	
	
}

function Gender(){
	
	svg.select("#yaxis").remove();
	svg.select("#xaxis").remove();
	svg.selectAll("rect").remove();
	svg.selectAll("#gen").remove();
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	 var max = d3.sum(genderChart,c=>c.count);
	var translate = [250,350];
	var segments = d3.arc().innerRadius(0).outerRadius(200).padAngle(0).padRadius(100);

//Sub-degree
var pie = d3.pie().value(function(d){ return d.count;});

var section1 = svg.append("g")
		.attr("id","gen")
				.attr("transform", function(d,i) {
						return "translate(" + translate + ")";
				}).selectAll("path").data(pie(genderChart));
    section1.enter()
		.append("path")
        .attr("d",segments)
        .attr("fill",function(d,i){return colors(i);})
	
	
	 svg.append("g")
		.attr("id","gen")
		 .selectAll("text")
		 .data(pie(genderChart))
		 .enter()
		 .append("text")
	
		.attr("transform", 
			function(d) {
				 var xp = translate[0] + segments.centroid(d)[0];
				 var yp = translate[1] + segments.centroid(d)[1];
			return "translate(" + xp+","+yp + ")";
		})
		.text(function(d) { 
			 //console.log(d.data.count);
		 var value = d.data.count/max *100
			return value.toFixed(2)+"%"; 
		});
	
	
	svg.select("#topic").remove();
		
		svg.append("g")
			.attr("id","topic")
			.append("text")
			.attr("x",250)
			.attr("y",50)
			.attr("text-anchor", "middle")
			.attr("font-size", 30)
			.text("Gender of Covid-19 ");
	
	var legend = svg.selectAll("legend")
	  .data(pie(genderChart))
	  .enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) {
		  return "translate(30," + (i * 30+100) + ")"; 
	  });

	legend.append("rect")
	  .attr("x",  margin.left)
	  .attr("y", 15)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill",function(d,i) {
		return colors(i);
	});

	legend.append("text")
	.attr("id","Lname")
	  .attr("x", margin.left+30)
	  .attr("y", 24)
	  .attr("dy", ".35em")
	  .style("text-anchor", "start")
	  .text(function(d) { return d.data.gender;
	  });
}




















