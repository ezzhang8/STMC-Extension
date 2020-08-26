
/**
 * Initializes the calendar, determining whether to load the cached calendar or populate the table with up-to-date information.
 */
function initCalendar() {
    chrome.storage.local.get(["calendar", "calendar-date"], (result)=> {
        const calendarDateString = new Date(result["calendar-date"]);
        const currentDate = new Date();
        const events = result.calendar;

        // If there is a date of last retrieval, a calendar JSON object saved, and it is of the current day, do not fetch a new calendar.
        if (calendarDateString!= undefined && calendarDateString.toDateString() == currentDate.toDateString() && events != undefined) {
            populateCalendar(events, calendarDateString)
        }
        else {
            newCalendar();
        }
    })
};
/**
 * Refreshes the calendar, getting an up-to-date JSON from the calendar endpoint.
 */
function newCalendar() {
    getTextFromFile(API.calendarURL, (response) => {
        const events = JSON.parse(response).items;
        const dateRetrieved = new Date();

        // Cache the calendar JSON and the date of last retrieval
        chrome.storage.local.set({"calendar": events}, ()=>{});
        chrome.storage.local.set({"calendar-date": dateRetrieved.toISOString()}, ()=>{});
    
        populateCalendar(events, dateRetrieved)
    });
}

/**
 * Returns a date of the format 'Mon. DD' from a date string of the format "YYYY-MM-DD"
 * @param {string} dateString - Date string of format "YYYY-MM-DD"
 * @returns {string}
 */
function parseDate(dateString) {
    const date = new Date(dateString);
    /*
        Due to STMC's location in the Pacific time zone, dates created with date strings are 7/8 hours behind, because the time of date objects is set to 00:00:00 GMT 
        by default.

        This results in the day being 1 day behind the calendar date in the Pacific time zone.

        To counter this, one day is added to the date string. This should not conflict with days at the end of a month, or events with times, since the times
        are stripped before using this function, and JavaScript Date objects automatically handles months.
    
    */
    date.setDate(date.getDate() + 1);

    if (dateString != null) {
        // constant months is inherited from popup.js
        return months[date.getMonth()]+". "+date.getDate();;
    } 
    
    return ""
}

/**
 * Takes an array of events and populates calendar table with said data.
 * @param {array} events - array of events
 * @param {string} dateString - date of retrieval for calendar
 */
function populateCalendar(events, dateString) {
    for (let i = 0; i < events.length; i++) {
        let date = events[i].start.date;

        // Events that are not all-day events do not have start.date defined, but start.dateTime instead. 
        // If such an event is found, get the first ten characters of start.dateTime to make a YYYY-MM-DD date string.
        if (events[i].start.dateTime != undefined) {
            date = events[i].start.dateTime.substring(0, 10);
        }
    
        // Adds each event row
        document.getElementById("calendar-table").insertAdjacentHTML("beforeend", '<tr><td style="width: 20%; text-align: center; padding: 5px;">'+parseDate(date)+'</td><td>'+events[i].summary+'</td></tr>');
        // Provides the date the calendar was last updated
        document.getElementById("calendar-upd").innerHTML = "Last updated: "+dateString.toString().split(" GMT")[0];
    }
    
}
// Initialize the calendar when this file loads.
initCalendar();