setInterval(() => {
    browser.storage.session.get().then((items) => {
        const currentTime = Math.floor(Date.now() / 1000);

        Object.keys(items).forEach(key => {
            const item = items[key];

            if(item.isEnabled) {
                const itemTime = item.lastReloaded + item.interval;

                browser.browserAction.setBadgeText({ text: String(currentTime - itemTime), tabId: Number(key) });

                if(currentTime >= itemTime) {
                    browser.tabs.reload(Number(key)).then(() => {}, (error) => {});

                    browser.storage.session.set({
                        [key]: {
                            ...item,
                            lastReloaded: currentTime
                        }
                    }).then(() => {}, (error) => {});
                }
            } else {
                browser.browserAction.setBadgeText({ text: "", tabId: Number(key) });
            }
        });
    }, (error) => {});
}, 1000);

// WARNING: Since setting a session is asynchronus, above code might be called
// right after we remove the object. This will result in object being added again.
// There must be some sort of mutual exclusion.
browser.tabs.onRemoved.addListener((tab) => {
    const sTab = String(tab);
    browser.storage.session.get().then((items) => {
        if(items[sTab] !== undefined) {
            browser.storage.session.remove(sTab).then((items) => {}, (error) => {});
        }
    }, (error) => {});
});

// TODO: Stop interval when there are no active tabs to manage.
