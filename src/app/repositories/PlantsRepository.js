const db = require('../../database')

class PlantsRepository {
    async findAll() {
        const rows = await db.query('SELECT * FROM plants')
        return rows
    }

    async create({ id, name }) {
        const [row] = await db.query(`
            INSERT INTO plants(id_plant, name)
            VALUES($1, $2)
            RETURNING *
        `, [id, name])
        
        return row
    }
}

module.exports = new PlantsRepository()