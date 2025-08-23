const fs = require("fs");
const path = require("path");

class Logger {
	constructor(options = {}) {
    	this.logDir = options.logDir || path.join(__dirname, "../../logs");

    	if (! fs.existsSync(this.logDir)) {
      		fs.mkdirSync(this.logDir, { recursive: true });
    	}

    	// Global error handling
    	process.on("uncaughtException", (err) => {
      		this.error("Uncaught Exception: " + (err.stack || err.message));

 	 		process.exit(1);
    	});

    	process.on("unhandledRejection", (reason) => {
      		this.error("Unhandled Rejection: " + (reason.stack || reason));
    	});
  	}

  	getLogPath() {
    	const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    	
    	return path.join(this.logDir, `${date}.log`);
  	}

  	_write(level, message) {
    	const logMessage = `[${level}] [${new Date().toISOString()}] ${message}`;
    	const logPath = this.getLogPath();

    	// Console log based on level
	    switch (level) {
	      case "INFO":
	        console.log(logMessage);
	        break;
	      case "WARN":
	        console.warn(logMessage);
	        break;
	      case "ERROR":
	        console.error(logMessage);
	        break;
	      default:
	        console.log(logMessage);
	    }

	    // Write to file
	    try {
      		fs.appendFileSync(logPath, logMessage + "\n", "utf8");
	    } catch (err) {
      		console.error("Logger file write error:", err);
    	}
  	}

  	info(msg) {
    	this._write("INFO", msg);
  	}

  	warn(msg) {
  		this._write("WARN", msg);
  	}

  	error(msg) {
    	this._write("ERROR", msg);
  	}
}

module.exports = new Logger();