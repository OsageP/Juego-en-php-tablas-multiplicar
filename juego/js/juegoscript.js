function returnToMenu() {
    window.location.href = 'index.php'; // Reemplaza 'index.php' con la URL de tu menú principal
}

window.addEventListener('load', function() {
    // Ocultar la pantalla de carga
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';

    // Obtener el nivel de dificultad del elemento de configuración
    var difficulty = document.getElementById('config-data').getAttribute('data-difficulty');
    // Obtener el contenedor de tiempo
    var timeContainer = document.getElementById('time-container');
    // Verificar si el nivel es "easy"
    if (difficulty === 'easy') {
        // Ocultar el contenedor de tiempo
        timeContainer.style.display = 'none';
    } else {
        // Mostrar el contenedor de tiempo
        timeContainer.style.display = 'block';
    }
});

function showRestartButton() {
    var restartButton = document.getElementById('restart');
    if (restartButton) {
        restartButton.style.display = "block";
    }
}

