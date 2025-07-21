const db = require('../config/db.js');

class Model {
	constructor(table = null, fillable = []) {
		this.table = table;
		this.fillable = fillable;
	}

	// Filter only fillable fields
	_filterFillableFields(data) {
		const filteredFields = {};

		for (const key of this.fillable) {
			if (data.hasOwnProperty(key)) {
				filteredFields[key] = data[key];
			}
		}

		return filteredFields;
	}

	// Create new record
	create(data) {
		const filteredFields = this._filterFillableFields(data);

		const fieldNames = Object.keys(filteredFields);
		const fieldValues = Object.values(filteredFields);
		const placeholders = fieldNames.map(() => '?').join(', ');

		const sql = `INSERT INTO ${this.table} (${fieldNames.join(', ')}) VALUES (${placeholders})`;

		return new Promise((resolve, reject) => {
			db.query(sql, fieldValues, (error, result) => {
				if (error) reject(error);

				const insertedId = result?.insertId;

				if (insertedId) {
					// Fetch and return full record by ID
					const findSql = `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`;

					db.query(findSql, [insertedId], (err, rows) => {
						if (err) return reject(err);

						// return full user object
						resolve(rows[0]); 
					});
				}
			});
		});
	}

	// Find by ID
	find(id) {
		const sql = `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`;

		return new Promise((resolve, reject) => {
			db.query(sql, [id], (error, results) => {
				if (error) return reject(error);

				resolve(results[0] || null);
			});
		});
	}


	// Update by ID
	update(id, data) {
		const filteredFields = this._filterFillableFields(data);
		const fields = Object.keys(filteredFields);
		const values = Object.values(filteredFields);

		if (fields.length === 0) 
			return Promise.resolve(false);

		const setClause = fields.map(field => `${field} = ?`).join(', ');

		const sql = `UPDATE ${this.table} SET ${setClause} WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.query(sql, [...values, id], (error, result) => {
				if (error) return reject(error);

				resolve(result);
			});
		});
	}

	// get all data
	all() {
		const sql = `SELECT * FROM ${this.table}`;

		return new Promise((resolve, reject) => {
			db.query(sql, (err, results) => {
				if (err) return reject(err);

				resolve(results);
			});
		});
	}

	// grab conditional data
	where(field, value) {
		const sql = `SELECT * FROM ${this.table} WHERE ${field} = ?`;

		return new Promise((resolve, reject) => {
			db.query(sql, [value], (err, results) => {
				if (err) return reject(err);

				resolve(results);
			});
		});
	}


	paginate(page = 1, perPage = 10) {
		const offset = (page - 1) * perPage;
		const sql = `SELECT * FROM ${this.table} LIMIT ? OFFSET ?`;

		return new Promise((resolve, reject) => {
			db.query(sql, [perPage, offset], (err, results) => {
				if (err) return reject(err);

				resolve({
					currentPage: page,
					perPage: perPage,
					data: results,
				});
			});
		});
	}

	whereIn(field, values = []) {
		if (!Array.isArray(values) || values.length === 0) return Promise.resolve([]);

		const placeholders = values.map(() => '?').join(', ');
		const sql = `SELECT * FROM ${this.table} WHERE ${field} IN (${placeholders})`;

		return new Promise((resolve, reject) => {
			db.query(sql, values, (err, results) => {
				if (err) return reject(err);
				resolve(results);
			});
		});
	}

	orderBy(field, direction = 'ASC') {
		const sql = `SELECT * FROM ${this.table} ORDER BY ${field} ${direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;

		return new Promise((resolve, reject) => {
			db.query(sql, (err, results) => {
				if (err) return reject(err);
				
				resolve(results);
			});
		});
	}


	// Delete by ID
	delete(id) {
		const sql = `DELETE FROM ${this.table} WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.query(sql, [id], (error, result) => {
				if (error) return reject(error);

				resolve(result);
			});
		});
	}
}

module.exports = Model;