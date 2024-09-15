const PermissionMiddleware = (access) => {
    return (req, res, next) => {
        const user = req['user'];

        const permissions = user.Role.Permissions;

        if (req.method === 'GET') {
            if (!permissions.some(p => (p.name === `view_${access}`) || (p.name === `edit_${access}`))) {
                return res.status(403).send({
                    message: 'Unauthorized'
                })
            }
        } else {
            if (!permissions.some(p => p.name === `edit_${access}`)) {
                return res.status(403).send({
                    message: 'Unauthorized'
                })
            }
        }

        next();
    }
}

module.exports = { PermissionMiddleware }