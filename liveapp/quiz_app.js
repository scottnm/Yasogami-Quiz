'use strict';

/**
 * @param name {string} The name of the character
 * @param description {string} The description of the user who identifies with
 * 	      this character
 * @param percentageThreshold {number} The upper score limit for this character.
 * 		  e.g. Teddie's is 12 so scores between 0-12% are Teddie scores.
 * @param image {string} Url of the image.
 * @constructor
 */
var Character = function(name, description, percentageThreshold, image) {
	this.name = name;
	this.description = description;
	this.percentageThreshold = percentageThreshold;
	this.image = image;
};

/**
 * @param month {string} the month this question falls under
 * @param question {string} The text of the question
 * @param answers {Array<string>} The text answer choices
 * @param correctIndex {number} Which answer in the answers array is correct
 * @constructor
 */
var Question = function(month, question, answers, correctIndex) {
	this.month = month;
	this.question = question;
	this.answers = answers;
	this.correctIndex = correctIndex;
	this.element = null;
}

/**
 * Take all of the data from the character JSON and turn it into an array of
 * Character objects
 */
var processCharacters = function(charJSON) {
	for (var charIdx in charJSON.characters) {
		var chr = charJSON.characters[charIdx];
		characters.push(new Character(chr.name, chr.description, chr.percentageThreshold, chr.image));
	}
};

/**
 * Take all the data from the question JSON and turn it into an array of
 * Question objects
 */
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

/**
 * Take each of the questions and build them into the DOM
 * as a question card.
 */
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

/**
 * Shuffle the question array so that on each run of the webpage,
 * the order of the questions is different.
 */
function shuffleQuestions() {
	var tempArr = [];
	while (questions.length) {
		var shuffleIndex = Math.floor(Math.random() * questions.length);
		tempArr.push(questions.splice(shuffleIndex, 1)[0]);
	}
	questions = tempArr;
}

/**
 * Choose which element to display first when the page loads.
 * Currently this is just chosen from the first question
 */
function selectInitialElement() {	
	currentQuestion = questions[0].element;
	currentQuestion.setAttribute('data-state', 'active');
	currentQuestionIndex = 0;
}

/**
 * When the previous button is clicked,
 * slide the current card to the right and
 * slide the previous card from the left.
 * 
 * Sliding effect achieved through CSS
 */
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

/**
 * When the next button is clicked,
 * slide the current card to the left and
 * slide the next card from the right.
 * 
 * Sliding effect achieved through CSS
 */
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

/**
 * When the submit button is clicked,
 * calculate the user's score and display the results
 */
function submitButtonHandler() {
	var numCorrect = 0;
	for(var i in questions) {
		if(correctAnswer(questions[i])) {
			numCorrect += 1;
		}
	}
	var score = (numCorrect / questions.length)*100;
	var result = determineCharacter(score);
	constructResultDom(result, score);
}

/**
 * When the restart button is clicked,
 * reset the webpage.
 */
 function restartButtonHandler() {
	 location.reload();
 }

/**
 * For a single question, determine if the user has selected
 * the correct choice.
 * @param question {Question} the question
 * @return {boolean}
 */
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

/**
 * Given a user's score determine the corresponding character
 * using each of the character's percentage thresholds.
 * @param score {number} The score to check against.
 * @return {Character}
 */
function determineCharacter(score) {
	for (var i in characters) {
		if (score - characters[i].percentageThreshold <= 0) {
			return characters[i];
		}
	}
}

/**
 * Given the resulting character, display an appropriate
 * results card.
 */
function constructResultDom(resultChar, score) {
	// outer card container
	var card = document.createElement('div');
	card.classList.add('question');
	card.classList.add('result');
	card.setAttribute('data-state', 'next');
	
	// image section
	var imgContainer = document.createElement('div');
	imgContainer.setAttribute('id', 'img-container');
	var img = document.createElement('img');
	img.setAttribute('src', resultChar.image);
	imgContainer.appendChild(img);
	card.appendChild(imgContainer);
	
	// info text section
	var infoContainer = document.createElement('div');
	infoContainer.setAttribute('id', 'info-container');
	var header = document.createElement('h2');
	header.innerText = 'Your score is... ' + Math.round(score) + '% correct';
	infoContainer.appendChild(header);
	var desc = document.createElement('p');
	desc.innerText = resultChar.description;
	infoContainer.appendChild(desc);
	card.appendChild(infoContainer);
	
	document.querySelector('.question-lane').appendChild(card);
	
	/* 
	 * seperate the data-state changes,
	 * so that the transition looks smooth
	 */
	currentQuestion.setAttribute('data-state', 'prev');
	
	createResetButton();
	
	/* other half of the transition */
	card.setAttribute('data-state', 'active');	
}

/**
 * Replace the buttons in the button bar with
 * a new restart button
 */
function createResetButton() {
	var icon = document.createElement('span');
	icon.classList.add('glyphicon');
	icon.classList.add('glyphicon-repeat');
	var restartButton = document.createElement('button');
	restartButton.classList.add('btn');
	restartButton.appendChild(icon);
	restartButton.innerHTML = restartButton.innerHTML + 'Restart';
	restartButton.addEventListener('click', restartButtonHandler);
	var buttonWrapper = document.createElement('div');
	buttonWrapper.appendChild(restartButton);
	var buttonBar = document.querySelector('.button-bar');
	buttonBar.innerHTML = '';
	buttonBar.appendChild(buttonWrapper);
}

processCharacters(charData);
processQuestions(questionData);
shuffleQuestions();
constructDom();
selectInitialElement();

