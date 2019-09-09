const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = Schema(
    {
        id: {type: Schema.Types.ObjectId},
        PGN: {type: String},
        FEN: {type: String},
        pointAllowance: {type: Number, required: true},
        whitePlayer: {type: String},
        blackPlayer: {type: String},
        whiteStartPos: {type: String},
        blackStartPos: {type: String},
        whitePlayerConnected: {type: Boolean},
        blackPlayerConnected: {type: Boolean},
        ended: {type: Boolean},
        result: {type: String},
        whiteTime: {type: Number},
        blackTime: {type: Number}
    }, 
    { timestamps: true }
);

const Game = mongoose.model("game", GameSchema);

module.exports = Game;