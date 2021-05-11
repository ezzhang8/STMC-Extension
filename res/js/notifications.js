function loadNotifications() {
    getTextFromFile(API.url+"notifications/", (response) => {
        const notifications = JSON.parse(response).notifications.reverse();
        const date = new Date();
        for (i=0; i<notifications.length; i++) {
            let resultDate = new Date(parseFloat(notifications[i].completed_at*1000));
            let displayDate;
            let altDate;
            let link = "";
            // If the notification was received today, show the time by default and hide the date received. 
            // Otherwise, hide the time and show the date recieved.
            if (date.getDate() == resultDate.getDate() && date.getMonth() == resultDate.getMonth()) {
                altDate = 'Date sent: '+ parseDate(resultDate);

                // Ternary operator: Changes time to 12 hour time based on if the hour component is greater than 12
                (resultDate.getHours() > 12) ? displayDate = (resultDate.getHours()-12) + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " PM": displayDate = resultDate.getHours() + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " AM"
            }
            else {
                // parseDate function located in calendar.js
                displayDate = parseDate(resultDate);
                
                // Ternary operator: Changes time to 12 hour time based on if the hour component is greater than 12
                (resultDate.getHours() > 12) ? altDate = 'Time sent: '+(resultDate.getHours()-12) + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " PM": altDate = 'Time received by this computer: '+resultDate.getHours() + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " AM"
            }

            // Displays notifications. If a link was in the original notification, a modified version is displayed with a link in the title.
            if (notifications[i].url != "") {
                link = notifications[i].url;

                document.getElementById("notification-body").insertAdjacentHTML('afterbegin', '<div class="uk-card uk-card-default uk-width-1-2@m" style="background-color:var(--default); border-radius: 8px; margin-bottom: 10px"><div class="uk-card-header" style="padding:5px;border:none;"><div class="uk-grid-small uk-flex-middle" uk-grid> <div class="uk-width-auto"><img class="uk-border-circle" width="25" height="25" src="res/imgs/icons/icon_128.png"> </div><div class="uk-width-expand" style="padding-left:2px; margin:0"><h5 class="small-header uk-margin-remove-bottom left lighter"> <b><a target = "_blank" href="'+link+'">'+notifications[i].headings.en+'</a></b></h5> <p class="uk-text-meta uk-margin-remove-top right" style="padding-right:5px" title="'+altDate+'">'+displayDate+'</p></div> </div></div><div class="uk-card-body" style="padding: 0px 15px 10px 15px; border:none;"><p style="color: var(--default-inv)">'+notifications[i].contents.en+'</p></div></div>')
                
            }
            else {
                document.getElementById("notification-body").insertAdjacentHTML('afterbegin', '<div class="uk-card uk-card-default uk-width-1-2@m" style="background-color:var(--default); border-radius: 8px; margin-bottom: 10px"><div class="uk-card-header" style="padding:5px;border:none;"><div class="uk-grid-small uk-flex-middle" uk-grid> <div class="uk-width-auto"><img class="uk-border-circle" width="25" height="25" src="res/imgs/icons/icon_128.png"> </div><div class="uk-width-expand" style="padding-left:2px; margin:0"><h5 class="small-header uk-margin-remove-bottom left lighter"> <b>'+notifications[i].headings.en+'</b></h5> <p class="uk-text-meta uk-margin-remove-top right" style="padding-right:5px" title="'+altDate+'">'+displayDate+'</p></div> </div></div><div class="uk-card-body" style="padding: 0px 15px 10px 15px; border:none;"><p style="color: var(--default-inv)">'+notifications[i].contents.en+'</p></div></div>')
            }
        }
    })
}

loadNotifications();