'use strict';

var Character = function(name, description, percentageThreshold, image) {
	this.name = name;
	this.description = description;
	this.percentageThreshold = percentageThreshold;
	this.image = image;
};

var Question = function(month, question, answers, correctIndex) {
	this.month = month;
	this.question = question;
	this.answers = answers;
	this.correctIndex = correctIndex;
	this.element = null;
}

var processCharacters = function(charJSON) {
	for (var charIdx in charJSON.characters) {
		var chr = charJSON.characters[charIdx];
		characters.push(new Character(chr.name, chr.description, chr.percentageThreshold, chr.image));
	}
};

var processQuestions = function(questionJSON) {
	for (var month in questionJSON.months) {
		for (var i in questionJSON.months[month]) {
			var question = questionJSON.months[month][i];
			questions.push(new Question(month, question.question, question.answers, question.correctIndex));
		}
	}
};

var currentQuestion = null;
var currentQuestionIndex = 0;
var characters = [];
var questions = [];
var prevButton = document.querySelector('button#prev');
prevButton.addEventListener('click', prevButtonHandler);
var nextButton = document.querySelector('button#next');
nextButton.addEventListener('click', nextButtonHandler);
var submitButton = document.querySelector('button#submit');
submitButton.addEventListener('click', submitButtonHandler);

function constructDom() {
	for(var i in questions) {
		var question = questions[i];
		var questionContainer = document.createElement('div');
		questionContainer.classList.add('question');
		questionContainer.setAttribute('data-state', 'next');
		questionContainer.setAttribute('id', i);
		var questionNumber = document.createElement('h3');
		questionContainer.appendChild(questionNumber);
		questionNumber.innerText = 'Question ' + (Number(i)+1);
		var questionHeader = document.createElement('h2');
		questionHeader.innerText = question.question;
		questionContainer.appendChild(questionHeader);
		var answerContainer = document.createElement('div');
		for (var j in question.answers) {
			var answerWrapper = document.createElement('div');
			var answerChoice = document.createElement('input');
			answerChoice.setAttribute('type', 'radio');
			answerChoice.setAttribute('name', i);
			answerChoice.setAttribute('id', i + '_' + j);
			var answerText = document.createElement('span');
			answerText.innerHTML = question.answers[j];
			answerWrapper.appendChild(answerChoice);
			answerWrapper.appendChild(answerText);
			answerWrapper.classList.add('radio');
			answerContainer.appendChild(answerWrapper);
		}
		questionContainer.appendChild(answerContainer);
		questionContainer.addEventListener('transitionend', function(e) {
			e.target.setAttribute('data-hidden', 'true');
		});
		document.querySelector('.question-lane').appendChild(questionContainer);
		questions[i].element = questionContainer;
	}
}

function shuffleQuestions() {
	var tempArr = [];
	while (questions.length) {
		var shuffleIndex = Math.floor(Math.random() * questions.length);
		tempArr.push(questions.splice(shuffleIndex, 1)[0]);
	}
	questions = tempArr;
}

function selectInitialElement() {	
	currentQuestion = questions[0].element;
	currentQuestion.setAttribute('data-state', 'active');
	currentQuestionIndex = 0;
}

function prevButtonHandler() {
	currentQuestion.setAttribute('data-state', 'next');
	currentQuestionIndex -= 1;
	currentQuestion = questions[currentQuestionIndex].element;
	currentQuestion.removeAttribute('data-hidden');
	currentQuestion.setAttribute('data-state', 'active');
	if (!currentQuestionIndex) {
		prevButton.disabled = true;
	}
	nextButton.disabled = false;
	submitButton.disabled = true;
}

function nextButtonHandler() {
	currentQuestion.setAttribute('data-state', 'prev');
	currentQuestionIndex += 1;
	currentQuestion = questions[currentQuestionIndex].element;
	currentQuestion.removeAttribute('data-hidden');
	currentQuestion.setAttribute('data-state', 'active');	
	if (currentQuestionIndex ===  (questions.length - 1)) {
		nextButton.disabled = true;
		submitButton.disabled = false;
	}
	prevButton.disabled = false;
}

function submitButtonHandler() {
	debugger;
	var numCorrect = 0;
	for(var i in questions) {
		if(correctAnswer(questions[i])) {
			numCorrect += 1;
		}
	}
	var score = (numCorrect / questions.length)*100;
	var result = determineCharacter(score);
	constructResultCard(result);
}

function correctAnswer(question) {
	var choices = question.element.querySelectorAll('input');
	var guess = -1;
	for(var i in choices) {
		var choice = choices[i];
		if (choice.checked) {
			guess = i;
		}
	}
	return guess === question.correctIndex;
}

function determineCharacter(score) {
	for (var i in characters) {
		if (score - characters[i].percentageThreshold <= 0) {
			return characters[i];
		}
	}
}

function constructResultCard(result) {
	document.body.remove();
	console.log(result);
}

processCharacters(charData);
processQuestions(questionData);
shuffleQuestions();
constructDom();
selectInitialElement();

