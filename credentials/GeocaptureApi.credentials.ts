import type {IAuthenticateGeneric, Icon, ICredentialTestRequest, ICredentialType, INodeProperties} from 'n8n-workflow';

export class GeocaptureApi implements ICredentialType {
	name = 'geocaptureApi';

	displayName = 'geoCapture API';

	icon: Icon = { light: 'file:../icons/geocapture.svg', dark: 'file:../icons/geocapture.dark.svg' };

	documentationUrl =
		'https://app.geocapture.net/api/help/view';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-token': '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.geocapture.net',
			url: '/api/me',
			method: 'GET',
		},
	};
}
