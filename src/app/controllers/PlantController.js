const ExternalPlantAPI = require("../services/ExternalPlantApi")
const PlantsRepository = require("../repositories/PlantsRepository")

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
            const { id } = request.query
            
            if (!id) {
                return response.status(400).json({ error: 'ID is Required' })
            }

            const plant = await ExternalPlantAPI.getPlantById(id)

            return response.json(plant)
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao buscar planta' })
        }
    }

    async store(request, response) {
        const { id, name } = request.body

        if (!id) {
            return response.status(400).json({ error: 'ID is Required' })
        }

        if (!name) {
            return response.status(400).json({error: 'Name is required' })
        }

        const plant = await PlantsRepository.create({ id, name })
        response.status(201).json(plant)
    }

    delete(request, response) {
        const { id } = request.params

        return response.json({ message: `Plant with id ${id} deleted successfully` })
    }
}

module.exports = new PlantController()