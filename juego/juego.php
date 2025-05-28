<?php
session_start(); // Iniciar la sesión

// Definir un array asociativo para los archivos de registro según la dificultad
$logFiles = array(
    'easy' => "log_easy.txt",
    'medium' => "log_medium.txt",
    'hard' => "log_hard.txt",
    'pro' => "log_pro.txt",
    'hacker' => "log_hacker.txt"
);

// Definir un array asociativo para traducir los niveles de dificultad
$difficultyLabels = array(
    'easy' => "Fácil",
    'medium' => "Medio",
    'hard' => "Difícil",
    'pro' => "Pro",
    'hacker' => "Hacker"
);

// Obtener opciones guardadas o establecer valores predeterminados
$config = isset($_SESSION['config']) ? $_SESSION['config'] : array(
    'showAnimations' => true,
    'difficulty' => 'easy'
);

// Obtener opciones específicas
$showAnimations = $config['showAnimations'];
$difficulty = $config['difficulty'];

// Obtener el nombre del archivo de registro según la dificultad
$logFile = isset($logFiles[$difficulty]) ? $logFiles[$difficulty] : null;

// Obtener la puntuación más alta y los últimos puntajes
$highScore = 0;
$highScoreDate = "";
$highScoreName = "";
$scores = [];

if ($logFile && file_exists($logFile)) {
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

// Ordenar puntajes por puntuación (en orden descendente)
usort($scores, function ($a, $b) {
    return $b['puntuacion'] - $a['puntuacion'];
});

// Obtener la puntuación más baja mostrada en la tabla
$lowestTableScore = !empty($scores) ? end($scores)['puntuacion'] : 0;


?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Juego - Tablas de Multiplicar</title>
    <meta name="description" content="¡Bienvenido al Juego de Tablas de Multiplicar!. Juego para aprender y practicar las tablas de multiplicar para niños de 8 años en adelante">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="apple-touch-icon" sizes="180x180" href="ico/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="ico/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="ico/favicon-16x16.png">
	<link rel="manifest" href="ico/site.webmanifest">
	<link rel="mask-icon" href="ico/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" media="print" onload="this.media='all'">
    <style>
        /* Estilos adicionales para la página */
        /* Títulos, botones, etc. */
    </style>
</head>
<body>
    <div id="config-data" data-show-animations="<?php echo $showAnimations ? 'true' : 'false'; ?>" data-difficulty="<?php echo $difficulty; ?>"></div>
    
    <!-- Pantalla de carga -->
    <div id="loading-screen" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.8); z-index: 999;">
        <img src="img/cargando.gif" alt="Cargando..." style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
    </div>
    
    <!-- Canvas para mostrar las animaciones cada 100 puntos -->
    <canvas id="confettiCanvas"></canvas>
    <div id="puntuacion">+100 puntos</div>

    <!-- Div para mostrar las imágenes animaciones según puntuaciones -->
    <div id="imagen-container"></div>

    <!-- Botón de configuración -->
    <div id="settingsButton" onclick="returnToMenu()">
        <img src="img/configuracion.svg" alt="Configuraciones">
    </div>

    <!-- Título y nivel -->
    <h1 class="title">Juego de Multiplicar</h1>
    <div class="subtitle-container <?php echo strtolower($difficulty); ?>">
        <p class="subtitle">Nivel <?php echo isset($difficultyLabels[$difficulty]) ? $difficultyLabels[$difficulty] : ucfirst($difficulty); ?></p>
    </div>

    <!-- Pregunta y opciones -->
    <p id="question"></p>
    <p id="result"></p>
    <div id="options" class="options">
        <button class="option" id="option1"></button>
        <button class="option" id="option2"></button>
        <button class="option" id="option3"></button>
    </div>

    <!-- Puntuación actual -->
    <p id="score">Puntuación: <?php echo $highScore; ?></p>

 <!-- Contenedor del botón "Volver a empezar" -->
<div class="centered">
    <button id="restart" onclick="restartGame()">Volver a empezar</button>
</div>

    <!-- Contenedor de tiempo -->
    <div id="time-container" style="display: none;">
        <span>Tiempo:</span>
        <div id="time-progress-bar">
            <div class="bar" id="time-bar"></div>
        </div>
        <div>
            <span id="time-display">00</span>
        </div>
    </div>

    <!-- Últimas puntuaciones -->
    <div class="container">
        <h2>Últimas puntuaciones</h2>
        <table class="paleBlueRows">
            <tr>
                <th>Puesto</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Puntos</th>
            </tr>
            <?php
            if (!empty($scores)) {
                foreach ($scores as $i => $score) {
                    echo "<tr" . ($i === 0 ? ' class="resaltado"' : '') . ">";
                    echo "<td>" . ($i + 1) . "</td>";
                    echo "<td>{$score['nombre']}</td>";
                    echo "<td>{$score['fecha']}</td>";
                    echo "<td>{$score['puntuacion']}</td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='4'>No hay puntuaciones disponibles</td></tr>";
            }
            ?>
        </table>
    </div>

    <!-- Pie de página -->
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Tablas de Multiplicar by Osagep. V.1.0.2</p>
    </footer>

    <!-- Scripts para el juego -->	
    <script src="js/confetti-js.js"></script>
    <script src="js/config.php"></script>
    <script src="js/gameLogic.js"></script>
    <script src="js/juegoscript.js"></script>

</body>
</html>
