const validator = require('validator');

class UpdateRoleDTO {
  constructor(data) {
    this.name = data.name;
    this.permissions = data.permissions;
  }

  validate() {
    let errors = [];

    // Name validation
    if (typeof this.name !== 'string' || validator.isEmpty(this.name)) {
      errors.push('Name is required and must be a string');
    }

    // Permissions validation (array of integers, at least 1 item)
    if (!Array.isArray(this.permissions) || this.permissions.length === 0) {
      errors.push('Permissions is required and should have at least 1 item');
    } else {
      this.permissions.forEach(permission => {
        if (!validator.isInt(String(permission))) {
          errors.push('Permissions must be numbers');
        }
      });
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

module.exports = { UpdateRoleDTO };
