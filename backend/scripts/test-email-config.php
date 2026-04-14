<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = config('SMTP_HOST');
    $mail->SMTPAuth   = true;
    $mail->Username   = config('SMTP_USER');
    $mail->Password   = config('SMTP_PASS');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = config('SMTP_PORT', 587);

    // Recipients
    $mail->setFrom(config('SMTP_FROM'), config('SMTP_FROM_NAME'));
    $mail->addAddress(config('SMTP_USER')); // Send test to self

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Southern Spine - SMTP Test';
    $mail->Body    = 'This is a test email to verify your SMTP configuration.';

    $mail->send();
    echo "Test email has been sent successfully to " . config('SMTP_USER') . "\n";
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}\n";
}
