const { readFileDB, saveDB, initAsks } = require('./database-controller');
const { _ } = require('lodash');

const getQuestion = (questionID) => {
    if ( questionID ) {
    const data = readFileDB();
    const question = data.asks.find(question => question.trackID === questionID);
    return question; 
    } else {
        throw new Error('se necesita nueva questioID');
    }
}

const validateNextQuestion = (currentQuestion) => {
    if (currentQuestion) {
        if (currentQuestion.trackID == 5) { return 'lastQuestion' } else {
            return getQuestion(currentQuestion.trackID + 1);
        }
    } else {
        throw new Error('se necesita nueva questioID');
    }
};

module.exports = {
    getQuestion,
    validateNextQuestion
}