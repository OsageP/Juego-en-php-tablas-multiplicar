<?php
// Definir el archivo de registro según la dificultad
$logFile = "log_" . $_POST['level'] . ".txt";

$scores = [];

if (file_exists($logFile)) {
    // Leer las últimas 5 puntuaciones máximas
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    rsort($lines); // Ordenar de mayor a menor
    $lines = array_slice($lines, 0, 5); // Obtener las primeras 5 puntuaciones
    foreach ($lines as $line) {
        $data = explode(' - ', $line);
        if (count($data) === 3) {
            $scores[] = array(
                'puntuacion' => intval($data[0]),
                'fecha' => $data[1],
                'nombre' => $data[2]
            );
        }
    }
}

// Devolver los puntajes como JSON
echo json_encode($scores);
?>