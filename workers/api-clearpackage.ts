/**
 * API Handler for /api/clearpackage-root
 * 
 * Deletes all WHM cPanel packages (except 'default') on the specified server
 * Accepts GET or POST requests with ip, user, pass parameters
 */

import type { WhmCredentials, DeletePackageResponse } from './whm-api';
import {
	isValidIp,
	isValidCredentials,
	whmLogin,
	deleteAllPackages,
	cleanupCookie
} from './whm-api';

/**
 * Handle POST/GET request to delete all packages
 */
export async function handleClearPackage(
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
		} as DeletePackageResponse, { 
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
			} as DeletePackageResponse, { 
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
			} as DeletePackageResponse, { 
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
			} as DeletePackageResponse, { 
				status: 401,
				headers: corsHeaders 
			});
		}

		const { token, cookie } = loginResult;

		// Send immediate response to client
		const immediateResponse = Response.json({
			status: 'processing',
			msg: 'Menghapus semua paket...'
		} as DeletePackageResponse, { 
			status: 200,
			headers: corsHeaders 
		});

		// Continue processing in background
		ctx.waitUntil((async () => {
			try {
				const result = await deleteAllPackages(credentials!, token, cookie);
				await cleanupCookie(env, credentials!.ip, credentials!.user);
				
				// Log results
				console.log('Package deletion completed:', {
					deleted: result.deleted.length,
					failed: result.failed.length,
					deletedPackages: result.deleted,
					failedPackages: result.failed
				});
			} catch (error) {
				console.error('Background package deletion failed:', error);
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
		} as DeletePackageResponse, { 
			status: 500,
			headers: corsHeaders 
		});
	}
}
