import mongoose from 'mongoose';
import { normalizeGameName } from '../../utils/gameName';

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    normalizedName: {
        type: String,
        unique: true,
        sparse: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['finished', 'progress'],
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

GameSchema.pre('validate', function setNormalizedName(next) {
    this.normalizedName = normalizeGameName(this.name);
    next();
});

export default mongoose.model('Game', GameSchema);
