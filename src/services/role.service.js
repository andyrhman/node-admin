const AbstractService = require('../common/abstract.service.js');
const { Role } = require('../../models');

class RoleService extends AbstractService {
    constructor() {
        super(Role);
    }
}

module.exports = { RoleService };
