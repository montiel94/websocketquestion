'use strict';

const fs = require('fs');

const archivo = './db/db.json';

const readFileDB = () => {

    if (!fs.existsSync(archivo)) {
        return null;
    }
    const info = fs.readFileSync(archivo, { encoding: 'utf-8' });
    const data = JSON.parse(info);
    return data;
}

const saveDB = (data) => {
    try {
        fs.writeFileSync(archivo, JSON.stringify(data));
    } catch (e) {
        console.log(e);
    }
}

const initAsks = () => {
    let information = readFileDB();
    information.asks = [{
        trackID: 1,
        ask: 'When was the first sherk movie?',
        answers: ['1 - 2001', '2 - 2005','3 - 2015', '4 - 2007'],
        correctAnswerPosition: 0,
        responseValue: 1
    },
    {
        trackID: 2,
        ask: 'How many children did Sherk have?',
        answers: ['1 - 1', '2 - 2','3 - 3', '4 - 5'],
        correctAnswerPosition: 2,
        responseValue: 1
    },
    {
        trackID: 3,
        ask: 'What is the name of Sherk´s best friend?',
        answers: ['1 - Cat with stockings', '2 - Donkey','3 - Fiona', '4 - Ginger'],
        correctAnswerPosition: 1,
        responseValue: 1
    },
    {
        trackID: 4,
        ask: 'Is Sherk´s color yellow?',
        answers: ['1 - True', '2 - False'],
        correctAnswerPosition: 1,
        responseValue: 1
    },
    {
        trackID: 5,
        ask: 'Does Sherk live in a swamp?',
        answers: ['1 - True', '2 - False'],
        correctAnswerPosition: 0,
        responseValue: 1
    }];
    saveDB(information);
}


module.exports = {
    readFileDB,
    saveDB,
    initAsks
}