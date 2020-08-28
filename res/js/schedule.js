/*
    Declares all 4 schedule variants.
*/
const regularJrSchedule = {
    "Morning X Block": "7:00-8:15",
    "1st Block": "8:25-9:45",
    "Jr. School Break": "9:45-9:55",
    "2nd Block": "10:00-11:15",
    "Lunch": "11:15-11:50",
    "3rd Block": "11:55-1:10",
    "4th Block": "1:15-2:30",
    "Afternoon Y Block": "2:45-4:00"
}
const regularSrSchedule = {
    "Morning X Block": "7:00-8:15",
    "1st Block": "8:30-9:50",
    "2nd Block": "9:55-11:10",
    "Sr. School Break": "11:10-11:20",
    "3rd Block": "11:25-12:40",
    "Lunch": "12:40-1:15",
    "4th Block": "1:20-2:35",
    "Afternoon Y Block": "2:45-4:00"
};

const jrCareerEd = {
    "Morning X Block": "7:00-8:10",
    "Staff Meeting/PLC": "8:20-9:05",
    "1st Block": "9:15-10:00",
    "2nd Block": "10:05-10:50",
    "Jr. Break": "10:50-11:05",
    "3rd Block": "11:10-11:55",
    "CLE 8/9": "12:00-12:40",
    "4th Block": "12:40-1:25",
    "COLLAB/FLEX": "1:35-2:40"
};

const srCareerEd = {
    "Morning X Block": "7:00-8:10",
    "Staff Meeting/PLC": "8:20-9:05",
    "1st Block": "9:20-10:05",
    "2nd Block": "10:10-10:55",
    "3rd Block": "11:00-11:45",
    "Sr. Break": "11:45-12:00",
    "CLE 10 & CLC 11/12": "12:05-12:45",
    "4th Block": "12:45-1:30",
    "COLLAB/FLEX": "1:30-2:40"
};

let currentScheduleIncrement = 0;

document.getElementById("schedule-prev").addEventListener("click", function() {
    paginator(-1);
})
document.getElementById("schedule-next").addEventListener("click", function() {
    paginator(1);
})

/**
 * Creates an array of events for the given date, then loads it.
 * @param {Date} date - date of events to look for
 */
function requestEvents(date) {
    let collectedEvents = [];
    getTextFromFile(API.calendarURL, (response) => {
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
                collectedEvents.push(events[i].summary);
            }
        }
        // If no events for the date were found, push a placeholder.
        if (!collectedEvents[0]) {
            collectedEvents.push("No events");
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
        table.insertAdjacentHTML("beforeend", '<tr><td>' + events[i] + '</td>')
    }
    enableButtonInput();
}

/**
 * Changes the schedule currently displayed on screen.
 * @param {int} dateForward - number of days ahead of the current day to load a schedule from
 */
function advanceSchedule(dateForward) {
    getTextFromFile(API.url+"schedules/", (response) => {
        const events = JSON.parse(response);
        const schoolDate = new Date(events[dateForward].date);
        events[dateForward].blockRotation.includes("A") ? document.getElementById("schedule-day").innerHTML = "Day 1 (" + events[dateForward].houseGroup+")" : document.getElementById("schedule-day").innerHTML = "Day 2 (" + events[dateForward].houseGroup+")"

        if (events[dateForward].blockRotation == "Orientation") {
            document.getElementById("schedule-day").innerHTML = "Orientation";
        }

        // Populates schedule info in specific elements
        document.getElementById("schedule-rotation").innerHTML = events[dateForward].blockRotation;
        document.getElementById("schedule-label").innerHTML = events[dateForward].scheduleType;
        document.getElementById("schedule-dotw").innerHTML = days[schoolDate.getDay()+1];
        document.getElementById("schedule-d").innerHTML = months[schoolDate.getMonth()] + ". " + (schoolDate.getDate()+1);

        const scheduleJSON = {
            "Regular Schedule-SR": regularSrSchedule,
            "Regular Schedule-JR": regularJrSchedule,
            "CLE/CLC-SR": srCareerEd,
            "CLE/CLC-JR": jrCareerEd
        }

        console.log(scheduleMode);
        loadSchedule(scheduleJSON[events[dateForward].scheduleType+"-"+scheduleMode]);
        schoolDate.setDate(schoolDate.getDate()+1);
        requestEvents(schoolDate);
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

// Advance the schedule to the current school day.
advanceSchedule(0);