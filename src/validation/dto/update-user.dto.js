const validator = require('validator');

class UpdateUserDTO {
  constructor(data) {
    this.fullname = data.fullname;
    this.username = data.username;
    this.email = data.email;
    this.role_id = data.role_id;
  }

  validate() {
    let errors = [];

    // Fullname validation
    if (this.fullname !== undefined && (typeof this.fullname !== 'string' || validator.isEmpty(this.fullname))) {
      errors.push('Full name must be a string and cannot be empty');
    }

    // Username validation
    if (this.username !== undefined && (typeof this.username !== 'string' || !validator.isLength(this.username, { min: 3, max: 30 }))) {
      errors.push('Username must be between 3 and 30 characters');
    }

    // Email validation
    if (this.email !== undefined && !validator.isEmail(this.email)) {
      errors.push('Email must be a valid email address');
    }

    // Role ID validation (check if it's an integer)
    if (this.role_id !== undefined && !validator.isInt(String(this.role_id))) {
      errors.push('Role must be an integer');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

module.exports = { UpdateUserDTO };
