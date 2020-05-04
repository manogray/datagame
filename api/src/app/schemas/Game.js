import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: false,
    },
    year: {
        type: Number,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.model('Game', GameSchema);