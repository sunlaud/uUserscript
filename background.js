var scriptsByUrlPattern;


function loadConfig() {
    browser.storage.local.get()
        .then(configData => scriptsByUrlPattern = configData)
        .catch(error => console.error("Failed to load extension config data from storage: ", error));
}


loadConfig();
browser.storage.onChanged.addListener(loadConfig);
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    let url = changeInfo.url;
    if (url) {
        let matchedUrlPatterns = Object.keys(scriptsByUrlPattern).filter((urlPattern) => new RegExp(urlPattern).test(url));
        matchedUrlPatterns.forEach(urlPattern => {
            let script = scriptsByUrlPattern[urlPattern];
            console.info(`page url '${url}' matched pattern '${urlPattern}' - injecting userscipt into page...`);
            browser.tabs.executeScript(tabId, { code: script });
        })
    }
});
