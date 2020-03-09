/*
    Declares all of our schedules.
    This saves some time
*/

const regularSchedule = {
    "Morning X Block": "7:00-8:15",
    "1st Block": "8:25-9:40",
    "2nd Block": "9:45-11:00",
    "Break": "11:00-11:15",
    "3rd Block": "11:20-12:35",
    "Lunch": "12:35-1:20",
    "4th Block": "1:25-2:40",
    "Afternoon Y Block": "2:45-4:00"
};

const lateStart = {
    "Morning X Block": "7:00-8:10",
    "Staff Meeting/PLC": "8:15-9:10",
    "1st Block": "9:20-10:25",
    "2nd Block": "10:30-11:35",
    "Lunch": "11:35-12:20",
    "3rd Block": "12:25-1:30",
    "4th Block": "1:35-2:40",
    "Afternoon Y Block": "2:45-4:00"
};

const academicAssembly = {
    "Morning X Block": "7:00-8:15",
    "1st Block": "8:25-9:25",
    "2nd Block": "9:30-10:30",
    "Break": "10:30-10:45",
    "3rd Block": "10:50-11:50",
    "Lunch": "11:50-12:40",
    "A/A Block": "12:45-1:35",
    "4th Block": "1:40-2:40",
    "Afternoon Y Block": "2:45-4:00"
};
const massSchedule = {
    "Morning X Block": "7:00-8:15",
    "1st Block": "8:25-9:25",
    "Break": "9:25-9:35",
    "2nd Block": "9:40-10:40",
    "Mass": "10:45-11:45",
    "Lunch": "11:45-12:30",
    "3rd Block": "12:35-1:35",
    "4th Block": "1:40-2:40",
    "Afternoon Y Block": "2:40-4:00"
};

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let currentScheduleIncrement = 0;

document.getElementById("schedule-prev").addEventListener("click", function() {
    paginator(-1);
})
document.getElementById("schedule-next").addEventListener("click", function() {
    paginator(1);
})

function structureScheduleData(events) {
    let dayMatrix = []
    for (let i = 0; i < events.length; i++) {
        if (events[i].summary.startsWith("Day 1") || events[i].summary.startsWith("Day 2")) {
            let eventDate = new Date(events[i].start.date);
            eventDate.setDate(eventDate.getDate() + 1);
            eventDate.setHours(0);
            eventDate.setMinutes(0);

            dayMatrix.push({ date: eventDate.toDateString(), schedule: events[i].summary.slice(6), label: "Regular Schedule" });
        }
    }
    for (let i=0; i<events.length; i++) {
         if (events[i].summary.startsWith("Academic Assembly")) {
            let eventDate = new Date(events[i].end.dateTime);
            eventDate.setHours(0);
            eventDate.setMinutes(0);

            let object = dayMatrix.find(({ date }) => date == eventDate.toDateString())

            object.label = "Academic Assembly";

        }
        else if (events[i].summary.startsWith("Mass Schedule")) {
            let eventDate = new Date(events[i].end.dateTime);
            eventDate.setHours(0);
            eventDate.setMinutes(0);

            let object = dayMatrix.find(({ date }) => date == eventDate.toDateString())
            
            object.label = "Mass Schedule";

        }
        else if (events[i].summary.startsWith("Staff/PLC")) {
            let eventDate = new Date(events[i].start.date);
            eventDate.setDate(eventDate.getDate() + 1);
            eventDate.setHours(0);
            eventDate.setMinutes(0);


            let object = dayMatrix.find(({ date }) => date == eventDate.toDateString());
            object.label = "Late Start";
        }
    }
    return dayMatrix;
}

function requestEvents(date) {
    let collectedEvents = []
    getTextFromFile("http://m-gapdev.stthomasmorecollegiate.ca/temp/tv/calendar.php", function done(response) {
        const events = JSON.parse(response).items;

        date.setDate(date.getDate() + 1);
        date.setHours(0);
        date.setMinutes(0);

        for (i = 0; i < events.length; i++) {
            let eventDate = new Date(events[i].end.date)
            eventDate.setHours(0);
            eventDate.setMinutes(0);
            eventDate.setDate(eventDate.getDate() + 1);

            if (eventDate != null && eventDate.toDateString() == date.toDateString() && !events[i].summary.startsWith("Day ")) {
                collectedEvents.push(events[i].summary);
            }
        }

        if (!collectedEvents[0]) {
            collectedEvents.push("No events");
        }
        loadEvents(collectedEvents);
    });
}

