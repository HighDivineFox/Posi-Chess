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
                email: req.body.email,
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
/// USER UPDATE - START SEARCHIN
/////
app.post('/api/v1/user/looking', (req, res) => {    
    User.findByIdAndUpdate(req.body.id, {looking_for_game: req.body.status})
        .exec((err, newUser) => {
            if(err) return res.status(404).send('Unable to update user')
            return res.send(req.body.status ? "User added to search list" : "User removed from search list")
        })
})

/////
/// Add to saved positions
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
        .exec((err, game) => {
            if(err) return res.status(404).send('No games with this player')
            return res.send(game[0])
        })
})

/////
/// CREATE NEW GAME
////
app.post('/api/v1/game/create/', (req, res) => {
    Game
        .create({
            PGN: req.body.PGN || "",
            FEN: req.body.FEN || "",
            pointAllowance: req.body.points || 15,
            whitePlayer: req.body.whitePlayer,
            blackPlayer: req.body.blackPlayer,
            ended: false,
            result: "",
            whiteTime: req.body.minutes || 5,
            blackTime: req.body.minutes || 5
        }, (err, game) => {
            if(err) return res.status(404).send('Unable to create game')
            return res.send(game)
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