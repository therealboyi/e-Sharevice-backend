// controllers/userController.js
export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch current user'
        });
    }
};