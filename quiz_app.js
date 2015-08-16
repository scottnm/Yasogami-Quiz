'use strict';

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
		var questionHeader = document.createElement('h2');
		questionHeader.innerText = question.question;
		questionContainer.appendChild(questionHeader);
		var answerContainer = document.createElement('div');
		for (var j in question.answers) {
			var answerWrapper = document.createElement('div');
			var answerChoice = document.createElement('input');
			answerChoice.type = 'radio';
			answerChoice.name = '' + i;
			answerChoice.id = i + '_' + j;
			var answerText = document.createElement('span');
			answerText.innerHTML = question.answers[j];
			answerWrapper.appendChild(answerChoice);
			answerWrapper.appendChild(answerText);
			answerWrapper.classList.add('radio');
			answerContainer.appendChild(answerWrapper);
		}
		questionContainer.appendChild(answerContainer);
		document.querySelector('.content-lane').appendChild(questionContainer);
	}	
}

processCharacters(charData);
processQuestions(questionData);

constructDom();