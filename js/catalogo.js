function mostrarProducto(tipo) {
  const producto = document.getElementById('producto');
  const img = document.getElementById('producto-img');
  const nombre = document.getElementById('producto-nombre');
  const modelosContainer = document.getElementById('producto-modelos');

  // Definir datos para cada tipo con modelos con imágenes
  const catalogo = {
    birlo: {
      img: 'img/birlo.png',
      nombre: 'Birlos encuentra el adecuado para tu vehículo',
      modelos: [
        { nombre: 'Birlo Chevrolet', img: 'img/logossvg/Chevrolet.svg' },
        { nombre: 'Birlo Chrysler', img: 'img/logossvg/Dodge.svg' },
        { nombre: 'Birlo Ford', img: 'img/logossvg/Ford.svg' },
        { nombre: 'Birlo GM', img: 'img/logossvg/GM.svg' },
        { nombre: 'Birlo GMC', img: 'img/logossvg/GMC.svg' },
        { nombre: 'Birlo Honda', img: 'img/logossvg/Honda.svg' },
        { nombre: 'Birlo Hyundai', img: 'img/logossvg/Hyundai.svg' },
        { nombre: 'Birlo Jeep', img: 'img/logossvg/Jeep.svg' },
        { nombre: 'Birlo Kia', img: 'img/logossvg/Kia.svg' },
        { nombre: 'Birlo Suzuki', img: 'img/logossvg/Suzuki.svg' },
        { nombre: 'Birlo Volkswagen', img: 'img/logossvg/Volkswagen.svg' },
        { nombre: 'Birlo para casi todos los modelos pregunta por el que necesites', img: 'none' }
      ]
    },
    tuerca: {
      img: 'img/tuerca.png',
      nombre: 'Tuercas',
      modelos: [
        { nombre: 'Tuerca hexagonal', img: 'img/hexagonal.png' },
        { nombre: 'Tuerca seguridad', img: 'img/seguridad.png' },
        { nombre: 'Tuerca castillo', img: 'img/Tuercas-Castillo.png' },
        { nombre: 'Tuerca lujo corta', img: 'img/tuercalujocorta.jpg' },
        { nombre: 'Tuerca lujo larga', img: 'img/tuercalujoalta.png' },
        { nombre: 'Tuerca corta', img: 'img/tuercabirlo.png' }
      ]
    },
    tornillo: {
      img: 'img/tornillo.png',
      nombre: 'Tornillos',
      modelos: [
        { nombre: 'Tornillo Modelo 1', img: 'img/logossvg/chevrolet.svg' },
        { nombre: 'Tornillo Modelo 2', img: 'img/modelos/tornillo2.png' },
        { nombre: 'Tornillo Modelo 3', img: 'img/modelos/tornillo3.png' }
      ]
    },
    arandela: {
      img: 'img/arandela.png',
      nombre: 'Arandela',
      modelos: [
        { nombre: 'Arandela plana', img: 'img/plana.png' },
        { nombre: 'Arandela presion', img: 'img/presion.png' },
        { nombre: 'Arandela automotriz', img: 'img/automotriz.png' }
      ]
    }
  };

  const datos = catalogo[tipo];

  // Mostrar datos principales
  img.src = datos.img;
  img.alt = datos.nombre;
  nombre.textContent = datos.nombre;

  // Limpiar modelos previos
  modelosContainer.innerHTML = '';

  // Crear tarjetas para cada modelo
  datos.modelos.forEach(modelo => {
    const card = document.createElement('div');
    card.className = 'bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition cursor-pointer';

    const modeloImg = document.createElement('img');
    modeloImg.src = modelo.img;
    modeloImg.alt = modelo.nombre;
    modeloImg.className = 'w-32 h-32 object-contain mb-3';

    const modeloNombre = document.createElement('p');
    modeloNombre.textContent = modelo.nombre;
    modeloNombre.className = 'text-center font-medium';

    card.appendChild(modeloImg);
    card.appendChild(modeloNombre);
    modelosContainer.appendChild(card);
  });

  producto.classList.remove('hidden');
}
