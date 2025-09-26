import {
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';
import {ProjectTriggerDescription, ProjectTriggerOperation} from './resources/project/trigger-description';
import type {WebhookOperation} from './shared/webhook';
import {geocaptureRequest} from './shared/transport';
import {ProjectCategoryLoadOptions} from './resources/project-category/load-options';

export class GeocaptureTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'geoCapture Trigger',
		name: 'geocaptureTrigger',
		icon: 'file:../../icons/geocapture.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["resource"]}}',
		description: 'Handle geoCapture events via webhooks',
		defaults: {
			name: 'geoCapture Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'geocaptureApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				required: true,
				default: 'project',
				options: [
					{ name: 'Project', value: 'project' },
				],
			},

			...ProjectTriggerDescription,
		],
	};

	methods = {
		loadOptions: {
			...ProjectCategoryLoadOptions,
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const { result } = await geocaptureRequest.call(this, 'GET', 'webhook/fetch', {
					'filter[byExternalIds]': webhookUrl,
				});

				return result?.data != null && result.data.length === 1;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const resource = this.getNodeParameter('resource') as string;

				return webhooks[resource].create.call(this);
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId == null) {
					return true;
				}

				const { result } = await geocaptureRequest.call(this, 'GET', 'webhook/delete', {
					'filter[byIds]': webhookData.webhookId,
				});

				return result?.deletedWebhooks != null && result.deletedWebhooks.length > 0;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();

		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
		};
	}
}

const webhooks: Record<string, WebhookOperation> = {
	project: ProjectTriggerOperation,
};
