// Quiz API URL
const API_URL = 'https://opentdb.com/api.php?amount=10&category=16&difficulty=easy&type=multiple';

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const progressBar = document.getElementById('progress-bar');
const scoreboard = document.getElementById('scoreboard');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from the API
async function fetchQuestions() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        questions = data.results;
        showQuestion();
    } catch (error) {
        questionElement.textContent = 'Failed to load questions. Please try again later.';
        console.error('Error fetching questions:', error);
    }
}

// Show the current question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showFinalScore();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
        .sort(() => Math.random() - 0.5);

    answersElement.innerHTML = '';

    answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer';
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        button.onclick = () => handleAnswerClick(answer === currentQuestion.correct_answer);
        answersElement.appendChild(button);
    });

    updateProgressBar();
}

// Handle answer click
function handleAnswerClick(isCorrect) {
    if (isCorrect) score++;
    currentQuestionIndex++;
    showQuestion();
}

// Show final score
function showFinalScore() {
    questionElement.textContent = `Quiz Complete! Your final score is ${score}/${questions.length}.`;
    answersElement.innerHTML = '';
    progressBar.style.width = '100%';
}

// Update the progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex / questions.length) * 100).toFixed(2);
    progressBar.style.width = `${progress}%`;
    scoreboard.textContent = `Score: ${score}/${questions.length}`;
}

// Initialize the quiz
fetchQuestions();