class DialogueManager {
  constructor() {
    this.isActive = false;
    this.currentQuestion = null;
    this.feedbackMessage = '';
    this.hintMessage = '';
    
    // Create HTML structure for dialogue
    this.container = createDiv('');
    this.container.id('dialogue-box');
    this.container.style('display', 'none');

    this.questionBox = createDiv('');
    this.answerInput = createInput('');
    this.submitButton = createButton('Submit');
    this.feedbackBox = createDiv('');
    this.hintBox = createDiv('');

    this.container.child(this.questionBox);
    this.container.child(this.answerInput);
    this.container.child(this.submitButton);
    this.container.child(this.feedbackBox);
    this.container.child(this.hintBox);

    // Bind events
    this.submitButton.mousePressed(() => this.checkAnswer());
  }

  open(question) {
    this.isActive = true;
    this.currentQuestion = question;
    this.questionBox.html(question.question);
    this.feedbackBox.html('');
    this.hintBox.html('');
    this.answerInput.value('');
    this.container.style('display', 'block');
    this.answerInput.elt.focus();
  }

  close() {
    this.isActive = false;
    this.container.style('display', 'none');
  }

  checkAnswer() {
    const playerAnswer = this.answerInput.value().trim();
    if (playerAnswer === this.currentQuestion.answer) {
      this.feedbackMessage = this.currentQuestion.correctFeedback;
    } else {
      this.feedbackMessage = this.currentQuestion.incorrectFeedback;
      this.hintMessage = this.currentQuestion.hint;
    }
    this.updateFeedback();
  }

  updateFeedback() {
    this.feedbackBox.html(this.feedbackMessage);
    this.hintBox.html(this.hintMessage);
  }
}