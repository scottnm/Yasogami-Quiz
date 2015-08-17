// This file was automatically generated from quiz_templates.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace quizApp.
 */

if (typeof quizApp == 'undefined') { var quizApp = {}; }


quizApp.questionCard = function(opt_data, opt_ignored) {
  var output = '<div class="question" data-state="next" id="' + soy.$$escapeHtml(opt_data.questionId) + '"><h3>Question ' + soy.$$escapeHtml(opt_data.questionId + 1) + '</h3><h2>' + soy.$$escapeHtml(opt_data.question.question) + '</h2><div>';
  var answerList12 = opt_data.question.answers;
  var answerListLen12 = answerList12.length;
  for (var answerIndex12 = 0; answerIndex12 < answerListLen12; answerIndex12++) {
    var answerData12 = answerList12[answerIndex12];
    var ansId__soy13 = soy.$$escapeHtml(answerIndex12) + '_' + soy.$$escapeHtml(opt_data.questionId);
    output += quizApp.answerChoice({questionId: opt_data.questionId, ansId: ansId__soy13, ansText: answerData12});
  }
  output += '</div></div>';
  return output;
};
if (goog.DEBUG) {
  quizApp.questionCard.soyTemplateName = 'quizApp.questionCard';
}


quizApp.answerChoice = function(opt_data, opt_ignored) {
  return '<div><input type="radio" name="' + soy.$$escapeHtml(opt_data.questionId) + '" id="' + soy.$$escapeHtml(opt_data.ansId) + '" /><span>' + soy.$$escapeHtml(opt_data.ansText) + '</span></div>';
};
if (goog.DEBUG) {
  quizApp.answerChoice.soyTemplateName = 'quizApp.answerChoice';
}
