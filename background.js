chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.storage.sync.set({"theme": "light"}, ()=>{});
        chrome.storage.sync.set({"notifications": []}, ()=>{});
    }
})

OneSignal.init({
    appId: "1e71fe3f-1946-42ca-9e77-956a87cb8b3c",
    googleProjectNumber: "1036103748498"});

OneSignal.addListenerForNotificationOpened((data) => {
    console.log("Received NotificationOpened:");
    console.log(data);
});

function onNotificationReceived(json) {
    let views = chrome.extension.getViews({
        type: "popup"
    });
    
    chrome.storage.sync.get(["notifications"], (result) => {
        let currentNotification = json;
        let notificationArray = result.notifications;

        currentNotification.date = new Date().toISOString();

        notificationArray.push(json);

        chrome.storage.sync.set({"notifications": notificationArray}, ()=>{})
    });
}