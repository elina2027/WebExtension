document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'f') {
      event.preventDefault();  // Prevent default Ctrl + F action
  
      // Your custom search behavior here
      let searchTerm = prompt('Enter search term:');
      if (searchTerm) {
        let bodyText = document.body.innerText;
        let foundIndex = bodyText.indexOf(searchTerm);
  
        if (foundIndex !== -1) {
          alert('Found: ' + searchTerm);
          // You can highlight the text or scroll to it, etc.
        } else {
          alert('No match found.');
        }
      }
    }
  });
  