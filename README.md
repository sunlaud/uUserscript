# uUserscript - micro userscript

## About

Simple web-extension for adding custom javascript snippets (userscripts) to HTML pages.

Core highlights:
* aims to be as small as possible (less code - less bugs and security holes)
* lightweight
* no dependencies
* simple not bloated UI (no feature creep)


### Example userscripts

#### Skip video ads
```javascript
if (window.amountAdsSkipped == undefined) {
    window.amountAdsSkipped = 0;
    console.log("video ad block loaded!");
    blockAds();

    function blockAds() {
        let adVideo = document.querySelector("#player-container .ad-interrupting video");
        if (adVideo && adVideo.duration - adVideo.currentTime > 0.1 ) {
            console.info("found ad video, skipping to the end...")
            adVideo.currentTime = adVideo.duration - 0.001;
            window.amountAdsSkipped++;
            let title = window.document.title.replace(/ <ads blocked: [0-9]+>$/, "");
            window.document.title = title + ` <ads blocked: ${window.amountAdsSkipped}>`;
        }
        let skipButton = document.querySelector("button.videoAdUiSkipButton");
        if (skipButton) {
            console.info("found skip ad button, clicking it...")
            skipButton.click();
        }
        let textAdd = document.querySelector(".video-ads");
        if (textAdd && textAdd.style.visibility != "hidden") {
            console.info("found text add, hiding it...")
            textAdd.style.visibility = "hidden";
        }

        setTimeout(blockAds, 250);
    }
}
```