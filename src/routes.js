const { Router } = require('express')

const PlantController = require('./app/controllers/PlantController')

const router = Router()

router.get('/plants', PlantController.index)
router.get('/plants/search', PlantController.search)
router.get('/plants/:id', PlantController.searchById)
router.post('/plants', PlantController.store)
router.put('/plants/:id', PlantController.update)
router.delete('/plants/:id', PlantController.delete)

module.exports = router