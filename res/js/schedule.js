/*
    Declares all 4 schedule variants.
*/

const regularSchedule = (schedule) => {
    return {
        "Morning X Blocks": "7:00-8:15",
        "Warning Bell": "8:20",
        ["Block " + schedule.charAt(0)]: "8:25-9:45",
        ["Block " + schedule.charAt(1)]: "9:50-11:05",
        "Break": "11:05-11:15",
        ["Block " + schedule.charAt(2)]: "11:20-12:35",
        "Lunch": "12:35-1:20",
        ["Block " + schedule.charAt(3)]: "1:25-2:40",
        "Afternoon Y Blocks": "2:45-4:00"
    }
};

const lateStart = (schedule) => {
    return {
        "Morning X Blocks": "7:00-8:10",
        "PLC/Staff Meetings": "8:20-9:05",
        "Warning Bell": "9:10",
        ["Block " + schedule.charAt(0)]: "9:20-10:25",
        ["Block " + schedule.charAt(1)]: "10:35-11:35",
        ["Block " + schedule.charAt(2)]: "11:40-12:45",
        "Lunch": "12:45-1:30",
        ["Block " + schedule.charAt(3)]: "1:35-2:40",
        "Afternoon Y Blocks": "2:45-4:00"
    }
};

const academicAssembly = (schedule) => {
    return {
        "Morning X Blocks": "7:00-8:15",
        "Warning Bell": "8:20",
        ["Block " + schedule.charAt(0)]: "8:25-9:30",
        ["Block " + schedule.charAt(1)]: "9:35-10:40",
        "Break": "10:40-10:50",
        ["Block " + schedule.charAt(2)]: "10:55-12:00",
        "Lunch": "12:00-12:40",
        "Career Ed ": "12:45-1:35",
        ["Block " + schedule.charAt(3)]: "1:35-2:40",
        "Afternoon Y Blocks": "2:45-4:00"
    }
};
const massSchedule = (schedule) => {
    return {
        "Morning X Blocks": "7:00-8:15",
        "Warning Bell": "8:20",
        ["Block " + schedule.charAt(0)]: "8:25-9:35",
        ["Block " + schedule.charAt(1)]: "9:40-10:45",
        "Break": "10:45-10:55",
        ["Block " + schedule.charAt(2) + " & Mass"]: "11:00-12:50",
        "Lunch": "12:50-1:30",
        ["Block " + schedule.charAt(3)]: "1:35-2:40",
        "Afternoon Y Block": "2:40-4:00"
    }
};


let currentScheduleIncrement = 0;

document.getElementById("schedule-prev").addEventListener("click", () => {
    paginator(-1);
})
document.getElementById("schedule-next").addEventListener("click", () => {
    paginator(1);
})

/**
 * Structures broad calendar data for schedule data only, including the block rotation and schedule type.
 * @param {object} events - event JSON
 */
function structureScheduleData(events) {
    let dayMatrix = []
    for (let i = 0; i < events.length; i++) {
        if (events[i].summary.startsWith("Day 1") || events[i].summary.startsWith("Day 2")) {
            let eventDate = new Date(events[i].start.date);
            eventDate.setDate(eventDate.getDate() + 1);
            eventDate.setHours(0);
            eventDate.setMinutes(0);

            dayMatrix.push({ date: eventDate.toDateString(), schedule: events[i].summary.slice(8), label: "Regular Schedule" });
        }
    }
    for (let i=0; i<events.length-1; i++) {
         if (events[i].summary.startsWith("Academic/ Assembly") || events[i].summary.includes("Mass Schedule") || events[i].summary.startsWith("Staff & PLC")) {
            let eventDate = new Date(events[i].start.date); 
            eventDate.setDate(eventDate.getDate() + 1);
            eventDate.setHours(0);
            eventDate.setMinutes(0);

            let object = dayMatrix.find(({ date }) => date == eventDate.toDateString())

            object.label = events[i].summary

            if (events[i].summary.startsWith("Academic/ Assembly")) {
                object.label = "Academic/Assembly";
            }  
            else if (events[i].summary.startsWith("Staff & PLC")) {
                object.label = "Late Start"
            }
            else if (events[i].summary.includes("Mass Schedule")) {
                object.label = "Mass Schedule"
            }
        
        }
    }
    return dayMatrix;
}


/**
 * Creates an array of events for the given date, then loads it.
 * @param {Date} date - date of events to look for
 */
function requestEvents(date) {
    let collectedEvents = [];
    getTextFromFile(API.url+"v2/calendar/", (response) => {
        const events = JSON.parse(response).items;

        for (i = 0; i < events.length; i++) {
            let eventDate = new Date(events[i].end.date)

            if (events[i].start.dateTime != undefined) {
                 eventDate = new Date(events[i].start.dateTime.substring(0, 10));
            }     
            eventDate.setHours(0);
            eventDate.setMinutes(0);

            if (eventDate != null && eventDate.toDateString() == date.toDateString() && !events[i].summary.startsWith("Day 1") && !events[i].summary.startsWith("Day 2")) {
                collectedEvents.push(events[i]);
            }
        }
        // If no events for the date were found, push a placeholder.
        if (!collectedEvents[0]) {
            collectedEvents.push({"summary": "No events", "htmlLink": ""});
        }
        loadEvents(collectedEvents);
    });
}

