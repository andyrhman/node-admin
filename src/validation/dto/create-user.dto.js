const validator = require('validator');

class CreateUserDTO {
  constructor(data) {
    this.fullname = data.fullname;
    this.username = data.username;
    this.email = data.email;
    this.role_id = data.role_id;
  }

  validate() {
    let errors = [];

    // Fullname validation (check if it's a string and not empty)
    if (typeof this.fullname !== 'string' || validator.isEmpty(this.fullname)) {
      errors.push('Full name must be a string and cannot be empty');
    }

    // Username validation (check if it's a string and within the required length)
    if (typeof this.username !== 'string' || !validator.isLength(this.username, { min: 3, max: 30 })) {
      errors.push('Username must be between 3 and 30 characters');
    }

    // Email validation (using validator.js)
    if (!validator.isEmail(this.email)) {
      errors.push('Email must be a valid email address');
    }

    // Role ID validation (must be an integer)
    if (!Number.isInteger(this.role_id)) {
      errors.push('Role is invalid');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

module.exports = { CreateUserDTO };
