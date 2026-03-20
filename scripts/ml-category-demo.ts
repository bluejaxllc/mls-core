import fs from 'fs';
import path from 'path';

// Sample product catalog to map to Mercado Libre categories
const dummyProducts = [
    { id: 1, title: 'Casa en Venta en Chihuahua', type: 'Real Estate', categoryName: 'Inmuebles' },
    { id: 2, title: 'Laptop Gamer Dell G15', type: 'Electronics', categoryName: 'Computación' },
    { id: 3, title: 'iPhone 13 Pro 128GB', type: 'Phones', categoryName: 'Celulares y Telefonía' },
    { id: 4, title: 'Silla de Oficina Ergonómica', type: 'Furniture', categoryName: 'Hogar, Muebles y Jardín' },
    { id: 5, title: 'Honda Civic 2020', type: 'Vehicles', categoryName: 'Autos, Motos y Otros' }
];

async function mlCategoryMappingDemo() {
    console.log('--- Mercado Libre Category Mapping Demo ---\n');

    try {
        console.log('1. Fetching root categories for site MLM (Mexico)...');
        // The ML Categories API is public and does not require an access token
        const res = await fetch('https://api.mercadolibre.com/sites/MLM/categories');
        
        if (!res.ok) {
            throw new Error(`ML API HTTP error: ${res.status}`);
        }
        
        const rootCategories: { id: string, name: string }[] = await res.json();
        
        console.log(`✅ Successfully fetched ${rootCategories.length} root categories.`);
        
        console.log('\n2. Attempting to map dummy products to ML Categories...');
        
        const mappedProducts = dummyProducts.map(product => {
            // Very simple heuristic: find a root category that matches our known product category name
            const mlCategory = rootCategories.find(c => 
                c.name.toLowerCase().includes(product.categoryName.toLowerCase()) || 
                product.categoryName.toLowerCase().includes(c.name.toLowerCase())
            );

            return {
                ...product,
                ml_category_id: mlCategory ? mlCategory.id : 'UNKNOWN',
                ml_category_name: mlCategory ? mlCategory.name : 'Unknown'
            };
        });

        console.table(mappedProducts, ['title', 'type', 'ml_category_id', 'ml_category_name']);

        // Demonstrate drilling down into a specific category (Real Estate)
        const realEstateCategory = mappedProducts.find(p => p.type === 'Real Estate')?.ml_category_id;
        
        if (realEstateCategory && realEstateCategory !== 'UNKNOWN') {
            console.log(`\n3. Drilling down into Real Estate Category (${realEstateCategory})...`);
            try {
                const catRes = await fetch(`https://api.mercadolibre.com/categories/${realEstateCategory}`);
                if (!catRes.ok) throw new Error(`HTTP ${catRes.status}`);
                const catData = await catRes.json();
                const children = catData.children_categories;
                console.log(`Found ${children.length} sub-categories under ${catData.name}:`);
                children.slice(0, 5).forEach((child: any) => {
                    console.log(`  - ${child.id}: ${child.name}`);
                });
                if (children.length > 5) console.log(`  ... and ${children.length - 5} more.`);
            } catch (err: any) {
                 console.log('Error fetching category details:', err.message);
            }
        }

        console.log('\n✅ Demo Complete.');

    } catch (error: any) {
        console.error('❌ Failed to fetch ML categories:', error.message);
    }
}

mlCategoryMappingDemo();
