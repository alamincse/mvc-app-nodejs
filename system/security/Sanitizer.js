const sanitizeHtml = require('sanitize-html');

class Sanitizer {
	static clean(input) {
		console.log("Input ", input)
		if (typeof input === 'string') {
      		return sanitizeHtml(input, {
        		allowedTags: [], // no HTML tags allowed
        		allowedAttributes: {}, // no attribute allowed
        		// nonTextTags: [], // Allow the content inside <script> and <style> tags to be preserved, so <script>alert("Hacked!")</script> becomes alert("Hacked!")
      		});
    	}

    	if (typeof input === 'object') {
      		for (let key in input) {
	        	input[key] = Sanitizer.clean(input[key]);
	      	}
	      	
	      	return input;
	    }

	    return input;
	}
}

module.exports = Sanitizer;