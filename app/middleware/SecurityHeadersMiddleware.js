class SecurityHeadersMiddleware {
	handle = (req, res, next) => {
        // Prevent MIME-sniffing
        res.setHeader("X-Content-Type-Options", "nosniff");

        // Prevent Clickjacking
        res.setHeader("X-Frame-Options", "SAMEORIGIN");

        // Enable XSS protection (for older browsers)
        res.setHeader("X-XSS-Protection", "1; mode=block");

        // Control referrer info
        res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");

        // Force HTTPS usage (HSTS)
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

        // Content Security Policy (CSP)
        res.setHeader("Content-Security-Policy", "default-src 'self'");

        // call next middleware or controller
        next();
    }
}

const middleware = new SecurityHeadersMiddleware();

module.exports = middleware.handle;