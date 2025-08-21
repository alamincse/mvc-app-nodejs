## Installation
1. **Install packages**
   ```bash
   npm install
   npm install mysql dotenv formidable --save
   npm install nodemon --save-dev
   ```
2. **Create database** in MySQL and update `.env` accordingly.
3. **Run migrations** with `nodemon database` (creates required tables).
4. **Start the server** with `node server` or `nodemon server`.

---