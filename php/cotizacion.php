<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['status'=>'error']);
  exit;
}

/* Anti-spam honeypot */
if (!empty($_POST['empresa'])) {
  exit;
}

/* Sanitización */
$nombre   = trim(strip_tags($_POST['nombre'] ?? ''));
$email    = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$telefono = trim(strip_tags($_POST['telefono'] ?? ''));
$mensaje  = trim(strip_tags($_POST['mensaje'] ?? ''));

if (!$nombre || !$email || !$mensaje) {
  echo json_encode([
    'status'=>'error',
    'title'=>'Datos incompletos',
    'message'=>'Por favor completa todos los campos obligatorios.'
  ]);
  exit;
}

$destinatario = 'cotizacion@bttduran.com';
$asunto = "Nueva Cotización - $nombre";

$cuerpo = "
Nueva solicitud desde bttduran.com

Nombre: $nombre
Email: $email
Teléfono: $telefono

Mensaje:
$mensaje
";

$headers = "From: Web BTT Duran <no-reply@bttduran.com>\r\n";
$headers .= "Reply-To: $email\r\n";

if (mail($destinatario, $asunto, $cuerpo, $headers)) {
  echo json_encode([
    'status'=>'ok',
    'title'=>'Mensaje enviado',
    'message'=>'Gracias por contactarnos. Te responderemos pronto.'
  ]);
} else {
  echo json_encode([
    'status'=>'error',
    'title'=>'Error',
    'message'=>'No se pudo enviar el mensaje.'
  ]);
}
