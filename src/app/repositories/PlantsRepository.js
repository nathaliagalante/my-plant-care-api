const db = require('../../database')

class PlantsRepository {
    async findAll() {
        const rows = await db.query(`
            SELECT
                id,
                name,
                common_name AS "commonName",
                water,
                watering_days AS "wateringDays",
                watering_unit AS "wateringUnit",
                last_watering AS "lastWatering",
                next_watering AS "nextWatering",
                sunlight,
                image
            FROM plants
        `)
        return rows
    }

    async findWateringDays({ id }) {
        const [row] = await db.query(`
            SELECT watering_days AS "wateringDays"
            FROM plants
            WHERE id = $1
        `, [id])

        return row
    }

    async create({ id, name, commonName, water, wateringDays, wateringUnit, sunlight, image }) {
        const [row] = await db.query(`
            INSERT INTO plants(id, name, common_name, water, watering_days, watering_unit, sunlight, image)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING
                id,
                name,
                common_name AS "commonName",
                water,
                watering_days AS "wateringDays",
                watering_unit AS "wateringUnit",
                sunlight,
                image
        `, [id, name, commonName, water, wateringDays, wateringUnit, sunlight, image])
        
        return row
    }

    async update({ id, lastWatering, nextWatering }) {
        const [row] = await db.query(`
            UPDATE plants
            SET last_watering = $2, next_watering = $3
            WHERE id = $1
            RETURNING
                id,
                name,
                common_name AS "commonName",
                water,
                watering_days AS "wateringDays",
                watering_unit AS "wateringUnit",
                last_watering AS "lastWatering",
                next_watering AS "nextWatering",
                sunlight,
                image
        `, [id, lastWatering, nextWatering])

        return row
    }

    async delete({ id }) {
        const [deletedPlant] = await db.query(
            'DELETE FROM plants WHERE id = $1 RETURNING id',
            [id]
        )

        return deletedPlant
    }
}

module.exports = new PlantsRepository()