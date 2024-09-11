import { ValidationError } from 'class-validator';

export const ValidationMiddleware = (err, req, res, next) => {
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const formattedErrors = err.map(e => {
      const constraints = e.constraints;
      const messages = constraints ? Object.values(constraints) : [];
      return { message: messages[0] }; // This will return only the first error message
    });

    const errorMessages = formattedErrors.filter(e => e.message).map(e => e.message);

    return res.status(400).json({ errors: errorMessages });
  }

  return next(err); // If not a validation error, pass it on
};
