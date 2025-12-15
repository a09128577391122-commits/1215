# p5 Quiz Game

## Overview
This project is an interactive quiz game built using p5.js. The game features two characters engaging in a dialogue where one character asks questions sourced from a CSV file, and the other character must provide the correct answers. The game provides feedback based on the player's responses.

## Project Structure
```
p5-quiz-game
├── index.html          # Main HTML document
├── package.json        # npm configuration file
├── .gitignore          # Files to ignore in Git
├── README.md           # Project documentation
├── src                 # Source files for the game
│   ├── sketch.js       # Entry point for the p5.js application
│   ├── dialogueManager.js # Manages dialogue between characters
│   ├── quizManager.js  # Manages quiz questions
│   └── utils.js        # Utility functions
├── data                # Data files
│   ├── questions.csv   # CSV file containing quiz questions
│   └── generate_questions.js # Script to generate quiz questions
├── styles              # CSS styles
│   └── styles.css      # Styles for the game
└── libs                # Libraries
    └── p5.min.js      # Minified p5.js library
```

## Getting Started

### Prerequisites
- Ensure you have Node.js installed on your machine.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd p5-quiz-game
   ```
3. Install the necessary dependencies:
   ```
   npm install
   ```

### Running the Game
1. Open `index.html` in your web browser to start the game.
2. Follow the on-screen instructions to interact with the characters and answer the quiz questions.

## Features
- Interactive dialogue between two characters.
- Quiz questions sourced from a CSV file.
- Feedback provided based on the player's answers.
- Responsive design for various screen sizes.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.