const validator = require('validator');

class RegisterDto {
  constructor(data) {
    this.fullname = data.fullname;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.password_confirm = data.password_confirm;
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

    // Password validation (check if it's at least 6 characters long)
    if (!validator.isLength(this.password, { min: 6 })) {
      errors.push('Password must be at least 6 characters long');
    }

    // Password confirm validation
    if (this.password !== this.password_confirm) {
      errors.push('Password confirm must be the same as password');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

module.exports = { RegisterDto };
