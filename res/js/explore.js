const toggleButton = document.getElementById("expand-schedule")
const exploreCards = document.getElementsByClassName("explore-card");

// Adds event listeners for button clicks, as inline click actions are not allowed in chrome extensions.
toggleButton.addEventListener("click", function () {
    toggleScheduleCards();
})

for (let i = 0; i < exploreCards.length; i++) {
    exploreCards[i].addEventListener("click", function () {
        showScheduleWindow(i);
    })
}

/**
 * Handles loading the schedule data on the explore page.
 */
function handleEvents() {
    chrome.storage.local.get(["eventArray", "event-date"], (result) => {
        const eventDate = new Date(result["event-date"]);
        const eventArray = result.eventArray;
        const currentDate = new Date();

        // Checks if a cache exists, and if it was made on the current calendar day.
        if (eventDate != undefined && eventDate.toDateString() == currentDate.toDateString() && eventArray != undefined) {
            for (let i = 0; i < 6; i++) {
                // Populate schedule cards with cached data
                const cell = document.getElementById("explore-" + i);
                const date = new Date(eventArray[i].date);

                cell.getElementsByClassName("left")[0].innerHTML = days[date.getDay()];
                cell.getElementsByClassName("right")[0].innerHTML = months[date.getMonth()] + ". " + date.getDate();
                cell.getElementsByClassName("small-header")[0].innerHTML = eventArray[i].schedule;
                cell.getElementsByClassName("footer")[0].innerHTML = eventArray[i].label;
            }
        }
        else {
            // Fetch a new schedule if the cache is out of date or does not exist.
            newSchedule();
        }
    });
}
/**
 * Loads a new schedule from calendar data.
 */
function newSchedule() {
    getTextFromFile(API.url+"schedules/", (response) => {
        const events = JSON.parse(response);
        const date = new Date().toString();

        // Cache the structured schedule data, and the date of retrieval.
        chrome.storage.local.set({"eventArray": events}, () => {});
        chrome.storage.local.set({"event-date": date}, () => {});

        // Populates schedule cards
        for (let i = 0; i < 6; i++) {
            const cell = document.getElementById("explore-" + i);
            const date = new Date(events[i].date);

            cell.getElementsByClassName("left")[0].innerHTML = days[date.getDay()+1];
            cell.getElementsByClassName("right")[0].innerHTML = months[date.getMonth()] + ". " + (date.getDate()+1);
            cell.getElementsByClassName("small-header")[0].innerHTML = events[i].blockRotation;

            if (events[i].scheduleType != null) {
                cell.getElementsByClassName("footer")[0].innerHTML = events[i].scheduleType + " " + "("+events[i].houseGroup+")";
            }
            else {
                cell.getElementsByClassName("footer")[0].innerHTML = "";
            }
        }
    });
}

/**
 * Shows the schedule tab and displays a particular day's schedule, relative to the current day.
 * @param {int} dateAhead - number of school days ahead the schedule tab should display. 
 */
function showScheduleWindow(dateAhead) {
    // 
    document.getElementById("tab-0").classList.add("hidden");
    document.getElementById("tab-1").classList.remove("hidden");

    // Visually changes the current tab on the sidebar
    sidebarButtons[0].classList.remove("selected");
    sidebarButtons[1].classList.add("selected");

    // Functions available in schedule.js
    clearSchedulePage();
    advanceSchedule(dateAhead);
    setScheduleIncrement(dateAhead);
}
/**
 * Toggles the display of an extra 3 schedule cards on the explore page.
 */
function toggleScheduleCards() {
    if (toggleButton.getAttribute("title") == "Expand") {
        toggleButton.setAttribute("title", "Hide");
        toggleButton.innerHTML = '<span uk-icon="icon: fa-chevron-up"></span>';

        document.getElementById("expanded-schedule-cards").classList.remove("hidden");
    }
    else if (toggleButton.getAttribute("title") == "Hide") {
        toggleButton.setAttribute("title", "Expand");
        toggleButton.innerHTML = '<span uk-icon="icon: fa-chevron-down"></span>';

        document.getElementById("expanded-schedule-cards").classList.add("hidden");
    }
}


function sortHousesByPoints(a, b) {
    if ( a.points < b.points ){
      return 1;
    }
    if ( a.points > b.points ){
      return -1;
    }
    return 0;
}

