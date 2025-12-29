<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Destinatario (Tu correo)
    $destinatario = "cotizacion@bttduran.com";
    
    // 2. Recolección de datos del formulario
    $nombre = strip_tags(trim($_POST["nombre"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $telefono = strip_tags(trim($_POST["telefono"]));
    $mensaje = strip_tags(trim($_POST["mensaje"]));

    // 3. Asunto del correo
    $asunto = "Nueva Cotizacion de: $nombre";

    // 4. Contenido del correo (Cuerpo)
    $contenido = "Has recibido una nueva solicitud de cotizacion desde tu sitio web.\n\n";
    $contenido .= "Detalles:\n";
    $contenido .= "Nombre: $nombre\n";
    $contenido .= "Email: $email\n";
    $contenido .= "Telefono: $telefono\n";
    $contenido .= "Mensaje:\n$mensaje\n";

    // 5. Encabezados (Importante para que no llegue a SPAM)
    // Usamos el mismo dominio para el 'From' para que el servidor de Neubox lo acepte
    $headers = "From: Web BTT Duran <no-reply@bttduran.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 6. Enviar el correo
    if (mail($destinatario, $asunto, $contenido, $headers)) {
        // Redirigir de vuelta o mostrar mensaje de éxito
        echo "<script>alert('Tu mensaje ha sido enviado con éxito. Pronto nos pondremos en contacto contigo.'); window.location.href='index.html';</script>";
    } else {
        echo "Lo sentimos, hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.";
    }
} else {
    header("Location: https://bttduran.com/");
}
?>