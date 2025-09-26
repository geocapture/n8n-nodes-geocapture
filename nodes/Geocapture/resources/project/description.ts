import type {IDataObject, INodeProperties} from 'n8n-workflow';
import {type OperationFunction, type Operations, upsertRequest} from '../../shared/operation';

const RESOURCE = 'project';

// --------------------------------------------------------------------------------------------------------------------------------
// Create / Upsert
// --------------------------------------------------------------------------------------------------------------------------------

const showOnlyForUpsert = {
	resource: [RESOURCE],
	operation: ['create', 'upsert'],
};

const UpsertDataOptionsDescription: INodeProperties[] = [
	{
		displayName: 'Approval Rule ID',
		name: 'approvalRuleId',
		type: 'number',
		default: 0,
	},
	{
		displayName: 'Category External ID',
		name: 'categoryExternalId',
		description: 'The external ID of the projectCategory',
		type: 'string',
		default: '',
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Contact Person',
		name: 'contactPerson',
		description: 'Contact person. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Cost Center',
		name: 'costCenter',
		description: 'The cost center. (max. 64 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Country Code',
		name: 'countryCode',
		description: 'The two-digit ISO 3166 country code',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Description',
		name: 'description',
		description: 'The project description',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Email',
		name: 'email',
		placeholder: 'test@example.org',
		description: 'Email. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Extra Name1',
		name: 'extraName1',
		description: 'The name1 address addition. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Extra Name2',
		name: 'extraName2',
		description: 'The name2 address addition. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Extra Name3',
		name: 'extraName3',
		description: 'The name3 address addition. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'ID',
		name: 'id',
		description: 'The internal project ID',
		type: 'number',
		default: 0,
	},
	{
		displayName: 'Import Key',
		name: 'importKey',
		description: 'External ID from the respective data source',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Import Source',
		name: 'importSource',
		description: 'External data source from which this project originated',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Lat Lng',
		name: 'latLng',
		description: 'The geo-coordinate. An array of two double values, representing the latitude and longitude.',
		type: 'collection',
		default: {},
		options: [
			{ displayName: 'Latitude', name: 'lat', type: 'number', default: null },
			{ displayName: 'Longitude', name: 'lng', type: 'number', default: null },
		],
	},
	{
		displayName: 'Mobile Number',
		name: 'mobileNumber',
		description: 'Mobile number. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Name',
		name: 'name',
		description: 'The project name. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Offer Reference',
		name: 'offerReference',
		description: 'The offer reference. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Order Reference',
		name: 'orderReference',
		description: 'The order reference. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		description: 'Telephone number. (max. 255 characters).',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Radius',
		name: 'radius',
		description: 'The project radius in meters',
		type: 'number',
		default: 0,
	},
	{
		displayName: 'Reference',
		name: 'reference',
		description: 'The project number',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Resource Planning From',
		name: 'resourcePlanningFrom',
		description: 'Ressource planning start date. (Only if the feature ressource planning is enabled).',
		type: 'dateTime',
		default: null,
	},
	{
		displayName: 'Resource Planning To',
		name: 'resourcePlanningTo',
		description: 'Ressource planning end date. (Only if the feature ressource planning is enabled).',
		type: 'dateTime',
		default: null,
	},
	{
		displayName: 'Street',
		name: 'street',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Valid From',
		name: 'validFrom',
		type: 'dateTime',
		default: null,
	},
	{
		displayName: 'Valid To',
		name: 'validTo',
		type: 'dateTime',
		default: null,
	},
	{
		displayName: 'Zip Code',
		name: 'zipCode',
		type: 'string',
		default: '',
	},
];

const UpsertOperationDescription: INodeProperties[] = [
	{
		displayName: 'Key Field',
		name: 'keyField',
		type: 'options',
		displayOptions: { show: showOnlyForUpsert },
		default: 'id',
		required: true,
		options: [
			{
				name: 'ID',
				value: 'id',
			},
			{
				name: 'Reference',
				value: 'reference',
			},
			{
				name: 'Import Key',
				value: 'importKey',
			},
		],
	},

	{
		displayName: 'Data',
		name: 'data',
		type: 'collection',
		displayOptions: { show: showOnlyForUpsert },
		default: {},
		required: true,
		options: UpsertDataOptionsDescription,
	},
];

const create: OperationFunction = function(index) {
	return upsertRequest.call(this, {
		resource: RESOURCE,
		records: [
			{
				keyField: 'id',
				data: {
					...this.getNodeParameter('data', index) as IDataObject,
					id: '-1',
				},
			},
		],
		getResult: result => result.createdProjects[0],
	});
};

const upsert: OperationFunction = function(index) {
	return upsertRequest.call(this, {
		resource: RESOURCE,
		records: [
			{
				keyField: this.getNodeParameter('keyField', index) as string,
				data: this.getNodeParameter('data', index) as IDataObject,
			},
		],
		getResult: result => result.updatedProjects[0] ?? result.createdProjects[0],
	});
};

// --------------------------------------------------------------------------------------------------------------------------------
// Description & Operations
// --------------------------------------------------------------------------------------------------------------------------------

export const ProjectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: [RESOURCE] },
		},
		default: 'create',
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new project',
				description: 'Create a new project',
			},
			{
				name: 'Create or Update',
				value: 'upsert',
				action: 'Create or update a project',
				description: 'Create a new project, or update the current one if it already exists (upsert)',
			},
		],
	},

	...UpsertOperationDescription,
];

export const ProjectOperations: Operations = {
	create,
	upsert,
};
