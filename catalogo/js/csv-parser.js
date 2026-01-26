/**
 * Simplified Parser for the Optimized CSV
 */
async function fetchAndParseCatalog() {
    try {
        if (typeof PRODUCT_CSV_DATA !== 'undefined') {
            return parseOptimizedCSV(PRODUCT_CSV_DATA);
        }
        const response = await fetch('PRODUCTOS_OPTIMIZADOS.csv');
        if (!response.ok) throw new Error('No se pudo cargar el catálogo optimizado');
        const text = await response.text();
        return parseOptimizedCSV(text);
    } catch (error) {
        console.error('Error loading catalog:', error);
        return { families: [] };
    }
}

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function parseOptimizedCSV(csvText) {
    const lines = csvText.split('\n');
    const familiesMap = new Map();

    // Helper to ensure unique IDs within a collection
    const getUniqueId = (baseId, existingIds) => {
        let id = baseId;
        let counter = 1;
        while (existingIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
        }
        existingIds.add(id);
        return id;
    };

    // Track used IDs to strictly prevent duplicates
    const usedFamilyIds = new Set();

    // Skip Header: FAMILIA;SUBFAMILIA;PRODUCTO;MEDIDAS
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        let [familyRaw, subfamilyRaw, product, measurementsRaw = ''] = line.split(';');

        // Clean and Normalize
        const clean = (s) => s ? s.replace(/^"|"$/g, '').trim() : '';
        const family = toTitleCase(clean(familyRaw));
        const subfamily = toTitleCase(clean(subfamilyRaw));
        product = clean(product);
        measurementsRaw = clean(measurementsRaw);

        if (!product) continue;

        const baseValidId = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        // --- Process Family ---
        if (!familiesMap.has(family)) {
            const familyBaseId = baseValidId(family) || 'fam';
            const familyId = getUniqueId(familyBaseId, usedFamilyIds);

            familiesMap.set(family, {
                id: familyId,
                name: family,
                subfamiliesMap: new Map(), // Use Map to merge subfamilies by name
                usedSubfamilyIds: new Set()
            });
        }
        const familyObj = familiesMap.get(family);

        // --- Process Subfamily ---
        if (!familyObj.subfamiliesMap.has(subfamily)) {
            const subBaseId = baseValidId(subfamily) || 'sub';
            const subId = getUniqueId(subBaseId, familyObj.usedSubfamilyIds);

            familyObj.subfamiliesMap.set(subfamily, {
                id: subId,
                name: subfamily,
                products: []
            });
        }
        const subfamilyObj = familyObj.subfamiliesMap.get(subfamily);

        // --- Process Product ---
        const measurements = measurementsRaw.split('|').map((m, idx) => ({
            id: `${subfamilyObj.id}-p${subfamilyObj.products.length}-m${idx}`,
            label: m
        }));

        subfamilyObj.products.push({
            name: product,
            measurements: measurements
        });
    }

    // Convert Maps to Arrays for Alpine.js
    const families = Array.from(familiesMap.values()).map(f => {
        f.subfamilies = Array.from(f.subfamiliesMap.values());
        // Clean up internal helpers
        delete f.subfamiliesMap;
        delete f.usedSubfamilyIds;
        return f;
    });

    return { families };
}
