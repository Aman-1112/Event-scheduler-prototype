class ApiFeatures {
	constructor(query, queryParams) {
		this.query = query;
		this.queryParams = queryParams;
	}

	filter() {
		//?{entryFee:{$lte:80}}
		//? string or number
		//? {entryFee:{'$lte':'80'}}

		let excluded = ['page', 'limit', 'fields', 'sort'];
		//filtering
		let queryParams = { ...this.queryParams };
		excluded.map((e) => delete queryParams[e]);

		// query with parameter
		let queryInJson = JSON.stringify(queryParams);

		let regex = new RegExp(/\bgte|lte|gt|lt\b/, 'ig');
		queryInJson = queryInJson.replace(regex, (matched) => {
			return `$${matched}`;
		});
		queryParams = JSON.parse(queryInJson);
		this.query = this.query.find(queryParams);
		return this;
	}
	pagination() {
		//pagination and limit
		const page = this.queryParams.page || 1;
		const limit = this.queryParams.limit || 10;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
	sorting() {
		//sorting
		if (this.queryParams.sort) {
			//? what error to give if query is not in proper format
			//? also why this format only
			let sort = this.queryParams.sort.replace(/,/g, ' ');
			this.query = this.query.sort(sort);
		} else {
			// this.query = this.query.sort('createdAt');
			this.query = this.query.sort('start');
		}
		return this;
	}
	projection() {
		//projection
		if (this.queryParams.fields) {
			let fields = this.queryParams.fields.replace(/,/g, ' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}
}

module.exports = ApiFeatures;
