// Clear notifications immediately when the button is pressed.
document.getElementById("notifications-clear").addEventListener('click', () => {
    clearNotifications();
})

/**
 * Loads cached notifications that have been received by the computer. Serves as a backup in case the notification center does not save the notifications.
 */
function loadNotifications() {
    // Loads previously saved notifications from chrome storage
    chrome.storage.sync.get(["notifications"], (result) => {
        const date = new Date()
        
        // If there are cached notifications...
        if (result.notifications.length > 0) {
            for (i=0; i<result.notifications.length; i++) {
                const resultDate = new Date(result.notifications[i].date)
                let displayDate;
                let altDate;
                let link = "";

                // If the notification was received today, show the time by default and hide the date received. 
                // Otherwise, hide the time and show the date recieved.
                if (date.toDateString() == resultDate.toDateString()) {
                    altDate = 'Date received by this computer: '+ parseDate(result.notifications[i].date);

                    // Ternary operator: Changes time to 12 hour time based on if the hour component is greater than 12
                    (resultDate.getHours() > 12) ? displayDate = (resultDate.getHours()-12) + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " PM": displayDate = resultDate.getHours() + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " AM"
                }
                else {
                    // parseDate function located in calendar.js
                    displayDate = parseDate(result.notifications[i].date);
                    
                    // Ternary operator: Changes time to 12 hour time based on if the hour component is greater than 12
                    (resultDate.getHours() > 12) ? altDate = 'Time received by this computer: '+(resultDate.getHours()-12) + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " PM": altDate = 'Time received by this computer: '+resultDate.getHours() + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " AM"
                }

                // Displays notifications. If a link was in the original notification, a modified version is displayed with a link in the title.
                if (result.notifications[i].url != undefined) {
                    link = result.notifications[i].url;

                    document.getElementById("notification-body").insertAdjacentHTML('afterbegin', '<div class="uk-card uk-card-default uk-width-1-2@m" style="background-color:var(--default); border-radius: 8px; margin-bottom: 10px"><div class="uk-card-header" style="padding:5px;border:none;"><div class="uk-grid-small uk-flex-middle" uk-grid> <div class="uk-width-auto"><img class="uk-border-circle" width="25" height="25" src="res/imgs/icons/icon_128.png"> </div><div class="uk-width-expand" style="padding-left:2px; margin:0"><h5 class="small-header uk-margin-remove-bottom left lighter"> <b><a target = "_blank" href="'+link+'">'+result.notifications[i].title+'</a></b></h5> <p class="uk-text-meta uk-margin-remove-top right" style="padding-right:5px" title="'+altDate+'">'+displayDate+'</p></div> </div></div><div class="uk-card-body" style="padding: 0px 15px 10px 15px; border:none;"><p style="color: var(--default-inv)">'+result.notifications[i].message+'</p></div></div>')
                    
                }
                else {
                    document.getElementById("notification-body").insertAdjacentHTML('afterbegin', '<div class="uk-card uk-card-default uk-width-1-2@m" style="background-color:var(--default); border-radius: 8px; margin-bottom: 10px"><div class="uk-card-header" style="padding:5px;border:none;"><div class="uk-grid-small uk-flex-middle" uk-grid> <div class="uk-width-auto"><img class="uk-border-circle" width="25" height="25" src="res/imgs/icons/icon_128.png"> </div><div class="uk-width-expand" style="padding-left:2px; margin:0"><h5 class="small-header uk-margin-remove-bottom left lighter"> <b>'+result.notifications[i].title+'</b></h5> <p class="uk-text-meta uk-margin-remove-top right" style="padding-right:5px" title="'+altDate+'">'+displayDate+'</p></div> </div></div><div class="uk-card-body" style="padding: 0px 15px 10px 15px; border:none;"><p style="color: var(--default-inv)">'+result.notifications[i].message+'</p></div></div>')
                }
            }
        }
        else {
            // Show a notice saying "No notifications" if there are no notifications
            document.getElementById("notification-body").innerHTML = '<div style="text-align:center"> <br><h6 class="lighter small-header">No notifications</h6></div>';
        }
    });
}

/**
 * Clears cached notifications and returns to a placeholder screen.
 */
function clearNotifications() {
    if (confirm("Are you sure you want to delete all cached notifications? This action cannot be undone.")) {
        document.getElementById("notification-body").innerHTML = '<div style="text-align:center"> <br><h6 class="lighter small-header">No notifications</h6></div>';
        chrome.storage.sync.set({"notifications": []}, ()=>{})
    }
}

loadNotifications();