function loadEvents(events) {
    const table = document.getElementById("schedule-events");

    document.getElementById("schedule-events").innerHTML = "";

    for (let i = 0; i < events.length; i++) {
        table.insertAdjacentHTML("beforeend", '<tr><td>' + events[i] + '</td>')
    }
    enableButtonInput();
}

function advanceSchedule(dateForward) {
    getTextFromFile("http://m-gapdev.stthomasmorecollegiate.ca/temp/tv/calendar.php", function done(response) {
        const events = JSON.parse(response).items;
        let dayMatrix = structureScheduleData(events);
        const schoolDate = new Date(dayMatrix[dateForward].date);

        disableButtonInput();
        requestEvents(schoolDate);

        // Updates dayMatrix with schedule information
        if (dayMatrix[0].schedule.includes("A")) {
            document.getElementById("schedule-day").innerHTML = "Day 1"
        }
        else {
            document.getElementById("schedule-day").innerHTML = "Day 2"
        }

        document.getElementById("schedule-rotation").innerHTML = dayMatrix[dateForward].schedule;
        document.getElementById("schedule-label").innerHTML = dayMatrix[dateForward].label;
        document.getElementById("schedule-dotw").innerHTML = days[schoolDate.getDay()]
        document.getElementById("schedule-d").innerHTML = months[schoolDate.getMonth()] + ". " + schoolDate.getDate();


        if (dayMatrix[dateForward].label == "Regular Schedule") {
            loadSchedule(regularSchedule);
        }
        else if (dayMatrix[dateForward].label == "Mass Schedule") {
            loadSchedule(massSchedule);
        }
        else if (dayMatrix[dateForward].label == "Academic Assembly") {
            loadSchedule(academicAssembly);
        }
        else if (dayMatrix[dateForward].label == "Late Start") {
            loadSchedule(lateStart);
        }

    });
}

function paginator(increment) {
    clearSchedulePage();
    disableButtonInput()

    if (currentScheduleIncrement > 0 && currentScheduleIncrement <5) {
        currentScheduleIncrement += increment;
        advanceSchedule(currentScheduleIncrement);
    }
    else if (currentScheduleIncrement == 0 && increment == 1) {
        currentScheduleIncrement += increment;
        advanceSchedule(currentScheduleIncrement);
    }
    else if (currentScheduleIncrement == 5 && increment == -1) {
        currentScheduleIncrement += increment;
        advanceSchedule(currentScheduleIncrement);
    }
}

function setScheduleIncrement(value) {
    currentScheduleIncrement = value;
}

function disableButtonInput() {
    document.getElementById("schedule-prev").setAttribute("disabled", true);
    document.getElementById("schedule-next").setAttribute("disabled", true);
}

function enableButtonInput() {
    if (currentScheduleIncrement == 0) {
        document.getElementById("schedule-prev").setAttribute("disabled", true);
        document.getElementById("schedule-next").removeAttribute("disabled")

    }
    else if (currentScheduleIncrement > 4) {
        document.getElementById("schedule-prev").removeAttribute("disabled")
        document.getElementById("schedule-next").setAttribute("disabled", true)
    }
    else {
        document.getElementById("schedule-prev").removeAttribute("disabled")
        document.getElementById("schedule-next").removeAttribute("disabled")

    }
}

function clearSchedulePage() {
    document.getElementById("schedule-table").innerHTML = "";
    document.getElementById("schedule-events").innerHTML = "";
    document.getElementById("schedule-day").innerHTML = "";
    document.getElementById("schedule-rotation").innerHTML = "";
    document.getElementById("schedule-label").innerHTML = "";
    document.getElementById("schedule-dotw").innerHTML = "Loading...";
    document.getElementById("schedule-d").innerHTML = "...";
}

advanceSchedule(0);