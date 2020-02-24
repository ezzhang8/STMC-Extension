const toggleButton = document.getElementById("expand-schedule")

toggleButton.addEventListener("click", function() {
    toggleScheduleCards();
})

function toggleScheduleCards() {
    if (toggleButton.getAttribute("title")=="Expand") {
        toggleButton.setAttribute("title", "Hide");
        toggleButton.innerHTML = '<span uk-icon="icon: chevron-up"></span>';

        document.getElementById("expanded-schedule-cards").classList.remove("hidden");
    }
    else if(toggleButton.getAttribute("title")=="Hide") {
        toggleButton.setAttribute("title", "Expand");
        toggleButton.innerHTML = '<span uk-icon="icon: chevron-down"></span>';

        document.getElementById("expanded-schedule-cards").classList.add("hidden");
    }
}