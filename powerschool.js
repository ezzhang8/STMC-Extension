var grades = document.querySelectorAll('tr[bgcolor="#edf3fe"], tr[bgcolor="#ffffff"]');
var categories = [];
var categorygrades = [];
var weights = [];

document.getElementById('btn-schoolInformation').insertAdjacentHTML('afterend', '<li style="background-image: url('+chrome.extension.getURL('icon.png')+')"role="menuitem"><a href="/guardian/schoolinformation.html">Test</a></li>');

if (window.location.href.indexOf('scores')>-1) {
    document.querySelector('.box-round').insertAdjacentHTML('afterend', '<div class="box-round"><h2>Detailed Grade Information</h2><p class="feedback-info">Grades are calculated by adding the total amount of marks. This does not take into account scaling.</p><table id="grade-table" border="0" cellpadding="0" cellspacing="0" width="99%" class="linkDescList"><tbody id="grade-info"><tr class="center"><th>Category</th><th>Average Score</th><th>Grade (Marks)</th><th>Weight (%)</th></tr></tbody></table></div>')
    document.querySelector('.box-round').insertAdjacentHTML('afterend', '<div class="box-round no-print"><h2>Hypothetical Assignments</h2><p class="feedback-info">This will show you how your grade will be affected by an assignment.</p><table border="0" cellpadding="0" cellspacing="0" width="99%" class="linkDescList"><tbody id="hypothetical"><tr><th>Category</th><th>Assignment Name</th><th>Score (X/Y)</th><th>%</th><th>Grd</th><th>X</th></tr><tr id="add-hypo"><td><select id="category-hypo"><option>Select Category</option></select></td><td><input id="hypo-name" type="text" style="width:95%;" aria-invalid="false"></td><td><input id="hypo-score" type="text" aria-invalid="false"></td><td>--</td><td>--</td><td>--</td></tr></tbody></table><button id="assignment-add" type="button" style="margin-bottom:10px;" class="ng-binding">Add Assignment</button></div>')
    calculateCategories();
}

document.getElementById("assignment-add").addEventListener("click", addAssignment);
document.getElementById("calc-avg").addEventListener("click", calculateWeightedAverage);

function clearDialog() {
    document.getElementById('grade-dialog').parentElement.removeChild(document.getElementById('grade-dialog'));
}

function addAssignment() {
    var row = document.getElementById('add-hypo');
    var select = document.querySelector('select').value;
    var name = document.getElementById('hypo-name').value;
    var score = document.getElementById('hypo-score').value;
    var percent = Math.round(parseFloat(score.split("/")[0])/parseFloat(score.split("/")[1])*100*100)/100;

    row.insertAdjacentHTML('beforebegin', '<tr><td>'+select+'</td><td>'+name+'</td><td>'+score+'</td><td>'+percent+'</td><td>'+grader(percent)+'<td><a style="color:red;">Remove</a></tr>');
}

function grader(score) {
    if (score>=86) {
        return 'A';
    } else if (score<86 && score >=80) {
        return 'B+';
    } else if (score<80 && score >=73) {
        return 'B';
    } else if (score<73 && score >=67) {
        return 'C+';
    } else if (score<67 && score >=60) {
        return 'C';
    } else if (score<60 && score >=50) {
        return 'C-';
    } else if (score<50) {
        return 'I';
    }
}

function calculateCategories() {
    //establish the categories
    for (i=0; i < grades.length; i++) {
        var currently = grades[i].children[1];
        if (categories.includes(currently.innerHTML) == false) {
            categories.push(currently.innerHTML);
        }
    }
    // print out category cells
    for (i=0; i < categories.length; i++) {
        document.getElementById('grade-info').insertAdjacentHTML('beforeend', '<tr id="category'+i+'"class="center"><td>'+categories[i]+'</td></tr>');
    }
    //calculate average grades within each category
    for (i=0; i < categories.length; i++) {
        var sum = 0;
        var num = 0;
        for (j=0; j < grades.length; j++) {
            var category = grades[j].children[1];
            var mark = grades[j].children[9];
            if (parseFloat(grades[j].children[9].innerHTML) == parseFloat(grades[j].children[9].innerHTML) && grades[j].children[1].innerHTML == categories[i]) {

                sum += parseFloat(grades[j].children[9].innerHTML);
                num++;

            }
        }
        document.getElementById('category'+i).insertAdjacentHTML('beforeend', '<td>'+(Math.round(sum/num*1000)/1000)+'%</td>');
    }
    //calculate grade marks
    for (i=0; i < categories.length; i++) {
        var achievedMarks = 0;
        var totalMarks = 0;
        for (j=0; j < grades.length; j++) {
            var category = grades[j].children[1];
            var mark = grades[j].children[8].children[0].innerHTML.split("/");
            if (parseFloat(mark[0]) == parseFloat(mark[0]) && grades[j].children[1].innerHTML == categories[i]) {
                achievedMarks += parseFloat(mark[0]);
                totalMarks += parseFloat(mark[1]);
            }
        }
        document.getElementById('category'+i).insertAdjacentHTML('beforeend', '<td>'+achievedMarks+'/'+totalMarks+' ('+Math.round(achievedMarks/totalMarks*100*1000)/1000+'%)</td>');
        categorygrades[i] = achievedMarks/totalMarks*100;

        document.getElementById('category'+i).insertAdjacentHTML('beforeend', '<td><input type="number" step="1" style="width:40px;" class="weight-input" aria-invalid="false"> %</td>');
    }
    document.getElementById('grade-table').insertAdjacentHTML('afterend', '<button id="calc-avg" type="button" style="margin-bottom:10px;" class="ng-binding no-print">Calculate Weighted Average</button>')
    hypotheticalAssignments();
}

function sum(total, num) {
    return total + num;
}

function calculateWeightedAverage() {
    var weightedGradeMarks = [];

    for (i=0; i < categories.length; i++) {
        weights[i] = parseFloat(document.getElementById('category'+i).children[3].children[0].value);
    }

    for (i=0; i < categories.length; i++) {
        weightedGradeMarks[i] = weights[i]/100*categorygrades[i];
    }
    document.getElementById('calc-avg').insertAdjacentHTML('beforebegin', '<p id="grade-dialog" class="feedback-info">Your weighted average using marks and the weights you provided is '+weightedGradeMarks.reduce(sum)/weights.reduce(sum)*100+'%.</p>');

    for (i=0; i< document.getElementsByClassName("weight-input").length; i++) {
        document.getElementsByClassName("weight-input")[i].addEventListener("onchange", clearDialog);
        console.log(true);

    }
console.log(document.getElementsByClassName("weight-input"));
    //weights then divide weights by 100 then multiply by category values then divide by weights total
    //console.log(weights);
    //console.log(categorygrades);
    //console.log(weightedGradeMarks);
    //console.log(weightedGradeMarks.reduce(sum)/weights.reduce(sum));
}



function hypotheticalAssignments() {
    for (i=0; i < categories.length; i++) {
        document.getElementById('category-hypo').insertAdjacentHTML('beforeend', '<option>'+categories[i]+'</option>');
    }
}
