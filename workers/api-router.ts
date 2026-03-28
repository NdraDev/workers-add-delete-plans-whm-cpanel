/**
 * API Router
 * 
 * Handles routing for all API endpoints and Swagger documentation
 */

import { handleAddPackage } from './api-addpackage';
import { handleClearPackage } from './api-clearpackage';

/**
 * Serve Swagger documentation
 */
function serveSwagger(): Response {
	return new Response(
		`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WHM cPanel Package Management API - Swagger Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .swagger-ui .topbar { background-color: #1b1f23; }
        .swagger-ui .info .title { color: #58a6ff; }
        .hero { background: #1b1f23; color: white; padding: 40px 20px; text-align: center; }
        .hero h1 { margin: 0 0 10px 0; font-size: 2.5em; }
        .hero p { margin: 0; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>🚀 WHM cPanel Package Management API</h1>
        <p>REST API untuk membuat dan menghapus package WHM cPanel secara otomatis</p>
    </div>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                spec: ${JSON.stringify(getSwaggerSpec(), null, 2)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
                plugins: [SwaggerUIBundle.plugins.DownloadUrl],
                layout: "StandaloneLayout",
                validatorUrl: null,
                docExpansion: 'list',
                defaultModelsExpandDepth: 2,
                defaultModelExpandDepth: 2
            });
            window.ui = ui;
        };
    </script>
</body>
</html>`,
		{
			headers: { 'Content-Type': 'text/html' }
		}
	);
}

/**
 * Get Swagger spec as object
 */
