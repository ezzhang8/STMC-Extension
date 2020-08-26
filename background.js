// When chrome extension is installed, clear previous notifications, and set the default theme to light. 
// This is mostly used in development to prevent previous saved data clogging up a new version.
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.storage.sync.set({"theme": "light"}, ()=>{});
        chrome.storage.sync.set({"notifications": []}, ()=>{});
    }
})

// Initialize OneSignal project and notifications.
OneSignal.init({
    appId: "1e71fe3f-1946-42ca-9e77-956a87cb8b3c",
    googleProjectNumber: "1036103748498"
});

/**
 * When a push notification is received, log the notification in chrome storage for future retrieval.
 * @param {object} json - notification JSON
 * @param {string} url - url the notification would open
 */
function onNotificationReceived(json, url) {
    chrome.storage.sync.get(["notifications"], (result) => {
        let currentNotification = json;
        let notificationArray = result.notifications;

        currentNotification.date = new Date().toISOString();
        currentNotification.url = url;

        notificationArray.push(json);

        chrome.storage.sync.set({"notifications": notificationArray}, ()=>{});
    });
}