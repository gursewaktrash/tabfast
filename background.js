// Listen for the browser action button click event
chrome.browserAction.onClicked.addListener(function (tab) {
  // Get the current tab's URL
  var url = tab.url;

  // Save the URL to storage
  chrome.storage.sync.get(["links"], function (result) {
    var links = result.links || [];
    links.push(url);

    chrome.storage.sync.set({ links: links }, function () {
      // Optional: Display a notification to confirm the link is saved
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Link Saved",
        message: "The link has been saved successfully.",
      });
    });
  });
});
