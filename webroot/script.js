var count = 0;
const prefixLabel = document.querySelector('#prefix-hint');
const rootLabel = document.querySelector('#root-hint');
const suffixLabel = document.querySelector('#suffix-hint');
const inputBoxes = document.querySelectorAll('input');
const POINT_SYSTEM = [10, 8, 4, 2, 0];


var wordOfTheDay = "";
var usernameG, scoreG = "";

class App {
  constructor() {
    //string attempt from input
    var attempt;
    getWordOfTheDay();

    // When the Devvit app sends a message with `context.ui.webView.postMessage`, this will be triggered
    window.addEventListener('message', (ev) => {
      const { type, data } = ev.data;

      if (type === 'devvit-message') {
        const {message} = data;

        if (message.type === 'leaderboard') {
          const {member, score} = message.data;
          usernameG = member;
          scoreG = score;
        }
      }

    });

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
                if (index != 3) {
                  inputBoxes[index+1].disabled = false; //unlock next textbox
                }
                attempt = input.value; // Store the value in a variable
                count++;
                // console.log(`Input ${index + 1}:`, attempt); // Log the value for testing
                // console.log('On Attempt' +count );
                if (attempt.toLowerCase() == wordOfTheDay.word.toLowerCase()) {
                  input.style.backgroundColor = "var(--correct-color)";
                  window.parent?.postMessage(
                    { type: 'setScore', 
                      data: { newScore: Number(scoreG + POINT_SYSTEM[index]) } },
                    '*'
                  );
                  // console.log(Number(scoreG + POINT_SYSTEM[index]));
                  celebrate();
                } else if (index == 3) {
                  // window.parent?.postMessage(
                  //   { type: 'setScore', 
                  //     data: { newScore: Number(scoreG + POINT_SYSTEM[index]) } },
                  //   '*'
                  // );
                  revealAnswer();
                } else {
                  revealHint();
                }
            }
        });
    });

  }

}

