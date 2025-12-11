document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Aquí se podría añadir una llamada a un servicio de email como EmailJS
      // o un endpoint de backend para procesar el formulario.
      
      // Simulación de envío exitoso
      alert("¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.");
      contactForm.reset();
    });
  }

  // Alpine.js se encarga del menú móvil, por lo que no se necesita JS adicional para eso.
  
});