/**
 * Loads events into a table on the Schedule Tab
 * @param {array} events - array of events to be loaded in a table
 */
function loadEvents(events) {
    const table = document.getElementById("schedule-events");
    document.getElementById("schedule-events").innerHTML = "";

    for (let i = 0; i < events.length; i++) {
        table.insertAdjacentHTML("beforeend", '<tr style="width:100%"><td style="width:120px"><a target="_blank" href="'+events[i].htmlLink+'">' + events[i].summary + '</a></td>')
    }
    enableButtonInput();
}

/**
 * Changes the schedule currently displayed on screen.
 * @param {int} dateForward - number of days ahead of the current day to load a schedule from
 */
async function advanceSchedule(dateForward) {
    const response = await request("GET", API.url+"v2/calendar/");
    const override = await request("GET", API.url+"overrides/");
    const overrides = JSON.parse(override);

    const events = JSON.parse(response).items;
    let dayMatrix = structureScheduleData(events);
    const schoolDate = new Date(dayMatrix[dateForward].date);
    schoolDate.setHours(0);
    schoolDate.setMinutes(0);

    console.log(schoolDate);

    for (schedule of overrides) {
        if (!schedule.scheduleType.includes(".")) {

            let dateData = schedule.date.split("-")
            let overrideDate = new Date(parseInt(dateData[0]), parseInt(dateData[1])-1, parseInt(dateData[2]))


            for (found of dayMatrix) {
                if (found.date == overrideDate.toDateString()) {
                    found.schedule = schedule.blockRotation;
                    found.label = schedule.scheduleType;
                    found.override = schedule.schedule;
                }
            }
        }
    }

    dayMatrix[dateForward].schedule.includes("A") ? document.getElementById("schedule-day").innerHTML = "Day 1" : document.getElementById("schedule-day").innerHTML = "Day 2"

    // Populates schedule info in specific elements
    document.getElementById("schedule-rotation").innerHTML = dayMatrix[dateForward].schedule;
    document.getElementById("schedule-label").innerHTML = dayMatrix[dateForward].label;
    document.getElementById("schedule-dotw").innerHTML = days[schoolDate.getDay()];
    document.getElementById("schedule-d").innerHTML = months[schoolDate.getMonth()] + ". " + (schoolDate.getDate());

    const scheduleJSON = {
        "Regular Schedule": regularSchedule,
        "Academic/Assembly": academicAssembly,
        "Late Start": lateStart,
        "Mass Schedule": massSchedule,
    }

    if (dayMatrix[dateForward].override == undefined) {
        loadSchedule(scheduleJSON[dayMatrix[dateForward].label](dayMatrix[dateForward].schedule));
    }
    else {
        const table = document.getElementById("schedule-table");
        table.innerHTML = "";
        console.log(dayMatrix[dateForward]);

        for (row of dayMatrix[dateForward]["override"]) {
            table.insertAdjacentHTML("beforeend", '<tr><td>' + row.name + '</td><td>' + row.timeSlot + '</td></tr>')

        }
    }
    requestEvents(schoolDate);
}

/**
 * Allows the user to change the schedule page to a date up to 5 school days in the future.
 * @param {int} increment - whether to go forward or backward in viewing schedules. value of 1 or -1.
 */
function paginator(increment) {
    clearSchedulePage();
    disableButtonInput()

    if (currentScheduleIncrement > 0 && currentScheduleIncrement < 5) {
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

/**
 * Sets the current schedule increment -- the schedule currently being viewed relative to the first school day being displayed.
 * @param {int} value - schedule, should be equivalent to dateForward parameter in advanceSchedule.
 */
function setScheduleIncrement(value) {
    currentScheduleIncrement = value;
}

/**
 * Disables previous and next buttons so the user cannot spam asynchronous requests.
 */
function disableButtonInput() {
    document.getElementById("schedule-prev").setAttribute("disabled", true);
    document.getElementById("schedule-next").setAttribute("disabled", true);
}

/**
 * Enables pagination once asynchronous requests have finished loading. Keeps buttons disabled when out of a 5 school day range.
 */
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

/**
 * Clears data from the schedule page.
 */
function clearSchedulePage() {
    document.getElementById("schedule-table").innerHTML = "";
    document.getElementById("schedule-events").innerHTML = "";
    document.getElementById("schedule-day").innerHTML = "";
    document.getElementById("schedule-rotation").innerHTML = "";
    document.getElementById("schedule-label").innerHTML = "";
    document.getElementById("schedule-dotw").innerHTML = "Loading...";
    document.getElementById("schedule-d").innerHTML = "...";
}
// Advance the schedule to the current school day.
advanceSchedule(0);
