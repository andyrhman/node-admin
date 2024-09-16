class AbstractService {
    constructor(model) {
        this.model = model;
    }

    async all(relations = []) {
        return await this.model.findAll({ include: relations });
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        return await this.model.update(data, { where: { id } });
    }

    async delete(id) {
        return await this.model.destroy({ where: { id } });
    }

    async findOne(options = {}, relations = []) {
        return await this.model.findOne({ where: options, include: relations });
    }

    async findByEmail(email) {
        return await this.model.findOne({ where: { email } });
    }

    async findByUsername(username) {
        return await this.model.findOne({ where: { username } });
    }

    async findByUsernameOrEmail(username, email) {
        return await this.model.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email }
                ]
            }
        });
    }

    async paginate(page, limit, relations = []) {
        const offset = (page - 1) * limit;
        const options = {
            limit,
            offset
        };

        if (relations.length > 0) {
            options.include = relations;
        }

        const { rows: data, count: total } = await this.model.findAndCountAll(options);

        return {
            data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
            }
        };
    }

}

module.exports = AbstractService;
