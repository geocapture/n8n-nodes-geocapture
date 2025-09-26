import type {IDataObject, INodeProperties} from 'n8n-workflow';
import {createWebhook, type WebhookOperation} from '../../shared/webhook';

const RESOURCE = 'project';

const show = {
	resource: [RESOURCE],
};

export const ProjectTriggerDescription: INodeProperties[] = [
	{
		displayName: 'Actions',
		name: 'actions',
		type: 'multiOptions',
		displayOptions: { show },
		default: ['CREATE', 'UPDATE', 'DELETE'],
		required: true,
		options: [
			{
				name: 'On Create',
				value: 'CREATE',
			},
			{
				name: 'On Update',
				value: 'UPDATE',
			},
			{
				name: 'On Delete',
				value: 'DELETE',
			},
		],
	},

	{
		displayName: 'Filter',
		name: 'filter',
		type: 'collection',
		displayOptions: { show },
		default: {},
		options: [
			{
				displayName: 'Project Category Name or ID',
				name: 'projectCategoryIds',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjectCategories',
					multipleValues: true,
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},
];

export const ProjectTriggerOperation: WebhookOperation = {
	create() {
		return createWebhook.call(this, {
			type: 'PROJECT',
			actions: this.getNodeParameter('actions') as string[],
			filter: this.getNodeParameter('filter') as IDataObject,
		});
	},
};
