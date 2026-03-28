/**
 * WHM cPanel Package Management API
 * 
 * Main entry point for Cloudflare Workers
 * Handles API routes and serves Swagger documentation
 */

import { apiRouter } from './api-router';

// Export types for React Router compatibility
export type { AppLoadContext } from "react-router";

/**
 * Main request handler
 * Routes API requests to appropriate handlers
 */
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		
		// Handle API routes and Swagger documentation
		if (
			url.pathname.startsWith('/api/') || 
			url.pathname === '/swagger' || 
			url.pathname === '/swagger.html' ||
			url.pathname === '/docs'
		) {
			return apiRouter(request, env, ctx);
		}
		
		// For non-API routes, return a simple welcome message
		// (React Router app can be served here if needed)
		return new Response(JSON.stringify({
			name: "WHM cPanel Package Management API",
			version: "1.0.0",
			description: "REST API untuk membuat dan menghapus package WHM cPanel secara otomatis",
			endpoints: {
				swagger: "/swagger",
				addPackage: "/api/addpackage-root",
				clearPackage: "/api/clearpackage-root"
			}
		}), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	},
} satisfies ExportedHandler<Env>;
