const submissions = {};

const floodControlMiddleware = (req, res, next) => {
    if (req.user && req.user.user) {
        const user_id = req.user.user._id;

        // Initialize user's submission tracking if not already present
        if (!submissions[user_id]) {
            submissions[user_id] = [];
        }

        const currentTime = Date.now();

        // Filter out old timestamps that are older than 5 seconds
        submissions[user_id] = submissions[user_id].filter(timestamp => currentTime - timestamp < 5000);

        // Check if there are more than 5 submissions in the last 5 seconds
        if (submissions[user_id].length >= 5) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        // Add the current timestamp to the user's submission tracking
        submissions[user_id].push(currentTime);

        // Optionally, clean up the user's submission tracking after a certain period
        setTimeout(() => {
            if (submissions[user_id]) {
                submissions[user_id] = submissions[user_id].filter(timestamp => Date.now() - timestamp < 5000);
                if (submissions[user_id].length === 0) {
                    delete submissions[user_id];
                }
            }
        }, 5000);
    }

    next();
};

export { floodControlMiddleware };
