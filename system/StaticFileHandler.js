const fs = require('fs');
const path = require('path');

const mimeTypes = {
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.eot': 'application/vnd.ms-fontobject',
	'.ico': 'image/x-icon',
};

class StaticFileHandler {
	static serve(req, res) {
		const publicPath = path.join(__dirname, '..', 'public');
		const filePath = path.join(publicPath, req.url);

		if (!req.url.startsWith('/css') &&
			!req.url.startsWith('/js') &&
			!req.url.startsWith('/images') &&
			!req.url.startsWith('/bootstrap') &&
			!req.url.startsWith('/fonts')) {
			return false; // Not a static asset path
		}

		if (! fs.existsSync(filePath)) return false;

		const ext = path.extname(filePath);
		const contentType = mimeTypes[ext] || 'application/octet-stream';

		const fileStream = fs.createReadStream(filePath);
		res.writeHead(200, { 'Content-Type': contentType });
		fileStream.pipe(res);

		return true;
	}
}

module.exports = StaticFileHandler;
