import mongoose from 'mongoose';

const GamePlanSchema = new mongoose.Schema({
    key: {
        type: String,
        default: 'current',
        unique: true,
    },
    items: [{
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game',
            required: true,
        },
        platform: {
            type: String,
            required: true,
        },
    }],
}, {
    timestamps: true,
});

export default mongoose.model('GamePlan', GamePlanSchema);
