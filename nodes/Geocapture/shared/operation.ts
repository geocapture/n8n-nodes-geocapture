import type {IDataObject, IExecuteFunctions} from 'n8n-workflow';
import {geocaptureRequest} from './transport';

export type OperationFunction = (this: IExecuteFunctions, index: number) => Promise<IDataObject[]>;
export type Operations = Record<string, OperationFunction>;

export async function upsertRequest(
	this: IExecuteFunctions,
	{
		resource,
		records,
		getResult,
	}: {
		resource: string;
		records: {
			data: IDataObject;
			keyField: string
		}[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getResult: (result: any) => IDataObject | IDataObject[];
	},
): Promise<IDataObject[]> {
	const { result } = await geocaptureRequest.call(this, 'POST', `/${resource}/upsert`, {}, {
		records,
	});

	const returnData = getResult(result);

	return Array.isArray(returnData) ? returnData : [returnData];
}
