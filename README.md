test web Socket 

1 - For connect with de WS use de url ws://localhost:8080/

2 - For init de connection with de WS use the message : { "serviceID": "init_connection" } , this will show all de serviceID available

3 - For register a player user the message { "serviceID": "register_player", "player": "jorge" }, this will return the first question like :
{
  "state": "ok",
  "message": {
    "playerID": "jorge",
    "question": "When was the first sherk movie?",
    "options": [
      "1 - 2001",
      "2 - 2005",
      "3 - 2015",
      "4 - 2007"
    ],
    "questionID": 1
  }
}
 You have to answer de question of atributte with any position of the array answer ( atributte options )

 4 - For response the question use a message like { "serviceID": "answer_question", "player": "teresa", "questionID": 1, "answerID": 1 } 

 {
  "serviceID": "answer_question",
  "player": "teresa", // player registered to answer the current question
  "questionID": 1, // question id of the current question, this will sended in the previous response web socket 
  "answerID": 1 // answer selected,for example if you want to send the option "1 - 2001" send 1,if you want send the option "3 - 2015", send 3
}

5 - you will receive the next question and the result of the previous answer

{
  "state": "ok",
  "message": {
    "playerID": "jorge", //id player
    "question": "How many children did Sherk have?", // new question
    "options": [ //new options
      "1 - 1",
      "2 - 2",
      "3 - 3",
      "4 - 5"
    ],
    "questionID": 2, // id current question
    "resultAnswer": "RIGHT" // result previous question
  }
}
6 - For response the question use a message like { "serviceID": "answer_question", "player": "teresa", "questionID": 1, "answerID": 1 } 
until you finished all the questions, finishing all the question you will receive you final score

7 - When answering each question, the WS will send to all the connections the score of each player

8 - For get a list with track data of the players , send a message like { "serviceID": "show_players" }

9 - You can disconnect the connection and continue answering the questions, the WS persist the client data

10 - For create a container the aplication, run the commands :
      docker build -t <your username>/node-web-app .
      docker run -p 49160:8080 -d <your username>/node-web-app

11 - For run the application in local enviroment, run the commands : 
      npm i 
      node app.js      


