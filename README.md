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
(function() {
    console.info("video ad block loaded!");
    let amountAdsSkipped = 0;
    let adMuted = false; //to track if script muted video or user
    let muteButton = document.querySelector("#player-container .ytp-mute-button.ytp-button");
    let pingCounter = 0;
    setInterval(blockAds, 400);

    function blockAds() {
        if (pingCounter % 5 == 0) {
            console.log(`pingCounter=${pingCounter}`)
            let pingSymbol = (pingCounter % 10 == 0) ? "★" : "☆"
            let titleSuffix = ` ${pingSymbol}ads: ${amountAdsSkipped}${pingSymbol}`;
            window.document.title = window.document.title.replace(/( .ads: [0-9]+.)*$/, titleSuffix)
        }
        let adVideo = document.querySelector("#player-container .ad-interrupting video");
        if (adVideo && adVideo.duration - adVideo.currentTime > 0.1 ) {
            console.info("found ad video, skipping to the end...")
            adVideo.currentTime = adVideo.duration - 0.001;
            amountAdsSkipped++;
        }
        let skipButton = document.querySelector("#container div[class*=skip-button] button");
        if (skipButton) {
            console.info(`found 'Skip Ad' button, clicking it...`)
            amountAdsSkipped++;
            skipButton.click();
        }

        //mute ad
        if (adVideo) {
            if(!adMuted && muteButton.attributes.getNamedItem("aria-label").textContent.startsWith("Mute")) {
                console.log("muting video coz ad is showing")
                muteButton.click();
                adMuted = true;
            }
        } else if (adMuted) {
            console.log("un-muting video coz no ad is showing")
            if (muteButton.attributes.getNamedItem("aria-label").textContent.startsWith("Unmute")) muteButton.click();
            adMuted = false;
        }

        let textAdd = document.querySelector(".video-ads");
        if (textAdd && textAdd.style.visibility != "hidden") {
            console.info("found text add, hiding it...")
            textAdd.style.visibility = "hidden";
        }
        pingCounter++
    }
})()
```
