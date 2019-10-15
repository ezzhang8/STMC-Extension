const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TIME_DISPLAY = document.getElementById('time');
const DATE_DISPLAY = document.getElementById('date');

function updateTime() {
    let now = new Date(),
		ampm = now.getHours() >= 12 ? "PM" : "AM",
		hour = (( now.getHours() - 1 ) % 12 ) + 1;
    let time = hour + ':' + ('0' + now.getMinutes()).slice(-2)  + ':' + ('0' + now.getSeconds()).slice(-2) + ' ' + ampm,
        date = days[now.getDay()] + ", " + months[now.getMonth()] + " " + now.getDate();

    TIME_DISPLAY.innerHTML = time;
    DATE_DISPLAY.innerHTML = date;
}

setInterval(updateTime, 1000);