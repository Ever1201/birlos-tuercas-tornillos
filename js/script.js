document.addEventListener("DOMContentLoaded", () => {
  
  // Cambia el fondo del header al hacer scroll
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("bg-gray-800", "shadow-xl");
    } else {
      header.classList.remove("bg-gray-800", "shadow-xl");
    }
  });

  // Efecto suave al desplazarse por los enlaces del menú
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Validación básica del formulario de contacto
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("¡Gracias por tu mensaje! Te responderemos pronto.");
    contactForm.reset();
  });
});
s