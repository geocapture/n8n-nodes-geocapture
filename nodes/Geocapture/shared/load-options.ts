import type {ILoadOptionsFunctions, INodePropertyOptions} from 'n8n-workflow';
import {geocaptureRequest} from './transport';

export type LoadOptionsFunction = (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>
export type LoadOptions = Record<string, LoadOptionsFunction>;

export async function loadOptionsRequest(
	this: ILoadOptionsFunctions,
	{
		resource,
		createOption,
	}: {
		resource: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		createOption: (data: any) => INodePropertyOptions
	},
): Promise<INodePropertyOptions[]> {
	const { result } = await geocaptureRequest.call(this, 'GET', `/${resource}/fetch`);

	return result.data.map(createOption);
}
