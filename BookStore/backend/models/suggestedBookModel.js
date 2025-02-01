import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    isbn: {
        type: [String],
        required: true,
    },
    state: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true,
        default: ''
    }
});

recommendationSchema.index({ user: 1, isbn: 1 }, { unique: true });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
