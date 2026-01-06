# REST Client Application

A Postman-like REST client built with Next.js, React, and MikroORM for testing HTTP APIs.

## Features

- ✅ Support for GET, POST, PUT, DELETE HTTP methods
- ✅ Custom headers editor
- ✅ JSON request body editor
- ✅ Response display with tabs (Body, Headers, Raw)
- ✅ Request history with MongoDB persistence
- ✅ **Infinite scroll with lazy loading** for efficient data handling
- ✅ **Client-side caching** for instant navigation
- ✅ **Search and filter** functionality (by URL and method)
- ✅ **Database indexes** for optimized query performance
- ✅ Pagination for large datasets (handles 100,000+ records efficiently)
- ✅ Beautiful, modern UI with Tailwind CSS
- ✅ No page reloads - fully client-side

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with MikroORM
- **HTTP Client**: Axios

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DB_NAME=rest-client
```

Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Making Requests

1. Select HTTP method (GET, POST, PUT, DELETE)
2. Enter the API endpoint URL
3. Add headers (optional)
4. Add request body for POST/PUT (optional)
5. Click "Send"

### Viewing Responses

- **Body**: View formatted JSON response
- **Headers**: See all response headers
- **Raw**: View complete raw response

### Request History

- All requests are automatically saved to MongoDB
- Click any history item to reload it
- Delete individual items or clear all history
- Pagination for large datasets (20 items per page)

## Project Structure

```
poster-boy/
├── app/
│   ├── api/
│   │   ├── proxy/          # HTTP proxy endpoint
│   │   └── history/        # History CRUD endpoints
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Main application
├── src/
│   ├── components/
│   │   ├── HeaderEditor.tsx
│   │   ├── RequestBuilder.tsx
│   │   ├── ResponseDisplay.tsx
│   │   └── RequestHistory.tsx
│   ├── db/
│   │   ├── init.ts         # Database initialization
│   │   └── mikro-orm.config.ts
│   ├── entities/
│   │   └── RequestHistory.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── formatters.ts
└── .env.local              # Environment variables
```

## API Endpoints

### POST /api/proxy

Make HTTP requests through the proxy.

**Request Body:**

```json
{
  "method": "GET",
  "url": "https://api.example.com/data",
  "headers": {
    "Authorization": "Bearer token"
  },
  "body": "{\"key\": \"value\"}"
}
```

### GET /api/history

Get paginated request history.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### GET /api/history/[id]

Get a specific history item by ID.

### DELETE /api/history/[id]

Delete a specific history item.

### DELETE /api/history

Clear all history.

## Development

Built for an internship assignment demonstrating:

- Full-stack Next.js development
- MongoDB integration with MikroORM
- RESTful API design
- Modern React patterns
- TypeScript best practices
- Efficient data handling (pagination)

## License

MIT
