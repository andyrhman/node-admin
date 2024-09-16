const AbstractService = require('../common/abstract.service.js');
const { Product } = require('../../models');

class ProductService extends AbstractService {
    constructor() {
        super(Product);
    }
}

module.exports = { ProductService };
