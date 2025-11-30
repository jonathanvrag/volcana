CREATE TABLE IF NOT EXISTS playlist (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS media_item (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER REFERENCES playlist(id) ON DELETE CASCADE,
    type TEXT NOT NULL,                    -- 'image', 'video', 'text', 'clip'
    title TEXT,
    description TEXT,
    file_url TEXT NOT NULL,                -- ruta/URL al archivo
    duration_seconds INTEGER DEFAULT 20,   -- para el loop de la pantalla
    order_index INTEGER DEFAULT 0,         -- orden en el loop
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
