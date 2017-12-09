var w = 600,
	h = 600;

var colorscale = d3.scale.category10();

var allData;
var orderedClasses = [];
var dataToDisplay = [];
var displayedClasses = [];

var allCourseInfo = {};

//Options for the Radar chart, other than default
var mycfg = {
    w: w,
    h: h,
    maxValue: 0.6,
    levels: 6,
    ExtraWidthX: 300,
}

// Load data from CSV
d3.csv('data.csv', parseInputRow, loadData);
d3.csv('course_info.csv', parseInputRowCourseInfo, loadDataCourseInfo);

function parseInputRowCourseInfo(d) {
    return {
        courseKey: d.courseKey,
        title: d.title,
        desc : d.description,
    };
}

function loadDataCourseInfo(error, data) {
    if (error) {
        console.log(error);
        throw error; // Runs if there's a problem fetching the csv.
    }

    //console.log(data);
    data.forEach(function(dataPoint) {
        allCourseInfo[dataPoint.courseKey] = {
            title: dataPoint.title,
            desc: dataPoint.desc,
        }
    });

}

function parseInputRow(d) {
    let courseName = d.deptCode + ' ' + d.classNo;
    orderedClasses.push(courseName);
    return [
		{axis:"AI", value: Math.sqrt(+d.scoreAI/100.0)},
        // {axis:"Biocomputation", value: d.scoreBiocomp},
        {axis:"Computer Engineering", value: Math.sqrt(+d.scoreCompeng/100.0)},
        {axis:"Info", value: Math.sqrt(+d.scoreInfo/100.0)},
        {axis:"Systems", value: Math.sqrt(+d.scoreSystems/100.0)},
        {axis:"Theory", value: Math.sqrt(+d.scoreTheory/100.0)},
        {axis:"HCI", value: Math.sqrt(+d.scoreHCI/100.0)},
        {axis:"Graphics", value: Math.sqrt(+d.scoreGraphics/100.0)},
    ];
}

var DEFAULT_CLASS = 'cs 124';

function loadData(error, data) {
    if (error) {
    	console.log(error);
        throw error; // Runs if there's a problem fetching the csv.
	}
	// console.log(orderedClasses);
	// console.log(data);

	allData = data;

	displayedClasses.push(DEFAULT_CLASS);
	addClassWidget(DEFAULT_CLASS);

    dataToDisplay.push(allData[orderedClasses.indexOf(DEFAULT_CLASS)]);
    RadarChart.draw("#chart", dataToDisplay, mycfg);

    // Search box
    $( function() {
        $( "#classSearch" ).autocomplete({
            source: orderedClasses,
            minLength: 0
        });

    } );
}

function displayClassInfo(event) {
    let elem = event.target;

    let courseKey = elem.innerHTML;
    console.log(courseKey);

    let currClassKeyElem = document.getElementById('currClassKey');
    currClassKey.innerHTML = courseKey.toUpperCase();
    let currClassElem = document.getElementById('currClass');
    let currClassInfoElem = document.getElementById('currClassInfo');
    if (courseKey in allCourseInfo) {
        let courseObj = allCourseInfo[courseKey];
        currClassElem.innerHTML = courseObj.title;
        currClassInfoElem.innerHTML = courseObj.desc;
    } else {
        currClassElem.innerHTML = '<em>Course info unavailable</em>';
        currClassInfoElem.innerHTML = '';
    }

}

var classSearchElem = document.getElementById('classSearch');
classSearchElem.addEventListener("keydown", onClassSearchEnter);

var BASE_OPACITY = 0.7;

function updateClassWidgetColors() {
    let elem = document.getElementById('selectable');
    let children = elem.children;
    for (var i = 0; i < children.length; i++) {
        let listElem = children[i].children[0];
        listElem.style.backgroundColor = colorscale(i);
    }
}

function addClassWidget(className) {
    let elem = document.getElementById('selectable');
    let listElem = document.createElement('li');
    let c = document.createElement('div');
    listElem.id = className;
    c.className = 'ui-widget-content btn btn-default';
    c.innerHTML = className;

    //c.innerHTML += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
    //c.style.backgroundColor = colorscale(selectedClassIndices.indexOf(classIdx));
    c.style.opacity = BASE_OPACITY;
    c.style.color = 'white'; // hack
    c.addEventListener('click', displayClassInfo);

    // c.addEventListener('mouseover', mouseoverClassWidget);
    // c.addEventListener('mouseout', mouseoutClassWidget);
    let b = document.createElement('button');
    b.innerHTML = 'x';
    b.className = 'btn btn-default';
    b.addEventListener('click', clickRemoveButton, true);
    listElem.appendChild(c);
    listElem.appendChild(b);
    elem.append(listElem);

    updateClassWidgetColors();
}


var feedbackElem = document.getElementById('feedback');
var MAX_CLASSES = 10;

function clickRemoveButton(event) {
    //console.log(event);

    //console.log(selectedClassIndices);

    feedbackElem.innerHTML = '';

    if (dataToDisplay.length > 1) {
        let parentElem = event.target.parentNode;
        console.log(parentElem);
        let className = parentElem.id;
        let listIdx = $( "#selectable li" ).index( parentElem );
        //console.log(listIdx);
        parentElem.parentNode.removeChild(parentElem);

        displayedClasses.splice(displayedClasses.indexOf(className), 1);

        dataToDisplay.splice(listIdx, 1);
        RadarChart.draw("#chart", dataToDisplay, mycfg);

        updateClassWidgetColors();

        console.log(displayedClasses);
    }
    else {
        feedbackElem.innerHTML = 'You have to display at least 1 class.';
    }
}

function onClassSearchEnter(e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        //console.log(e);

        feedbackElem.innerHTML = '';

        let selectedClass = e.target.value;
        let classIdx = orderedClasses.indexOf(selectedClass);
        // TODO add feedback for these
        if (classIdx < 0 || displayedClasses.includes(selectedClass)) {
            return;
        }
        if (displayedClasses.length >= MAX_CLASSES) {
            feedbackElem.innerHTML = "Sorry, you can't display more than " + MAX_CLASSES + " classes.";
            return;
        }
        displayedClasses.push(selectedClass);
        addClassWidget(selectedClass);

        dataToDisplay.push(allData[orderedClasses.indexOf(selectedClass)]);
        RadarChart.draw("#chart", dataToDisplay, mycfg);

        //console.log(displayedClasses);
    }
}