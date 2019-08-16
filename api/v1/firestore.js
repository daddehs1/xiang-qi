var math = require('mathjs');

var admin = require("firebase-admin");
var serviceAccount = require("../firestore-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xiangqi-firestore.firebaseio.com"
});
var db = admin.firestore();

const fs = {

  async registerGame(gameID, redID, blackID) {
    var gameRef = db.collection('games').doc(gameID);
    var blackPlayerRef = db.collection('players').doc(blackID);
    var redPlayerRef = db.collection('players').doc(redID);

    var docSnapshot = await gameRef.get();
    if (!docSnapshot.exists) {
      gameRef.set({
        moves: [],
        redID,
        blackID
      })

      redPlayerRef.set({
        gameID,
        opponentID: blackID,
        playerColor: 1
      })

      blackPlayerRef.set({
        gameID,
        opponentID: redID,
        playerColor: 0
      })
    }
  },

  //TODO add exit listeners
  listenToGame(gameID, callback) {
    var gameRef = db.collection('games').doc(gameID);
    gameRef.onSnapshot(docSnapshot => callback(docSnapshot.get('moves')));
  },

  async loadGameFromPlayerID(playerID) {
    var playerRef = db.collection('players').doc(playerID);
    var docSnapshot = await playerRef.get()
    var gameInfo = false;
    if (docSnapshot.exists) {
      gameInfo = docSnapshot.data();
    }
    return gameInfo
  },

  pushMoveToGame(gameID, moveString) {
    var gameRef = db.collection('games').doc(gameID);
    var currentSeconds = math.round(new Date().getTime() / 1000);

    var created = new admin.firestore.Timestamp(currentSeconds, 0);
    gameRef.update({
      moves: admin.firestore.FieldValue.arrayUnion({
        moveString,
        created
      })
    });
  }
}

module.exports = fs;