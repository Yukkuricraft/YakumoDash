export interface ILoginRequest {
	id_token: string;
}

export interface ILoginReturn {
	access_token: string;
}

export interface ILogoutRequest {
	access_token: string;
}

export interface ILogoutReturn {
	success: boolean;
}
