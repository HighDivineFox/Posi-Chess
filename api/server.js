'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')

// Models
const User = require('./user')
const Game = require('./game')

mongoose.set('useFindAndModify', false)

+mongoose.connect(
    'mongodb+srv://Chris:BbSXLCX6YGzZJ1Zq@cluster0-ptonv.mongodb.net/chess_app?retryWrites=true&w=majority', 
    { useNewUrlParser: true, useCreateIndex: true, }
  );
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/////
// USER LOGIN 
/////
app.get('/api/v1/user/email/:email/password/:password', (req, res) => {
    User
        .find({email: req.params.email})
        .exec((err, user) => {
            if(err) return res.status(404).send('Unable to find user')

            if(user.length == 0){
                return res.status(404).send("couldn't find user")
            }            
            
            bcrypt.compare(req.params.password, user[0].password, (err, result) => {
                if(err) return res.status(404).send('Not found')
                
                if(result){
                    return res.send(user[0])
                }else{
                    return res.status(404).send("Unable to log in")
                }
            })
        })
})


/////
/// GET USER BY ID
////
app.get('/api/v1/user/id/:id', (req, res) => {
    User
        .find({_id: req.params.id})
        .exec((err, user) => {
            if(err) return res.status(404).send('Unable to find user')
            return res.send(user[0])
        })
})

/////
/// GET USER BY EMAIL
////
app.get('/api/v1/user/email/:email', (req, res) => {
    User
        .find({email: req.params.email})
        .exec((err, user) => {
            if(err) return res.status(404).send('Unable to find user')
            if(user.length > 0){
                return res.send(true)
            }else{
                return res.send(false)
            }
        })
})

/////
/// GET WHITE POSITIONS BY ID
////
app.get('/api/v1/user/id/:id/whitepos', (req, res) => {
    User
        .find({_id: req.params.id})
        .exec((err, user) => {
            if(err) return res.status(404).send('Unable to find user')
            return res.send(user[0].savedPositions.filter(item => item.side == 'w'))
        })
})

/////
/// CREATE NEW USER
/////
app.post('/api/v1/user/create', (req, res) => {
    bcrypt.hash(req.body.password, 4)
        .then((newPW) => {
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                username_lower: req.body.username.toLowerCase(),
                email: req.body.email.toLowerCase(),
                password: newPW,
                rating: 1200,
                activeGames: [],
                gameHistory: [],
                savePositions: [],
                looking_for_game: false
            })
        
            newUser.save((err, user) => {
                if (err) return res.status(404).send('Unable to create user')
                return res.send(user)
            })
        })
})

/////
/// GET USER THAT IS LOOKING FOR A GAME
/////
app.get('/api/v1/user/looking', (req, res) => {   
    User
        .find({looking_for_game: true})
        .limit(1)
        .exec((err, user) => {
            if(err) return res.status(404).send('Unable to update user')
            if(user.length == 0) return res.send(null)

            return res.send(user[0])
        })
})

/////
/// CHECK IF USER EXISTS OR NOT
/////
app.get('/api/v1/user/username/:username/email/:email', (req, res) => {
    User
        .find({$or: [
            {username_lower: req.params.username.toLowerCase()},
            {email: req.params.email.toLowerCase()}
        ]})
        .exec((err, result) => {
            if(err) /* User not found */ return res.status(404).send(false)
            return res.send(result.length > 0)
        })
})

/////
/// ADD TO SAVED POSITIONS
/////
app.post('/api/v1/user/savePos', (req, res) => {
    let posOBj = {
        side: req.body.side,
        pos: req.body.pos,
        points: req.body.points
    }

    User.findByIdAndUpdate(req.body.user_id, {$push: {savedPositions: posOBj}})
        .exec((err, newUser) => {
            if(err) return res.status(404).send('Unable to update user')
            return res.send(true)
        })
})

/////
/// UPDATE SAVED POSITION
/////
app.post('/api/v1/user/updatePos', (req, res) => {

    User.updateOne({'savedPositions._id': req.body.pos_id}, {$set: {'savedPositions.$.pos': req.body.pos, 'savedPositions.$.side': req.body.side}})
        .exec((err, newPos) => {
            if(err) return res.status(404).send('Unable to remove position')
            return res.send(true)
        })
})

/////
/// REMOVE SAVED POSITION
/////
app.post('/api/v1/user/deletePos', (req, res) => {

    User.findByIdAndUpdate(req.body.user_id, {$pull: {savedPositions: {_id: req.body.pos_id}}})
        .exec((err, removedPos) => {
            if(err) return res.status(404).send('Unable to remove position')
            return res.send(true)
        })
})

/////
/// GET GAME BY ID
////
app.get('/api/v1/game/id/:id', (req, res) => {
    Game
        .find({_id: req.params.id})
        .exec((err, game) => {
            if(err) return res.status(404).send('Unable to find game')
            return res.send(game[0])
        })
})

