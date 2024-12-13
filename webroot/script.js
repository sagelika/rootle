var count = 0;
const prefixLabel = document.querySelector('#prefix-hint');
const rootLabel = document.querySelector('#root-hint');
const suffixLabel = document.querySelector('#suffix-hint');

class App {
  constructor() {
    const output = document.querySelector('#messageOutput');
    const increaseButton = document.querySelector('#btn-increase');
    const decreaseButton = document.querySelector('#btn-decrease');
    const usernameLabel = document.querySelector('#username');
    const counterLabel = document.querySelector('#counter');
    var attempt;
    var counter = 0;

    // When the Devvit app sends a message with `context.ui.webView.postMessage`, this will be triggered
    window.addEventListener('message', (ev) => {
      const { type, data } = ev.data;

    });
    // Select all input boxes
    const inputBoxes = document.querySelectorAll('input');

    // Loop through each input box and add event listeners
    inputBoxes.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            // Accept only letters (a-z, A-Z) and prevent other characters
            const isLetter = /^[a-zA-Z]$/.test(event.key);
            if (!isLetter && event.key !== 'Backspace' && event.key !== 'Enter') {
                event.preventDefault();
            }

            // Convert to lowercase immediately
            input.addEventListener('input', () => {
                input.value = input.value.toLowerCase();
            });

            // Lock the textbox and store value in a variable when Enter is pressed
            if (event.key === 'Enter' && input.value.trim() !== '') {
                input.disabled = true; // Lock the textbox
                attempt = input.value; // Store the value in a variable
                count++;
                console.log(`Input ${index + 1}:`, attempt); // Log the value for testing
                console.log('On Attempt' +count );
                revealHint();
            }
        });
    });

  }

}

function revealHint() {
    //PREFIX HINT
    if (count == 1) {
      const newPrefixLabel = document.createElement('h3');
      const prefixHintBox = document.getElementById('prefix-hint-box');
      newPrefixLabel.id = "prefix-hint";
      newPrefixLabel.textContent = "Prefix Hint Revealed";

      newPrefixLabel.style.fontSize ="20px";
      prefixHintBox.replaceChild(newPrefixLabel, prefixLabel);

      prefixHintBox.style.backgroundColor = "var(--notquite-color)";


      // Dynamically adjust font size if needed
      while (newPrefixLabel.scrollWidth > prefixHintBox.clientWidth || newPrefixLabel.scrollHeight > prefixHintBox.clientHeight) {
        const currentFontSize = parseFloat(window.getComputedStyle(newPrefixLabel).fontSize);
        newPrefixLabel.style.fontSize = (currentFontSize - 1) + 'px';
      }
    } 
    //ROOT HINT 
    else if (count == 2) {
      const newRootLabel = document.createElement('h3');
      const rootHintBox = document.getElementById('root-hint-box');
      newRootLabel.id = "root-hint";
      newRootLabel.textContent = "Root Hint Revealed";

      newRootLabel.style.fontSize ="20px";
      rootHintBox.replaceChild(newRootLabel, rootLabel);

      rootHintBox.style.backgroundColor = "var(--notquite-color)";


      // Dynamically adjust font size if needed
      while (newRootLabel.scrollWidth > rootHintBox.clientWidth || newRootLabel.scrollHeight > rootHintBox.clientHeight) {
        const currentFontSize = parseFloat(window.getComputedStyle(newRootLabel).fontSize);
        newRootLabel.style.fontSize = (currentFontSize - 1) + 'px';
      }
    }
    //SUFFIX HINT 
    else if (count == 3) {
      const newSuffixLabel = document.createElement('h3');
      const suffixHintBox = document.getElementById('suffix-hint-box');
      newSuffixLabel.id = "suffix-hint";
      newSuffixLabel.textContent = "Suffix Hint Revealed";

      newSuffixLabel.style.fontSize ="20px";
      suffixHintBox.replaceChild(newSuffixLabel, suffixLabel);

      suffixHintBox.style.backgroundColor = "var(--notquite-color)";


      // Dynamically adjust font size if needed
      while (newSuffixLabel.scrollWidth > suffixHintBox.clientWidth || newSuffixLabel.scrollHeight > suffixHintBox.clientHeight) {
        const currentFontSize = parseFloat(window.getComputedStyle(newSuffixLabel).fontSize);
        newSuffixLabel.style.fontSize = (currentFontSize - 1) + 'px';
      }
    }
}

new App();
