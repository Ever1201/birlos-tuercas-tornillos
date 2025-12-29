// ===============================
// Inicialización general
// ===============================
document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     AOS
  =============================== */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }

  /* ===============================
     Header con sombra al hacer scroll
  =============================== */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('shadow-lg', window.scrollY > 0);
    });
  }

  /* ===============================
     Formulario de cotización
  =============================== */
  const form = document.getElementById('cotizacionForm');
  const modal = document.getElementById('modal');
  const loader = document.getElementById('loader');
  const btnText = document.getElementById('btnText');

  if (!form || !modal) {
    console.warn('Formulario o modal no encontrados');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    loader?.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Enviando...';

    const data = new FormData(form);

    try {
      const res = await fetch('/php/cotizacion.php', {
        method: 'POST',
        body: data
      });

      const result = await res.json();

      showModal(
        result.status === 'ok',
        result.title,
        result.message,
        result.whatsapp || null
      );

      if (result.status === 'ok') form.reset();

    } catch (error) {
      showModal(false, 'Error', 'No se pudo enviar el mensaje.');
    }

    loader?.classList.add('hidden');
    if (btnText) btnText.textContent = 'Enviar mensaje';
  });

  /* ===============================
     Eventos del modal
  =============================== */
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

});


/* ===============================
   Funciones globales del modal
=============================== */
function showModal(success, title, message, whatsapp = null) {
  const modal = document.getElementById('modal');
  if (!modal) return;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  document.getElementById('modalIcon').innerHTML = success ? '✅' : '❌';
  document.getElementById('modalTitle').textContent = title;

  const modalText = document.getElementById('modalText');
  modalText.innerHTML = message;

  if (whatsapp) {
    modalText.innerHTML += `
      <br><br>
      <a href="${whatsapp}" target="_blank"
        class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        <i class="fab fa-whatsapp mr-2"></i> Enviar WhatsApp
      </a>`;
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