/////
/// GET GAME WITH PLAYER ID
////
app.get('/api/v1/game/playerId/:id', (req, res) => {
    Game
        .find(
            {$or:[
                    {whitePlayer: req.params.id},
                    {blackPlayer: req.params.id}
                ]
            }
        )
        .exec((err, games) => {
            if(err) return res.status(404).send('No games with this player')
            return res.send(games)
        })
})

/////
/// CREATE NEW GAME
////
app.post('/api/v1/game/create/', (req, res) => {
    Game
        .create({
            PGN: null,
            FEN: null,
            pointAllowance: req.body.points || 15,
            whitePlayer: req.body.whitePlayer,
            blackPlayer: req.body.blackPlayer,
            whiteStartPos: "",
            blackStartPos: "",
            ended: false,
            result: "",
            whiteTime: req.body.minutes || 5,
            blackTime: req.body.minutes || 5
        }, (err, game) => {
            if(err) return res.status(404).send('Unable to create game')
            return res.send(game)
        })
})

app.post('/api/v1/game/join', (req, res) => {
    if(req.body.whitePlayer){
        Game
            .findByIdAndUpdate(req.body.id, {whitePlayer: req.body.whitePlayer}, {new: true})
            .exec((err, game) => {
                if(err) return res.status(404).send('Unable to join game')
                return res.send(game)
            })
    }else if(req.body.blackPlayer){
        Game
            .findByIdAndUpdate(req.body.id, {blackPlayer: req.body.blackPlayer}, {new: true})
            .exec((err, game) => {
                if(err) return res.status(404).send('Unable to join game')
                return res.send(game)
            })
    }
})

/////
/// UPDATE START POSITION FOR PLAYER
/////
app.post('/api/v1/game/updatePos', (req, res) => {

    //console.log(req.body);

    if(req.body.side == 'white'){
        Game.findByIdAndUpdate(req.body.id, {whiteStartPos: req.body.pos}, {new: true})
            .exec((err, updatedGame) => {
                if(err) return res.status(404).send('Unable to update position')

                if(updatedGame.whiteStartPos != '' && updatedGame.blackStartPos != ''){
                    let combinedFEN = combineFEN(updatedGame.whiteStartPos, updatedGame.blackStartPos) + ' w KQkq - 0 1'
                    updatedGame['FEN'] = combinedFEN

                    Game
                        .findByIdAndUpdate(req.body.id, {FEN: combinedFEN}, {new: true})
                        .exec((err, game) => {
                            if(err) return res.status(404).send('Unable to update position')
                            return res.send(game)
                        })
                }else{
                    return res.send(updatedGame)
                }
            })
    }else{
        Game.findByIdAndUpdate(req.body.id, {blackStartPos: req.body.pos})
            .exec((err, updatedGame) => {
                if(err) return res.status(404).send('Unable to update position')

                if(updatedGame.whiteStartPos != '' && updatedGame.blackStartPos != ''){
                    let combinedFEN = combineFEN(updatedGame.whiteStartPos, updatedGame.blackStartPos) + ' w KQkq - 0 1'
                    updatedGame['FEN'] = combinedFEN

                    Game
                        .findByIdAndUpdate(req.body.id, {FEN: combinedFEN}, {new: true})
                        .exec((err, game) => {
                            if(err) return res.status(404).send('Unable to update position')
                            return res.send(game)
                        })
                }else{
                    return res.send(updatedGame)
                }
            })
    }
})

var combineFEN = function(whiteHalf, blackHalf){
    //console.log(blackHalf);
    let blackReg = /(^.{1,}\/.{1,}\/.{1,}\/.{1,}\/).\/.\/.\//
    let whiteReg = /\/8\/8\/8(\/.{1,}\/.{1,}\/.{1,}\/.{1,})$/
    let b = blackHalf.match(blackReg)
    let w = whiteHalf.match(whiteReg)

    //console.log(b[1]);
    //console.log(w[1]);
    
    let newPos = b[1].slice(0, -1) + w[1]
    //console.log(newPos);

    return newPos
  }

/////
/// UPDATE GAME FEN
////
app.post('/api/v1/game/updateFEN/', (req, res) => {
    Game
        .findByIdAndUpdate(req.body.id, {FEN: req.body.fen})
        .exec((err, game) => {
            if(err) return res.status(404).send('Unable to update FEN for game')
            return res.send(true)
        })
})

app.get('/api/v1/game/getFEN/:id', (req, res) => {
    Game
        .findById(req.params.id)
        .exec((err, game) => {
            if(err) return res.status(404).send('Unable to get FEN')
            return res.send(game.FEN)
        })
})

/////
/// GET GAMES WITH ONLY ONE PLAYER THAT HAVEN'T ENDED
////
app.get('/api/v1/game/open', (req, res) => {
    Game
        .find(
            {$or:
                [
                    {
                        ended: false,
                        whitePlayer: ''
                    },
                    {
                        ended: false,
                        blackPlayer: ''
                    }
                ]
            })
        .exec((err, game) => {
            if(err) return res.status(404).send('Unable to find game')
            return res.send(game)
        })
})

const PORT = 5000;
app.listen(PORT);
console.log('api running on port ' + PORT + ': ');