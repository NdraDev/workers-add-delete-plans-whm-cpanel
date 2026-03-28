/**
 * API Handler for /api/addpackage-root
 * 
 * Creates all WHM cPanel packages on the specified server
 * Accepts GET or POST requests with ip, user, pass parameters
 */

import type { WhmCredentials, AddPackageResponse, PackageResult } from './whm-api';
import {
	isValidIp,
	isValidCredentials,
	whmLogin,
	addAllPackages,
	cleanupCookie
} from './whm-api';

/**
 * Parse credentials from request
 */
function parseCredentials(request: Request): WhmCredentials | null {
	const url = new URL(request.url);
	
	// Try POST body first
	if (request.method === 'POST') {
		const contentType = request.headers.get('content-type') || '';
		
		if (contentType.includes('application/json')) {
			try {
				const body = request.json<WhmCredentials>();
				return body as unknown as WhmCredentials;
			} catch {
				return null;
			}
		}
		
		if (contentType.includes('application/x-www-form-urlencoded') || 
		    contentType.includes('multipart/form-data')) {
			// Will be handled by URLSearchParams below
		}
	}
	
	// Try URL query params or form data
	const searchParams = new URLSearchParams(url.search);
	
	// For POST with form data, we need to parse body
	if (request.method === 'POST' && !searchParams.has('ip')) {
		// Body will be parsed by caller
		return null;
	}
	
	const ip = searchParams.get('ip') || '';
	const user = searchParams.get('user') || '';
	const pass = searchParams.get('pass') || '';
	
	if (!ip && request.method === 'POST') {
		return null; // Body needs to be parsed
	}
	
	return { ip, user, pass };
}

/**
 * Handle POST/GET request to add all packages
 */
export async function handleAddPackage(
	request: Request,
	env: Env,
	ctx: ExecutionContext
): Promise<Response> {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Content-Type': 'application/json'
	};

	// Handle CORS preflight
	if (request.method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders });
	}

	// Only allow GET and POST
	if (request.method !== 'GET' && request.method !== 'POST') {
		return Response.json({
			status: 'error',
			code: 405,
			msg: 'Method not allowed. Use GET or POST.'
		} as AddPackageResponse, { 
			status: 405,
			headers: corsHeaders 
		});
	}

	try {
		// Parse credentials
		let credentials: WhmCredentials | null = null;
		
		if (request.method === 'POST') {
			const contentType = request.headers.get('content-type') || '';
			
			if (contentType.includes('application/json')) {
				credentials = await request.json<WhmCredentials>() as unknown as WhmCredentials;
			} else {
				const formData = await request.formData();
				credentials = {
					ip: formData.get('ip') as string || '',
					user: formData.get('user') as string || '',
					pass: formData.get('pass') as string || ''
				};
			}
		} else {
			const url = new URL(request.url);
			credentials = {
				ip: url.searchParams.get('ip') || '',
				user: url.searchParams.get('user') || '',
				pass: url.searchParams.get('pass') || ''
			};
		}

		// Validate credentials
		if (!credentials || !isValidCredentials(credentials)) {
			return Response.json({
				status: 'error',
				code: 400,
				msg: 'Parameter ip, user, dan pass wajib diisi.'
			} as AddPackageResponse, { 
				status: 400,
				headers: corsHeaders 
			});
		}

		// Validate IP
		if (!isValidIp(credentials.ip)) {
			return Response.json({
				status: 'error',
				code: 400,
				msg: 'Format IP tidak valid.'
			} as AddPackageResponse, { 
				status: 400,
				headers: corsHeaders 
			});
		}

		// Login to WHM
		const loginResult = await whmLogin(credentials, env);
		
		if (!loginResult.success || !loginResult.token || !loginResult.cookie) {
			return Response.json({
				status: 'error',
				code: 401,
				msg: loginResult.error || 'Login gagal. Periksa IP, username, dan password.'
			} as AddPackageResponse, { 
				status: 401,
				headers: corsHeaders 
			});
		}

		const { token, cookie } = loginResult;

		// Send immediate response to client
		const immediateResponse = Response.json({
			status: 'success',
			code: 200,
			msg: 'Login berhasil, proses penambahan package sedang berlangsung.'
		} as AddPackageResponse, { 
			status: 200,
			headers: corsHeaders 
		});

		// Continue processing in background
		ctx.waitUntil((async () => {
			try {
				const results = await addAllPackages(credentials!, token, cookie, env);
				await cleanupCookie(env, credentials!.ip, credentials!.user);
				
				// Log results (could be sent to analytics service)
				const successCount = results.filter(r => r.success).length;
				const failCount = results.filter(r => !r.success).length;
				console.log('Package creation completed:', {
					total: results.length,
					success: successCount,
					failure: failCount
				});
			} catch (error) {
				console.error('Background package creation failed:', error);
				await cleanupCookie(env, credentials!.ip, credentials!.user);
			}
		})());

		return immediateResponse;

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
		return Response.json({
			status: 'error',
			code: 500,
			msg: errorMessage
		} as AddPackageResponse, { 
			status: 500,
			headers: corsHeaders 
		});
	}
}
