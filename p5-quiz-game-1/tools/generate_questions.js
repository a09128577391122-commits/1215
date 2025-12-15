const fs = require('fs');
const path = require('path');

// Function to generate random addition questions
function generateQuestions(numQuestions) {
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        const question = `${num1} + ${num2}`;
        const answer = num1 + num2;
        const correctFeedback = "正確！";
        const incorrectFeedback = "錯誤，請再試一次。";
        const hint = `提示：答案是 ${answer} 的一個數字。`;

        questions.push({ question, answer, correctFeedback, incorrectFeedback, hint });
    }
    return questions;
}

// Function to write questions to CSV file
function writeQuestionsToCSV(questions, filePath) {
    const csvContent = questions.map(q => 
        `${q.question},${q.answer},${q.correctFeedback},${q.incorrectFeedback},${q.hint}`
    ).join('\n');

    fs.writeFileSync(filePath, csvContent, 'utf8');
}

// Main execution
const numQuestions = 10; // Number of questions to generate
const questions = generateQuestions(numQuestions);
const csvFilePath = path.join(__dirname, '../data/questions.csv');
writeQuestionsToCSV(questions, csvFilePath);

console.log(`成功生成 ${numQuestions} 道題目並寫入 ${csvFilePath}`);