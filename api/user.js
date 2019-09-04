const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema(
    {
        name: {type: String},
        username: {type: String, required: true},
        username_lower: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        rating: {type: Number, required: true},
        activeGames: {type: Array},
        gameHistory: {type: Array},
        savedPositions: [
            {
                id: Schema.Types.ObjectId,
                side: String,
                pos: String,
                points: Number
            }
        ],
        looking_for_game: {type: Boolean, required: true}
    }, 
    { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;