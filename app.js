const WebSocket = require('ws');
const { _ } = require('lodash');
const { readFileDB, saveDB, initAsks } = require('./controller/database-controller');
const { increasePlayerPoints, getPlayer, validateTrackingQuestionPlayer,
        updatePlayer, getPlayersWithAnswer } = require('./controller/player-controller');
const { getQuestion, validateNextQuestion } = require('./controller/question-controller');

const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', function connection(ws) {
    console.log('client conected');
    ws.on('message', function incoming(message) {
        try {
            const jsonMessage = JSON.parse(message);
            const { serviceID } = jsonMessage;
            console.log(serviceID);
            switch (serviceID) {
                case 'init_connection':
                    ws.send(JSON.stringify({
                        state: 'ok',
                        message: {
                            services: [{
                                name: 'init_connection',
                                description: 'show status and websocket services',
                                exampleMessageInput: '{ "serviceID": "init_connection" }'
                            },
                            {
                                name: 'register_player',
                                description: 'register a user',
                                exampleMessageInput: '{ "serviceID": "register_player", user : "namerUser" }'
                            },
                            {
                                name: 'answer_question',
                                description: 'validate response and show next question',
                                exampleMessageInput: ' { "serviceID": "answer_question", "player": "letmar", "questionID": 1, "answerID": 1 }'
                            },
                            {
                                name: 'show_players',
                                description: 'show players and scores',
                                exampleMessageInput: '{ "serviceID": "show_players" }'
                            }]
                        }
                    }));
                    break;
                case 'init_play':
                    initPlay(jsonMessage, ws);
                    break;
                case 'register_player':
                    registerPlayer(jsonMessage, ws);
                    break;
                case 'answer_question':
                    answerQuestion(jsonMessage, ws);
                    break;
                case 'show_players':
                    showPlayers(ws);
                    break;    
            }
        } catch (error) {
            console.log(error);
        }
    });
});

function initPlay(jsonMessage, ws) {
    console.log('initPlay');
    const player = _.get(jsonMessage, 'player', false);
    if (!player) {
        ws.send(JSON.stringify({
            state: 'ok',
            message: 'please register an user to play with the service register_player'
        }));
    }
}

function registerPlayer(jsonMessage, ws) {
    const playerID = _.get(jsonMessage, 'player', false);
    const data = readFileDB();
    let playersDB = _.get(data, 'players', []);
    _.remove(playersDB, function (playerDB) {
        return playerDB.player == playerID;
    });
    playersDB.push({
        player: playerID,
        TrackAskID: 1,
        score: 0
    });
    console.log(playersDB);
    data.players = playersDB;
    saveDB(data);
    initAsks();
    sendQuestion(playerID, 1, ws);
}

function sendQuestion(playerID, questionID, ws) {
    const data = readFileDB();
    const question = data.asks.find(question => question.trackID === questionID);
    ws.send(JSON.stringify({
        state: 'ok',
        message: {
            playerID,
            question: question.ask,
            options: question.answers,
            questionID
        }
    }));
}


function answerQuestion(jsonMessage, ws) {
    const data = readFileDB();
    const playerID = _.get(jsonMessage, 'player', false);
    const questionID = _.get(jsonMessage, 'questionID', false);
    const answerID = _.get(jsonMessage, 'answerID', false);
    const question = data.asks.find(question => question.trackID === questionID);
    const player = data.players.find(player => player.player == playerID);
    const trackingStatePlayer = validateTrackingQuestionPlayer(player, questionID);
    switch (trackingStatePlayer) {
        case 3 : // state ok of question received and question tracking player
            const resultAnswer = validateAnswer(player, question, answerID);
            const nextQuestion = validateNextQuestion(question);
            broadcastLeaderboard();
            if (nextQuestion == 'lastQuestion') {
                const updatedPlayer = getPlayer(playerID);
                ws.send(JSON.stringify({
                    state: 'ok',
                    message: `the previous answer was ${resultAnswer} , you finished the questions,  your score was ${updatedPlayer.score}`
                }));
            } else {
                console.log(nextQuestion);
                ws.send(JSON.stringify({
                    state: 'ok',
                    message: {
                        playerID,
                        question: nextQuestion.ask,
                        options: nextQuestion.answers,
                        questionID: nextQuestion.trackID,
                        resultAnswer
                    }
                }));
            }
            break;
        case 1 : // player finished  questions  
            ws.send(JSON.stringify({
                state: 'ok',
                message: `you finished your questions previously, your score was ${player.score}`
            }));
            break;
        case 2 : // client sent response outside of their tracking
            ws.send(JSON.stringify({
                state: 'ok',
                message: `client sent response outside of their tracking, you should send question answer ${player.TrackAskID}`
            }));
            break;        
    }
}

function validateAnswer(player, question, answerID) {
    if ((answerID - 1) === question.correctAnswerPosition) {
        console.log('Correct answer');
        increasePlayerPoints(player, question.responseValue);
        return 'RIGHT'
    } else {
        player.TrackAskID++;
        updatePlayer(player);
        console.log('Incorrect answer');
        return 'WRONG'
    }
}

function broadcastLeaderboard() {
    const players = getPlayersWithAnswer();
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            state: 'ok',
            message: players
        }));
        }
    });
}

function showPlayers(ws) {
    const players = getPlayersWithAnswer();
    ws.send(JSON.stringify({
        state: 'ok',
        message: players
    }));
}