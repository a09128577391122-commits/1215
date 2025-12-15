// utils.js
function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    loadStrings(filePath, (data) => {
      if (data) {
        const questions = data.map(line => {
          const [question, answer, correctFeedback, incorrectFeedback, hint] = line.split(',');
          return { question, answer, correctFeedback, incorrectFeedback, hint };
        });
        resolve(questions);
      } else {
        reject('Failed to load CSV data');
      }
    });
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}