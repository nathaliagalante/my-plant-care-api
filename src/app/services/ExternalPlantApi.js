class ExternalPlantApi {
    async searchPlants(query) {
        const apiKey = process.env.EXTERNAL_PLANT_API_KEY;

        if (!apiKey) {
            throw new Error("API Key da API externa não configurada no .env");
        }

        const response = await fetch(`https://perenual.com/api/v2/species-list?key=${apiKey}&q=${query}`)
        const data = await response.json()

        console.log("Dados recebidos da API externa:", data); // Log para depuração

        return data.data.map(plant => ({
            id: plant.id,
            name: plant.scientific_name[0] || "Desconhecido",
            commonName: plant.common_name || "Sem nome popular",
            water: plant.watering || "A cada 7 dias",
            light: "Luz indireta",
            sunlight: "Indireta",
            fertilization: "30 dias", // A Perenual detalha isso em outro endpoint, então usamos um fallback
            image: plant.default_image.thumbnail || plant.default_image.original_url
        }));
    }

    async getPlantById(id) {
        const apiKey = process.env.EXTERNAL_PLANT_API_KEY;

        if (!apiKey) {
            throw new Error("API Key da API externa não configurada no .env");
        }

        const response = await fetch(`https://perenual.com/api/v2/species/details/${id}?key=${apiKey}&q=${query}`)
        const data = await response.json()

        console.log("Dados recebidos da API externa:", data); // Log para depuração
    }
}

module.exports = new ExternalPlantApi()