const AbstractService = require('../common/abstract.service.js');
const { Order } = require('../../models');

class OrderService extends AbstractService {
    constructor() {
        super(Order);
    }
}

module.exports = { OrderService };
