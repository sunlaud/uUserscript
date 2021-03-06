var settings = {
    scriptsByUrl: {}
}

function loadConfig() {
    console.info("(re)loading config...")
    browser.storage.local.get(settings).then(storedSettings => {
        settings = storedSettings;
        console.info("(re)loaded userscripts for url patterns: " + Object.keys(settings.scriptsByUrl))
    }).catch(error => console.error("Failed to load extension config data from storage: ", error));
}


loadConfig();
browser.storage.onChanged.addListener(loadConfig);
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "loading") {
        let url = tab.url
        let matchedUrlPatterns = Object.keys(settings.scriptsByUrl).filter((urlPattern) => new RegExp(urlPattern).test(url));
        matchedUrlPatterns.forEach(urlPattern => {
            let script = settings.scriptsByUrl[urlPattern];
            console.info(`page url '${url}' matched pattern '${urlPattern}' - injecting userscipt into page...`);
            browser.tabs.executeScript(tabId, { code: script });
        })
    }
}, { properties: ["status"] });
