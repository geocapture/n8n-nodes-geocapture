import type {IDataObject, IExecuteFunctions, IExecuteSingleFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions} from 'n8n-workflow';

export async function geocaptureRequest(
	this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	path: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
) {
	if (path.startsWith('/')) {
		path = path.slice(1);
	}

	return this.helpers.httpRequestWithAuthentication.call(this, 'geocaptureApi', {
		method: method,
		qs,
		body,
		url: `https://app.geocapture.net/api/${path}`,
		json: true,
	});
}
