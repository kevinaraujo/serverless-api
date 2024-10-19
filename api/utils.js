function buildResponse(statusCode, body, headers) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(body)
    }
}

module.exports = { buildResponse }