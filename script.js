const letters = document.querySelectorAll(".scoreboard-letter");
const keyPress = document.querySelector("body");
const word_url = "https://words.dev-apis.com/word-of-the-day";
const validWordUrl = "https://words.dev-apis.com/validate-word";
const buttonA = document.querySelector("#buttonA");
const container = document.getElementById("keyboard-buttons");
let FirstRowIndex = 1;
let word = "";
let wordOfTheDayValue;
let validWordResultValue = null;
let eventListenerEnabled = true;
let buttonConfirmClicked = false;




const qwertyLayout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

for (let row = 0; row < qwertyLayout.length; row++) {
  const rowContainer = document.createElement("div");
  rowContainer.className = "keyboard-row";

  for (let col = 0; col < qwertyLayout[row].length; col++) {
    const letter = qwertyLayout[row][col];
    const button = document.createElement("button");
    button.innerText = letter;
    button.addEventListener("click", handleButtonClick);
    rowContainer.appendChild(button);
  }

  container.appendChild(rowContainer);
}

let backspaceButton = document.querySelector("#backspace")
backspaceButton.addEventListener("click", handleBackspaceClick)

const buttonConfirm = document.getElementById("enter");
buttonConfirm.addEventListener("click", handleButtonConfirmClick);



async function validWord() {
  try {
    const loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.style.display = "block";

    // for (i = FirstRowIndex - 1; i > FirstRowIndex - 6; i--) {
    //   console.log(FirstRowIndex);
    //   let square = document.getElementById(`letter-number${i}`);
    //   square.classList.add("loadingAnimation");
    // }

    const response = await fetch(validWordUrl, {
      method: "POST",
      body: JSON.stringify({ word }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.validWord);
      let validWordResult = result.validWord;
      validWordResultValue = validWordResult;
    } else {
      console.log("Error: Unable to validate word");
    }
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    // Hide the loading message, regardless of success or error
    const loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.style.display = "none";

    // for (i = FirstRowIndex - 1; i > FirstRowIndex - 6; i--) {
    //   console.log(FirstRowIndex);
    //   let square = document.getElementById(`letter-number${i}`);
    //   square.classList.remove("loadingAnimation");
    // }
  }
}

async function wordOfTheDay() {
  const promise = await fetch(word_url);
  const processedResponse = await promise.json();

  let wordOftheDay = processedResponse.word;
  console.log(wordOftheDay);
  wordOfTheDayValue = wordOftheDay;
  return wordOftheDay;
}
wordOfTheDay();


// buttonA.addEventListener("click", function () {
//   if (word.length < 5){
//     const input = document.getElementById(`letter-number${FirstRowIndex}`);
//     FirstRowIndex++;

//     word += buttonA.innerText;
//     input.innerText = buttonA.innerText
//   }else{
//     return;
//   }
// });

keyPress.addEventListener("keyup", async function (event) {
  if (!eventListenerEnabled) {
    return;
  }

  console.log("długość wyrazu", word, word.length)
  console.log("1", word);
  console.log("2", FirstRowIndex);
  console.log(document.getElementById(`letter-number${FirstRowIndex}`));
  if (isBackspace(event.key) && word.length > 0) {
    // Handle Backspace key
    console.log(FirstRowIndex);
    if (FirstRowIndex > 0) {
      const removeInput = document.getElementById(
        `letter-number${FirstRowIndex - 1}`
      );
      FirstRowIndex = FirstRowIndex - 1;

      removeInput.innerText = "";
      word = word.slice(0, -1);
    }
    return;
  }

  if (word.length < 5 && /^[a-zA-Z]$/.test(event.key)) {
    const input = document.getElementById(`letter-number${FirstRowIndex}`);
    let letter = event.key;

    if (isLetter(letter)) {
      console.log("jest");
      input.innerText = letter.toUpperCase();
      console.log("letter", typeof letter, letter);

      if (input.innerText !== "") {
        FirstRowIndex++;
        word += input.innerText.toLowerCase();
      }
    }
  } else if ((word.length === 5 && isEnter(event.key)) || buttonConfirmClicked){
    await validWord(); // Wait for validWord function to complete
    
 
    console.log(validWordResultValue, wordOfTheDayValue);

    if (validWordResultValue && word === wordOfTheDayValue) {
      console.log("super");

      let wordArray = word.split("");
      let wordOfTheDayValueArray = wordOfTheDayValue.split("");

      const sameIndexLetters = wordArray.reduce((result, letter, index) => {
        if (wordOfTheDayValueArray[index] === letter) {
          result.push(index);
        }
        return result;
      }, []);

      addGreenClassToLetters(sameIndexLetters, FirstRowIndex);

      const winnerBaner = document.querySelector(".alertWinner");
      winnerBaner.classList.add("displayyes");
      word = "";
      eventListenerEnabled = false;
    } else if (validWordResultValue == false) {
      for (i = FirstRowIndex - 1; i > FirstRowIndex - 6; i--) {
        console.log(FirstRowIndex);
        let square = document.getElementById(`letter-number${i}`);
        square.classList.add("newClass");

        setTimeout(() => {
          square.classList.remove("newClass");
        }, 1000);
      }
    } else if (validWordResultValue && word != wordOfTheDayValue) {
      let wordOfTheDayValueArray = wordOfTheDayValue.split("");
      let wordArray = word.split("");
      let greyArray = [];

      const letterOccurrences = new Map();
      const matchingIndexes = wordArray.reduce((indexes, letter, index) => {
        const wordOccurrences = letterOccurrences.get(letter) || 0;
        if (wordOfTheDayValueArray.includes(letter) && wordOccurrences < 1) {
          indexes.push(index);
          letterOccurrences.set(letter, wordOccurrences + 1);
        } else {
          greyArray.push(index);
        }
        return indexes;
      }, []);

      const sameIndexLetters = wordArray.reduce((result, letter, index) => {
        if (wordOfTheDayValueArray[index] === letter) {
          result.push(index);
        }
        return result;
      }, []);

      console.log(greyArray);
      console.log(matchingIndexes);
      console.log(sameIndexLetters);

      addGreyClassToLetters(greyArray, FirstRowIndex);

      addYellowClassToLetters(matchingIndexes, FirstRowIndex);

      addGreenClassToLetters(sameIndexLetters, FirstRowIndex);

      console.log("Rows", FirstRowIndex);

      word = "";
    } else {
      word = "";
    }
    if (FirstRowIndex > 30) {
      console.log(`You lost a word of day is: ${wordOfTheDayValue}`);
      const winnerBaner = document.querySelector(".alertLoser");
      winnerBaner.classList.add("displayyes");
      winnerBaner.innerText = `;/ u lost word of the day is: ${wordOfTheDayValue}`;
      word = "";
    }
    return;
  } else {
    return;
  }
});

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function isEnter(enter) {
  return enter === "Enter";
}

function isBackspace(backspace) {
  return backspace === "Backspace";
}

function addGreyClassToLetters(greyArray, FirstRowIndex) {
  for (let i = 0; i < greyArray.length; i++) {
    console.log("szare", greyArray[i]);
    const index = greyArray[i] + FirstRowIndex - 6;
    let square = document.getElementById(`letter-number${index + 1}`);
    square.classList.add("greyClass");
    console.log(index + 1, FirstRowIndex);
  }
}

function addYellowClassToLetters(matchingIndexes, FirstRowIndex) {
  for (let i = 0; i < matchingIndexes.length; i++) {
    console.log("szare", matchingIndexes[i]);
    const index = matchingIndexes[i] + FirstRowIndex - 6;
    let square = document.getElementById(`letter-number${index + 1}`);
    square.classList.add("yellowClass");
    console.log(index + 1, FirstRowIndex);
  }
}

function addGreenClassToLetters(sameIndexLetters, FirstRowIndex) {
  for (let i = 0; i < sameIndexLetters.length; i++) {
    console.log("szare", sameIndexLetters[i]);
    const index = sameIndexLetters[i] + FirstRowIndex - 6;
    let square = document.getElementById(`letter-number${index + 1}`);
    square.classList.add("greenClass");
    console.log(index + 1, FirstRowIndex);
  }
}

function findMatchingIndexes(wordArray, wordOfTheDayValueArray) {
  const letterOccurrences = new Map();
  const matchingIndexes = wordArray.reduce((indexes, letter, index) => {
    const wordOccurrences = letterOccurrences.get(letter) || 0;
    if (wordOfTheDayValueArray.includes(letter) && wordOccurrences < 1) {
      indexes.push(index);
      letterOccurrences.set(letter, wordOccurrences + 1);
    } else {
      greyArray.push(index);
    }
    return indexes;
  }, []);

  return matchingIndexes;
}


function handleButtonClick(event) {
  const button = event.target;
  const letter = button.innerText;

  if (word.length < 5) {
    const input = document.getElementById(`letter-number${FirstRowIndex}`);
    
    

    word += letter.toLowerCase();
    FirstRowIndex++;

    
    input.innerText = letter;
    console.log(word, word.length)
  } else {
    return;
  }
}


function handleBackspaceClick(event) {
  const button = event.target;
  const letter = button.innerText;
  const input = document.getElementById(`letter-number${FirstRowIndex}`);
  if (word.length > 0) {
    
    
    

    if (FirstRowIndex > 0) {
      const removeInput = document.getElementById(
        `letter-number${FirstRowIndex - 1}`
      );
      FirstRowIndex = FirstRowIndex - 1;

      removeInput.innerText = "";
      word = word.slice(0, -1);
    }
    return;
}
}







async function handleButtonConfirmClick() {
  // Set the buttonConfirmClicked variable to true when the button is clicked

    await validWord(); // Wait for validWord function to complete
    
 
    console.log(validWordResultValue, wordOfTheDayValue);

    if (validWordResultValue && word === wordOfTheDayValue) {
      console.log("super");

      let wordArray = word.split("");
      let wordOfTheDayValueArray = wordOfTheDayValue.split("");

      const sameIndexLetters = wordArray.reduce((result, letter, index) => {
        if (wordOfTheDayValueArray[index] === letter) {
          result.push(index);
        }
        return result;
      }, []);

      addGreenClassToLetters(sameIndexLetters, FirstRowIndex);

      const winnerBaner = document.querySelector(".alertWinner");
      winnerBaner.classList.add("displayyes");
      word = "";
      eventListenerEnabled = false;
    } else if (validWordResultValue == false) {
      for (i = FirstRowIndex - 1; i > FirstRowIndex - 6; i--) {
        console.log(FirstRowIndex);
        let square = document.getElementById(`letter-number${i}`);
        square.classList.add("newClass");

        setTimeout(() => {
          square.classList.remove("newClass");
        }, 1000);
      }
    } else if (validWordResultValue && word != wordOfTheDayValue) {
      let wordOfTheDayValueArray = wordOfTheDayValue.split("");
      let wordArray = word.split("");
      let greyArray = [];

      const letterOccurrences = new Map();
      const matchingIndexes = wordArray.reduce((indexes, letter, index) => {
        const wordOccurrences = letterOccurrences.get(letter) || 0;
        if (wordOfTheDayValueArray.includes(letter) && wordOccurrences < 1) {
          indexes.push(index);
          letterOccurrences.set(letter, wordOccurrences + 1);
        } else {
          greyArray.push(index);
        }
        return indexes;
      }, []);

      const sameIndexLetters = wordArray.reduce((result, letter, index) => {
        if (wordOfTheDayValueArray[index] === letter) {
          result.push(index);
        }
        return result;
      }, []);

      console.log(greyArray);
      console.log(matchingIndexes);
      console.log(sameIndexLetters);

      addGreyClassToLetters(greyArray, FirstRowIndex);

      addYellowClassToLetters(matchingIndexes, FirstRowIndex);

      addGreenClassToLetters(sameIndexLetters, FirstRowIndex);

      console.log("Rows", FirstRowIndex);

      word = "";
    } else {
      word = "";
    }
    if (FirstRowIndex > 30) {
      console.log(`You lost a word of day is: ${wordOfTheDayValue}`);
      const winnerBaner = document.querySelector(".alertLoser");
      winnerBaner.classList.add("displayyes");
      winnerBaner.innerText = `;/ u lost word of the day is: ${wordOfTheDayValue}`;
      word = "";
    }
    return;
  
}


