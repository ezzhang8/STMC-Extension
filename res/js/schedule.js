/*
    Declares all 4 schedule variants.
*/
const jrRegularSchedule = {
    "Morning X Blocks": "7:00-8:15",
    "Warning Bell": "8:20",
    "1st Block": "8:25-9:45",
    "Jr. School Break": "9:45-9:55",
    "2nd Block": "10:00-11:15",
    "Jr. School Lunch": "11:15-11:50",
    "3rd Block": "11:55-1:10",
    "4th Block": "1:15-2:30",
    "Afternoon Y Blocks": "2:35-3:50"
}
const srRegularSchedule = {
    "Morning X Blocks": "7:00-8:15",
    "Warning Bell": "8:20",
    "1st Block": "8:25-9:45",
    "2nd Block": "9:50-11:05",
    "Sr. School Break": "11:05-11:15",
    "3rd Block": "11:20-12:35",
    "Sr. School Lunch": "12:35-1:10",
    "4th Block": "1:15-2:30",
    "Afternoon Y Blocks": "2:35-3:50"
};

const jrCareerEd = {
    "Morning X Blocks": "7:00-8:15",
    "Warning Bell": "8:20",
    "1st Block": "8:25-9:30",
    "Jr. School Break": "9:30-9:35",
    "2nd Block": "9:40-10:45",
    "Jr. School Lunch": "10:45-11:20",
    "3rd Block": "11:25-12:30",
    "CE 8/9": "12:35-1:25",
    "4th Block": "1:25-2:30",
    "Afternoon Y Blocks": "2:35-3:50"
};

const srCareerEd = {
    "Morning X Blocks": "7:00-8:15",
    "Warning Bell": "8:20",
    "1st Block": "8:25-9:30",
    "2nd Block": "9:35-10:40",
    "Sr. School Break": "10:40-10:45",
    "3rd Block": "10:50-11:55",
    "Sr. School Lunch": "11:55-12:30",
    "CE 8/9": "12:35-1:25",
    "4th Block": "1:25-2:30",
    "Afternoon Y Blocks": "2:35-3:50"
};

const jrMassSchedule = {
    "Morning X Blocks": "7:00-8:15",
    "Warning Bell": "8:20",
    "1st Block": "8:25-9:35",
    "Jr. School Break": "9:35-9:45",
    "2nd Block": "9:50-10:55",
    "Jr. School Lunch": "10:55-11:30",
    "3rd Block": "11:35-12:40",
    "4th Block & Mass": "12:45-2:30",
    "Afternoon Y Blocks": "2:35-3:50"
}


const srMassSchedule = {
    "Morning X Blocks": "7:00-8:15",
    "Warning Bell": "8:20",
    "1st Block": "8:25-9:35",
    "2nd Block": "9:40-10:45",
    "Sr. School Break": "10:45-10:55",
    "3rd Block": "11:00-12:05",
    "Sr. School Lunch": "12:05-12:40",
    "4th Block & Mass": "12:45-2:30",
    "Afternoon Y Blocks": "2:35-3:50"
}

const jrCompassSchedule = {
    "Morning X Blocks": "7:00-8:15",
    "PLC/Staff Meetings": "8:20-9:05",
    "Warning Bell": "9:10",
    "1st Block": "9:15-10:10",
    "2nd Block": "10:15-11:10",
    "Jr. School Lunch": "11:10-11:45",
    "3rd Block": "11:50-12:45",
    "4th Block": "12:50-1:45",
    "Compass Time": "1:50-2:30",
    "Afternoon Y Blocks": "2:35-3:50"
}

const srCompassSchedule = {
    "Morning X Blocks": "7:00-8:15",
    "PLC/Staff Meetings": "8:20-9:05",
    "Warning Bell": "9:10",
    "1st Block": "9:15-10:10",
    "2nd Block": "10:15-11:10",
    "3rd Block": "11:15-12:10",
    "Sr. School Lunch": "12:10-12:45",
    "4th Block": "12:50-1:45",
    "Compass Time": "1:50-2:30",
    "Afternoon Y Blocks": "2:35-3:50"
}

let currentScheduleIncrement = 0;

