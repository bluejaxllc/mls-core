import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para agregar URLs de Google Maps Street View CON API KEY
 */

const GOOGLE_MAPS_API_KEY = 'AIzaSyDJxi6EGYIJfJSPN7_uwiXLn6ULDH8zK7c';

function getStreetViewUrl(address: string, city: string): string {
    const fullAddress = `${address}, ${city}, Chihuahua, Mexico`;
    const encoded = encodeURIComponent(fullAddress);

    // URL de Google Street View Static API con API key
    return `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${encoded}&heading=0&pitch=0&fov=90&key=${GOOGLE_MAPS_API_KEY}`;
}

async function addStreetViewImages() {
    console.log('📸 Adding Google Street View images with API key...');

    const propertiesPath = path.join(__dirname, '../../dummy-data/properties.json');
    const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));

    let updated = 0;

    // Agregar Street View URL a cada propiedad
    properties.forEach((property: any) => {
        if (property.address && property.city) {
            property.image = getStreetViewUrl(property.address, property.city);
            updated++;
        }
    });

    // Guardar archivo actualizado
    fs.writeFileSync(propertiesPath, JSON.stringify(properties, null, 2));
    console.log(`✅ Updated ${updated} properties with Street View images`);

    // También copiar a web/public/data
    const webPath = path.join(__dirname, '../../web/public/data/properties.json');
    fs.writeFileSync(webPath, JSON.stringify(properties, null, 2));
    console.log('✅ Copied to web/public/data/properties.json');

    console.log('\n✨ Properties now show real Google Street View with API key!');

    // Mostrar ejemplo
    console.log('\n📋 Example URL:');
    console.log(properties[0].image);
}

addStreetViewImages().catch(console.error);
