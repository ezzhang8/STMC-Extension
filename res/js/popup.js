const sidebarButtons = document.getElementsByClassName("sidebar");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


document.getElementById("more-toggle").addEventListener("click", () => {
    toggleDarkMode();
})

for (let i = 0; i < sidebarButtons.length; i++) {
    sidebarButtons[i].addEventListener("click", function () {
        changeTab(i);
    })
}

function changeTab(index) {
    for (i = 0; i < sidebarButtons.length; i++) {
        document.getElementById("tab-" + i).classList.add("hidden");
        sidebarButtons[i].classList.remove("selected");
    }

    document.getElementById("tab-" + index).classList.remove("hidden");
    sidebarButtons[index].classList.add("selected");
}

// Open an XMLXttpRequest to Philip's calendar retriever.
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

function loadSchedule(schedule) {
    const table = document.getElementById("schedule-table");

    table.innerHTML = "";

    for (let i = 0; i < Object.keys(schedule).length; i++) {
        table.insertAdjacentHTML("beforeend", '<tr><td>' + Object.keys(schedule)[i] + '</td><td>' + Object.values(schedule)[i] + '</td></tr>')
    }

}

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

function initializeTheme() {
    chrome.storage.sync.get(["theme"], (result) => {
        document.documentElement.setAttribute("data-theme", result.theme);
    });
}

initializeTheme();

