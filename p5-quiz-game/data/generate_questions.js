// This file generates random quiz questions and writes them to questions.csv

const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

const questions = [];
const numberOfQuestions = 10; // Number of questions to generate

for (let i = 0; i < numberOfQuestions; i++) {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const question = `${num1} + ${num2}`;
    const answer = num1 + num2;
    const correctFeedback = "正確！你真聰明！";
    const incorrectFeedback = "錯誤！再試一次！";
    const hint = `提示：答案是 ${answer} 的一個數字。`;

    questions.push({
        question,
        answer,
        correctFeedback,
        incorrectFeedback,
        hint
    });
}

const csvFilePath = path.join(__dirname, 'questions.csv');
const writer = csvWriter({
    path: csvFilePath,
    header: [
        { id: 'question', title: '題目' },
        { id: 'answer', title: '答案' },
        { id: 'correctFeedback', title: '答對時的回饋' },
        { id: 'incorrectFeedback', title: '答錯時的回饋' },
        { id: 'hint', title: '提示文字' }
    ]
});

writer.writeRecords(questions)
    .then(() => {
        console.log('問題已成功生成並寫入 questions.csv');
    })
    .catch(err => {
        console.error('寫入 CSV 時發生錯誤:', err);
    });