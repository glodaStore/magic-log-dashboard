import magicApi from '../index';
import { CertificateLoginRequest, CertificateLoginResponse, EmailLoginRequest, EmailLoginResponse, RefreshTokenRequest, RefreshTokenResponse } from './models';

export const certificateLogin = async (
	data: CertificateLoginRequest
): Promise<CertificateLoginResponse> => {
	const formData = new FormData();
	formData.append('file', data.certificate);

	const response = await magicApi.post<CertificateLoginResponse>(
		'/auth/certificate/login',
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	);
	return response.data;
};

export const emailLogin = async (
	data: EmailLoginRequest
): Promise<EmailLoginResponse> => {
	const response = await magicApi.post<EmailLoginResponse>(
		'/auth/login',
		data,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
	return response.data;
};

export const refreshToken = async (
	data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
	const response = await magicApi.post<RefreshTokenResponse>(
		'/auth/refresh',
		data,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
	return response.data;
};

const magicApiAuth = {
	certificateLogin,
	emailLogin,
	refreshToken,
};

export default magicApiAuth;