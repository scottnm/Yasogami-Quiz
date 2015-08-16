'use strict';

var currentQuestion = null;
var characters = [];
var questions = [];

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
		var char = charJSON.characters[charIdx];
		characters.push(new Character(char.name, char.description, char.percentageThreshold, char.image));
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

function constructDom() {
	for(var i in questions) {
		var question = questions[i];
		var questionContainer = document.createElement('div');
		questionContainer.classList.add('question');
		questionContainer.setAttribute('data-state', 'prev');
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
	var currentQuestion = questions[0].element;
	currentQuestion.setAttribute('data-state', 'active');
}

processCharacters(charData);
processQuestions(questionData);
shuffleQuestions();
constructDom();
selectInitialElement();