import axios from 'axios';

const MAGIC_API_URL = process.env.NEXT_PUBLIC_MAGIC_API_URL;

let tokenRefreshCallback: ((token: string) => void) | null = null;

export const setTokenRefreshCallback = (callback: (token: string) => void) => {
	tokenRefreshCallback = callback;
};

const magicApi = axios.create({
	baseURL: MAGIC_API_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
});

magicApi.interceptors.request.use((config) => {
	const token = localStorage.getItem('loginToken') || sessionStorage.getItem('loginToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

magicApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			const originalRequest = error.config;
			
			if (!originalRequest._retry) {
				originalRequest._retry = true;
				
				try {
					const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
					
					if (refreshToken) {
						const { default: magicApiAuth } = await import('@/services/magic_api/auth');
						const refreshResponse = await magicApiAuth.refreshToken({ refreshToken });
						
						if (refreshResponse?.data?.accessToken) {
							const newToken = refreshResponse.data.accessToken;
							const newRefreshToken = refreshResponse.data.refreshToken;
							
							localStorage.setItem('loginToken', newToken);
							sessionStorage.setItem('loginToken', newToken);
							if (newRefreshToken) {
								localStorage.setItem('refreshToken', newRefreshToken);
								sessionStorage.setItem('refreshToken', newRefreshToken);
							}
							
							if (tokenRefreshCallback) {
								tokenRefreshCallback(newToken);
							}
							
							originalRequest.headers.Authorization = `Bearer ${newToken}`;
							return magicApi(originalRequest);
						}
					}
					
					if (typeof window !== 'undefined') {
						window.dispatchEvent(new CustomEvent('showCertificateModal'));
					}
				} catch (refreshError) {
					console.error('Failed to refresh token:', refreshError);
					if (typeof window !== 'undefined') {
						window.dispatchEvent(new CustomEvent('showCertificateModal'));
					}
				}
			}
		}
		
		return Promise.reject(error);
	}
);

export default magicApi;
