// src/quizManager.js
class QuizManager {
  constructor(csvFile) {
    this.questions = [];
    this.currentQuestion = null;
    this.loadQuestions(csvFile);
  }

  loadQuestions(csvFile) {
    loadTable(csvFile, 'csv', 'header', (table) => {
      for (let r = 0; r < table.getRowCount(); r++) {
        const question = table.getString(r, 'question');
        const answer = table.getString(r, 'answer');
        const correctFeedback = table.getString(r, 'correctFeedback');
        const incorrectFeedback = table.getString(r, 'incorrectFeedback');
        const hint = table.getString(r, 'hint');

        this.questions.push({
          question,
          answer,
          correctFeedback,
          incorrectFeedback,
          hint
        });
      }
      this.selectRandomQuestion();
    });
  }

  selectRandomQuestion() {
    const randomIndex = floor(random(this.questions.length));
    this.currentQuestion = this.questions[randomIndex];
  }

  checkAnswer(playerAnswer) {
    if (playerAnswer === this.currentQuestion.answer) {
      return {
        isCorrect: true,
        feedback: this.currentQuestion.correctFeedback
      };
    } else {
      return {
        isCorrect: false,
        feedback: this.currentQuestion.incorrectFeedback,
        hint: this.currentQuestion.hint
      };
    }
  }

  getCurrentQuestion() {
    return this.currentQuestion ? this.currentQuestion.question : null;
  }
}

export default QuizManager;