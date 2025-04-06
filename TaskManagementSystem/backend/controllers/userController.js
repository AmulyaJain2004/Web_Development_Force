import e from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc Get all users
// @route GET /api/users/
// @access Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users =  await User.find({
            role: 'member'
        }).select('-password'); // Exclude password from the user object
        
        // Add tasks count to each user
        const usersWithTasksCount = await Promise.all(
                users.map(async (user) => {
                    const pendingTasks = await Task.countDocuments(
                        {
                            assignedTo: user._id, 
                            status: "Pending",
                        }
                    );
                    const inProgressTasks = await Task.countDocuments(
                        {
                            assignedTo: user._id, 
                            status: "In Progress",
                        }
                    );
                    const completedTasks = await Task.countDocuments(
                        {
                            assignedTo: user._id, 
                            status: "Completed",
                        }
                    );

                    return {
                        ...user._doc, // Include all existing user data
                        pendingTasks,
                        inProgressTasks,
                        completedTasks,
                    };        
                }
            )
        );
        res.json(usersWithTasksCount);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password from the user object
        if (!user) {
            return res.status(404).json(
                { 
                    message: 'User not found' 
                }
            );
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json(
            { 
                message: 'Server error', 
                error: error.message 
            }
        );
    }
};

export { 
    getUsers, 
    getUserById
};