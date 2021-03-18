const bad_response = (statusCode, message) => ({ statusCode, message, isError: true });

module.exports = {
    bad_response,
};
