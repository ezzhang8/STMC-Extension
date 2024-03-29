const sidebarButtons = document.getElementsByClassName("sidebar");
let scheduleMode = "";
// Defines days and months that are used in other scripts.
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const houses = ["Canterbury", "Dublin", "Limerick", "London", "Oxford", "Waterford"];
// Defines API urls that are used in this extension.
const API = {
    "url": "https://app.stmc.bc.ca/api/"
}

// Changes display mode 
document.getElementById("more-toggle").addEventListener("click", () => {
    toggleDarkMode();
})

// Allows sidebar buttons to change tabs.
for (let i = 0; i < sidebarButtons.length; i++) {
    sidebarButtons[i].addEventListener("click", () => {
        changeTab(i);
    })
}

/**
 * Changes currently displayed tab
 * @param {int} index - index of tab to change to
 */
function changeTab(index) {
    let internalTabs = document.getElementsByClassName("internal-tab")

    for (i=0; i<internalTabs.length; i++) {
        internalTabs[i].classList.add("hidden");
    }

    for (i = 0; i < sidebarButtons.length; i++) {
        document.getElementById("tab-" + i).classList.add("hidden");
        sidebarButtons[i].classList.remove("selected");
    }

    
    document.getElementById("tab-" + index).classList.remove("hidden");
    sidebarButtons[index].classList.add("selected");
}

/**
 * Sends a "GET" request to an API endpoint and gives callback function the response text.
 * @param {string} url - URL of resource to get
 * @callback ondone - callback function relaying response text
 */
function getTextFromFile(url, ondone) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            ondone(request.responseText);
        }
    };
    request.send();
}

function request(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

/**
 * Loads a schedule from a JSON object on the schedule tab. Called in popup.js so that loading can complete faster.
 * @param {object} schedule - the schedule to load, with key being the event, and the value being the time.
 */
function loadSchedule(schedule) {
    const table = document.getElementById("schedule-table");

    table.innerHTML = "";

    if (schedule == undefined) {
        table.insertAdjacentHTML("beforeend", "There doesn't seem to be a schedule for this day. Click the Google Calendar link for today's schedule.")
        return;
    }

    for (let i = 0; i < Object.keys(schedule).length; i++) {
        table.insertAdjacentHTML("beforeend", '<tr><td>' + Object.keys(schedule)[i] + '</td><td>' + Object.values(schedule)[i] + '</td></tr>')
    }
}

/**
 * Changes the display appearance and saves the user's preference.
 */
function toggleDarkMode() {
    if (document.documentElement.getAttribute("data-theme") == "light") {
        document.documentElement.setAttribute("data-theme", "dark");

        chrome.storage.sync.set({"theme": "dark"}, ()=>{});
    }
    else {
        document.documentElement.setAttribute("data-theme", "light");

        chrome.storage.sync.set({"theme": "light"}, ()=>{});
    }
}
/** 
 * Initializes the theme from a user preference.
 */
function initializeTheme() {
    chrome.storage.sync.get(["theme"], (result) => {
        document.documentElement.setAttribute("data-theme", result.theme);
    });
}

// initialize current theme
initializeTheme();

