function formatValidationErrors(errorMessage) {
    return { message: [errorMessage] };  // Return the error message as an array
}

module.exports = { formatValidationErrors };
