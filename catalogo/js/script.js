document.addEventListener('alpine:init', () => {
    Alpine.data('catalog', () => ({
        // Data
        rawCatalog: { families: [], allProducts: [] },
        view: 'families', // 'families', 'subfamilies', 'products', 'search'

        // Navigation State
        currentFamily: null,
        currentSubfamily: null,
        searchQuery: '',

        // UI State
        isLoading: true,
        modalOpen: false,
        activeProduct: null,
        selectedMeasurements: [],

        // Cart
        quoteList: [],
        cartOpen: false,

        async init() {
            // Load Data
            this.rawCatalog = await fetchAndParseCatalog();
            this.isLoading = false;

            // Load cart
            const savedCart = localStorage.getItem('btt_quote_list');
            if (savedCart) this.quoteList = JSON.parse(savedCart);
        },

        // Navigation Methods
        selectFamily(family) {
            this.currentFamily = family;
            this.view = 'subfamilies';
            this.searchQuery = '';
            window.scrollTo(0, 0);
        },

        selectSubfamily(subfamily) {
            this.currentSubfamily = subfamily;
            this.view = 'products';
            window.scrollTo(0, 0);
        },

        goBack() {
            if (this.view === 'products') {
                this.view = 'subfamilies';
            } else if (this.view === 'subfamilies' || this.view === 'search') {
                this.view = 'families';
                this.currentFamily = null;
                this.currentSubfamily = null;
            }
            window.scrollTo(0, 0);
        },

        // Search logic
        performSearch() {
            if (this.searchQuery.length > 2) {
                this.view = 'search';
            } else if (this.searchQuery.length === 0) {
                this.view = 'families';
            }
        },

        get searchResults() {
            const query = this.searchQuery.toLowerCase();
            let results = [];
            this.rawCatalog.families.forEach(f => {
                f.subfamilies.forEach(sub => {
                    sub.products.forEach(p => {
                        if (p.name.toLowerCase().includes(query)) {
                            results.push(p);
                        }
                    });
                });
            });
            return results.slice(0, 50); // Limit results for performance
        },

        // Modal Methods
        openProduct(product) {
            this.activeProduct = product;
            this.selectedMeasurements = [];
            this.modalOpen = true;
        },

        closeModal() {
            this.modalOpen = false;
        },

        toggleMeasurement(label) {
            if (this.selectedMeasurements.includes(label)) {
                this.selectedMeasurements = this.selectedMeasurements.filter(l => l !== label);
            } else {
                this.selectedMeasurements.push(label);
            }
        },

        // Cart Methods
        addToQuote() {
            this.selectedMeasurements.forEach(m => {
                const exists = this.quoteList.find(i => i.name === this.activeProduct.name && i.measure === m);
                if (!exists) {
                    this.quoteList.push({
                        name: this.activeProduct.name,
                        measure: m
                    });
                }
            });
            localStorage.setItem('btt_quote_list', JSON.stringify(this.quoteList));
            this.closeModal();
        },

        removeFromQuote(index) {
            this.quoteList.splice(index, 1);
            localStorage.setItem('btt_quote_list', JSON.stringify(this.quoteList));
        },

        sendWhatsApp() {
            let msg = "Hola, me gustaría cotizar:\n\n";
            this.quoteList.forEach(i => msg += `- ${i.name} [${i.measure}]\n`);
            window.open(`https://wa.me/526566242220?text=${encodeURIComponent(msg)}`, '_blank');
        },

        // Image Mapping
        getImage(name = '') {
            const n = name.toUpperCase();
            if (n.includes('TORNILLO SOCKET')) return '../img/Catalogo/tornillo_socket.png';
            if (n.includes('PUNTA BROCA')) return '../img/Catalogo/tornillo_puntabroca.png';
            if (n.includes('TORNILLO HEXAGONAL')) return '../img/Catalogo/tornillo_hexagonal1.png';
            if (n.includes('COCHE')) return '../img/Catalogo/tornillo_coche.png';
            if (n.includes('ARADO')) return '../img/Catalogo/tornillo_arado.png';
            if (n.includes('FUSIBLE')) return '../img/Catalogo/tornillo_fusible.png';
            if (n.includes('AUTOROSCANTE')) return '../img/Catalogo/tornillo_autoroscante.png';
            if (n.includes('CABEZA GOTA')) return '../img/Catalogo/tornillo_cabeza_gota.png';
            if (n.includes('CABEZA PLANA')) return '../img/Catalogo/tornillo_cabeza_plana.png';
            if (n.includes('CABEZA QUESO')) return '../img/Catalogo/tornillo_cabeza_queso.png';
            if (n.includes('CABEZA FIJADORA')) return '../img/Catalogo/tornillo_cabeza_fijadora.png';
            if (n.includes('EXTRACTOR')) return '../img/Catalogo/extractor.png';
            if (n.includes('ELEVADOR')) return '../img/Catalogo/tornillo_elevador.png';
            if (n.includes('PIJA')) return '../img/Catalogo/tornillo_pija.png';
            if (n.includes('TUERCA HEX')) return '../img/Catalogo/tuerca_hexagonal.png';
            if (n.includes('RONDANA PLANA')) return '../img/Catalogo/arandela_plana.png';
            if (n.includes('RONDANA DE PRESION')) return '../img/Catalogo/arandela_presion.png';
            if (n.includes('2H')) return '../img/Catalogo/tuerca_2h.png';
            if (n.includes('ACME')) return '../img/Catalogo/tuerca_acme.png';
            if (n.includes('MARIPOSA')) return '../img/Catalogo/tuerca_mariposa.png';
            if (n.includes('FLANGE')) return '../img/Catalogo/tuerca_flange.png';
            if (n.includes('INSERTO')) return '../img/Catalogo/tuerca_inserto.png';
            if (n.includes('BELLOTA')) return '../img/Catalogo/tuerca_bellota.png';
            if (n.includes('CONTRATUERCA')) return '../img/Catalogo/contratuerca.png';
            if (n.includes('TUERCA RESORTE')) return '../img/Catalogo/tuerca_resorte.png';
            if (n.includes('TUERCA ARTILLERIA')) return '../img/Catalogo/tuerca_artilleria.png';
            if (n.includes('TUERCA CROMADA')) return '../img/Catalogo/tuerca_corta.png';
            if (n.includes('REMACHADORA')) return '../img/Catalogo/tuerca_remachadora.png';
            if (n.includes('OPRESOR')) return '../img/Catalogo/opresor.png';
            if (n.includes('VARILLA ROSCADA')) return '../img/Catalogo/varilla_roscada.png';
            if (n.includes('BIRLO')) return '../img/Catalogo/birlo.png';
            return '../img/logo.png';
        },

        getFamilyIcon(id) {
            const icons = {
                tornillos: 'fas fa-bolt',
                tuercas: 'fas fa-nut-can',
                birlos: 'fas fa-car-side',
                rondanas: 'fas fa-circle-notch',
                pijas: 'fas fa-screwdriver',
                varillas: 'fas fa-bars',
                herramientas: 'fas fa-tools',
                otros: 'fas fa-box-open'
            };
            return icons[id] || 'fas fa-question';
        }
    }));
});
