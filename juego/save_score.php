<?php
// Leer los datos JSON recibidos
$jsonData = file_get_contents('php://input');

// Decodificar los datos JSON a un array asociativo
$data = json_decode($jsonData, true);

// Verificar si se han recibido los datos necesarios
if(isset($data['score'], $data['playerName'], $data['date'], $data['level'])) {
    $score = $data['score'];
    $playerName = $data['playerName'];
    $date = $data['date']; // Mantener la fecha y hora tal como llega del cliente
    $level = $data['level']; // Obtener el nivel del juego desde la solicitud AJAX

    // Determinar el archivo de registro según el nivel
    $logFile = "log_" . strtolower($level) . ".txt";
    $maxLines = 5; // Solo se guardarán las últimas 5 puntuaciones

    // Leer las puntuaciones existentes
    $existingScores = [];
    if (file_exists($logFile)) {
        // Leer el contenido actual del archivo
        $existingScores = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    }

    // Agregar la nueva puntuación al array de puntuaciones
    $existingScores[] = "$score - $date - $playerName";

    // Ordenar las puntuaciones de mayor a menor
    rsort($existingScores, SORT_NUMERIC);

    // Limitar el número de líneas a la cantidad deseada
    $existingScores = array_slice($existingScores, 0, $maxLines);

    // Guardar el contenido actualizado de vuelta en el archivo
    file_put_contents($logFile, implode("\n", $existingScores));

    // Envía una respuesta de éxito al cliente
    echo "Puntuación guardada correctamente en $logFile.";
} else {
    // Si falta algún dato, enviar una respuesta de error al cliente
    echo "Error: Falta uno o más datos necesarios.";
}
?>
