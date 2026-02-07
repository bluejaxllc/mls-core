// Extension to normalizer for Mercado Libre data
export function normalizeMercadoLibre(mlItem: any): {
    title: string;
    description: string;
    price: number;
    currency: string;
    address: string;
    status: string;
    images: string[];
    url: string;
    externalId: string;
} {
    const attrs = mlItem.attributes || [];
    const getAttr = (id: string) => attrs.find((a: any) => a.id === id);

    // Determine if rent or sale
    const operationType = getAttr('OPERATION_TYPE');
    const isRent =
        operationType?.value_name?.toLowerCase().includes('rent') ||
        operationType?.value_name?.toLowerCase().includes('alquiler') ||
        mlItem.title?.toLowerCase().includes('renta');

    // Extract property details
    const propertyType = getAttr('PROPERTY_TYPE')?.value_name || 'Propiedad';
    const bedrooms = getAttr('BEDROOMS')?.value_name;
    const bathrooms = getAttr('BATHROOMS')?.value_name;
    const totalArea = getAttr('TOTAL_AREA')?.value_name;

    // Build description
    let description = `${propertyType} ${isRent ? 'en renta' : 'en venta'} en ${mlItem.location?.city?.name || 'México'}. `;
    if (bedrooms) description += `${bedrooms} recámaras, `;
    if (bathrooms) description += `${bathrooms} baños, `;
    if (totalArea) description += `${totalArea} m² totales.`;

    // Extract address
    const address =
        mlItem.seller_address?.address_line ||
        mlItem.location?.address_line ||
        `${mlItem.location?.city?.name || ''}, ${mlItem.location?.state?.name || ''}`.trim();

    // Extract images
    const images = (mlItem.pictures || [])
        .map((p: any) => p.secure_url || p.url)
        .filter(Boolean);

    return {
        title: mlItem.title || 'Sin título',
        description: description.trim(),
        price: mlItem.price || 0,
        currency: mlItem.currency_id || 'MXN',
        address: address || 'Sin dirección',
        status: isRent ? 'DETECTED_RENT' : 'DETECTED_SALE',
        images: images,
        url: mlItem.permalink || '',
        externalId: mlItem.id || ''
    };
}
