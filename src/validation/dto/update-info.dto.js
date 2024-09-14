const validator = require('validator');

class UpdateInfoDTO {
  constructor(data) {
    this.fullname = data.fullname;
    this.username = data.username;
    this.email = data.email;
  }

  validate() {
    let errors = [];

    // Fullname validation (check if it's a string and not empty)
    if (this.fullname !== undefined && (typeof this.fullname !== 'string' || validator.isEmpty(this.fullname))) {
      errors.push('Full name must be a string and cannot be empty');
    }

    // Username validation (check if it's a string and within the required length)
    if (this.username !== undefined && (typeof this.username !== 'string' || !validator.isLength(this.username, { min: 3, max: 30 }))) {
      errors.push('Username must be between 3 and 30 characters');
    }

    // Email validation (using validator.js)
    if (this.email !== undefined && !validator.isEmail(this.email)) {
      errors.push('Email must be a valid email address');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

module.exports = { UpdateInfoDTO };