document.getElementById("schedule-prev").addEventListener("click", function() {
    paginator(-1);
})
document.getElementById("schedule-next").addEventListener("click", function() {
    paginator(1);
})

document.getElementById("setting-schedule").addEventListener("click", function() {
    changeScheduleMode();
})

/**
 * Structures broad calendar data for schedule data only, including the block rotation and schedule type.
 * @param {object} events - event JSON
 */
function structureScheduleData(events) {
    let dayMatrix = [];
    for (let i = 0; i < events.length; i++) {
        if (events[i].summary.startsWith("MORE - ") || events[i].summary.startsWith("RICE - ")) {
            let eventDate = new Date(events[i].start.date);
            eventDate.setDate(eventDate.getDate() + 1);
            eventDate.setHours(0);
            eventDate.setMinutes(0);

            const scheduleComponents = events[i].summary.split(" - ");
            let label;

            if (scheduleComponents[2] != undefined) {
                label = scheduleComponents[2];
            }
            else {
                label = "Regular Schedule";
            }

            label += " ("+scheduleComponents[0]+")";


            dayMatrix.push({ date: eventDate.toDateString(), dateString: events[i].start.date, schedule: scheduleComponents[1], label: label });
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
    getTextFromFile(API.url+"calendar/", (response) => {
        const events = JSON.parse(response).items;

        for (i = 0; i < events.length; i++) {
            let eventDate = new Date(events[i].start.date)

            if (events[i].start.dateTime != undefined) {
                 eventDate = new Date(events[i].start.dateTime.substring(0, 10));
            }     
            eventDate.setDate(eventDate.getDate() + 1);
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
function advanceSchedule(dateForward) {
    getTextFromFile(API.url+"calendar/", (response) => {
        const events = JSON.parse(response).items;
        let dayMatrix = structureScheduleData(events);
        const schoolDate = new Date(dayMatrix[dateForward].date);

        dayMatrix[dateForward].schedule.includes("A") ? document.getElementById("schedule-day").innerHTML = "Day 1" : document.getElementById("schedule-day").innerHTML = "Day 2"

        // Populates schedule info in specific elements
        document.getElementById("schedule-rotation").innerHTML = dayMatrix[dateForward].schedule;
        document.getElementById("schedule-label").innerHTML = dayMatrix[dateForward].label;
        document.getElementById("schedule-dotw").innerHTML = days[schoolDate.getDay()];
        document.getElementById("schedule-d").innerHTML = months[schoolDate.getMonth()] + ". " + (schoolDate.getDate());

        const scheduleJSON = {
            "Regular Schedule-SR": srRegularSchedule,
            "Regular Schedule-JR": jrRegularSchedule,
            "Career Education Schedule-SR": srCareerEd,
            "Career Education Schedule-JR": jrCareerEd,
            "Mass Schedule-SR": srMassSchedule,
            "Mass Schedule-JR": jrMassSchedule,
            "PLC/ Staff Meetings/ Compass Schedule-SR": srCompassSchedule,
            "PLC/ Staff Meetings/ Compass Schedule-JR": jrCompassSchedule
        }

        loadSchedule(scheduleJSON[dayMatrix[dateForward].label.split(" (")[0]+"-"+scheduleMode]);
        requestEvents(schoolDate);

        initScheduleButton();
    });
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


function changeScheduleMode() {
    if (scheduleMode == "JR") {
        document.getElementById("setting-schedule").innerHTML = "View Jr. Schedules";
        scheduleMode = "SR"
        advanceSchedule(currentScheduleIncrement)
    }
    else if(scheduleMode == "SR") {
        document.getElementById("setting-schedule").innerHTML = "View Sr. Schedules";
        scheduleMode = "JR"
        advanceSchedule(currentScheduleIncrement)
    }
}

function initScheduleButton() {
    if (scheduleMode == "SR") {
        document.getElementById("setting-schedule").innerHTML = "View Jr. Schedules";
    }
    else if(scheduleMode == "JR") {
        document.getElementById("setting-schedule").innerHTML = "View Sr. Schedules";
    }
}

// Advance the schedule to the current school day.
advanceSchedule(0);
