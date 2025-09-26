import {type LoadOptions, loadOptionsRequest} from '../../shared/load-options';

export const ProjectCategoryLoadOptions: LoadOptions = {
	async getProjectCategories() {
		return loadOptionsRequest.call(this, {
			resource: 'project_category',
			createOption: (category) => ({
				name: category.description,
				value: category.id,
			}),
		});
	},
};
