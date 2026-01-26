const fs = require('fs');

const FAMILIES = [
    { id: 'Tornillos', keywords: ['TOR ', 'TORNILLO'] },
    { id: 'Tuercas', keywords: ['TUERCA'] },
    { id: 'Birlos', keywords: ['BIRLO'] },
    { id: 'Rondanas', keywords: ['RONDANA', 'ARANDELA'] },
    { id: 'Pijas', keywords: ['PIJA'] },
    { id: 'Varillas', keywords: ['VARILLA'] },
    { id: 'Herramientas', keywords: ['BROCA', 'DADO', 'MACHUELO', 'LINTERNA', 'MICROFIBRA'] },
];

function cleanName(name) {
    const cleaningRegex = /\s(NGO|ZINC|GALV|INOX|CADM|NEGRO|GALVANIZADO|NGA|NGR|NUEVO|NUEVA)\b/gi;
    return name.replace(cleaningRegex, '').trim();
}

function process() {
    const csvPath = 'c:/Users/Ever/Documents/GitHub/birlos-tuercas-tornillos/LISTA DE PRECIOS BTT(GENERAL).csv';
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n');

    const groups = new Map();

    lines.forEach(line => {
        if (!line.trim()) return;
        const cols = line.split(';');
        if (cols.length < 2) return;

        const fullName = cols[1]?.trim() || '';
        if (!fullName || fullName.toUpperCase() === 'DESCRIPCION') return;

        let [fullType, measurement] = fullName.split(' - ');
        if (!measurement) {
            fullType = fullName;
            measurement = 'N/A';
        }

        const typeClean = cleanName(fullType);

        // Find Family
        let family = FAMILIES.find(f => f.keywords.some(k => fullName.toUpperCase().includes(k)))?.id || 'Otros';

        // Find Subfamily (first 2 words)
        const parts = typeClean.split(' ');
        const subfamily = parts.slice(0, 2).join(' ');

        if (!groups.has(typeClean)) {
            groups.set(typeClean, {
                family,
                subfamily,
                name: typeClean,
                measurements: new Set()
            });
        }
        groups.get(typeClean).measurements.add(measurement.trim());
    });

    let output = 'FAMILIA;SUBFAMILIA;PRODUCTO;MEDIDAS\n';
    groups.forEach(g => {
        const mList = Array.from(g.measurements).join('|');
        output += `${g.family};${g.subfamily};${g.name};${mList}\n`;
    });

    fs.writeFileSync('c:/Users/Ever/Documents/GitHub/birlos-tuercas-tornillos/catalogo/PRODUCTOS_OPTIMIZADOS.csv', output);
    console.log('Optimized CSV generated with', groups.size, 'product types.');
}

process();
