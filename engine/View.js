const fs = require('fs');
const path = require('path');

class View {
	constructor(viewName, data = {}, layout = 'layouts/main') {
		this.viewName = viewName;
		this.data = data;
		this.layout = layout;
	}

	async renderFile(filePath) {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, 'utf8', (error, content) => {
				if (error) return reject(`View file not found: ${filePath}`);

				resolve(content);
			});
		});
	}

	replacePlaceholders(content, data) {
		Object.keys(data).forEach(key => {
			// Replace {{ key }} with values
			const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');

			content = content.replace(pattern, data[key]);
		});

		return content;
	}

	async render() {
		const viewPath = path.join(__dirname, '../views', this.viewName + '.html');
		const layoutPath = path.join(__dirname, '../views', this.layout + '.html');

		const viewContent = await this.renderFile(viewPath);
		const layoutContent = await this.renderFile(layoutPath);

		// First replace {{ content }} in layout with the actual view HTML
		let finalHtml = layoutContent.replace('{{ content }}', viewContent);

		// Then replace other data placeholders
		finalHtml = this.replacePlaceholders(finalHtml, this.data);

		return finalHtml;
	}

	static async make(viewName, data = {},  layout = 'layouts/main') {
		const view = new View(viewName, data, layout);

		return await view.render();
	}
}

module.exports = View;
