document.addEventListener("DOMContentLoaded", function () {
  var linkInput = document.getElementById("linkInput");
  var saveButton = document.getElementById("saveButton");
  var saveTabButton = document.getElementById("saveTabButton");
  var savedLinks = document.getElementById("savedLinks");
  var deleteAllButton = document.getElementById("deleteAllButton");

  // Load saved links from storage and update the UI
  chrome.storage.sync.get(["links"], function (result) {
    if (result.links) {
      var linksList = document.createElement("ul");
      linksList.style.listStyleType = "none";
      result.links.forEach(function (link) {
        var linkItem = document.createElement("li");
        var linkElement = document.createElement("a");
        linkElement.href = link;
        linkElement.style.display = "block";
        linkElement.style.fontSize = "16px";
        linkElement.textContent = link;
        linkItem.appendChild(linkElement);
        linksList.appendChild(linkItem);
      });
      savedLinks.appendChild(linksList);
    }
  });

  // Add event listener for the save button
  saveButton.addEventListener("click", function () {
    var link = linkInput.value;
    saveLink(link);
  });

  // Add event listener for the save tab button
  saveTabButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var link = tabs[0].url;
      saveLink(link);
    });
  });

  // Function to handle the "Delete All" button click event
  deleteAllButton.addEventListener("click", function () {
    // Clear the saved links from storage and update the UI
    chrome.storage.sync.set({ links: [] }, function () {
      savedLinks.innerHTML = "";
    });
  });

  // Function to save the link to storage and update the UI
  function saveLink(link) {
    if (link) {
      // Save the link to storage
      chrome.storage.sync.get(["links"], function (result) {
        var links = result.links || [];
        links.push(link);

        chrome.storage.sync.set({ links: links }, function () {
          // Update the UI with the new link
          var linkItem = document.createElement("li");
          var linkElement = document.createElement("a");
          linkElement.href = link;
          linkElement.textContent = link;
          linkElement.style.display = "block"; // Display links as block elements
          linkElement.style.fontSize = "16px"; // Set text size to 18px
          linkItem.appendChild(linkElement);
          savedLinks.firstChild.appendChild(linkItem);

          // Clear the input field
          linkInput.value = "";
        });
      });
    }
  }
});
