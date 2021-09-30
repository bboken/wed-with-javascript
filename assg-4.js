// JavaScript Document
var svgHeight = 700;
var svgWidth = 1200;
var svg = d3.select("#svgContainer").append("svg");
svg.attr("width",svgWidth)
    .attr("height",svgHeight)
    .style("background-color", "rgba(230,230,230,100)");
var margin = {top:50,left:80,right:50,bottom:50};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var y,x;
var parser = d3.timeParse("%d/%m/%Y");
var colors = d3.scaleOrdinal(d3.schemeCategory10);
var colors1 = [3,2,0], bname = ["Confirm","Death"];
var url = "https://api.data.gov.hk/v1/historical-archive/get-file?url=http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Fcountries_areas_have_reported_cases_eng.csv&time=20210422-0922";
var data,Cmdata=[],selC=0;
var parser = d3.timeParse("%d/%m/%Y");
var Format = d3.timeFormat("%d/%m/%Y");
var isCd=false;


d3.csv(url).then(function(worldCase){
	console.log(worldCase.length);
	console.log(worldCase);
	data = new Array(worldCase.length);
	
	for(var i = 0; i < worldCase.length;i++){
		//data[i]=[{data:0,confirm:0,death:0,discharge:0,newConfirm:0,newDeath:0,disCharge:0}];
		data[i]=new Array();
		data[i].date = parser(worldCase[i]["As of date"]);
		data[i].countries = worldCase[i]["Countries/areas"];
		data[i].confirm =+ worldCase[i]["Cumulative number of confirmed cases"];
		data[i].death =+ worldCase[i]["Cumulative number of deaths among confirmed cases"];
		
	}
	console.log(data);
	
	data.forEach(function (a) {
		if (!this[a.countries]) {
			this[a.countries] = { countries: a.countries, Cmax: 0,Dmax:0};
			Cmdata.push(this[a.countries]);
		}
		if(a.confirm> this[a.countries].Cmax)
			this[a.countries].Cmax = a.confirm;

		if(a.death> this[a.countries].Dmax)
			this[a.countries].Dmax = a.death;
	})
	
	//console.log(Cmdata);
	var select = d3.select("#opts")
		.on("change", function(){
			 selC = select.property('selectedIndex');
			if(isCd)
				Cd();
			//console.log(si);
		});
	
	d3.select("#opts").selectAll("option").data(Cmdata).enter().append("option")
 		.text(function(d) { return d.countries;});
	
	Cm();
	
})

	var temp=[];

function Cd(){
	svg.select("#yaxis").remove();
	svg.select("#xaxis").remove();
	svg.selectAll("rect").remove();
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	isCd = true;
	
	
	data.forEach(function (a) {
		if(a.countries == Cmdata[selC].countries){
			if (!this[a.date]) {
					this[a.date] = { date: a.date, confirm: 0,death:0};
					temp.push(this[a.date]);
			}
			this[a.date].confirm = a.confirm;
			this[a.date].death = a.death;
		}
	})
	console.log(selC);
	console.log(temp);
	
	
	var maxValue = d3.max(temp, d => d.confirm);
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	x = d3.scaleTime().domain([d3.min(temp, d => d.date),d3.max(temp, d => d.date)]).range([0,width]);
	//console.log(d.date);
	
	svg.append("g")
		.attr("id","yaxis")
		.attr("transform",function(){
			var translate = [margin.left,0];
			return "translate("+translate+")";
			})
		.call(d3.axisLeft(y));
	
	svg.append('g')
		.call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%m/%y')))
		.attr("id","xaxis")
		.attr("transform",function(){
			var translate = [margin.left,svgHeight - margin.bottom];
			return "translate("+translate+")";})
		.selectAll("text")
		//置右
		.style("text-anchor","end")
		.attr("transform","rotate(-50)");
	
	
	
	
	var rect = svg.selectAll("rect1")
		.data(temp)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(d.date)})
		.attr("y",function(d){ return y(d.confirm)})
		//.attr("width", x.bandwidth())
		.attr("width", 5)
		.attr("height",function(d,i){ return svgHeight - y(d.confirm) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-5,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(0)})
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
                .text(Format(d.date)+  ", confirm :"+ d.confirm );
            })
          .on("mouseout",function(){
			 		d3.select(this).attr("stroke","none")
                d3.select("#tooltips").remove();
            });
	
	
	var rect = svg.selectAll("rect2")
		.data(temp)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(d.date)})
		.attr("y",function(d){ return y(d.death)})
		//.attr("width", x.bandwidth())
		.attr("width", 5)
		.attr("height",function(d,i){ return svgHeight - y(d.death) - margin.bottom})
		.attr("transform",function(){
			var translate = [margin.left-5,0];
			return "translate("+translate+")";})
		.attr("fill", function(d,i){ return colors(1)})
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
                .text(Format(d.date)+  ", Death :"+ d.death );
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
        .text(Cmdata[selC].countries+" of Covid-19");
	
	var legend = svg.selectAll("legend")
	  .data([0,1])
	  .enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) {
		  return "translate(30," + (i * 30+50) + ")"; 
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


	
function Cm(){
	svg.select("#yaxis").remove();
	svg.select("#xaxis").remove();
	svg.selectAll("rect").remove();
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	isCd = false;
	
	
	var maxValue = d3.max(Cmdata, d => d.Cmax);
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	x = d3.scaleBand().domain(Cmdata.map(function(d){return d.countries;})).range([0,width]);
	
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
		.data(Cmdata)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(d.countries)})
		.attr("y",function(d){ return y(d.Cmax)})
		//.attr("width", x.bandwidth())
		.attr("width", 5)
		.attr("height",function(d,i){ return svgHeight - y(d.Cmax) - margin.bottom})
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
                .text(d.countries+  ", Count :"+ d.Cmax );
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
        .text("World's confirm of Covid-19");
	
}


function Dm(){
	svg.select("#yaxis").remove();
	svg.select("#xaxis").remove();
	svg.selectAll("rect").remove();
	svg.selectAll("legend").remove();
	svg.selectAll("#Lname").remove();
	isCd = false;
	
	
	var maxValue = d3.max(Cmdata, d => d.Dmax);
	y = d3.scaleLinear().domain([0,maxValue]).range([svgHeight - margin.bottom, margin.top]);
	x = d3.scaleBand().domain(Cmdata.map(function(d){return d.countries;})).range([0,width]);
	
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
		.data(Cmdata)
		.enter()
		.append("rect")
		.attr("x",function(d){return x(d.countries)})
		.attr("y",function(d){ return y(d.Dmax)})
		//.attr("width", x.bandwidth())
		.attr("width", 5)
		.attr("height",function(d,i){ return svgHeight - y(d.Dmax) - margin.bottom})
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
                .text(d.countries+  ", Count :"+ d.Dmax );
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
        .text("World's death of Covid-19");
	
}





























