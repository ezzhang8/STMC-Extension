const toggleButton = document.getElementById("expand-schedule")
const exploreCards = document.getElementsByClassName("explore-card");


toggleButton.addEventListener("click", function () {
    toggleScheduleCards();
})

for (let i = 0; i < exploreCards.length; i++) {
    exploreCards[i].addEventListener("click", function () {
        showScheduleWindow(i);

    })
}

function toggleScheduleCards() {
    if (toggleButton.getAttribute("title") == "Expand") {
        toggleButton.setAttribute("title", "Hide");
        toggleButton.innerHTML = '<span uk-icon="icon: chevron-up"></span>';

        document.getElementById("expanded-schedule-cards").classList.remove("hidden");
    }
    else if (toggleButton.getAttribute("title") == "Hide") {
        toggleButton.setAttribute("title", "Expand");
        toggleButton.innerHTML = '<span uk-icon="icon: chevron-down"></span>';

        document.getElementById("expanded-schedule-cards").classList.add("hidden");
    }
}

function showScheduleWindow(dateAhead) {
    document.getElementById("tab-0").classList.add("hidden");
    document.getElementById("tab-1").classList.remove("hidden");

    sidebarButtons[0].classList.remove("selected");
    sidebarButtons[1].classList.add("selected");

    clearSchedulePage();
    advanceSchedule(dateAhead);
    setScheduleIncrement(dateAhead);
}

//eventArray, event-date
function handleEvents() {
    chrome.storage.local.get(["eventArray", "event-date"], (result) => {
        const eventDate = new Date(result["event-date"]);
        const eventArray = result.eventArray;
        const currentDate = new Date();

        console.log(result);

        if (eventDate != undefined && eventDate.toDateString() == currentDate.toDateString() && eventArray != undefined) {
            for (let i = 0; i < 6; i++) {
                const cell = document.getElementById("explore-" + i);
                const date = new Date(eventArray[i].date);

                cell.getElementsByClassName("left")[0].innerHTML = days[date.getDay()];
                cell.getElementsByClassName("right")[0].innerHTML = months[date.getMonth()] + ". " + date.getDate();
                cell.getElementsByClassName("small-header")[0].innerHTML = eventArray[i].schedule;
                cell.getElementsByClassName("footer")[0].innerHTML = eventArray[i].label;
            }
        }
        else {
            newSchedule();
        }
    });
}

function newSchedule() {
    getTextFromFile("http://m-gapdev.stthomasmorecollegiate.ca/temp/tv/calendar.php", function done(response) {
        const events = JSON.parse(response).items;
        let dayMatrix = structureScheduleData(events);
        const date = new Date().toString();

        chrome.storage.local.set({"eventArray": dayMatrix}, () => { });
        chrome.storage.local.set({"event-date": date}, () => { });


        for (let i = 0; i < 6; i++) {
            const cell = document.getElementById("explore-" + i);
            const date = new Date(dayMatrix[i].date);

            cell.getElementsByClassName("left")[0].innerHTML = days[date.getDay()];
            cell.getElementsByClassName("right")[0].innerHTML = months[date.getMonth()] + ". " + date.getDate();
            cell.getElementsByClassName("small-header")[0].innerHTML = dayMatrix[i].schedule;
            cell.getElementsByClassName("footer")[0].innerHTML = dayMatrix[i].label;
        }
    });
}

function newBlockScheduleArray() {
    getTextFromFile("http://m-gapdev.stthomasmorecollegiate.ca/temp/tv/calendar.php", function done(response) {
        const events = JSON.parse(response).items;
        let dayMatrix = structureScheduleData(events);

        for (let i = 0; i < 6; i++) {
            const cell = document.getElementById("explore-" + i);
            const date = new Date(dayMatrix[i].date);

            cell.getElementsByClassName("left")[0].innerHTML = days[date.getDay()];
            cell.getElementsByClassName("right")[0].innerHTML = months[date.getMonth()] + ". " + date.getDate();
            cell.getElementsByClassName("small-header")[0].innerHTML = dayMatrix[i].schedule;
            cell.getElementsByClassName("footer")[0].innerHTML = dayMatrix[i].label;
        }
    });
}

handleEvents();