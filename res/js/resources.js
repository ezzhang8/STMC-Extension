const resources = {
    "School Resources": [
        {
            "name": "Moodle",
            "link": "https://moodle.stmc.bc.ca",
            "img": "res/imgs/schoolres/moodle.png"
        },
        {
            "name": "PowerSchool",
            "link": "https://ps.stmc.bc.ca",
            "img": "res/imgs/schoolres/PowerSchool.png"
        },
        {
            "name": "STMC Library Catalog (Follett Destiny)",
            "link": "https://stmc.follettdestiny.ca/",
            "img": "res/imgs/schoolres/follett.png"
        },
        {
            "name": "Student Life/STMC Student Council",
            "link": "https://sites.google.com/stmc.bc.ca/studentlife",
            "img": "res/imgs/icons/icon_128.png"
        },
        {
            "name": "Print Console (school network only)",
            "link": "http://192.168.0.239:9191/",
            "img": "res/imgs/schoolres/PaperCutIMG2.png"
        }
    ],
    "Research Resources": [
        {
            "name": "STMC Learning Commons Website",
            "link": "https://sites.google.com/stmc.bc.ca/learningcommons",
            "img": "res/imgs/schoolres/library.png"
        },
        {
            "name": "Research Databases (Learning Commons)",
            "link": "https://sites.google.com/stmc.bc.ca/learningcommons/research/research-databases",
            "img": "res/imgs/schoolres/research_resources.png"
        },
        {
            "name": "NoodleTools",
            "link": "https://my.noodletools.com/logon/signin",
            "img": "res/imgs/schoolres/NoodleTools.png"
        }
    ],
    "Google G Suite": [
        {
            "name": "Gmail",
            "link": "https://mail.google.com",
            "img": "res/imgs/schoolres/ggl/mail.png"
        },
        {
            "name": "Google Calendar",
            "link": "https://calendar.google.com",
            "img": "res/imgs/schoolres/ggl/calendar.png"
        },
        {
            "name": "Google Drive",
            "link": "https://drive.google.com",
            "img": "res/imgs/schoolres/ggl/drive.png"
        },
        {
            "name": "Google Classroom",
            "link": "https://classroom.google.com",
            "img": "res/imgs/schoolres/ggl/classroom.png"
        },
        {
            "name": "Google Keep",
            "link": "https://keep.google.com",
            "img": "res/imgs/schoolres/ggl/keep.png"
        },
        {
            "name": "Google Docs",
            "link": "https://docs.google.com",
            "img": "res/imgs/schoolres/ggl/docs.png"
        },
        {
            "name": "Google Slides",
            "link": "https://slides.google.com",
            "img": "res/imgs/schoolres/ggl/slides.png"
        },
        {
            "name": "Google Sheets",
            "link": "https://sheets.google.com",
            "img": "res/imgs/schoolres/ggl/sheets.png"
        },
        {
            "name": "Google Drawings",
            "link": "https://drawings.google.com",
            "img": "res/imgs/schoolres/ggl/drawings.png"
        },
        {
            "name": "Google Sites",
            "link": "https://sites.google.com",
            "img": "res/imgs/schoolres/ggl/sites.png"
        }
    ],
    "Other Resources": [
        {
            "name": "myBlueprint",
            "link": "https://app.myblueprint.ca/",
            "img": "res/imgs/schoolres/myBlueprint.png"
        }
    ]
}

function loadResources() {
    const container = document.getElementById("resources-container");
    for (const section in resources) {
        container.insertAdjacentHTML('beforeend', '<h6 class="small-header">'+section+"</h6>");
       // container.insertAdjacentHTML('beforeend', '<div class="uk-grid-column-collapse uk-child-width-1-5 uk-text-center" uk-grid>')

        let grid = document.createElement('div');
        grid.classList.add("uk-grid-column-collapse", "uk-child-width-1-5", "uk-text-center");
        grid.setAttribute("uk-grid", "");

        for (const resource in resources[section]) {
            console.log(resource);
            grid.insertAdjacentHTML('beforeend', '<div><div class="card card-resource" title="'+resources[section][resource]["name"]+'"><a target="_blank" href="'+resources[section][resource]["link"]+'"><div class="uk-cover-container"><canvas width="50px" height="50px"></canvas><img class="resource" src="'+resources[section][resource]["img"]+'" alt="" uk-cover></div></a></div></div>');
        }
        
        container.insertAdjacentElement('beforeend', grid);
    }
}

loadResources();