function loadHouses() {
    getTextFromFile(API.url+"houses/", (response) => {
        let housePoints = JSON.parse(response);
        housePoints.sort(sortHousesByPoints);

        const houseTable = document.getElementById("house-table")
        for (i=0; i<housePoints.length; i++) {  
            houseTable.insertAdjacentHTML('beforeend', '<tr><td style="width: 20%; text-align: center"><img class="crest left" src="res/imgs/house/'+housePoints[i].houseName.toLowerCase()+'.png"><div class="other-bg score-div" style="width: 100%;"><h5 class="house-title small-header white left"><a class="white" id="house-'+housePoints[i].houseId+'">'+housePoints[i].houseName+'</a></h5><span class="score-span right white">'+housePoints[i].points+' pts.</span></div></td></tr>')
           
            document.getElementById("house-"+housePoints[i].houseId).addEventListener('click', (event)=> {
                showHouseTab(parseInt(event.srcElement.id.substr(-1)));
            });
        }
    })
}

function showHouseTab(houseId) {
    const houseTab = document.getElementById("house-tab");
    const exploreTab = document.getElementById("tab-0");

    exploreTab.classList.add("hidden");
    houseTab.classList.remove("hidden");

    document.getElementById("house-tab-name").innerHTML = houses[houseId-1];
    document.getElementById("house-tab-img").src = "res/imgs/house/"+houses[houseId-1].toLowerCase()+".png";

    getTextFromFile(API.url+"houses/"+houseId, (response)=> {
        let json = JSON.parse(response)[0];
        document.getElementById("house-tab-point-label").innerHTML = json.points + " pts.";
    })

    getTextFromFile(API.url+"points/"+houseId, (response)=> {
        let json = JSON.parse(response);
        document.getElementById("points-table").innerHTML = "";

        if (json.length == 0) {
            document.getElementById("points-table").insertAdjacentHTML("beforeend", '<tr><td>No points to display</td></tr>');
        }
        else {
            for (i=0; i<json.length; i++) {
                document.getElementById("points-table").insertAdjacentHTML("beforeend", '<tr><td style="width: 25%">'+json[i].date.substr(0,10)+'</td><td>'+json[i].action+'</td><td style="width: 20%">+'+json[i].points+' pts.</tr>');
            }
        }
        
    })
}

function showBulletin(bulletinId) {
    const bulletinTab = document.getElementById("bulletin-tab");
    const exploreTab = document.getElementById("tab-0");

    exploreTab.classList.add("hidden");
    bulletinTab.classList.remove("hidden");

    getTextFromFile(API.url+"bulletin/", (response) => {
        let bulletin = JSON.parse(response);

        for (i=0; i<bulletin.length; i++) {
            if (bulletin[i].bulletinId == bulletinId) {
                document.getElementById("bulletin-tab-name").innerHTML = bulletin[i].name;
                document.getElementById("bulletin-tab-img").src = bulletin[i].imageLink;
                document.getElementById("bulletin-tab-text").innerHTML = bulletin[i].description;

                if (bulletin[i].webLink != null) {
                    bulletinTab.insertAdjacentHTML('beforeend', '<button title="View School Calendar" id="calendar-button" class="primary float"><a style="color:white !important;" target="_blank" href="'+bulletin[i].webLink+'"><span uk-icon="icon: fa-paper-plane"></span></a></button>')
                } 
            }
        }
        
    });
}

function loadBulletin() {
    getTextFromFile(API.url+"bulletin/", (response)=> {
        let json = JSON.parse(response);

        for (i=0; i<json.length; i++) {
            document.getElementById("bulletin-container").insertAdjacentHTML('beforeend', ' <div style="width: 170px; text-align:center" class="card left vert-center"><a id="bulletin-'+json[i].bulletinId+'"><h5 class="small-header" style="padding-top:8px; text-align:center">'+json[i].name+'</h5><h6 class="small-text footer" style="text-align:center; font-size: 12px;">'+json[i].dateAdded+'</h6></a></div>')

            document.getElementById("bulletin-"+json[i].bulletinId).addEventListener('click', (event)=> {
                showBulletin(parseInt(event.path[1].id.substr(-1)));
            });
        }
    });
}


loadHouses();
loadBulletin();
newSchedule();