const currentDate = new Date();
var ref = firebase.database().ref();
let data;

ref.once("value", function(snapshot) {
  data = snapshot.val()
}).then(function() {
  let schedule = JSON.parse(JSON.stringify(data));

//
console.log(data)
//let schedule = JSON.parse(data);
let currentDateOffset = 0;

document.getElementById("prev").addEventListener("click", function(){dateOffset(-1);});
document.getElementById("next").addEventListener("click", function(){dateOffset(1);});

for (let i=1; i<=4; i++) {
	document.getElementById("tab-"+i).addEventListener("click", function(){toggleTabs(i)});
}

function check() {
	console.log(data)
}

function toggleTabs(next) {
	for (let i=1; i<=4; i++) {
		document.getElementById("screen-"+i).classList.remove("visible");
		document.getElementById("tab-"+i).classList.remove("enabled");
	}

	document.getElementById("screen-"+next).classList.add("visible");
	document.getElementById("tab-"+next).classList.add("enabled");

}

function getViewingDate() {
    let offsetDate = new Date(currentDate);
    offsetDate.setDate(currentDate.getDate() + currentDateOffset);
    return(offsetDate.getFullYear()+"-"+(offsetDate.getMonth()+1)+"-"+offsetDate.getDate());
}

function formatDate() {
    let offsetDate = new Date(currentDate);
    offsetDate.setDate(currentDate.getDate() + currentDateOffset);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return(months[offsetDate.getMonth()]+" "+offsetDate.getDate()+", "+offsetDate.getFullYear());
}

function formatDOTW() {
    let offsetDate = new Date(currentDate);
    offsetDate.setDate(currentDate.getDate() + currentDateOffset);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return(days[offsetDate.getDay()]);
}

function dateOffset(increment) {
    if (currentDateOffset >= -1 && currentDateOffset <= 30) {
        currentDateOffset += increment;
    } else if (currentDateOffset <= -1 && increment > 0) {
        currentDateOffset += increment;
    } else if (currentDateOffset >= 30 && increment < 0) {
        currentDateOffset += increment;
    }
    console.log(currentDateOffset);
    loadInformation();
}

function loadInformation() {
    const object = schedule[getViewingDate()];

    document.getElementById("date").innerHTML = formatDate();
    document.getElementById("dotw").innerHTML = formatDOTW();
    document.getElementById("events-body").innerHTML ="";

    if (object.events.length > 0) {
        document.getElementById("events-body").insertAdjacentHTML('beforeend', '<h3 style="margin:0;" class="header centered">Events</h3>')
        for (i=0; i<object.events.length; i++) {
            document.getElementById("events-body").insertAdjacentHTML('beforeend', '<tr><td>'+object.events[i])
        }
    } else {
        document.getElementById("events-body").insertAdjacentHTML('beforeend', '<h3 style="margin:0;" class="header centered">No Events</h3>')
    }


    if (object.day > 0) {
        document.getElementById("day-info").innerHTML = "Day "+object.day+" &mdash; "+object.block;
        document.getElementById("schedule").style.display = "table";

        if (object["staff-meeting"]==true) {
            loadTables(1);
        } else if (object.mass==true) {
            loadTables(2);
        } else if (object["ac-as"]==true) {
            loadTables(3);
        } else {
            loadTables(0);
        }
    } else if (object.day == 0) {
        document.getElementById("day-info").innerHTML = object.block;
        document.getElementById("schedule").style.display = "none";
    }
}

function loadTables(sched) {
    const object = schedule[getViewingDate()];
    const block_array = object.block.split("");
    const time = new Date(object.date +" "+ object.begin);
    const table = document.getElementById("schedule-body");
    const cl = object['class-length'];
    const bl = object['break-length'];
    const ll = object['lunch-length'];

    table.innerHTML = "";
    table.insertAdjacentHTML('beforeend', '<tr><td style="width:30%">'+rt(time, 0, 5)+'<td>Warning Bell</td>');

    if (sched == 0) {
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5, cl)+'<td>Block '+block_array[0]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+cl+5, cl)+'<td>Block '+block_array[1]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, cl+5+cl+5, bl)+'<td>Break</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+bl+cl+5+cl+5, cl)+'<td>Block '+block_array[2]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, cl+5+bl+cl+5+cl+5, ll)+'<td>Lunch</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+ll+cl+5+bl+cl+5+cl+5, cl)+'<td>Block '+block_array[3]+'</td>');
    } else if (sched==1) {
        table.insertAdjacentHTML('afterbegin', '<tr><td><b>8:15&ndash;9:15</b></td><td><b style="color:red;">Staff Meeting</b></td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5, cl)+'<td>Block '+block_array[0]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+cl+5, cl)+'<td>Block '+block_array[1]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, cl+5+cl+5, ll)+'<td>Lunch</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+ll+cl+5+cl+5, cl)+'<td>Block '+block_array[2]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+cl+5+ll+cl+5+cl+5, cl)+'<td>Block '+block_array[3]+'</td>');
    } else if (sched==2) {
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5, cl)+'<td>Block '+block_array[0]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, cl+5, bl)+'<td>Break</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+bl+cl+5, cl)+'<td>Block '+block_array[1]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+cl+5+bl+cl+5, 60)+'<td>Mass</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 60+5+cl+5+bl+cl+5, ll)+'<td>Lunch</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+ll+60+5+cl+5+bl+cl+5, cl)+'<td>Block '+block_array[2]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+cl+5+ll+60+5+cl+5+bl+cl+5, cl)+'<td>Block '+block_array[3]+'</td>');
    } else if (sched==3) {
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5, cl)+'<td>Block '+block_array[0]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+cl+5, cl)+'<td>Block '+block_array[1]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, cl+5+cl+5, bl)+'<td>Break</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+bl+cl+5+cl+5, cl)+'<td>Block '+block_array[2]+'</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, cl+5+bl+cl+5+cl+5, ll)+'<td>Lunch</td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+ll+cl+5+bl+cl+5+cl+5, 50)+'<td><b>Academic/Assembly</b></td>');
        table.insertAdjacentHTML('beforeend', '<tr><td>'+rt(time, 5+50+5+ll+cl+5+bl+cl+5+cl+5, cl)+'<td>Block '+block_array[3]+'</td>');
    }
}

function add(tm, minutes) {
    return new Date(tm.getTime() + minutes*60000);
}

function twh(tm) {
    if (tm>12) {
        return tm-12;
    } else {
        return tm;
    }
}

function rt(tm, before, minutes) {
    return twh(add(tm, before).getHours())+':'+('0'+add(tm, before).getMinutes()).slice(-2)+'&ndash;'+twh(add(add(tm, before), minutes).getHours())+':'+('0'+add(add(tm, before), minutes).getMinutes()).slice(-2);
}

loadInformation();
});
