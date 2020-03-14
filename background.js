chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.storage.sync.set({"theme": "light"}, ()=>{});
        chrome.storage.sync.set({"notifications": []}, ()=>{});
    }
})

OneSignal.init({
    appId: "1e71fe3f-1946-42ca-9e77-956a87cb8b3c",
    googleProjectNumber: "1036103748498"
});

function onNotificationReceived(json, url) {
    console.log(json);
    console.log(url);
    chrome.storage.sync.get(["notifications"], (result) => {
        let currentNotification = json;
        let notificationArray = result.notifications;

        currentNotification.date = new Date().toISOString();
        currentNotification.url = url;

        notificationArray.push(json);

        chrome.storage.sync.set({"notifications": notificationArray}, ()=>{});
    });
}