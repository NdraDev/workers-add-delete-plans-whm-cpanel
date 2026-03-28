# WHM cPanel Package Management API

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/NdraDev/workers-add-delete-plans-whm-cpanel)

A modern, production-ready REST API for managing WHM cPanel packages automatically using Cloudflare Workers.

<!-- dash-content-start -->

## Features

- 🚀 **REST API** - Full RESTful API for package management
- 📚 **Swagger Documentation** - Interactive API documentation
- 🔄 **Background Processing** - Non-blocking package operations
- 🔒 **Secure** - Cookie-based authentication with automatic cleanup
- 📦 **15 Predefined Packages** - cPanel, WHM Reseller, Mega WHM, and Unlimited packages
- 🌐 **Cloudflare Workers** - Edge deployment with global low-latency
- 🔎 **Built-in Observability** - Monitor your Worker with Cloudflare dashboard

## Available Packages

### cPanel Packages

| Package       | Bandwidth | Storage | Subdomains | FTP Accounts | SQL Databases | Email Accounts |
| ------------- | --------- | ------- | ---------- | ------------ | ------------- | -------------- |
| cPanel Mini   | 1 GB      | 512 MB  | 10         | 10           | 10            | 25             |
| cPanel Medium | 2 GB      | 1 GB    | 20         | 20           | 20            | 50             |
| cPanel Extra  | 4 GB      | 2 GB    | 30         | 30           | 30            | 75             |
| cPanel Super  | 8 GB      | 4 GB    | 50         | 50           | 50            | 100            |

### WHM Reseller Packages

| Package    | Bandwidth | Storage | Subdomains | FTP Accounts | SQL Databases | Email Accounts |
| ---------- | --------- | ------- | ---------- | ------------ | ------------- | -------------- |
| Whm Mini   | 10 GB     | 5 GB    | 100        | 100          | 100           | 200            |
| Whm Medium | 20 GB     | 10 GB   | 150        | 150          | 150           | 300            |
| Whm Extra  | 30 GB     | 15 GB   | 200        | 200          | 200           | 400            |
| Whm Super  | 50 GB     | 25 GB   | 300        | 300          | 300           | 600            |

### Mega WHM Packages

| Package     | Bandwidth | Storage | Subdomains | FTP Accounts | SQL Databases | Email Accounts |
| ----------- | --------- | ------- | ---------- | ------------ | ------------- | -------------- |
| Mwhm Mini   | 100 GB    | 50 GB   | 500        | 500          | 500           | 1000           |
| Mwhm Medium | 200 GB    | 100 GB  | 750        | 750          | 750           | 1500           |
| Mwhm Extra  | 300 GB    | 150 GB  | 1000       | 1000         | 1000          | 2000           |
| Mwhm Super  | 500 GB    | 250 GB  | 1500       | 1500         | 1500          | 3000           |

### Unlimited Packages

- **Admin** - Unlimited resources
- **Ceo** - Unlimited resources
- **Wakil Founder** - Unlimited resources

All packages use the **Jupiter** theme (modern cPanel default).

<!-- dash-content-end -->

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Your API will be available at `http://localhost:5173`.

### Typegen

Generate types for your Cloudflare bindings:

```sh
npm run typegen
```

## API Documentation

### Interactive Swagger Documentation

Access the interactive Swagger documentation at:

- **Local:** `http://localhost:5173/swagger`
- **Production:** `https://your-worker.workers.dev/swagger`

### API Endpoints

#### 1. Add All Packages

Creates all 15 predefined WHM packages on the specified server.

**Endpoint:** `POST /api/addpackage-root` or `GET /api/addpackage-root`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ip | string | Yes | WHM server IP address |
| user | string | Yes | WHM username (usually 'root') |
| pass | string | Yes | WHM password |

**Example Request (GET):**

```bash
curl "http://localhost:5173/api/addpackage-root?ip=192.168.1.1&user=root&pass=yourpassword"
```

**Example Request (POST with JSON):**

```bash
curl -X POST "http://localhost:5173/api/addpackage-root" \
  -H "Content-Type: application/json" \
  -d '{"ip":"192.168.1.1","user":"root","pass":"yourpassword"}'
```

**Example Response:**

```json
{
  "status": "success",
  "code": 200,
  "msg": "Login berhasil, proses penambahan package sedang berlangsung."
}
```

**Note:** The response is sent immediately, and package creation continues in the background.

#### 2. Clear All Packages

Deletes all WHM packages except the 'default' package.

**Endpoint:** `POST /api/clearpackage-root` or `GET /api/clearpackage-root`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ip | string | Yes | WHM server IP address |
| user | string | Yes | WHM username (usually 'root') |
| pass | string | Yes | WHM password |

**Example Request (GET):**

```bash
curl "http://localhost:5173/api/clearpackage-root?ip=192.168.1.1&user=root&pass=yourpassword"
```

**Example Request (POST with JSON):**

```bash
curl -X POST "http://localhost:5173/api/clearpackage-root" \
  -H "Content-Type: application/json" \
  -d '{"ip":"192.168.1.1","user":"root","pass":"yourpassword"}'
```

**Example Response:**

```json
{
  "status": "processing",
  "msg": "Menghapus semua paket..."
}
```

**Note:** The response is sent immediately, and package deletion continues in the background.

### Response Codes

| Code | Status             | Description                     |
| ---- | ------------------ | ------------------------------- |
| 200  | success/processing | Request accepted and processing |
| 400  | error              | Invalid parameters or IP format |
| 401  | error              | Authentication failed           |
| 405  | error              | Method not allowed              |
| 500  | error              | Internal server error           |

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Create Cloudflare KV Namespace

Before deploying, create a KV namespace for storing WHM cookies:

```bash
npx wrangler kv:namespace create WHM_COOKIES
```

This will output two IDs - one for preview and one for production. Update `wrangler.json`:

```json
{
  "kv_namespaces": [
    {
      "binding": "WHM_COOKIES",
      "id": "your-production-id",
      "preview_id": "your-preview-id"
    }
  ]
}
```

### Deploy to Cloudflare

Build and deploy your app:

```sh
npm run build
npm run deploy
```

Or deploy a preview version:

```sh
npx wrangler versions upload
npx wrangler versions deploy
```

## Configuration

### Environment Variables

Configure your Worker in `wrangler.json`:

```json
{
  "vars": {
    "API_VERSION": "1.0.0"
  }
}
```

### CORS

All API endpoints support CORS for cross-origin requests from web applications.

## Security Considerations

- **Cookie Storage:** WHM session cookies are stored in Cloudflare KV with automatic expiration (1 hour)
- **No Database:** No persistent storage of credentials
- **Automatic Cleanup:** Cookies are automatically deleted after operations complete
- **HTTPS Only:** All WHM connections use HTTPS (port 2087)

## Troubleshooting

### Login Fails

- Verify IP address, username, and password
- Ensure WHM server allows API connections
- Check firewall settings on WHM server

### Package Creation Fails

- Ensure you have root/reseller access
- Verify package names don't already exist
- Check WHM API logs for detailed errors

## Tech Stack

- **Runtime:** Cloudflare Workers
- **Language:** TypeScript
- **API:** RESTful with Swagger documentation
- **Styling:** TailwindCSS (for Swagger UI)
- **Storage:** Cloudflare KV (for session cookies)

## License

MIT License - Built with ❤️ using React Router and Cloudflare Workers.

## Support

For issues and feature requests, please open an issue on GitHub.
