## Quick Start
```bash
# 1) Clone
git clone https://github.com/alamincse/mvc-app-nodejs.git
cd mvc-app-nodejs

# 2) Install dependencies
npm install

# 3) Configure env (copy & edit)
cp .env.example .env   # if provided; otherwise edit .env directly

# 4) Run DB migrations
nodemon database      # or: node database

# 5) Start the server
nodemon server        # or: node server
```

> Default app port is read from `.env` (see **Environment Configuration**).

---