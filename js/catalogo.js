function catalog() {
  return {
    products: [
      // Birlos (Threaded Fasteners)
      {
        id: 1,
        name: 'Birlo de Seguridad Cromado',
        code: 'BS-5001',
        category: 'birlos',
        image: 'img/BR50030L-1.png',
        specifications: {
          Material: 'Acero templado cromado',
          Longitud: '50mm',
          Diámetro: '12mm',
          Rosca: 'M12x1.5'
        }
      },
      {
        id: 2,
        name: 'Birlo Largo Cromado',
        code: 'BC-7020',
        category: 'birlos',
        image: 'img/BR70209RP-4.png',
        specifications: {
          Material: 'Acero cromado',
          Longitud: '70mm',
          Diámetro: '14mm',
          Rosca: 'M14x1.5'
        }
      },
      {
        id: 3,
        name: 'Birlo para Camión',
        code: 'BTA-226',
        category: 'birlos',
        image: 'img/BTA226A-1.png',
        specifications: {
          Material: 'Acero de alta resistencia',
          Longitud: '90mm',
          Diámetro: '22mm',
          Rosca: 'M22x1.5'
        }
      },
      {
        id: 4,
        name: 'Birlo Deportivo Rojo',
        code: 'BD-4313',
        category: 'birlos',
        image: 'img/BTA4313R-1.png',
        specifications: {
          Material: 'Aluminio anodizado',
          Longitud: '45mm',
          Diámetro: '12mm',
          Acabado: 'Rojo'
        }
      },
      {
        id: 17,
        name: 'Birlo Estándar',
        code: 'BE-100',
        category: 'birlos',
        image: 'img/birlo.png',
        specifications: {
          Material: 'Acero al carbono',
          Longitud: '40mm',
          Diámetro: '12mm',
          Rosca: 'M12x1.5'
        }
      },

      // Tuercas (Nuts)
      {
        id: 5,
        name: 'Tuerca de Seguridad',
        code: 'TS-101',
        category: 'tuercas',
        image: 'img/seguridad.png',
        specifications: {
          Material: 'Acero templado',
          Tipo: 'Autoblocante',
          Rosca: 'M12x1.5',
          Altura: '16mm'
        }
      },
      {
        id: 6,
        name: 'Tuerca Hexagonal',
        code: 'TH-202',
        category: 'tuercas',
        image: 'img/hexagonal.png',
        specifications: {
          Material: 'Acero grado 8',
          Tipo: 'DIN 934',
          Rosca: 'M14x1.5',
          Altura: '12mm'
        }
      },

      // Tornillos (Screws/Bolts)
      {
        id: 9,
        name: 'Tornillo Cabeza Hexagonal',
        code: 'TCH-001',
        category: 'tornillos',
        image: 'img/hexagonal1.png',
        specifications: {
          Material: 'Acero galvanizado',
          Longitud: '30mm',
          Diámetro: '8mm',
          Rosca: 'M8x1.25'
        }
      },
      {
        id: 10,
        name: 'Tornillo Allen',
        code: 'TA-002',
        category: 'tornillos',
        image: 'img/socket.png',
        specifications: {
          Material: 'Acero inoxidable',
          Longitud: '25mm',
          Diámetro: '6mm',
          Rosca: 'M6x1.0'
        }
      },

      // Arandelas (Washers)
      {
        id: 13,
        name: 'Arandela Plana',
        code: 'AP-501',
        category: 'arandelas',
        image: 'img/plana.png',
        specifications: {
          Material: 'Acero inoxidable',
          'Diámetro ext': '24mm',
          'Diámetro int': '13mm',
          Espesor: '2mm'
        }
      },
      {
        id: 14,
        name: 'Arandela de Presión',
        code: 'ADP-502',
        category: 'arandelas',
        image: 'img/presion.png',
        specifications: {
          Material: 'Acero al carbono',
          'Diámetro ext': '20mm',
          'Diámetro int': '10mm',
          Tipo: 'Grower'
        }
      }
    ],
    categories: [
      { id: 'birlos', name: 'Birlos' },
      { id: 'tuercas', name: 'Tuercas' },
      { id: 'tornillos', name: 'Tornillos' },
      { id: 'arandelas', name: 'Arandelas' }
    ],
    searchTerm: '',
    selectedCategory: 'all',
    sortBy: 'name-asc',
    filteredProducts: [],

    init() {
      this.filterProducts();
    },

    filterProducts() {
      // Aplicar filtros
      this.filteredProducts = this.products.filter(product => {
        const searchMatch = !this.searchTerm || 
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.code.toLowerCase().includes(this.searchTerm.toLowerCase());
        const categoryMatch = this.selectedCategory === 'all' || product.category === this.selectedCategory;
        return searchMatch && categoryMatch;
      });

      // Aplicar ordenamiento
      this.sortProducts();
    },

    sortProducts() {
      const [field, direction] = this.sortBy.split('-');
      this.filteredProducts.sort((a, b) => {
        let comparison = 0;
        if (field === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (field === 'code') {
          comparison = a.code.localeCompare(b.code);
        }
        return direction === 'asc' ? comparison : -comparison;
      });
    },

    resetFilters() {
      this.searchTerm = '';
      this.selectedCategory = 'all';
      this.sortBy = 'name-asc';
      this.filterProducts();
    },

    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : '';
    }
  };
}
