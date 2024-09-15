const { User, Role, Permission } = require('../../models');
const { verify } = require('jsonwebtoken');

const AuthMiddleware = async (req, res, next) => {
    try {
        const jwt = req.cookies['user_session'];

        const payload = verify(jwt, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).send({
                message: "Unauthenticated"
            });
        };

        req["user"] = await User.findOne({
            where: { id: payload.id },
            include: [{
                model: Role,
                include: [
                    {
                        model: Permission,
                        through: { attributes: [] }
                    }
                ]
            }]
        });

        next();
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated"
        });
    }
}

module.exports = { AuthMiddleware };