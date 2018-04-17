'use strict'

var mockUrls = {"gg" : "tt", "yy" : "oo"};
mockUrls = {};
var browser = { storage: {local: {get: () => {return {then: (callback) => callback(mockUrls)}}}}}

var scriptsByUrl;

var urlSelect = document.querySelector("#urls");
var scriptInput = document.querySelector("#script");
var urlInput = document.querySelector("#url");
var newButton = document.querySelector("#new");
var saveButton = document.querySelector("#save");
var removeButton = document.querySelector("#remove");



function init() {
    console.info('loading data');
    browser.storage.local.get().then((data) => {
        console.info('got data: ', data);
        scriptsByUrl = data;
        Object.keys(scriptsByUrl).forEach(addUrlToSelect);
        selectUrl(0);
    });
}

function addUrlToSelect(url) {
    let option = document.createElement("option");
    option.value = url;
    option.text = url;
    urlSelect.add(option);
}

function selectUrl(indexToSelect) {
    urlSelect.selectedIndex = indexToSelect;
    selectedUrlChanged();
}

function selectedUrlChanged() {
    let url = urlSelect.value;
    console.debug("url selected: ", url);
    removeButton.disabled = !url;
    urlInput.value = url;
    scriptInput.value = scriptsByUrl[url] || "";
}

function save() {
    let oldUrl = urlSelect.value;
    let url = urlInput.value;
    let script = scriptInput.value;
    console.info("saving", "oldUrl=", oldUrl, "newUrl=", url);
    if (!url) {
        alert("Error: url is required")
        return;
    }
    if (!script) {
        alert("Error: script is required")
        return;
    }
    if (oldUrl == url) {
        setSelectedUrlValueTo(url);
    } else {
        if (scriptsByUrl[url]) {
            alert("Error: script for url '" + url + "' is already present!");
            return;
        }
        if (oldUrl) {
            delete scriptsByUrl[oldUrl];
            urlSelect.options.remove(urlSelect.selectedIndex);
        }
        console.debug("adding url to selecte...");
        addUrlToSelect(url);
        urlSelect.selectedIndex = urlSelect.options.length - 1;
        removeButton.disabled = false;
    }
    scriptsByUrl[url] = script;

    console.log("saving ", url + " => " + script);
    browser.storage.local.set(scriptsByUrl);
}

function setSelectedUrlValueTo(url) {
    let option = urlSelect.options[urlSelect.selectedIndex];
    option.value = url;
    option.text = url;
}

function newUrl() {
    selectUrl(-1);
}

function remove() {
    let index = urlSelect.selectedIndex;
    let url = urlSelect.options[index].value;
    if (!confirm("Really delete url '" + url + "'?")) {
        return;
    }
    urlSelect.options.remove(index);
    delete scriptsByUrl[url];
    browser.storage.local.set(scriptsByUrl);
    selectUrl(0);
}

document.addEventListener('DOMContentLoaded', init);
urlSelect.onchange = selectedUrlChanged;
saveButton.onclick = save;
removeButton.onclick = remove;
newButton.onclick = newUrl;

console.clear();
