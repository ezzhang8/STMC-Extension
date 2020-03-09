document.getElementById("notifications-clear").addEventListener('click', () => {
    clearNotifications();
})

function loadNotifications() {
    chrome.storage.sync.get(["notifications"], (result) => {
        const date = new Date()
       
        if (result.notifications.length > 0) {
            for (i=0; i<result.notifications.length; i++) {
                const resultDate = new Date(result.notifications[i].date)
                let displayDate;
                let altDate;

                if (date.toDateString() == resultDate.toDateString()) {
                    if (resultDate.getHours() > 12) {
                        displayDate = (resultDate.getHours()-12) + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " PM";
                    }
                    else {
                        displayDate = resultDate.getHours + ":" + ('0' + resultDate.getMinutes()).slice(-2) + "AM";
                    }
                    altDate = parseDate(result.notifications[i].date);
                }
                else {
                    displayDate = parseDate(result.notifications[i].date);

                    if (resultDate.getHours() > 12) {
                        altDate = (resultDate.getHours()-12) + ":" + ('0' + resultDate.getMinutes()).slice(-2) + " PM";
                    }
                    else {
                        altDate = resultDate.getHours + ":" + ('0' + resultDate.getMinutes()).slice(-2) + "AM";
                    }
                }
                document.getElementById("notification-body").insertAdjacentHTML('afterbegin', '<div class="uk-card uk-card-default uk-width-1-2@m" style="background-color:var(--default); border-radius: 8px; margin-bottom: 10px"><div class="uk-card-header" style="padding:5px;border:none;"><div class="uk-grid-small uk-flex-middle" uk-grid> <div class="uk-width-auto"><img class="uk-border-circle" width="25" height="25" src="res/imgs/icons/icon_128.png"> </div><div class="uk-width-expand" style="padding-left:2px; margin:0"><h5 class="small-header uk-margin-remove-bottom left lighter"> <b>'+result.notifications[i].title+'</b></h5> <p class="uk-text-meta uk-margin-remove-top right" style="padding-right:5px" title="'+altDate+'">'+displayDate+'</p></div> </div></div><div class="uk-card-body" style="padding: 0px 15px 10px 15px; border:none;"><p style="color: var(--default-inv)">'+result.notifications[i].message+'</p>   </div></div>')
            }
        }
        else {
            document.getElementById("notification-body").innerHTML = '<div style="text-align:center"> <br><h6 class="lighter small-header">No notifications</h6></div>';
        }
    });
}


function clearNotifications() {
    document.getElementById("notification-body").innerHTML = '<div style="text-align:center"> <br><h6 class="lighter small-header">No notifications</h6></div>';
    chrome.storage.sync.set({"notifications": []}, ()=>{})
}

loadNotifications();