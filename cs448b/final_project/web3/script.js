var w = 800,
	h = 800;

var colorscale = d3.scale.category10();

//Legend titles
// var LegendOptions = ['cs 221','cs 147'];

//Data
var d = [
		  [
			{axis:"AI",value:0.59},
			{axis:"Biocomputation",value:0.56},
			{axis:"Computer Engineering",value:0.42},
			{axis:"Graphics",value:0.34},
			{axis:"HCI",value:0.48},
			{axis:"Info",value:0.14},
			{axis:"Systems",value:0.11},
			{axis:"Theory",value:0.05},
		  ],[
			{axis:"AI",value:0.48},
			{axis:"Biocomputation",value:0.41},
			{axis:"Computer Engineering",value:0.27},
			{axis:"Graphics",value:0.28},
			{axis:"HCI",value:0.46},
			{axis:"Info",value:0.29},
			{axis:"Systems",value:0.11},
			{axis:"Theory",value:0.14},
		  ]
		];

var allData;
var orderedClasses = [];
var selectedClassIndices = [];
var dataToDisplay = [];

// Load data from CSV
d3.csv('out.csv', parseInputRow, loadData);

function parseInputRow(d) {
    let courseName = d.deptCode + ' ' + d.classNo;
    orderedClasses.push(courseName);
    return [
		{axis:"AI", value: +d.scoreAI/100.0},
        // {axis:"Biocomputation", value: d.scoreBiocomp},
        {axis:"Computer Engineering", value: +d.scoreCompeng/100.0},
        // {axis:"Graphics", value: d.scoreGraphics},
        // {axis:"HCI", value: d.scoreHCI},
        {axis:"Info", value: +d.scoreInfo/100.0},
        {axis:"Systems", value: +d.scoreSystems/100.0},
        {axis:"Theory", value: +d.scoreTheory/100.0},
    ];
}

// function setCurrClassInfo() {
//     let currClassElem = document.getElementById('currClass');
//     let currClassInfoElem = document.getElementById('currClassInfo');
//     currClassElem.innerHTML = orderedClasses[currClassIdx];
// }

function displaySelectedClasses() {
    let currClassesElem = document.getElementById('currClasses');
    currClassesElem.innerHTML = "";
    selectedClassIndices.forEach(function(classIdx) {
        currClassesElem.innerHTML += orderedClasses[classIdx] + ', ';
    });
}

function loadData(error, data) {
    if (error) {
    	console.log(error);
        throw error; // Runs if there's a problem fetching the csv.
	}
	console.log(orderedClasses);
	console.log(data);

	allData = data;

	selectedClassIndices.push(orderedClasses.indexOf('cs 124'));
	addClassWidget(orderedClasses.indexOf('cs 124'));

    for (var i = 0; i < allData.length; i++) {
        if (selectedClassIndices.includes(i)) {
            dataToDisplay.push(allData[i]);
        }
    }

    console.log(allData);
    console.log(dataToDisplay);

    //Options for the Radar chart, other than default
    var mycfg = {
        w: w,
        h: h,
        maxValue: 0.6,
        levels: 6,
        ExtraWidthX: 300,
        classIndices: selectedClassIndices
    }

    //Call function to draw the Radar chart
	//Will expect that data is in %'s
    //displaySelectedClasses();
    RadarChart.draw("#chart", dataToDisplay, mycfg);

    // Search box
    $( function() {
        $( "#classSearch" ).autocomplete({
            source: orderedClasses,
            minLength: 0
        });

    } );

    // Selectable elements
    $( function() {
        $( "#selectable" ).selectable({
            stop: function() {
                var result = $( "#select-result" ).empty();
                $( ".ui-selected", this ).each(function() {
                    var index = $( "#selectable li" ).index( this );
                    result.append( " #" + ( index + 1 ) );
                });
            }
        });
    } );
}

var classSearchElem = document.getElementById('classSearch');
classSearchElem.addEventListener("keydown", onClassSearchEnter);

var originalStyle;
function highlightClass(classIdx) {
    // console.log(classIdx);
    let elem = document.getElementById(classIdx);
    // console.log(elem);
    originalStyle = elem.style.border;
    elem.style.border = "thick solid black";
}

function unhighlightClass(classIdx) {
    let elem = document.getElementById(classIdx);
    elem.style.border = originalStyle;
}

function addClassWidget(classIdx) {
    let elem = document.getElementById('selectable');
    let c = document.createElement('li');
    c.id = classIdx;
    c.className = 'ui-widget-content';
    c.innerHTML = orderedClasses[classIdx];
    c.style.backgroundColor = colorscale(selectedClassIndices.indexOf(classIdx));
    c.style.opacity = 0.7;
    //c.addEventListener('mouseover', mouseoverClassWidget);
    //c.addEventListener('mouseout', mouseoutClassWidget);
    elem.appendChild(c);
}

function onClassSearchEnter(e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        //console.log(e);
        let selectedClass = e.target.value;
        let classIdx = orderedClasses.indexOf(selectedClass);
        // TODO add feedback for these
        if (classIdx < 0 || selectedClassIndices.includes(classIdx) || selectedClassIndices.length >= 5) {
            return;
        }
        selectedClassIndices.push(classIdx);
        addClassWidget(classIdx);


        dataToDisplay.push(allData[classIdx]);

        //console.log(allData);
        //console.log(dataToDisplay);

        //Options for the Radar chart, other than default
        var mycfg = {
            w: w,
            h: h,
            maxValue: 0.6,
            levels: 6,
            ExtraWidthX: 300,
            classIndices: selectedClassIndices
        }

        //Call function to draw the Radar chart
        //Will expect that data is in %'s
        //displaySelectedClasses();
        RadarChart.draw("#chart", dataToDisplay, mycfg);
    }
}

function mouseoverClassWidget(e) {
    //console.log(e);
    let classIdx = +e.target.id;
    //console.log(classIdx);
    highlightClass(classIdx);
}

function mouseoutClassWidget(e) {
    let classIdx = +e.target.id;
    unhighlightClass(classIdx);
}


////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

//var svg = d3.select('#body')
//	.selectAll('svg')
//	.append('svg')
//	.attr("width", w+300)
//	.attr("height", h)
//
////Create the title for the legend
//var text = svg.append("text")
//	.attr("class", "title")
//	.attr('transform', 'translate(90,0)')
//	.attr("x", w - 70)
//	.attr("y", 10)
//	.attr("font-size", "12px")
//	.attr("fill", "#404040")
//	.text("Classes");
//
////Initiate Legend
//var legend = svg.append("g")
//	.attr("class", "legend")
//	.attr("height", 100)
//	.attr("width", 200)
//	.attr('transform', 'translate(90,20)')
//	;
//	//Create colour squares
//	legend.selectAll('rect')
//	  .data(LegendOptions)
//	  .enter()
//	  .append("rect")
//	  .attr("x", w - 65)
//	  .attr("y", function(d, i){ return i * 20;})
//	  .attr("width", 10)
//	  .attr("height", 10)
//	  .style("fill", function(d, i){ return colorscale(i);})
//	  ;
//	//Create text next to squares
//	legend.selectAll('text')
//	  .data(LegendOptions)
//	  .enter()
//	  .append("text")
//	  .attr("x", w - 52)
//	  .attr("y", function(d, i){ return i * 20 + 9;})
//	  .attr("font-size", "11px")
//	  .attr("fill", "#737373")
//	  .text(function(d) { return d; })
//	  ;	/**
// * Created by kywang on 12/1/17.
// */
