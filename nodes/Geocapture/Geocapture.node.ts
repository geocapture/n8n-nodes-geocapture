import {type IExecuteFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription, NodeConnectionType} from 'n8n-workflow';
import {ProjectDescription, ProjectOperations} from './resources/project/description';
import {ProjectCategoryLoadOptions} from './resources/project-category/load-options';
import type {Operations} from './shared/operation';

export class Geocapture implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'geoCapture',
		name: 'geocapture',
		icon: 'file:../../icons/geocapture.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume geoCapture API',
		defaults: {
			name: 'geoCapture',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'geocaptureApi',
				required: true,
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
			...ProjectDescription,
		],
	};

	methods = {
		loadOptions: {
			...ProjectCategoryLoadOptions,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const execute = operations[resource]?.[operation];

		if (execute == null) {
			return [];
		}

		for (let i = 0; i < items.length; ++i) {
			try {
				const responseData = await execute.call(this, i);
				const executeResult = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executeResult);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);

					returnData.push(...executionErrorData);
					continue;
				}

				throw error;
			}
		}

		return [returnData];
	}
}

const operations: Record<string, Operations> = {
	project: ProjectOperations,
};
