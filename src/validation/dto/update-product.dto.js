const validator = require('validator');

class ProductUpdateDto {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.image = data.image;
    this.price = data.price;
  }

  validate() {
    let errors = [];

    // Title validation
    if (this.title !== undefined && (typeof this.title !== 'string' || validator.isEmpty(this.title))) {
      errors.push('Title must be a string and cannot be empty');
    }

    // Description validation
    if (this.description !== undefined && (typeof this.description !== 'string' || validator.isEmpty(this.description))) {
      errors.push('Description must be a string and cannot be empty');
    }

    // Image validation
    if (this.image !== undefined && (typeof this.image !== 'string' || validator.isEmpty(this.image))) {
      errors.push('Image must be a string and cannot be empty');
    }

    // Price validation (check if it's an integer)
    if (this.price !== undefined && !validator.isInt(String(this.price))) {
      errors.push('Price must be an integer');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

module.exports = { ProductUpdateDto };
