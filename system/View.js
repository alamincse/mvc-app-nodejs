const fs = require('fs');
const path = require('path');

class View {
	constructor(viewName, data = {}) {
		this.viewName = viewName;
		this.data = data;
	}

	async render() {
		const filePath = path.join(__dirname, '../views', this.viewName + '.html');

		return new Promise((resolve, reject) => {
			fs.readFile(filePath, 'utf8', (error, content) => {
				if (error) 
					return reject('View file not found: ' + this.viewName);

				// Replace {{ key }} with values
				Object.keys(this.data).forEach(key => {
					const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');

					content = content.replace(pattern, this.data[key]);
				});

				resolve(content);
			});
		});
	}

	static async make(viewName, data = {}) {
		const view = new View(viewName, data);

		return await view.render();
	}
}

module.exports = View;
