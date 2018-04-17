browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (!changeInfo.url) {
//         return;
//     }
    console.info("onUpdated: ", changeInfo, tab);
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
        console.info("active: ", tabs)
    });
});


browser.tabs.onCreated.addListener((tabId, changeInfo, tab) => {
    //     if (!changeInfo.url) {
    //         return;
    //     }
    console.info("onUpdated: ", changeInfo, tab);
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
        console.info("active: ", tabs)
    });
});



browser.tabs.onActivated.addListener((activeInfo) => {
    console.info("activated: ", activated);
});
