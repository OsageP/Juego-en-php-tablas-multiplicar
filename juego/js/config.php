<?php
// Obtener el nivel de dificultad y la configuración de animación
$difficulty = isset($_SESSION['config']['difficulty']) ? $_SESSION['config']['difficulty'] : 'easy';
$showAnimations = isset($_SESSION['config']['showAnimations']) ? $_SESSION['config']['showAnimations'] : true;
?>
