function parseDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    //console.log(date);
    //console.log(dateString)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (dateString == null) {
        return "";
    } 
    else {
        return months[date.getMonth()]+". "+date.getDate();
    }
}

function newCalendar() {
    getTextFromFile("http://m-gapdev.stthomasmorecollegiate.ca/temp/tv/calendar.php", function done(response) {
        const events = JSON.parse(response).items;
        const dateRetrieved = new Date();

        chrome.storage.local.set({"calendar": events}, ()=>{});
        chrome.storage.local.set({"calendar-date": dateRetrieved.toISOString()}, ()=>{});
    
        for (let i = 0; i < events.length; i++) {
            let date = events[i].start.date;

            if (events[i].start.dateTime != undefined) {
               date = events[i].start.dateTime.substring(0, 10);
            }

            document.getElementById("calendar-table").insertAdjacentHTML("beforeend", '<tr><td style="text-align: center; padding: 5px;">'+parseDate(date)+'</td><td>'+events[i].summary+'</td></tr>');
            document.getElementById("calendar-upd").innerHTML = "Last updated: "+dateRetrieved.toString().split(" GMT")[0];
        } 
    });
}

function initCalendar() {
    chrome.storage.local.get(["calendar", "calendar-date"], (result)=> {
        const calendarDateString = new Date(result["calendar-date"]);
        const currentDate = new Date();
        const events = result.calendar;
        if (calendarDateString!= undefined && calendarDateString.toDateString() == currentDate.toDateString() && events != undefined) {
            for (let i = 0; i < events.length; i++) {
                let date = events[i].start.date;

                if (events[i].start.dateTime != undefined) {
                date = events[i].start.dateTime.substring(0, 10);
                }
                document.getElementById("calendar-table").insertAdjacentHTML("beforeend", '<tr><td style="text-align: center; padding: 5px;">'+parseDate(date)+'</td><td>'+events[i].summary+'</td></tr>');
                document.getElementById("calendar-upd").innerHTML = "Last updated: "+calendarDateString.toString().split(" GMT")[0];
            } 
        }
        else {
            newCalendar();
        }
    })
};

initCalendar();
//newCalendar();
