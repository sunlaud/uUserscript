var settings = {
    scriptsByUrl: {}
}

/*
var emalutadData = {};
var browser = { storage: {local: {
    get: () => {return {then: callback => {callback(emalutadData); return {catch: (callback) => callback("error")}}}},
    set: (data) => {emalutadData = data; return {then: callback => callback()}}
}}}
*/


function init() {
    let urlSelect = document.querySelector("#urls");
    let scriptInput = document.querySelector("#script");
    let urlInput = document.querySelector("#url");
    let newButton = document.querySelector("#new");
    let exportButton = document.querySelector("#export");
    let removeButton = document.querySelector("#remove");
    let form = document.querySelector("form");

    urlSelect.onchange = () => {
        let url = urlSelect.value;
        removeButton.disabled = !url;
        urlInput.value = url;
        scriptInput.value = settings.scriptsByUrl[url] || "";
    };

    newButton.onclick = (event) => {
        event.preventDefault();
        selectUrl(-1);
    };

    removeButton.onclick = removeSelectedUserscript;
    form.onsubmit = saveUserscript;
    exportButton.onclick = exportSettings;

    browser.storage.local.get(settings).then(storedSettings => {
        settings = storedSettings;
        Object.keys(settings.scriptsByUrl).forEach(addUrlToSelect);
        selectUrl(0);
    }).catch((error) => alert("Failed to load config data: " + error));


    function addUrlToSelect(url) {
        let option = document.createElement("option");
        option.value = url;
        option.text = url;
        urlSelect.add(option);
    }

    function selectUrl(indexToSelect) {
        urlSelect.selectedIndex = indexToSelect;
        urlSelect.onchange();
    }

    function saveUserscript(event) {
        let oldUrl = urlSelect.value;
        let url = urlInput.value;
        let script = scriptInput.value;
        console.debug("saving: ", oldUrl, url, script);

        event.preventDefault();
        if (!url || !script) {
            return;
        }
        if (oldUrl != url) {
            if (settings.scriptsByUrl[url]) {
                alert(`Error: script for url '${url}' is already present!`);
                return;
            }
            if (oldUrl) {
                let selectedOption = urlSelect.options[urlSelect.selectedIndex];
                selectedOption.value = url;
                selectedOption.text = url;
                delete settings.scriptsByUrl[oldUrl];
            } else {
                addUrlToSelect(url);
                urlSelect.selectedIndex = urlSelect.options.length - 1;
                removeButton.disabled = false;
            }
        }
        settings.scriptsByUrl[url] = script;
        browser.storage.local.set(settings).catch(error => alert("Failed to save config data: " + error));  //hm... if store fails we'll end up with UI not matching storage
    }


    function removeSelectedUserscript(event) {
        let index = urlSelect.selectedIndex;
        let url = urlSelect.options[index].value;
        event.preventDefault();
        if (confirm(`Really delete script for '${url}'?`)) {
            urlSelect.options.remove(index);
            selectUrl(0);
            delete settings.scriptsByUrl[url];
            browser.storage.local.set(settings).catch(error => alert("Failed to save config data: " + error));  //hm... if store fails we'll end up with UI not matching storage
        }
    }

    function exportSettings() {
        let configDataAsUrl = "data:text/json," + encodeURIComponent(JSON.stringify(settings, null, "  "));
        let something = window.open(configDataAsUrl, "_blank");
        something.focus();
    }
}

document.addEventListener('DOMContentLoaded', init);

