const { registerDecorator } = require('class-validator');

function IsEqualTo(property, validationOptions) {
  return function (object, propertyName) {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value, args) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}

module.exports = { IsEqualTo };
