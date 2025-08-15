function mostrarProducto(tipo) {
  const producto = document.getElementById('producto');
  const img = document.getElementById('producto-img');
  const nombre = document.getElementById('producto-nombre');
  const modelosContainer = document.getElementById('producto-modelos');

  // Datos del catálogo
  const catalogo = {
    birlo: {
      img: 'img/birlo.png',
      nombre: 'Birlos - Encuentra el adecuado para tu vehículo',
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
        { nombre: 'Birlo para casi todos los modelos, pregunta por el que necesites', img: 'none' }
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
        { nombre: 'Tornillo Allen cabeza cilíndrica', img: 'img/socket.png' },
        { nombre: 'Tornillo Allen cabeza avellanada', img: 'img/boton.png' },
        { nombre: 'Tornillo de cabeza hexagonal', img: 'img/hexagonal1.png' },
        { nombre: 'Tornillo de cabeza plana', img: 'img/plano.png' },
        { nombre: 'Tornillo autorroscante', img: 'img/buscarosca.png' },
        { nombre: 'Tornillo para madera', img: 'img/pija.png' },
        { nombre: 'Tornillo para metal', img: 'img/puntabroca.png' },
        { nombre: 'Tornillo de máquina', img: 'img/tornillo.png' }
      ]
    },
    arandela: {
      img: 'img/arandela.png',
      nombre: 'Arandelas',
      modelos: [
        { nombre: 'Arandela plana', img: 'img/plana.png' },
        { nombre: 'Arandela de presión (Grower)', img: 'img/presion.png' },
        { nombre: 'Arandela automotriz', img: 'img/automotriz.png' },
        { nombre: 'Arandela dentada interna', img: 'img/arandela-dentada-interna.png' },
        { nombre: 'Arandela dentada externa', img: 'img/arandela-dentada-externa.png' },
        { nombre: 'Arandela de goma', img: 'img/arandela-goma.png' },
        { nombre: 'Arandela cóncava', img: 'img/arandela-concava.png' },
        { nombre: 'Arandela Belleville', img: 'img/arandela-belleville.png' }
      ]
    }
  };

  const datos = catalogo[tipo];

  // Cambiar datos principales
  img.src = datos.img;
  img.alt = datos.nombre;
  nombre.textContent = datos.nombre;

  // Limpiar modelos previos
  modelosContainer.innerHTML = '';

  // Crear tarjetas con animación
  datos.modelos.forEach((modelo, index) => {
    const card = document.createElement('div');
    card.className = 'bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center transition transform hover:scale-105 hover:shadow-xl cursor-pointer opacity-0 translate-y-4';
    card.style.transition = `all 0.3s ease ${index * 0.05}s`;

    if (modelo.img && modelo.img !== 'none') {
      const modeloImg = document.createElement('img');
      modeloImg.src = modelo.img;
      modeloImg.alt = modelo.nombre;
      modeloImg.className = 'w-24 h-24 object-contain mb-3';
      card.appendChild(modeloImg);
    }

    const modeloNombre = document.createElement('p');
    modeloNombre.textContent = modelo.nombre;
    modeloNombre.className = 'text-center font-medium';
    card.appendChild(modeloNombre);

    modelosContainer.appendChild(card);

    // Animación de entrada
    setTimeout(() => {
      card.classList.remove('opacity-0', 'translate-y-4');
    }, 50);
  });

  // Mostrar contenedor con fade-in
  producto.classList.remove('hidden', 'show');
  setTimeout(() => producto.classList.add('show'), 50);
}
