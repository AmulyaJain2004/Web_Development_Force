import express from 'express';
import Recommendation from '../models/suggestedBookModel.js'; // Adjust the path as necessary

const router = express.Router();

// Middleware to validate request body
const validateRecommendationBody = (req, res, next) => {
    const { user, isbn, description } = req.body; // Changed userId to user
    if (!user || !isbn || !description) {
        console.log('Validation failed: Missing user, isbn, or description');
        return res.status(400).send({
            message: 'Please provide user, isbn (array), and description.',
        });
    }
    next();
};

// Route to create a new recommendation
router.post('/', validateRecommendationBody, async (req, res) => {
    try {
        const { user, isbn, state = false, description } = req.body; // Changed userId to user

        // Check if the user has already recommended any book
        const existingRecommendation = await Recommendation.findOne({ user });
        if (existingRecommendation) {
            console.log(`User ${user} has already made a recommendation.`);
            return res.status(409).send({
                message: 'You have already made a recommendation.',
            });
        }

        const newRecommendation = new Recommendation({
            user, // Changed userId to user
            isbn,
            state,
            description,
        });

        const recommendation = await newRecommendation.save();
        console.log('Recommendation created successfully:', recommendation);
        return res.status(200).send(recommendation);

    } catch (error) {
        console.error('Error occurred during recommendation creation:', error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get all recommendations
router.get('/', async (req, res) => {
    try {
        const recommendations = await Recommendation.find({}); // Removed populate since user is a string

        console.log('Recommendations fetched successfully');
        return res.status(200).json({
            count: recommendations.length,
            data: recommendations,
        });

    } catch (error) {
        console.error('Error occurred while fetching recommendations:', error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get all recommendations for a specific user
router.get('/:user', async (req, res) => {
    try {
        const { user } = req.params; // User is taken from the route parameter
        const recommendations = await Recommendation.find({ user }); // Fetch all recommendations for the user

        if (recommendations.length === 0) {
            console.log(`No recommendations found for user ${user}`);
            return res.status(200).json({ count: 0, message: `No recommendations found for ${user}` });
        }

        console.log('Fetched recommendations for user:', user);
        return res.status(200).json({ count: recommendations.length, data: recommendations });

    } catch (error) {
        console.error('Error occurred while fetching recommendations:', error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to update a recommendation for a specific user
router.put('/:user', async (req, res) => {
    try {
        const { user } = req.params;
        const { state, description, isbn } = req.body;

        const existingRecommendation = await Recommendation.findOne({ user });
        if (!existingRecommendation) {
            console.log(`No recommendation found for user ${user}`);
            return res.status(404).json({ message: 'Recommendation not found' });
        }

        const updateFields = {};
        if (state !== undefined) updateFields.state = state;
        if (description !== undefined) updateFields.description = description;
        if (isbn !== undefined) updateFields.isbn = isbn;

        const updatedRecommendation = await Recommendation.findOneAndUpdate(
            { user },
            updateFields,
            { new: true }
        );

        console.log('Recommendation updated successfully:', updatedRecommendation);
        return res.status(200).json({ data: updatedRecommendation });

    } catch (error) {
        console.error('Error occurred during recommendation update:', error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to delete a recommendation for a specific user
router.delete('/:user', async (req, res) => {
    try {
        const { user } = req.params;
        const deletedRecommendation = await Recommendation.findOneAndDelete({ user });

        if (!deletedRecommendation) {
            console.log(`No recommendation found for user ${user}`);
            return res.status(404).json({ message: 'Recommendation not found' });
        }

        console.log('Recommendation deleted successfully:', deletedRecommendation);
        return res.status(200).json({ message: 'Recommendation deleted successfully' });

    } catch (error) {
        console.error('Error occurred during recommendation deletion:', error.message);
        res.status(500).send({ message: error.message });
    }
});


export default router;
