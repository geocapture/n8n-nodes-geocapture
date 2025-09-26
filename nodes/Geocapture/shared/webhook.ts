import type {IDataObject, IHookFunctions} from 'n8n-workflow';
import {geocaptureRequest} from './transport';

export interface WebhookOperation {
	create(this: IHookFunctions): Promise<boolean>;
}

export async function createWebhook(
	this: IHookFunctions,
	{
		type,
		actions,
		filter,
	}: {
		type: string;
		actions: readonly string[],
		filter: IDataObject,
	},
): Promise<boolean> {
	const webhookUrl = this.getNodeWebhookUrl('default');
	const webhookData = this.getWorkflowStaticData('node');

	const responseData = await geocaptureRequest.call(this, 'POST', '/webhook/upsert', {
		records: [
			{
				keyField: 'externalId',
				data: {
					applicationExternalId: 'n8n',
					applicationName: 'n8n',
					url: webhookUrl,
					externalId: webhookUrl,
					configuration: {
						type,
						actions,
						filter,
					},
				},
			},
		],
	});

	const result = responseData.result.createdWebhooks?.[0] ?? responseData.result.updatedWebhooks?.[0];

	if (result == null) {
		// Required data is missing so was not successful
		return false;
	}

	webhookData.webhookId = result.id + '';
	return true;
}