function getSwaggerSpec() {
	return {
		"openapi": "3.0.0",
		"info": {
			"title": "WHM cPanel Package Management API",
			"version": "1.0.0",
			"description": "REST API untuk membuat dan menghapus package WHM cPanel secara otomatis.\n\n## Fitur\n- **/api/addpackage-root** - Membuat semua package WHM yang telah didefinisikan\n- **/api/clearpackage-root** - Menghapus semua package WHM (kecuali 'default')\n\n## Package yang Tersedia\n### cPanel Packages\n- cPanel Mini (1GB BW, 512MB Storage)\n- cPanel Medium (2GB BW, 1GB Storage)\n- cPanel Extra (4GB BW, 2GB Storage)\n- cPanel Super (8GB BW, 4GB Storage)\n\n### WHM Reseller Packages\n- Whm Mini (10GB BW, 5GB Storage)\n- Whm Medium (20GB BW, 10GB Storage)\n- Whm Extra (30GB BW, 15GB Storage)\n- Whm Super (50GB BW, 25GB Storage)\n\n### Mega WHM Packages\n- Mwhm Mini (100GB BW, 50GB Storage)\n- Mwhm Medium (200GB BW, 100GB Storage)\n- Mwhm Extra (300GB BW, 150GB Storage)\n- Mwhm Super (500GB BW, 250GB Storage)\n\n### Unlimited Packages\n- Admin, Ceo, Wakil Founder",
			"contact": {
				"name": "NdraDev"
			}
		},
		"servers": [
			{
				"url": "https://workers-add-delete-plans-whm-cpanel.ndra.workers.dev",
				"description": "Cloudflare Workers Production"
			},
			{
				"url": "http://localhost:5173",
				"description": "Local Development"
			}
		],
		"tags": [
			{
				"name": "Package Management",
				"description": "API untuk mengelola package WHM cPanel"
			}
		],
		"paths": {
			"/api/addpackage-root": {
				"get": {
					"tags": ["Package Management"],
					"summary": "Add All Packages",
					"description": "Membuat semua package WHM yang telah didefinisikan pada server yang ditentukan.\n\nProses ini akan membuat 15 package sekaligus:\n- 4 cPanel packages\n- 4 WHM reseller packages\n- 4 Mega WHM packages\n- 3 Unlimited packages\n\n**Catatan:** Proses penambahan package berjalan di background setelah response dikirim.",
					"operationId": "addAllPackages",
					"parameters": [
						{
							"name": "ip",
							"in": "query",
							"description": "IP address server WHM cPanel",
							"required": true,
							"schema": { "type": "string", "example": "192.168.1.1" }
						},
						{
							"name": "user",
							"in": "query",
							"description": "Username untuk login ke WHM (biasanya 'root')",
							"required": true,
							"schema": { "type": "string", "example": "root" }
						},
						{
							"name": "pass",
							"in": "query",
							"description": "Password untuk login ke WHM",
							"required": true,
							"schema": { "type": "string", "example": "your_password" }
						}
					],
					"responses": {
						"200": {
							"description": "Login berhasil, proses penambahan package sedang berlangsung",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/AddPackageSuccessResponse" }
								}
							}
						},
						"400": {
							"description": "Parameter tidak lengkap atau format IP tidak valid",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ErrorResponse" }
								}
							}
						},
						"401": {
							"description": "Login gagal - kredensial tidak valid",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ErrorResponse" }
								}
							}
						}
					}
				},
				"post": {
					"tags": ["Package Management"],
					"summary": "Add All Packages (POST)",
					"description": "Membuat semua package WHM yang telah didefinisikan pada server yang ditentukan (menggunakan POST).\n\n**Catatan:** Proses penambahan package berjalan di background setelah response dikirim.",
					"operationId": "addAllPackagesPOST",
					"requestBody": {
						"content": {
							"application/json": {
								"schema": { "$ref": "#/components/schemas/Credentials" }
							},
							"application/x-www-form-urlencoded": {
								"schema": { "$ref": "#/components/schemas/Credentials" }
							}
						}
					},
					"responses": {
						"200": {
							"description": "Login berhasil, proses penambahan package sedang berlangsung",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/AddPackageSuccessResponse" }
								}
							}
						},
						"400": {
							"description": "Parameter tidak lengkap atau format IP tidak valid",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ErrorResponse" }
								}
							}
						},
						"401": {
							"description": "Login gagal - kredensial tidak valid",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ErrorResponse" }
								}
							}
						}
					}
				}
			},
			"/api/clearpackage-root": {
				"get": {
					"tags": ["Package Management"],
					"summary": "Clear All Packages",
					"description": "Menghapus semua package WHM pada server yang ditentukan, kecuali package 'default'.\n\n**Catatan:** Proses penghapusan package berjalan di background setelah response dikirim.",
					"operationId": "clearAllPackages",
					"parameters": [
						{
							"name": "ip",
							"in": "query",
							"description": "IP address server WHM cPanel",
							"required": true,
							"schema": { "type": "string", "example": "192.168.1.1" }
						},
						{
							"name": "user",
							"in": "query",
							"description": "Username untuk login ke WHM (biasanya 'root')",
							"required": true,
							"schema": { "type": "string", "example": "root" }
						},
						{
							"name": "pass",
							"in": "query",
							"description": "Password untuk login ke WHM",
							"required": true,
							"schema": { "type": "string", "example": "your_password" }
						}
					],
					"responses": {
						"200": {
							"description": "Proses penghapusan package sedang berlangsung",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ClearPackageProcessingResponse" }
								}
							}
						},
						"400": {
							"description": "Parameter tidak lengkap atau format IP tidak valid",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ErrorResponse" }
								}
							}
						},
						"401": {
							"description": "Login gagal - kredensial tidak valid",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ErrorResponse" }
								}
							}
						}
					}
				},
				"post": {
					"tags": ["Package Management"],
					"summary": "Clear All Packages (POST)",
					"description": "Menghapus semua package WHM pada server yang ditentukan, kecuali package 'default' (menggunakan POST).\n\n**Catatan:** Proses penghapusan package berjalan di background setelah response dikirim.",
					"operationId": "clearAllPackagesPOST",
					"requestBody": {
						"content": {
							"application/json": {
								"schema": { "$ref": "#/components/schemas/Credentials" }
							},
							"application/x-www-form-urlencoded": {
								"schema": { "$ref": "#/components/schemas/Credentials" }
							}
						}
					},
					"responses": {
						"200": {
							"description": "Proses penghapusan package sedang berlangsung",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ClearPackageProcessingResponse" }
								}
							}
						},
						"400": {
							"description": "Parameter tidak lengkap atau format IP tidak valid",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ErrorResponse" }
								}
							}
						},
						"401": {
							"description": "Login gagal - kredensial tidak valid",
							"content": {
								"application/json": {
									"schema": { "$ref": "#/components/schemas/ErrorResponse" }
								}
							}
						}
					}
				}
			}
		},
		"components": {
			"schemas": {
				"Credentials": {
					"type": "object",
					"required": ["ip", "user", "pass"],
					"properties": {
						"ip": { "type": "string", "description": "IP address server WHM cPanel", "example": "192.168.1.1" },
						"user": { "type": "string", "description": "Username untuk login ke WHM", "example": "root" },
						"pass": { "type": "string", "description": "Password untuk login ke WHM", "example": "your_password" }
					}
				},
				"AddPackageSuccessResponse": {
					"type": "object",
					"properties": {
						"status": { "type": "string", "enum": ["success"], "example": "success" },
						"code": { "type": "integer", "example": 200 },
						"msg": { "type": "string", "example": "Login berhasil, proses penambahan package sedang berlangsung." }
					}
				},
				"ClearPackageProcessingResponse": {
					"type": "object",
					"properties": {
						"status": { "type": "string", "enum": ["processing"], "example": "processing" },
						"msg": { "type": "string", "example": "Menghapus semua paket..." }
					}
				},
				"ErrorResponse": {
					"type": "object",
					"properties": {
						"status": { "type": "string", "enum": ["error"], "example": "error" },
						"code": { "type": "integer", "example": 400 },
						"msg": { "type": "string", "example": "Parameter ip, user, dan pass wajib diisi." }
					}
				}
			}
		}
	};
}

/**
 * Main API router
 */
export async function apiRouter(
	request: Request,
	env: Env,
	ctx: ExecutionContext
): Promise<Response> {
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Swagger documentation
	if (pathname === '/swagger' || pathname === '/swagger.html' || pathname === '/docs') {
		return serveSwagger();
	}

	// API endpoints
	if (pathname === '/api/addpackage-root') {
		return handleAddPackage(request, env, ctx);
	}

	if (pathname === '/api/clearpackage-root') {
		return handleClearPackage(request, env, ctx);
	}

	// Return 404 for unknown routes
	return Response.json({
		status: 'error',
		code: 404,
		msg: 'Endpoint not found. Available endpoints: /swagger, /api/addpackage-root, /api/clearpackage-root'
	}, { status: 404 });
}
