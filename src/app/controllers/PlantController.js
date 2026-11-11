const ExternalPlantAPI = require("../services/ExternalPlantApi")
const PlantsRepository = require("../repositories/PlantsRepository")

const DEFAULT_WATERING_DAYS = 5

class PlantController {
    async index(request, response) {
        const plants = await PlantsRepository.findAll()
        response.json(plants)
    }

    async search(request, response) {
        try {
            const { query } = request.query

            if (!query) {
                return response.status(400).json({
                    error: 'Termo de pesquisa é obrigatório'
                })
            }

            const plants = await ExternalPlantAPI.searchPlants(query)

            return response.json(plants)
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao buscar plantas' })
        }
    }

    async searchById(request, response) {
        try {
            const { id } = request.params
            
            if (!id) {
                return response.status(400).json({ error: 'ID is Required' })
            }

            if (!/^\d+$/.test(id)) {
                return response.status(400).json({
                    error: 'ID inválido. Informe o ID numérico da planta, não o objeto completo.'
                })
            }

            const plant = await ExternalPlantAPI.getPlantById(id)

            return response.json(plant)
        } catch (error) {
            console.error('Erro ao buscar planta por ID:', error)

            if (error.statusCode === 429) {
                return response.status(503).json({
                    error: 'A API externa atingiu o limite de requisições. Tente novamente mais tarde.'
                })
            }

            if (error.statusCode) {
                return response.status(502).json({ error: 'A API externa não conseguiu buscar a planta' })
            }

            return response.status(500).json({ error: 'Erro ao buscar planta' })
        }
    }

    async store(request, response) {
        const { id, name } = request.body

        if (!id || !/^\d+$/.test(String(id))) {
            return response.status(400).json({
                error: 'ID inválido. Informe o ID numérico da planta, não o objeto completo.'
            })
        }

        if (!name) {
            return response.status(400).json({error: 'Name is required' })
        }

        try {
            const details = await ExternalPlantAPI.getPlantById(id)
            const plant = await PlantsRepository.create({
                ...details,
                id,
                name: details.name || name
            })

            return response.status(201).json(plant)
        } catch (error) {
            if (error.statusCode === 429) {
                return response.status(503).json({
                    error: 'A API externa atingiu o limite de requisições. Tente novamente mais tarde.'
                })
            }

            if (error.statusCode) {
                return response.status(502).json({ error: 'A API externa não conseguiu buscar a planta' })
            }

            return response.status(500).json({ error: 'Erro ao salvar planta' })
        }
    }

    async update(request, response) {
        const lastWatering = new Date()
        const { id } = request.params

        if (!/^\d+$/.test(id)) {
            return response.status(400).json({
                error: 'ID inválido. Informe o ID numérico da planta.'
            })
        }

        const plant = await PlantsRepository.findWateringDays({ id })

        if (!plant) {
            return response.status(404).json({ error: 'Planta não encontrada' })
        }

        const wateringDays = String(plant.wateringDays ?? '')
            .normalize('NFKC')
            .replace(/[‐‑‒–—−]/g, '-')
            .replace(/^["']|["']$/g, '')
            .trim()
        let days = DEFAULT_WATERING_DAYS

        if (wateringDays) {
            const wateringInterval = wateringDays.match(/^(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?$/)

            if (!wateringInterval) {
                return response.status(422).json({
                    error: 'Intervalo de rega inválido para esta planta.'
                })
            }

            days = Number(wateringInterval[2] || wateringInterval[1])
        }

        if (!Number.isFinite(days) || days <= 0) {
            return response.status(422).json({
                error: 'Intervalo de rega inválido para esta planta.'
            })
        }

        const nextWatering = new Date(lastWatering.getTime() + days * 24 * 60 * 60 * 1000)
        const wateredPlant = await PlantsRepository.update({ id, lastWatering, nextWatering })

        if (!wateredPlant) {
            return response.status(404).json({ error: 'Planta não encontrada' })
        }

        return response.json(wateredPlant)
    }

    async delete(request, response) {
        const { id } = request.params

        if (!/^\d+$/.test(id)) {
            return response.status(400).json({
                error: 'ID inválido. Informe o ID numérico da planta.'
            })
        }

        const deletedPlant = await PlantsRepository.delete({ id })

        if (!deletedPlant) {
            return response.status(404).json({ error: 'Planta não encontrada' })
        }

        return response.sendStatus(204)
    }
}

module.exports = new PlantController()