import jwt from 'jsonwebtoken';

const checkToken = (req, res, next) => {
    // check whethet the user logged in or not
    const authHeader = req.headers['authorization'];
    req.user = {}
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token != "null") {
            jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({message: 'Invalid token'});
                }
                req.user = user;
                next()
            })
        } else {
            next();
        };
    } else {
        next()
    }
};

const verifyToken = (req, res, next) => {
    // allow user only if he is logged in
    const authHeader = req.headers['authorization'];

    // If the Authorization header is missing, send a 403 response
    if (!authHeader) {
        return res.status(403).json({message: 'Token is required'});
    }
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(403).json({message: 'Token is required'});
    }

    jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
        if (err) return res.status(403).json({message: 'Invalid token'});
        req.user = user;
        next();
    });
};

const adminOnly = (req, res, next) => {
    if (!req.user.user.role || req.user.user.role != "admin") {
        res.status(200).json({
            status: 'unauthorized',
            data: "No sufficent permissions",
        });
        return
    }
    next();
};

export { verifyToken, adminOnly, checkToken };