export interface CertificateLoginRequest {
	certificate: File;
}

export interface CertificateLoginResponse {
	message: string;
	data: {
		accessToken: string;
		refreshToken: string;
		user: {
			id: string;
			email: string;
			name: string;
			role: string;
			storeId: string;
		};
	};
}

export interface EmailLoginRequest {
	email: string;
	password: string;
	magicId: string;
}

export interface EmailLoginResponse {
	message: string;
	data: {
		accessToken: string;
		refreshToken: string;
		user: {
			id: string;
			email: string;
			name: string;
			role: string;
			storeId: string;
		};
	};
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export interface RefreshTokenResponse {
	message: string;
	data: {
		accessToken: string;
		refreshToken: string;
	};
}
