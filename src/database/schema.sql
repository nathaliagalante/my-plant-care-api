CREATE TABLE IF NOT EXISTS public.plants (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    common_name VARCHAR(255),
    water VARCHAR(255),
    watering_days VARCHAR(255),
    watering_unit VARCHAR(255),
    last_watering TIMESTAMPTZ,
    next_watering TIMESTAMPTZ,
    light VARCHAR(255),
    sunlight TEXT[],
    fertilization VARCHAR(255),
    image TEXT
);

ALTER TABLE public.plants
    ADD COLUMN IF NOT EXISTS common_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS water VARCHAR(255),
    ADD COLUMN IF NOT EXISTS last_watering TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS next_watering TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS light VARCHAR(255),
    ADD COLUMN IF NOT EXISTS sunlight TEXT[],
    ADD COLUMN IF NOT EXISTS fertilization VARCHAR(255),
    ADD COLUMN IF NOT EXISTS watering_days VARCHAR(255),
    ADD COLUMN IF NOT EXISTS watering_unit VARCHAR(255),
    ADD COLUMN IF NOT EXISTS image TEXT;
