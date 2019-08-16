const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const cors = require('cors');
const bodyParser = require('body-parser');
const firestore = require('./api/v1/firestore')


require('dotenv').config()


// create the express app
const app = express()

app.use(cors());
app.use(bodyParser.json())

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/api', require('./api'))

// create middleware to handle the serving the app
app.use("/", serveStatic(path.join(__dirname, '/dist')))

// Catch all routes and redirect to the index file
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html')
})

// Create default port to serve the app on
const port = process.env.PORT || 80
server.listen(port)

io.on('connection', function(socket) {
  socket.on('clientRequestRegisterGame', async ({
    gameID,
    redID,
    blackID
  }) => {
    await firestore.registerGame(gameID, redID, blackID);
    socket.emit('serverCompleteRegisterGame')
  });

  socket.on('clientListenGame', async ({
    gameID
  }) => {
    var callback = (moves) => {
      socket.emit('serverUpdateGame', {
        moves
      });
    }
    firestore.listenToGame(gameID, callback);
    socket.emit('serverListenGame')
  });

  socket.on('clientLoadGame', async ({
    playerID
  }) => {
    var gameInfo = await firestore.loadGameFromPlayerID(playerID);
    var callback = (moves) => {
      socket.emit('game-updated', {
        moves
      });
    }

    firestore.listenToGame(gameInfo.gameID, callback);
    socket.emit('serverLoadGame', gameInfo)
  });

  // socket.on('game-subscribed', function(payload) {
  //   var callback = (moves) => {
  //     socket.emit('game-updated', {
  //       moves
  //     });
  //   }
  //   firestore.listenToGame(payload.gameID, callback);
  //
  // });

  socket.on('move-made', function(payload) {
    firestore.pushMoveToGame(payload.gameID, payload.moveString);
  });
  socket.on('listen-game', function() {
    firestore.setData();
  });
});