const cors = {
	// Allowed Origins list (only these domains can access your API)
    allowedOrigins: [
        'http://localhost:3000',
        'https://app.example.com',
        'https://example.com',
        'https://myapp.com',
    ],

    // Allow these HTTP methods from the client
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    // Allow these headers(Content-Type, Authorization) from the client
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors;