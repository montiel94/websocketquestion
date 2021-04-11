

const { readFileDB, saveDB, initAsks } = require('./database-controller');
const { _, last } = require('lodash');

const increasePlayerPoints = (player,responseValue) => {
    player.score =  player.score + responseValue;
    player.TrackAskID++;
    updatePlayer(player);
}


const updatePlayer = (player) => {
    const data = readFileDB();
    let playersDB = _.get(data, 'players', []);
    _.remove(playersDB, function (playerDB) {
        return playerDB.player == player.player;
    });
    playersDB.push(player);
    data.players = playersDB;
    saveDB(data);
    initAsks();
}

const getPlayer = (playerID) => {
    const data = readFileDB();
    const player = data.players.find(player => player.player == playerID);
    return player;
}

const getPlayersWithAnswer = () => {
    const data = readFileDB();
    const players = data.players;
    const playersWithAnwers = players.map(player => {
        return {
            player : player.player,
            correctAnswer : player.score
        }
    });
    return playersWithAnwers;
}

const validateTrackingQuestionPlayer = (player, questionID) => {
    const LASTQUESTION = 6;
    const trackPlayer = player.TrackAskID;
    if ( trackPlayer == LASTQUESTION) {
        return 1;
    } else if ( questionID != trackPlayer) {
        return 2;
    } else if ( trackPlayer == questionID ){
        return 3;
    }
}

module.exports = {
    increasePlayerPoints,
    getPlayer,
    validateTrackingQuestionPlayer,
    updatePlayer,
    getPlayersWithAnswer
}