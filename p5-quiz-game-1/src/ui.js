// ui.js
let inputField, submitButton, feedbackDisplay;

function setupUI() {
  inputField = createInput('');
  inputField.position(20, height - 60);
  inputField.size(200);
  
  submitButton = createButton('提交答案');
  submitButton.position(inputField.x + inputField.width + 10, height - 60);
  submitButton.mousePressed(checkAnswer);
  
  feedbackDisplay = createDiv('');
  feedbackDisplay.position(20, height - 100);
  feedbackDisplay.style('font-size', '16px');
  feedbackDisplay.style('color', '#333');
}

function displayFeedback(message) {
  feedbackDisplay.html(message);
}

function checkAnswer() {
  const playerAnswer = inputField.value().trim();
  // Call a function from gameLogic.js to check the answer
  const result = checkPlayerAnswer(playerAnswer); // This function should be defined in gameLogic.js
  if (result.correct) {
    displayFeedback(result.correctFeedback);
  } else {
    displayFeedback(result.incorrectFeedback);
  }
  inputField.value(''); // Clear the input field
}