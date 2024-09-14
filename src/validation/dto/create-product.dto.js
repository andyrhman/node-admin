const validator = require('validator');

class ProductCreateDto {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.image = data.image;
        this.price = data.price;
    }
    validate() {
        let errors = [];
        if (typeof this.title !== 'string' || validator.isEmpty(this.title)) {
            errors.push('Title must be a string');
        }

        if (typeof this.description !== 'string' || validator.isEmpty(this.description)) {
            errors.push('Description must be a string');
        }

        if (typeof this.image !== 'string' || validator.isEmpty(this.image)) {
            errors.push('Image must be a string');
        }
        
        if (typeof this.price !== 'number' || validator.isEmpty(this.price)) {
            errors.push('Price must be a Integer');
        }
    }
}

module.exports = { ProductCreateDto };