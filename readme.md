# Data Catalog API Service

This is a Node.js API service built with TypeScript, Express, and Prisma that allows managing event tracking metadata. The service supports operations around:

* **Properties**
* **Events**
* **Tracking Plans**
* **API Keys**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/data-catalog-api.git
cd data-catalog-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the environment variables

Create a `.env` file in the root directory and add your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
PORT=3000
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

---

## 🐳 Run with Docker

### 1. Build and start the app

```bash
docker-compose up --build
```

### 2. Visit API Docs

After the server is up, visit:

```
http://localhost:3000/api-docs/
```

---

## 🧪 Running Tests

This project uses **Jest** and **Supertest** for integration tests.

To run tests, use the following command:

```bash
npx --yes jest --runInBand
```

The `--runInBand` flag ensures tests run **sequentially**, which is useful for tests that share a database or perform setup/teardown.

---

## 🔐 API Key Authentication

All routes require an `x-api-key` header to be passed in the request.
You can generate API keys using the internal function `generateApiKey()`.

---

## 🧼 Database Reset

A utility `resetDatabase()` is available in tests to truncate all tables between runs. It's automatically used in the test lifecycle.

---

## 📂 Folder Structure

```
├── prisma/              # Prisma schema and migrations
├── src/
│   ├── routes/          # Express routes for events, properties, plans, etc.
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication, error handlers
│   ├── utils/           # Utility functions (e.g. API key generator)
│   └── server.ts        # App entry point
├── tests/               # Jest + Supertest integration tests
└── docker-compose.yml   # Docker configuration
```

---

## 📜 License

MIT

---

## 👨🏻‍💻 Author

Abhiraaj Verma
