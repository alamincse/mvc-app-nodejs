module.exports = {
	default: process.env.MAIL_DRIVER ?? 'smtp', // default driver: smtp, sendmail, mailgun

	drivers: {
        smtp: {
            host: process.env.MAIL_HOST ?? 'smtp.example.com',
            port: parseInt(process.env.MAIL_PORT, 10) ?? 587,
            secure: process.env.MAIL_SECURE === 'true', // true for 465
            auth: {
                user: process.env.MAIL_USER ?? 'alamin@example.com',
                pass: process.env.MAIL_PASS ?? 'password'
            },
            timeout: parseInt(process.env.MAIL_TIMEOUT, 10) ?? 5000
        }
    },

    from: {
        address: process.env.MAIL_FROM_ADDRESS ?? 'noreply@example.com',
        name: process.env.MAIL_FROM_NAME ?? 'MVC APP Node.js'
    },

    queue: {
        enabled: process.env.MAIL_QUEUE === 'true', // true if mail should be queued
        driver: process.env.MAIL_QUEUE_DRIVER ?? 'default'
    }
}