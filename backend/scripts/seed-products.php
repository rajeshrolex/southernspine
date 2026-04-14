<?php
require_once __DIR__ . '/../config/database.php';

try {
    echo "Seeding products...\n";

    $products = [
        ['Lumbar Support Brace', 'Provides excellent support for the lower back.', 45.99, 'Braces', 'https://example.com/brace.jpg'],
        ['Ergonomic Office Chair', 'High-back chair with lumbar support.', 199.99, 'Furniture', 'https://example.com/chair.jpg'],
        ['Posture Corrector', 'Adjustable brace for upper back support.', 25.50, 'Braces', 'https://example.com/posture.jpg'],
        ['Orthopedic Pillow', 'Cervical pillow for neck pain relief.', 39.00, 'Bedding', 'https://example.com/pillow.jpg']
    ];

    foreach ($products as $p) {
        Database::query("INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)", $p);
        echo "Inserted: {$p[0]}\n";
    }

    echo "Seeding completed successfully!\n";

} catch (Exception $e) {
    echo "Seeding failed: " . $e->getMessage() . "\n";
}
