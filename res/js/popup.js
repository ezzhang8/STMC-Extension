const sidebarButtons = document.getElementsByClassName("sidebar");

for (let i=0; i<sidebarButtons.length; i++) {
    sidebarButtons[i].addEventListener("click", function () {
        changeTab(i);
    })
}

function changeTab(index) {
    for (i=0; i<sidebarButtons.length; i++) {
        document.getElementById("tab-"+i).classList.add("hidden");
        sidebarButtons[i].classList.remove("selected");
    }

    document.getElementById("tab-"+index).classList.remove("hidden");
    sidebarButtons[index].classList.add("selected");
}