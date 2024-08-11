import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // If the Authorization header is missing, send a 403 response
    if (!authHeader) {
        return res.status(403).send('Token is required');
    }
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        console.log(req.user)
        next();
    });
};

const adminOnly = (req, res, next) => {
    console.log(req.user);
    if (!req.user.user.role || req.user.user.role != "admin") {
        res.status(200).json({
            status: 'unauthorized',
            data: "No sufficent permissions",
        });
        return
    }
    next();
};

export { verifyToken, adminOnly };