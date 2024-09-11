export function formatValidationErrors(validationErrors) {
    const message = validationErrors.map(error => {
        return error.constraints ? Object.values(error.constraints)[0] : null;
    }).filter(error => error !== null);
    return { message };
}
