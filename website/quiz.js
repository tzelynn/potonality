const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const navBack = document.getElementById("back")
const navNext = document.getElementById("next")
const progressBar = document.getElementById("progressBar");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const quiz = document.getElementById("quiz");
const image = document.getElementById("qnImage");
const WIDTH = 100;

let currentQuestion = {};
let questionCounter = -1;
let availableQuestions = [];
let previousChoice;
let collectedAnswers = {};
let questions = [];
const MAX_QUESTIONS = 2;

// Fetch questions in advance
fetch("assets/questions.json")
    .then(res => res.json())
    .then(loadedQuestions => {
        questions = loadedQuestions;
        startQuiz();
    })
    .catch(err => {
        console.error(err);
    });


let startQuiz = () => {
    questionCounter = -1;
    availableQuestions = [...questions]; // copies out the question array
    navBack.hidden = true;
    navNext.hidden = true;
    getNewQuestion();
}


let getNewQuestion = () => {
    loader.style.display = "flex";
    quiz.hidden = true;
    if (questionCounter === availableQuestions.length - 1) {
        localStorage.setItem("collectedAnswers", JSON.stringify(collectedAnswers));
        return window.location.assign('end.html', 500)
    }
    if (questionCounter >= 0) {
        navBack.hidden = false;
    }
    previousChoice = null;
    questionCounter++;
    currentQuestion = availableQuestions[questionCounter];
    question.innerText = currentQuestion.question;
    image.src = `assets/qn_imgs/${questionCounter + 1}.PNG`
    choices.forEach(choice => {
        let choiceNum = choice.dataset.number;
        choice.classList.remove("selected");
        if (choiceNum === collectedAnswers[currentQuestion.id]) {
            choice.classList.add("selected");
            previousChoice = choice;
        }
        choice.innerText = currentQuestion["choice" + choiceNum];
    })
    if (previousChoice) {
        navNext.hidden = false;
    } else {
        navNext.hidden = true;
    }
    progressBarFull.style.width = `
        ${(questionCounter + 1) / availableQuestions.length * WIDTH}%`

    loader.style.display = "none";
    progressBar.hidden = false;
    quiz.hidden = false;
    quiz.style.display = "flex";
    selectAnswer();
}


let getPrevQuestion = () => {
    if (questionCounter > 1) {
        navBack.hidden = false;
    } else {
        navBack.hidden = true;
    }
    navNext.hidden = false;
    previousChoice = null;
    questionCounter--;
    currentQuestion = availableQuestions[questionCounter];
    question.innerText = currentQuestion.question;
    image.src = `assets/qn_imgs/${questionCounter + 1}.PNG`
    choices.forEach(choice => {
        let choiceNum = choice.dataset.number;
        choice.classList.remove("selected");
        if (choiceNum === collectedAnswers[currentQuestion.id]) {
            choice.classList.add("selected");
            previousChoice = choice;
        }
        choice.innerText = currentQuestion["choice" + choiceNum];
    })
    progressBarFull.style.width = `
        ${(questionCounter + 1) / availableQuestions.length * WIDTH}%`
    selectAnswer(currentQuestion);
}


let selectAnswer = () => {
    choices.forEach(choice => {
        choice.addEventListener("click", selectChoiceHandler)
    })
}


let selectChoiceHandler = ev => {
    if (previousChoice) {
        previousChoice.classList.remove("selected");
    }
    const selectedChoice = ev.target;
    previousChoice = selectedChoice
    const selectedAnswer = selectedChoice.dataset.number;
    console.log(selectedChoice);
    collectedAnswers[currentQuestion.id] = selectedAnswer;
    console.log(collectedAnswers);

    selectedChoice.classList.add("selected");
    console.log(choices)
    navNext.hidden = false;
}


navNext.addEventListener("click", ev => {
    choices.forEach(choice => {
        choice.removeEventListener("click", selectChoiceHandler);
    })
    getNewQuestion();
})


navBack.addEventListener("click", ev => {
    choices.forEach(choice => {
        choice.removeEventListener("click", selectChoiceHandler);
    })
    getPrevQuestion();
})