function celebrate() {
  //disable all boxes
  inputBoxes.forEach((input,index) => {
    if (!input.disabled) {
      input.disabled = true;
    }
  });
  //reveal remaining hints
  while (count < 4) {
    revealHint();
    count++;
  }

  //reveal prefix,root,suffix
  revealMorphemes();

}
function revealMorphemes() {
  //document.getElementsByClassName("answer-container").style.display = "flex";
  if (wordOfTheDay.prefix != "") {
    const prefixAnswer = document.createElement('h3');
    prefixAnswer.textContent = wordOfTheDay.prefix;
    prefixAnswer.style.fontWeight = "bold";
    document.getElementById('prefix-answer-box').appendChild(prefixAnswer);
  }
  if (wordOfTheDay.root != "") {
    const rootAnswer = document.createElement('h3');
    rootAnswer.textContent = wordOfTheDay.root;
    rootAnswer.style.fontWeight = "bold";
    document.getElementById('root-answer-box').appendChild(rootAnswer);
  }
  if (wordOfTheDay.suffix != "") {
    const suffixAnswer = document.createElement('h3');
    suffixAnswer.textContent = wordOfTheDay.suffix;
    suffixAnswer.style.fontWeight = "bold";
    document.getElementById('suffix-answer-box').appendChild(suffixAnswer);
  }
  
}
function revealAnswer() {
  //banner showing answer
  const answerReveal = document.getElementById('word-of-day-box');
  const answer = document.createElement('h1');
  answer.textContent = wordOfTheDay.word;
  answer.classList.add("word-of-day");
  answerReveal.appendChild(answer);
  answerReveal.classList.remove("hidden");
  answerReveal.style.display = "block";

  revealMorphemes();
}
function revealHint() {
    //PREFIX HINT
    if (count == 1) {
      const newPrefixLabel = document.createElement('h3');
      const prefixHintBox = document.getElementById('prefix-hint-box');
      newPrefixLabel.id = "prefix-hint";
      if (wordOfTheDay.prefixOrigin === "") {
        newPrefixLabel.textContent = "No Prefix in Today's Word"
      } else {
        newPrefixLabel.textContent = wordOfTheDay.prefixOrigin;
      }
      
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
      if (wordOfTheDay.rootOrigin === "") {
        newRootLabel.textContent = "No Root in Today's Word";
      } else {
        newRootLabel.textContent = wordOfTheDay.rootOrigin;
      }
    
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
      if (wordOfTheDay.suffixOrigin === "") {
        newSuffixLabel.textContent = "No Suffix in Today's Word";
      } else {
        newSuffixLabel.textContent = wordOfTheDay.suffixOrigin;
      }  

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
const words = [
  { word: "Autonomy",
    prefix: "Auto", 
    prefixOrigin: "Greek: 'self'", 
    root: "Nom", 
    rootOrigin: "Greek: 'law'", 
    suffix: "Y", 
    suffixOrigin: "English: 'state of'" },
  {
    word: "Biology", 
    prefix: "",
    prefixOrigin: "",
    root: "Bio",
    rootOrigin: "Greek: 'life'",
    suffix: "Logy",
    suffixOrigin: "Greek: 'study of'"
  },
  {
    word: "Democracy",
    prefix: "Demo",
    prefixOrigin: "Greek: 'people'",
    root: "Cracy",
    rootOrigin: "Greek: 'rule'",
    suffix: "",
    suffixOrigin: ""
  },
  {
    word: "Ideology",
    prefix: "Ideo",
    prefixOrigin: "Greek: 'idea'",
    root: "Logy",
    rootOrigin: "Greek: 'study of'",
    suffix: "",
    suffixOrigin: ""
  },
  {
    word: "Lexicon",
    prefix: "Lex",
    prefixOrigin: "Greek: 'word'",
    root: "Icon",
    rootOrigin: "Greek: 'image'",
    suffix: "",
    suffixOrigin: ""
  },
  {
    word: "Metaphor",
    prefix: "Meta",
    prefixOrigin: "Greek: 'beyond'",
    root: "Phor",
    rootOrigin: "Greek: 'carry'",
    suffix: "",
    suffixOrigin: ""
  },
  {
    word: "Necropolis",
    prefix: "",
    prefixOrigin: "",
    root: "Necro",
    rootOrigin: "Greek: 'dead'",
    suffix: "Polis",
    suffixOrigin: "Greek: 'city'"
  },
  {
    word: "Philosopher",
    prefix: "Philo",
    prefixOrigin: "Greek: 'love'",
    root: "Soph",
    rootOrigin: "Greek: 'wisdom'",
    suffix: "Er",
    suffixOrigin: "English: 'one who does or is associated with'"
  },
  {
    word: "Pyromania",
    prefix: "Pyro",
    prefixOrigin: "Greek: 'fire'",
    root: "Mania",
    rootOrigin: "Greek: 'madness'",
    suffix: "",
    suffixOrigin: ""
  },
  {
    word: "Psychologist",
    prefix: "Psycho",
    prefixOrigin: "Greek: 'soul'",
    root: "Log",
    rootOrigin: "Greek: 'study of'",
    suffix: "Ist",
    suffixOrigin: "Greek: 'one who practices'"
  },
  {
    word: "Symbiosis",
    prefix: "Sym",
    prefixOrigin: "Greek: 'together'",
    root: "Bio",
    rootOrigin: "Greek: 'life'",
    suffix: "Sis",
    suffixOrigin: "Greek: 'process'"
  },
  {
    word: "Thermodynamics",
    prefix: "Thermo",
    prefixOrigin: "Greek: 'heat'",
    root: "Dynamics",
    rootOrigin: "Greek: 'force'",
    suffix: "",
    suffixOrigin: ""
  },
  {
    word: "Theologian",
    prefix: "Theo",
    prefixOrigin: "Greek: 'god'",
    root: "Log",
    rootOrigin: "Greek: 'study of'",
    suffix: "Ian",
    suffixOrigin: "Latin: 'one who practices or is concerned with'"
  }
];

// Logic to select the word of the day
function getWordOfTheDay() {
  const currentDate = new Date().toISOString().split('T')[0];
  const wordIndex = Math.abs(currentDate.split('-').reduce((acc, num) => acc + parseInt(num, 10), 0)) % words.length;
  wordOfTheDay = words[wordIndex];
  return wordOfTheDay;
}


new App();
