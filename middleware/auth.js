function isAuthenticated(req, res, next) {
    if (req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

function isAdminOrManager(req, res, next) {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'MANAGER')) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
}

module.exports = { isAuthenticated, isAdminOrManager };
