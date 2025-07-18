const { notFoundHandler } = require('../handlers/notFoundHandler');
const { StringDecoder } = require('string_decoder');
const { parseJSON } = require('./utilities');
const routes = require('../routes');
const url = require('url');

const handleRequestResponse = (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.pathname;
	const trimePath = path.replace(/^\/+|\/+$/g, '');
	const method = req.method.toLowerCase();
	const queryStringObject = parsedUrl.query;
	const headersObject = req.headers;

	const requestProperties = {
		parsedUrl,
		path,
		trimePath,
		method,
		queryStringObject,
		headersObject,
	};

	const decoder = new StringDecoder('utf-8');
	let buffer = '';

	req.on('data', (chunk) => {
		buffer += decoder.write(chunk);
	});

	req.on('end', () => {
		buffer += decoder.end();
		requestProperties.body = parseJSON(buffer);

		const chosenHandler = routes[trimePath] ?? notFoundHandler;

		chosenHandler(requestProperties, (statusCode = 500, payload = {}) => {
			const payloadString = JSON.stringify(payload);
			
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
		});
	});
};

module.exports = { handleRequestResponse };