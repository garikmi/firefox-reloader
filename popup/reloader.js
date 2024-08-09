function storeValues() {
    const enable = document.getElementById("toggle-button").checked;
    let interval = document.getElementById("interval-input").value;
    if(interval.length === 0) { interval = "5"; }

    browser.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        if(enable) { // NOTE: Here just to make it feel more responsive.
            browser.browserAction.setBadgeText({ text: (interval*-1).toString(), tabId: tabs[0].id });
        } else {
            browser.browserAction.setBadgeText({ text: "", tabId: tabs[0].id });
        }

        browser.storage.session.set({
            [tabs[0].id]: {
                isEnabled: enable,
                lastReloaded: Math.floor(Date.now() / 1000),
                interval: Number(interval)
            }
        }).then(() => {}, (error) => {});
    });
}

function syncUI() {
    browser.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        const currentTabId = String(tabs[0].id);

        browser.storage.session.get(currentTabId).then((result) => {
            const item = result[currentTabId];
            if(item !== undefined) {
                document.getElementById("toggle-button").checked = item.isEnabled;
                document.getElementById("interval-input").value = item.interval;
            }
        }, (error) => {
            console.error("FAILED TO RETRIEVE TO SYNC UI");
        });
    });
}

function containsOnlyDigits(str) {
    return /^\d+$/.test(str);
}

function removeNonDigits(str) {
    return str.replace(/[^0-9]/g, "");
}

document.getElementById("toggle-button").addEventListener("change", (e) => {
    storeValues();
});

document.getElementById("interval-1-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "1";
    storeValues();
});

document.getElementById("interval-2-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "2";
    storeValues();
});

document.getElementById("interval-3-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "3";
    storeValues();
});

document.getElementById("interval-4-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "4";
    storeValues();
});

document.getElementById("interval-5-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "5";
    storeValues();
});

document.getElementById("interval-10-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "10";
    storeValues();
});

document.getElementById("interval-20-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "20";
    storeValues();
});

document.getElementById("interval-30-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "30";
    storeValues();
});

document.getElementById("interval-60-button").addEventListener("click", (e) => {
    document.getElementById("interval-input").value = "60";
    storeValues();
});

document.getElementById("interval-input").addEventListener("input", (e) => {
    const str = e.target.value;
    if(!containsOnlyDigits(str)) {
        e.target.value = removeNonDigits(str);
    }
    storeValues();
});

document.getElementById("toggle-off-all-button").addEventListener("click", (e) => {
    browser.storage.session.get().then((items) => {
        document.getElementById("toggle-button").checked = false;
        Object.keys(items).forEach(key => {
            const item = items[key];
            browser.browserAction.setBadgeText({ text: "", tabId: Number(key) });
            browser.storage.session.set({
                [key]: { ...item, isEnabled: false }
            }).then(() => {}, (error) => {});
        });
    }, (error) => {});
});

// Developer utility buttons.
/*
document.getElementById("show-button").addEventListener("click", (e) => {
    browser.storage.session.get().then((items) => {
        console.log(items);
    }, (error) => {
        console.error("FAILED TO RETRIEVE");
    });
});

document.getElementById("clear-button").addEventListener("click", (e) => {
    browser.storage.session.clear().then(() => {
        console.log("CLEARED");
    }, (error) => {
        console.error("FAILED TO CLEAR");
    });
});
*/

syncUI();
