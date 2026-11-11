class ExternalPlantApi {
    async searchPlants(query) {
        const apiKey = process.env.EXTERNAL_PLANT_API_KEY;

        if (!apiKey) {
            throw new Error("API Key da API externa não configurada no .env");
        }

        const response = await fetch(`https://perenual.com/api/v2/species-list?key=${apiKey}&q=${query}`)
        const data = await response.json()

        return data.data.map(plant => ({
            id: plant.id,
            name: plant.scientific_name[0] || "Desconhecido",
            commonName: plant.common_name || "Sem nome popular",
            image: plant.default_image.thumbnail || plant.default_image.original_url
        }));
    }

    async getPlantById(id) {
        const apiKey = process.env.EXTERNAL_PLANT_API_KEY;

        if (!apiKey) {
            throw new Error("API Key da API externa não configurada no .env");
        }

        const response = await fetch(
            `https://perenual.com/api/v2/species/details/${encodeURIComponent(id)}?key=${encodeURIComponent(apiKey)}`
        );

        if (!response.ok) {
            const error = new Error(`External plant API returned status ${response.status}`);
            error.statusCode = response.status;
            throw error;
        }

        const plant = await response.json();

        if (!plant || typeof plant !== "object" || Array.isArray(plant) || !plant.id) {
            throw new Error("External plant API returned an invalid plant");
        }

        const wateringBenchmark = plant.watering_general_benchmark || {};

        return {
            id: plant.id,
            name: plant.scientific_name[0] || "Desconhecido",
            commonName: plant.common_name || "Sem nome popular",
            water: plant.watering || '',
            wateringDays: wateringBenchmark.value ?? null,
            wateringUnit: wateringBenchmark.unit ?? null,
            sunlight: plant.sunlight,
            image: plant.default_image?.thumbnail || plant.default_image?.original_url || null
        };
    }
}

module.exports = new ExternalPlantApi()