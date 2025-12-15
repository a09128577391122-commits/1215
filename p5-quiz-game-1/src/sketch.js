let questions = [];
let currentQuestionIndex = 0;
let playerAnswer = '';
let feedbackMessage = '';
let isAnswering = false;
let dialogueMgr;

function preload() {
  loadQuestions();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  dialogueMgr = new DialogueManager();
  dialogueMgr.open();
}

function draw() {
  background(220);
  displayQuestion();
  displayFeedback();
}

function displayQuestion() {
  if (currentQuestionIndex < questions.length) {
    let question = questions[currentQuestionIndex].question;
    textSize(32);
    textAlign(CENTER);
    text(question, width / 2, height / 2 - 50);
    
    if (isAnswering) {
      textSize(24);
      text("你的答案: " + playerAnswer, width / 2, height / 2 + 50);
    }
  } else {
    textSize(32);
    text("測驗結束！", width / 2, height / 2);
  }
}

function displayFeedback() {
  if (feedbackMessage) {
    textSize(24);
    fill(feedbackMessage.includes("錯誤") ? 'red' : 'green');
    text(feedbackMessage, width / 2, height / 2 + 100);
  }
}

function keyPressed() {
  if (keyCode === ENTER && isAnswering) {
    checkAnswer();
  } else if (keyCode === BACKSPACE) {
    playerAnswer = playerAnswer.slice(0, -1);
  } else if (keyCode >= 48 && keyCode <= 57) { // 0-9
    playerAnswer += key;
  } else if (keyCode === ESCAPE) {
    resetGame();
  }
}

function checkAnswer() {
  let currentQuestion = questions[currentQuestionIndex];
  if (playerAnswer === currentQuestion.answer) {
    feedbackMessage = currentQuestion.correctFeedback;
  } else {
    feedbackMessage = currentQuestion.incorrectFeedback + " 提示: " + currentQuestion.hint;
  }
  currentQuestionIndex++;
  playerAnswer = '';
  isAnswering = false;

  if (currentQuestionIndex < questions.length) {
    dialogueMgr.setQuestion(questions[currentQuestionIndex].question);
    isAnswering = true;
  } else {
    feedbackMessage = "測驗結束！謝謝參加！";
  }
}

function loadQuestions() {
  // Load questions from CSV file
  loadTable('data/questions.csv', 'csv', 'header', (table) => {
    for (let r = 0; r < table.getRowCount(); r++) {
      let question = table.getString(r, 'question');
      let answer = table.getString(r, 'answer');
      let correctFeedback = table.getString(r, 'correctFeedback');
      let incorrectFeedback = table.getString(r, 'incorrectFeedback');
      let hint = table.getString(r, 'hint');
      questions.push({ question, answer, correctFeedback, incorrectFeedback, hint });
    }
    dialogueMgr.setQuestion(questions[currentQuestionIndex].question);
    isAnswering = true;
  });
}

function resetGame() {
  currentQuestionIndex = 0;
  playerAnswer = '';
  feedbackMessage = '';
  loadQuestions();
}