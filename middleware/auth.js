/**
 * Middleware to ensure req.user always exists.
 * Unauthenticated users get the 'NOTLOGDIN' role.
 */
function attachUserRole(req, res, next) {
    if (req.session.user) {
        req.user = req.session.user;
    } else {
        req.user = { role: 'NOTLOGDIN' };
    }
    next();
}

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

module.exports = { attachUserRole, isAuthenticated, isAdminOrManager };
