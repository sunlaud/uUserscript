var scriptsByUrl;

var urlSelect = document.querySelector("#urls");
var scriptInput = document.querySelector("#script");
var urlInput = document.querySelector("#url");
var newButton = document.querySelector("#new");
var exportButton = document.querySelector("#export");
var removeButton = document.querySelector("#remove");
var form = document.querySelector("form");
/*
var emalutadData = {};
var browser = { storage: {local: {
    get: () => {return {then: callback => {callback(emalutadData); return {catch: (callback) => callback("error")}}}},
    set: (data) => {emalutadData = data; return {then: callback => callback()}}
}}}
*/

function init() {
    browser.storage.local.get().then((data) => {
        scriptsByUrl = data;
        Object.keys(scriptsByUrl).forEach(addUrlToSelect);
        selectUrl(0);
    }).catch((error) => alert("Failed to load config data: " + error));
}

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

function setSelectedUrlValueTo(url) {
    let option = urlSelect.options[urlSelect.selectedIndex];
    option.value = url;
    option.text = url;
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
        if (scriptsByUrl[url]) {
            alert(`Error: script for url '${url}' is already present!`);
            return;
        }
        if (oldUrl) {
            setSelectedUrlValueTo(url);
            delete scriptsByUrl[oldUrl];
            browser.storage.local.remove(oldUrl).catch(error => alert("Failed to save config data: " + error));
        } else {
            addUrlToSelect(url);
            urlSelect.selectedIndex = urlSelect.options.length - 1;
        }

        removeButton.disabled = false;
    }
    scriptsByUrl[url] = script;
    browser.storage.local.set(scriptsByUrl).catch(error => alert("Failed to save config data: " + error));
}

function removeSelectedUserscript() {
    let index = urlSelect.selectedIndex;
    let url = urlSelect.options[index].value;

    return browser.storage.local.remove(url).then(() => {
        urlSelect.options.remove(index);
        delete scriptsByUrl[url];
    }).catch(error => alert("Failed to save config data: " + error));
}

function exportSettings() {
    let configDataAsUrl = "data:text/json," + encodeURIComponent(JSON.stringify(scriptsByUrl, null, "  "));
    let something = window.open(configDataAsUrl, "_blank");
    something.focus();
}

urlSelect.onchange = () => {
    let url = urlSelect.value;
    removeButton.disabled = !url;
    urlInput.value = url;
    scriptInput.value = scriptsByUrl[url] || "";
};

newButton.onclick = (event) => {
    event.preventDefault();
    selectUrl(-1);
};

removeButton.onclick = (event) => {
    event.preventDefault();
    if (confirm(`Really delete script for '${url}'?`)) {
        removeSelectedUserscript().then(() => selectUrl(0));
    }
};

form.onsubmit = saveUserscript;
exportButton.onclick = exportSettings;

document.addEventListener('DOMContentLoaded', init);

