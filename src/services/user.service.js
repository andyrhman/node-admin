const AbstractService = require('../common/abstract.service.js');
const { User } = require('../../models');

class UserService extends AbstractService {
    constructor() {
        super(User);
    }
}

module.exports = { UserService };
