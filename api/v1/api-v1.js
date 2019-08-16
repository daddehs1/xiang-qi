var express = require('express')
var router = express.Router()
const firestore = require('./firestore.js')

router.get('/game/:playerID', async (req, res) => {
  try {
    var gameInfo = await firestore.loadGameFromPlayerID(req.params.playerID);
    if (gameInfo) {
      res.json(gameInfo)
    } else {
      res.status(400).json({
        errorMessage: "The specified game does not exist"
      })
    }
  } catch (error) {
    res.status(400).json({
      errorMessage: error
    });
  }
})

router.post('/game', async (req, res) => {
  try {
    await firestore.registerGame(req.body.gameID, req.body.redID, req.body.blackID);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({
      errorMessage: error
    });
  }

})

module.exports = router