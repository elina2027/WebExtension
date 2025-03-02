document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search").addEventListener("click", () => {
      let word1 = document.getElementById("word1").value;
      let charGap = parseInt(document.getElementById("charGap").value, 10);
      let word2 = document.getElementById("word2").value;

      if (!word1 || !word2 || isNaN(charGap) || charGap < 0) {
          alert("Please enter valid words and a positive number.");
          return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: findAndHighlight,
              args: [word1, charGap, word2]
          });
      });
  });

  document.getElementById("clear").addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: () => {
                  document.querySelectorAll(".highlighted").forEach(el => {
                      el.outerHTML = el.innerText;
                  });
              }
          });
      });
  });
});


function findAndHighlight(word1, charGap, word2) {
  // Remove previous highlights
  document.querySelectorAll(".highlighted").forEach(el => {
      el.outerHTML = el.innerText;
  });

  let regex = new RegExp(word1 + ".{0," + charGap + "}" + word2, "gi"); // Regex for finding words with a gap
  let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

  while (walker.nextNode()) {
      let node = walker.currentNode;
      let text = node.nodeValue;

      // Find all matches in the text
      let matches = [...text.matchAll(regex)];

      // If matches are found, split the text and wrap matched parts in <span>
      if (matches.length > 0) {
          let newHTML = "";
          let lastIndex = 0;

          matches.forEach(match => {
              // Add text before the match
              newHTML += text.slice(lastIndex, match.index);
              // Wrap matched part in a <span> element
              newHTML += `<span class='highlighted' style='background:pink;'>${match[0]}</span>`;
              lastIndex = match.index + match[0].length;
          });

          // Add any remaining text after the last match
          newHTML += text.slice(lastIndex);

          // Replace the text node with the new HTML
          let span = document.createElement("span");
          span.innerHTML = newHTML;
          node.parentNode.replaceChild(span, node);
      }
  }
}


