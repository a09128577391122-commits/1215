# p5 Quiz Game

## Overview
The p5 Quiz Game is an interactive game that features two characters engaging in a quiz format. Character 2 asks questions generated from a CSV file, and Character 1 must input the correct answers. Feedback is provided based on the player's responses.

## Features
- Two characters with dialogue interactions.
- Quiz questions generated from a CSV file.
- Real-time feedback on answers (correct or incorrect).
- Hints provided for each question.
- Responsive user interface.

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd p5-quiz-game
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Generate Questions**
   Use the `generate_questions.js` script to create the `questions.csv` file with random questions:
   ```bash
   node tools/generate_questions.js
   ```

4. **Run the Game**
   Open `index.html` in a web browser to start the game.

## File Structure
- **index.html**: Main HTML document for the game.
- **package.json**: Configuration file for npm dependencies.
- **data/questions.csv**: Contains quiz questions and answers.
- **src/**: Contains JavaScript files for game logic, dialogue management, and UI.
- **styles/style.css**: CSS styles for the game interface.
- **tools/generate_questions.js**: Script to generate quiz questions.

## Usage
- Interact with the characters by answering quiz questions.
- Type your answers in the input field and press Enter.
- Receive feedback based on your answers.

## License
This project is licensed under the MIT License.