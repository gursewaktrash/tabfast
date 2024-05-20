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
      linksList.className = "saved-links"; 
      result.links.forEach(function (link) {
        var linkItem = document.createElement("li");
        var linkElement = document.createElement("a");
        linkElement.href = link;
        linkElement.textContent = link;
        linkElement.addEventListener("click", function (event) { 
          event.preventDefault();  //To open saved links in a new tab
          chrome.tabs.create({ url: link });  
        });
        linkItem.appendChild(linkElement);

        // Fetch the favicon for the website
        var faviconUrl = getFaviconUrl(link);
        var faviconImage = document.createElement("img");
        faviconImage.src = faviconUrl;
        faviconImage.className = "favicon";
        linkItem.appendChild(faviconImage);

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
          linkItem.appendChild(linkElement);

          // Fetch the favicon for the website
          var faviconUrl = getFaviconUrl(link);
          var faviconImage = document.createElement("img");
          faviconImage.src = faviconUrl;
          faviconImage.className = "favicon";
          linkItem.appendChild(faviconImage);

          savedLinks.firstChild.appendChild(linkItem);


          // Clear the input field
          linkInput.value = "";
        });
      });
    }
  }


  // Function to get the favicon URL 
  function getFaviconUrl(url) {
    var hostname = new URL(url).hostname;
    return "https://www.google.com/s2/favicons?domain=" + hostname;
  }
});


