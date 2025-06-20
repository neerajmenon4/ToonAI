# Toon AI Chatbot

A React-based chatbot application featuring a cartoon character with lip-sync animation that responds to user input using Groq's AI and text-to-speech capabilities.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Features

- Modern, clean UI with a cartoon character in the middle of the screen
- Text input for user messages at the bottom
- AI-powered responses using Groq's API
- Text-to-speech conversion for the chatbot's responses
- Lip-sync animation synchronized with the speech

## Setup

### Prerequisites

- Node.js and npm installed
- A Groq API key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser
5. Enter your Groq API key when prompted

## How It Works

1. The user types a message in the text input field
2. The message is sent to Groq's API for processing
3. The AI generates a response
4. The response is converted to speech using Groq's text-to-speech API
5. The cartoon character's mouth animates in sync with the speech

## Technologies Used

- React.js with TypeScript
- Styled Components for styling
- Framer Motion for animations
- Groq API for AI responses
- Groq Text-to-Speech API for voice synthesis

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

For more information about Groq's API, visit the [Groq documentation](https://console.groq.com/docs/overview).
