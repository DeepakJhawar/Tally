const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(403).send('Token is required');

    console.log(process.env.SESSION_SECRET)
    
    jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });
};