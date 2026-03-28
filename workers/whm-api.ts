/**
 * WHM cPanel Package Manager
 * 
 * Utility functions for interacting with WHM cPanel API
 * Handles login, package creation, and package deletion
 */

// ----------------------------------------------------------------------
// Package Definitions (based on PHP implementation)
// ----------------------------------------------------------------------
export interface PackageParams {
	bwlimit: number | 'unlimited';
	quota: number | 'unlimited';
	maxsub: number | 'unlimited';
	maxaddon: number;
	maxpark: number;
	maxftp: number | 'unlimited';
	maxsql: number | 'unlimited';
	maxpop: number | 'unlimited';
	cgi: number;
	frontpage: number;
	cpmod: string;
	language: string;
}

export type Packages = Record<string, PackageParams>;

export const PACKAGES: Packages = {
	// cPanel Packages
	'cPanel Mini': {
		bwlimit: 1024,
		quota: 512,
		maxsub: 10,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 10,
		maxsql: 10,
		maxpop: 25,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'cPanel Medium': {
		bwlimit: 2048,
		quota: 1024,
		maxsub: 20,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 20,
		maxsql: 20,
		maxpop: 50,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'cPanel Extra': {
		bwlimit: 4096,
		quota: 2048,
		maxsub: 30,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 30,
		maxsql: 30,
		maxpop: 75,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'cPanel Super': {
		bwlimit: 8192,
		quota: 4096,
		maxsub: 50,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 50,
		maxsql: 50,
		maxpop: 100,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},

	// Reseller (WHM) Packages
	'Whm Mini': {
		bwlimit: 10240,
		quota: 5120,
		maxsub: 100,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 100,
		maxsql: 100,
		maxpop: 200,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'Whm Medium': {
		bwlimit: 20480,
		quota: 10240,
		maxsub: 150,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 150,
		maxsql: 150,
		maxpop: 300,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'Whm Extra': {
		bwlimit: 30720,
		quota: 15360,
		maxsub: 200,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 200,
		maxsql: 200,
		maxpop: 400,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'Whm Super': {
		bwlimit: 51200,
		quota: 25600,
		maxsub: 300,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 300,
		maxsql: 300,
		maxpop: 600,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},

	// Mega WHM Packages
	'Mwhm Mini': {
		bwlimit: 102400,
		quota: 51200,
		maxsub: 500,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 500,
		maxsql: 500,
		maxpop: 1000,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'Mwhm Medium': {
		bwlimit: 204800,
		quota: 102400,
		maxsub: 750,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 750,
		maxsql: 750,
		maxpop: 1500,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'Mwhm Extra': {
		bwlimit: 307200,
		quota: 153600,
		maxsub: 1000,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 1000,
		maxsql: 1000,
		maxpop: 2000,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'Mwhm Super': {
		bwlimit: 512000,
		quota: 256000,
		maxsub: 1500,
		maxaddon: 0,
		maxpark: 0,
		maxftp: 1500,
		maxsql: 1500,
		maxpop: 3000,
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},

	// Unlimited Packages
	'Admin': {
		bwlimit: 'unlimited',
		quota: 'unlimited',
		maxsub: 'unlimited',
		maxaddon: 0,
		maxpark: 0,
		maxftp: 'unlimited',
		maxsql: 'unlimited',
		maxpop: 'unlimited',
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'Ceo': {
		bwlimit: 'unlimited',
		quota: 'unlimited',
		maxsub: 'unlimited',
		maxaddon: 0,
		maxpark: 0,
		maxftp: 'unlimited',
		maxsql: 'unlimited',
		maxpop: 'unlimited',
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	},
	'Wakil Founder': {
		bwlimit: 'unlimited',
		quota: 'unlimited',
		maxsub: 'unlimited',
		maxaddon: 0,
		maxpark: 0,
		maxftp: 'unlimited',
		maxsql: 'unlimited',
		maxpop: 'unlimited',
		cgi: 1,
		frontpage: 0,
		cpmod: 'jupiter',
		language: 'en'
	}
};

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
export interface WhmCredentials {
	ip: string;
	user: string;
	pass: string;
}

export interface WhmLoginResponse {
	success: boolean;
	token?: string;
	cookie?: string;
	error?: string;
}

export interface PackageResult {
	name: string;
	success: boolean;
	error?: string;
}

export interface AddPackageResponse {
	status: 'success' | 'error' | 'processing';
	code?: number;
	msg: string;
	results?: PackageResult[];
}

export interface DeletePackageResponse {
	status: 'success' | 'error' | 'processing' | 'empty';
	msg: string;
	deleted?: string[];
	failed?: string[];
}

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

/**
 * Validate IP address format
 */
export function isValidIp(ip: string): boolean {
	return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip) || 
	       /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/.test(ip);
}

/**
 * Validate credentials
 */
export function isValidCredentials(credentials: WhmCredentials): boolean {
	return !!(credentials.ip && credentials.user && credentials.pass);
}

/**
 * Create cookie key based on IP and user
 */
function getCookieKey(ip: string, user: string): string {
	return `whm_${btoa(`${ip}:${user}`)}`;
}

// ----------------------------------------------------------------------
// WHM API Functions
// ----------------------------------------------------------------------

/**
 * Login to WHM and get security token
 */
export async function whmLogin(credentials: WhmCredentials, env: Env): Promise<WhmLoginResponse> {
	const { ip, user, pass } = credentials;
	const url = `https://${ip}:2087/login/?login_only=2`;
	const cookieKey = getCookieKey(ip, user);

	try {
		const formData = new URLSearchParams();
		formData.append('user', user);
		formData.append('pass', pass);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		});

		const text = await response.text();
		const json = JSON.parse(text);

		if (json.status === 1 && json.security_token) {
			// Store cookie in KV storage for subsequent requests
			const cookie = response.headers.get('set-cookie') || '';
			await env.WHM_COOKIES.put(cookieKey, JSON.stringify({
				cookie,
				token: json.security_token,
				timestamp: Date.now()
			}));

			return {
				success: true,
				token: json.security_token,
				cookie
			};
		}

		return {
			success: false,
			error: json.reason || 'Login failed'
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

/**
 * Get stored cookie and token
 */
export async function getStoredCookie(env: Env, ip: string, user: string): Promise<{ cookie: string; token: string } | null> {
	const cookieKey = getCookieKey(ip, user);
	try {
		const stored = await env.WHM_COOKIES.get(cookieKey);
		if (stored) {
			const data = JSON.parse(stored);
			// Check if cookie is still valid (1 hour expiry)
			if (Date.now() - data.timestamp < 3600000) {
				return { cookie: data.cookie, token: data.token };
			}
		}
	} catch {
		// Ignore errors, just return null
	}
	return null;
}

/**
 * Add a single package to WHM
 */
export async function addPackage(
	ip: string,
	token: string,
	cookie: string,
	packageName: string,
	params: PackageParams
): Promise<PackageResult> {
	const url = `https://${ip}:2087${token}/json-api/addpkg`;
	const formData = new URLSearchParams({
		'api.version': '1',
		'name': packageName,
		...Object.entries(params).reduce((acc, [key, value]) => {
			acc[key] = String(value);
			return acc;
		}, {} as Record<string, string>)
	});

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Cookie': cookie
			},
			body: formData.toString(),
		});

		const result = await response.json();

		if (result.metadata?.result === 1) {
			return { name: packageName, success: true };
		}

		return {
			name: packageName,
			success: false,
			error: result.metadata?.reason || 'Failed to add package'
		};
	} catch (error) {
		return {
			name: packageName,
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

/**
 * Add all packages to WHM
 */
export async function addAllPackages(
	credentials: WhmCredentials,
	token: string,
	cookie: string,
	env: Env
): Promise<PackageResult[]> {
	const { ip } = credentials;
	const results: PackageResult[] = [];

	for (const [name, params] of Object.entries(PACKAGES)) {
		const result = await addPackage(ip, token, cookie, name, params);
		results.push(result);
	}

	return results;
}

/**
 * List all packages from WHM
 */
export async function listPackages(
	ip: string,
	token: string,
	cookie: string
): Promise<string[]> {
	const url = `https://${ip}:2087${token}/json-api/listpkgs?api.version=1`;

	try {
		const response = await fetch(url, {
			headers: {
				'Cookie': cookie
			}
		});

		const result = await response.json();

		if (result.data?.pkg) {
			return result.data.pkg
				.filter((pkg: { name?: string }) => pkg.name && pkg.name.toLowerCase() !== 'default')
				.map((pkg: { name: string }) => pkg.name);
		}

		return [];
	} catch {
		return [];
	}
}

/**
 * Delete a single package from WHM
 */
export async function deletePackage(
	ip: string,
	token: string,
	cookie: string,
	packageName: string
): Promise<PackageResult> {
	const url = `https://${ip}:2087${token}/json-api/killpkg?api.version=1&pkg=${encodeURIComponent(packageName)}`;

	try {
		const response = await fetch(url, {
			headers: {
				'Cookie': cookie
			}
		});

		const result = await response.json();

		if (result.metadata?.result === 1) {
			return { name: packageName, success: true };
		}

		return {
			name: packageName,
			success: false,
			error: result.metadata?.reason || 'Failed to delete package'
		};
	} catch (error) {
		return {
			name: packageName,
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

/**
 * Delete all packages from WHM (except 'default')
 */
export async function deleteAllPackages(
	credentials: WhmCredentials,
	token: string,
	cookie: string
): Promise<{ deleted: string[]; failed: string[] }> {
	const { ip } = credentials;
	const packageNames = await listPackages(ip, token, cookie);
	const deleted: string[] = [];
	const failed: string[] = [];

	for (const name of packageNames) {
		const result = await deletePackage(ip, token, cookie, name);
		if (result.success) {
			deleted.push(name);
		} else {
			failed.push(name);
		}
	}

	return { deleted, failed };
}

/**
 * Clean up stored cookie
 */
export async function cleanupCookie(env: Env, ip: string, user: string): Promise<void> {
	const cookieKey = getCookieKey(ip, user);
	try {
		await env.WHM_COOKIES.delete(cookieKey);
	} catch {
		// Ignore cleanup errors
	}
}
