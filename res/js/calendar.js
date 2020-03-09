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


getTextFromFile("http://m-gapdev.stthomasmorecollegiate.ca/temp/tv/calendar.php", function done(response) {
    const events = JSON.parse(response).items;

    for (let i = 0; i < events.length; i++) {
        document.getElementById("calendar-table").insertAdjacentHTML("beforeend", '<tr><td style="text-align: center; padding: 5px;">'+parseDate(events[i].start.date)+'</td><td>'+events[i].summary+'</td></tr>');

    } 
});