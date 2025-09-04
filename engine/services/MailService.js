const nodemailer = require('nodemailer');
const MailConfig = require('@config/mail');

class MailService {
	constructor() {
        this.driver = MailConfig.default;
        this.config = MailConfig.drivers[this.driver];
        this.transporter = this._createTransporter();
    }

    _createTransporter() {
        switch (this.driver) {
            case 'smtp':
                return nodemailer.createTransport({
                    host: this.config.host,
                    port: this.config.port,
                    secure: this.config.secure,
                    auth: this.config.auth,
                    tls: {
					    rejectUnauthorized: false, // For local environment
				  	},
                    timeout: this.config.timeout
                });
            default:
                throw new Error(`Unsupported mail driver: ${this.driver}`);
        }
    }

    async sendMail({ to, subject, text, html, from }) {
        const mailOptions = {
            from: from || `"${MailConfig.from.name}" <${MailConfig.from.address}>`,
            to,
            subject,
            text,
            html
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);

            Log.info('Mail sent:', info.response ?? info);
            
            return info;
        } catch (err) {
            Log.error('Mail sending error:', err);

            throw err;
        }
    }
}

module.exports = new MailService();