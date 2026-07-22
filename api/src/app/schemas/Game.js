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
        required: false,
    },
    photo: {
        type: String,
        required: false,
        default: null,
    },
    coverUrl: {
        type: String,
        required: false,
        default: null,
    },
    fallbackCoverUrl: {
        type: String,
        required: false,
        default: null,
    },
    coverSource: {
        type: String,
        enum: ['upload', 'rawg', 'steam'],
        default: 'upload',
    },
    externalId: {
        type: Number,
        required: false,
        default: null,
    },
    sourceUrl: {
        type: String,
        required: false,
        default: null,
    },
    steamAppId: {
        type: Number,
        required: false,
        unique: true,
        sparse: true,
    },
    steamPlaytimeMinutes: {
        type: Number,
        required: false,
        default: null,
    },
    steamLastPlayedAt: {
        type: Date,
        required: false,
        default: null,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Game', GameSchema);
