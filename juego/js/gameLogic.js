var score = 0;
var correctAnswer;
var showAnimations; // Variable para controlar si se muestran las animaciones
var difficulty; // Variable para almacenar el nivel de dificultad
var timerInterval; // Variable para almacenar el intervalo del temporizador


// Variables de configuración para las animaciones
var animationDurationEasy = 5000; // Duración de la animación en milisegundos para el nivel fácil
var animationDurationMedium = 4000; // Duración de la animación en milisegundos para el nivel medio
var animationDurationHard = 3000; // Duración de la animación en milisegundos para el nivel difícil

// Función para leer los datos de configuración del elemento oculto
function readConfigData() {
    // Leer los datos de configuración del elemento oculto
    var configData = document.getElementById('config-data');
    if (configData) {
        var showAnimationsAttr = configData.getAttribute('data-show-animations');
        var difficultyAttr = configData.getAttribute('data-difficulty');

        // Verificar si se han activado las animaciones
        showAnimations = showAnimationsAttr === 'true';
        console.log('Animaciones activadas:', showAnimations);

        // Log para verificar qué nivel se ha cargado
        console.log('Nivel cargado:', difficultyAttr);

        return difficultyAttr;
    } else {
        console.error("Elemento config-data no encontrado");
        return null;
    }
}

function initializeGame() {
    // Leer el nivel de dificultad
    difficulty = readConfigData();
    if (!difficulty) {
        console.error("No se pudieron cargar los datos de configuración");
    } else {
        // Generar la primera pregunta y empezar el temporizador
        generateQuestion();
        resetTimer();
    }
}

function generateQuestion() {
    // Limpiar las clases de los botones de respuesta
    limpiarBotonesRespuesta();

    var num1 = Math.floor(Math.random() * 10) + 1;
    var num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 * num2;

    document.getElementById('question').textContent = num1 + " x " + num2 + " = ?";

    var correctOption = Math.floor(Math.random() * 3) + 1;
    document.getElementById('option' + correctOption).textContent = correctAnswer;

    for (var i = 1; i <= 3; i++) {
        if (i !== correctOption) {
            var wrongAnswer;
            do {
                wrongAnswer = Math.floor(Math.random() * 100) + 1;
            } while (wrongAnswer === correctAnswer);
            document.getElementById('option' + i).textContent = wrongAnswer;
        }
    }
    // Reiniciar el temporizador para la nueva pregunta
    resetTimer();
}

function checkAnswer(answer) {
    if (answer === correctAnswer || answer === null) {
        if (answer === correctAnswer) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer(null); // Manejar la respuesta incorrecta cuando el tiempo se agota
        }
    } else {
        handleIncorrectAnswer(answer); // Manejar la respuesta incorrecta
    }
}

function handleCorrectAnswer() {
    score++;
    document.getElementById('score').textContent = "Puntuación: " + score;
    generateQuestion();
    document.getElementById('result').textContent = "";
    document.getElementById('result').className = "";
    if (showAnimations) {
        handleAnimations();
    }
}

function handleIncorrectAnswer(answer) {
    // Establecer el mensaje y la clase de resultado según la respuesta
    var scoreSupera = checkScoreSupera(); // Verificar si la puntuación supera alguna de las mostradas

    if (answer === null) {
        document.getElementById('result').textContent = "¡Se te acabó el tiempo!";
    } else {
        document.getElementById('result').textContent = "¡Has fallado!";
    }
    document.getElementById('result').className = "incorrect";
    document.getElementById('result').innerHTML += "<p class='incorrect-message'>Inténtalo de nuevo</p>";

    // Detener el temporizador y ocultar el contenedor de tiempo
    clearInterval(timerInterval);
    document.getElementById('time-container').style.display = 'none';

    // Desactivar los botones de opción
    for (var i = 1; i <= 3; i++) {
        document.getElementById('option' + i).disabled = true;
    }
    
    // Resaltar la respuesta correcta
    resaltarCorrecta();

    // Mostrar la puntuación final
    document.getElementById('score').innerHTML = "<span style='font-size: 24px; font-weight: bold;'>Puntuación final: " + score + "</span>";

    // Cargar y actualizar los puntajes
    loadScores();

    // Mostrar el botón "Volver a empezar"
    showRestartButton();

    // Verificar si se superó alguna puntuación y solicitar el nombre del jugador
    if (scoreSupera) {
        // Solicitar el nombre del jugador solo si se supera una puntuación
        var playerName = prompt("Has superado una puntuación.\nTu puntuación final fue de: " + score + "\nPor favor, introduce tu nombre:");
        playerName = playerName || "Anónimo"; // Nombre predeterminado si no se proporciona ninguno
        // Llamar a la función para guardar la puntuación con el nombre del jugador y la respuesta incorrecta
        saveScoreOnFailureOrTimeout(playerName, answer);
    }
}

function saveScoreOnFailureOrTimeout(playerName) {
    // Obtener la puntuación actual
    var currentScore = score;

    // Obtener las puntuaciones mostradas en la tabla
    var tableScores = [];
    var tableRows = document.querySelectorAll(".paleBlueRows tr:not(:first-child)");
    tableRows.forEach(function(row) {
        var scoreData = {
            playerName: row.cells[1].textContent.trim(),
            score: parseInt(row.cells[3].textContent.trim())
        };
        tableScores.push(scoreData);
    });

    // Verificar si la puntuación actual supera alguna de las puntuaciones mostradas
    var scoreSupera = checkScoreSupera();

    // Si la puntuación supera alguna de las mostradas, guardar la puntuación
    if (scoreSupera) {
        // Verificar si playerName está definido y no es nulo ni una cadena vacía
        if (typeof playerName !== 'undefined' && playerName !== null && playerName.trim() !== "") {
            // Obtener el nivel de dificultad del juego
            var difficulty = document.getElementById('config-data').getAttribute('data-difficulty');

            // Crear el objeto con los datos de la puntuación
            var scoreData = {
                score: currentScore,
                playerName: playerName,
                date: new Date().toLocaleString(), // Obtener la fecha y hora actual en formato local
                level: difficulty // Enviar el nivel al servidor
            };

            // Convertir el objeto a JSON
            var jsonData = JSON.stringify(scoreData);

            // Realizar la solicitud POST al servidor con los datos JSON
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "save_score.php", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        // Después de guardar la puntuación, cargar y actualizar los puntajes
                        loadScores();
                    } else {
                        console.error("Error al guardar la puntuación:", xhr.status);
                    }
                }
            };
            xhr.onerror = function() {
                console.error("Error de red al intentar guardar la puntuación.");
            };
            xhr.send(jsonData);
        } else {
            console.error("Error: Falta el nombre del jugador.");
        }
    } else {
        console.error("Error: La puntuación no supera ninguna de las mostradas.");
    }
    
    // Devolver si la puntuación supera alguna de las mostradas
    return scoreSupera;
}

function checkScoreSupera() {
    // Obtener la puntuación actual
    var currentScore = score;

    // Verificar si currentScore es un número válido
    if (isNaN(currentScore)) {
        console.error("Error: La puntuación actual no es un número válido");
        return false;
    }

    // Obtener las puntuaciones mostradas en la tabla
    var tableScores = [];
    var tableRows = document.querySelectorAll(".paleBlueRows tr:not(:first-child)");
    tableRows.forEach(function(row) {
        var scoreData = {
            playerName: row.cells[1].textContent.trim(),
            score: parseInt(row.cells[3].textContent.trim())
        };
        tableScores.push(scoreData);
    });

    // Verificar si la puntuación actual supera alguna de las puntuaciones mostradas
    var scoreSupera = tableScores.some(function(scoreData) {
        // Verificar si scoreData.score es un número válido
        if (isNaN(scoreData.score)) {
            console.error("Error: La puntuación mostrada no es un número válido");
            return false;
        }
        return currentScore > scoreData.score;
    });

    return scoreSupera;
}

function saveScore(scoreData) {
    // Convertir el objeto de datos a JSON
    var jsonData = JSON.stringify(scoreData);

    // Realizar la solicitud POST al servidor con los datos JSON
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "save_score.php", true);
    xhr.setRequestHeader("Content-Type", "application/json"); // Cambiar el tipo de contenido a JSON
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            // Después de guardar la puntuación, cargar y actualizar los puntajes
            loadScores();
        }
    };
    xhr.send(jsonData); // Enviar los datos JSON
}

function loadScores() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "get_scores.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var scores = JSON.parse(xhr.responseText);
                updateScoresTable(scores);
            } else {
                console.error("Error al cargar las puntuaciones:", xhr.status);
            }
        }
    };
    xhr.onerror = function() {
        console.error("Error de red al intentar cargar las puntuaciones.");
    };
    xhr.send("level=" + difficulty);
}

function updateScoresTable(scores) {
    var tableBody = document.querySelector(".paleBlueRows tbody");
    
    // Limpiar la tabla antes de actualizar los datos
    tableBody.innerHTML = "";

    if (scores.length > 0) {
        // Ordenar las puntuaciones por puntuación, fecha y hora
        scores.sort(function(a, b) {
            // Primero por puntuación (de mayor a menor)
            if (b.puntuacion !== a.puntuacion) {
                return b.puntuacion - a.puntuacion;
            }
            // Luego por fecha y hora (de más reciente a más antigua)
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });

        // Agregar la primera fila con los encabezados de la tabla
        var tableHTML = "<tr><th>Puesto</th><th>Nombre</th><th>Fecha y Hora</th><th>Puntos</th></tr>";

        scores.forEach(function(score, index) {
            var rowClass = (index === 0) ? "resaltado" : ""; // Resaltar solo la primera fila
            var date = new Date(score.fecha);
            var formattedDate = formatDate(date); // Formatear la fecha y hora
            var row = "<tr class='" + rowClass + "'>" +
                "<td>" + (index + 1) + "</td>" +
                "<td>" + score.nombre + "</td>" +
                "<td>" + formattedDate + "</td>" +
                "<td>" + score.puntuacion + "</td>" +
                "</tr>";
            tableHTML += row;
        });

        // Agregar las filas a la tabla
        tableBody.innerHTML = tableHTML;
    } else {
        // Si no hay puntuaciones, mostrar un mensaje en la tabla
        tableBody.innerHTML = "<tr><td colspan='4'>No hay puntuaciones disponibles</td></tr>";
    }
}

function formatDate(dateString) {
    // Convertir la cadena de fecha a un objeto Date
    const date = new Date(dateString);

    // Verificar si la conversión fue exitosa
    if (isNaN(date.getTime())) {
        console.error("Error: Fecha inválida");
        return "Fecha inválida";
    }

    // Formatear la fecha y hora en el formato deseado (ej. "dd/mm/yyyy hh:mm:ss")
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Usar formato de 24 horas
    };
    return date.toLocaleString(undefined, options);
}

function standardizeDate(dateString) {
    // Convertir la cadena de fecha a un objeto Date
    const date = new Date(dateString);

    // Verificar si la conversión fue exitosa
    if (isNaN(date.getTime())) {
        console.error("Error: Fecha inválida");
        return null;
    }

    // Devolver la fecha en formato ISO (estándar)
    return date.toISOString();
}

function limpiarBotonesRespuesta() {
    for (var i = 1; i <= 3; i++) {
        document.getElementById('option' + i).classList.remove('correct');
        document.getElementById('option' + i).classList.remove('incorrect');
    }
}

// Objeto para almacenar las duraciones del temporizador por nivel de dificultad
const timerDurations = {
    medium: 10, // 10 segundos para el nivel medio
    hard: 5, // 5 segundos para el nivel difícil
    pro: 3, // 3 segundos para el nivel pro
    hacker: 2 // 2 segundos para el nivel hacker
};

function resetTimer() {
    // Detener el temporizador actual si existe
    clearInterval(timerInterval);

    // Obtener el nivel de dificultad del juego
    const difficulty = document.getElementById('config-data').getAttribute('data-difficulty');

    // Mostrar el contenedor de tiempo si no está en el nivel "fácil"
    if (difficulty !== 'easy') {
        document.getElementById('time-container').style.display = 'block';

        // Obtener la duración del temporizador según el nivel de dificultad del objeto timerDurations
        const duration = timerDurations[difficulty];

        let timeLeft = duration;
        updateTimerDisplay(timeLeft); // Mostrar el tiempo inicial

        // Iniciar el temporizador
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);

            if (timeLeft === 0) {
                // Si se acaba el tiempo, se llama a la función de respuesta incorrecta
                checkAnswer(null);
            }
        }, 1000);
    } else {
        // Ocultar el contenedor de tiempo en el nivel "fácil"
        document.getElementById('time-container').style.display = 'none';
    }
}

function updateTimerDisplay(timeLeft) {
    // No hacer nada en el nivel "fácil"
    if (difficulty === 'easy') {
        return;
    }

    // Actualizar el texto de la pantalla del temporizador
    document.getElementById('time-display').textContent = timeLeft + "s";

    // Actualizar la barra de progreso del temporizador
    const progressBar = document.getElementById('time-bar');
    let maxTime;
    let color; // Variable para almacenar el color de la barra de progreso

    switch (difficulty) {
        case 'medium':
            maxTime = 10; // 10 segundos para el nivel medio
            break;
        case 'hard':
            maxTime = 5; // 5 segundos para el nivel difícil
            break;
        case 'pro':
            maxTime = 3; // 3 segundos para el nivel pro
            break;
        case 'hacker':
            maxTime = 2; // 2 segundos para el nivel hacker
            break;
        default:
            return;
    }

    // Calcular el porcentaje de tiempo restante
    const progress = (timeLeft / maxTime) * 100;

    // Cambiar el color de la barra a rojo si queda 1 segundo
    if (timeLeft === 1) {
        color = 'red';
    } else {
        color = 'green';
    }

    // Actualizar el estilo de la barra de progreso
    progressBar.style.width = progress + "%";
    progressBar.style.backgroundColor = color;
}
function handleAnimations() {
    // No mostrar animaciones en los niveles "pro" y "hacker"
    if (difficulty === 'pro' || difficulty === 'hacker') {
        return;
    }

    // Animaciones para cada 100 puntos
    if (score % 100 === 0) {
        pauseTimer(); // Pausar el temporizador
        show100PointsAnimation();
    } else {
        // Animaciones para niveles fácil, medio y difícil
        switch (difficulty) {
            case 'easy':
                if (score % 25 === 0 && score !== 0 && score % 100 !== 0) {
                    pauseTimer(); // Pausar el temporizador
                    showLevelAnimation(score);
                }
                break;
            case 'medium':
                if (score % 50 === 0 && score !== 0 && score % 100 !== 0) {
                    pauseTimer(); // Pausar el temporizador
                    showLevelAnimation(score);
                }
                break;
            case 'hard':
                if (score % 75 === 0 && score !== 0 && score % 100 !== 0) {
                    pauseTimer(); // Pausar el temporizador
                    showLevelAnimation(score);
                }
                break;
            default:
                break;
        }
    }
}

function pauseTimer() {
    clearInterval(timerInterval); // Detener el temporizador
}

function resumeTimer() {
    resetTimer(); // Reanudar el temporizador
}

function show100PointsAnimation() {
    // No mostrar confetis en los niveles "pro" y "hacker"
    if (difficulty === 'pro' || difficulty === 'hacker') {
        return;
    }

    const scoreElement = document.getElementById('puntuacion');
    const confettiCanvas = document.getElementById('confettiCanvas');

    scoreElement.style.display = 'block';
    scoreElement.style.opacity = '0';
    scoreElement.style.transform = 'translate(-50%, -50%) scale(1)';
    confettiCanvas.style.display = 'block';

    const confettiSettings = {
        target: 'confettiCanvas',
        max: 500,
        size: 1,
        rotate: true
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    setTimeout(() => {
        scoreElement.style.opacity = '1';
        confetti.clear();
        setTimeout(() => {
            scoreElement.style.transform = 'translate(-50%, -50%) scale(3)';
            setTimeout(() => {
                scoreElement.style.opacity = '0';
                scoreElement.style.display = 'none';
                confettiCanvas.style.display = 'none';
                resumeTimer(); // Reanudar el temporizador después de que la animación haya terminado
            }, 2000);
        }, 200);
    }, 5000);
}

function showLevelAnimation(score) {
    // Calcular el número de imagen basado en la puntuación y el nivel de dificultad
    let numImagen;
    let rutaCarpeta; // Variable para almacenar la ruta de la carpeta de imágenes
    let duracionAnimacion; // Variable para almacenar la duración de la animación

    switch (difficulty) {
        case 'easy':
            numImagen = Math.ceil(score / 25);
            rutaCarpeta = 'gif/easy/'; // Carpeta para el nivel fácil
            duracionAnimacion = 3000; // Duración de la animación en milisegundos para el nivel fácil
            break;
        case 'medium':
            numImagen = Math.ceil(score / 50);
            rutaCarpeta = 'gif/medium/'; // Carpeta para el nivel medio
            duracionAnimacion = 2000; // Duración de la animación en milisegundos para el nivel medio
            break;
        case 'hard':
            numImagen = Math.ceil(score / 75);
            rutaCarpeta = 'gif/hard/'; // Carpeta para el nivel difícil
            duracionAnimacion = 1000; // Duración de la animación en milisegundos para el nivel difícil
            break;
        default:
            break;
    }

    // Detener el temporizador mientras se ejecuta la animación
    pauseTimer();

    // Construir la ruta completa de la imagen
    const rutaImagen = rutaCarpeta + numImagen.toString().padStart(2, '0') + '.gif';

    // Crear el elemento de imagen
    const img = new Image();
    img.src = rutaImagen; // Establecer la ruta de la imagen

    // Cuando la imagen esté cargada, añadirla al contenedor
    img.onload = function() {
        const container = document.getElementById('imagen-container');
        container.innerHTML = ''; // Limpiar el contenedor antes de añadir una nueva imagen
        container.appendChild(img); // Añadir la imagen al contenedor
        container.classList.add('mostrar');
        setTimeout(function() {
            container.classList.remove('mostrar');
            // Reanudar el temporizador después de que la animación haya terminado
            resumeTimer();
        }, duracionAnimacion);
    };
}

function resaltarCorrecta() {
    for (var i = 1; i <= 3; i++) {
        var optionButton = document.getElementById('option' + i);
        if (parseInt(optionButton.textContent) === correctAnswer) {
            optionButton.classList.add('correct');
        } else {
            optionButton.classList.remove('correct');
        }
    }
}

function restartGame() {
    score = 0;
    document.getElementById('score').textContent = "";
    document.getElementById('restart').style.display = "none";

    // Habilitar los botones de opción y limpiar las clases
    for (var i = 1; i <= 3; i++) {
        var optionButton = document.getElementById('option' + i);
        optionButton.disabled = false;
        optionButton.classList.remove('correct'); // Remover la clase correcta
        optionButton.classList.remove('incorrect'); // Remover la clase incorrecta
        optionButton.classList.add('option'); // Añadir la clase option
    }

    // Ocultar el resultado
    document.getElementById('result').textContent = "";
    document.getElementById('result').className = "";

    // Generar una nueva pregunta
    generateQuestion();

    // Reiniciar el temporizador
    resetTimer();
}

window.onload = function() {
    initializeGame();
    generateQuestion();
    for (var i = 1; i <= 3; i++) {
        document.getElementById('option' + i).onclick = (function(i) {
            return function() {
                checkAnswer(parseInt(document.getElementById('option' + i).textContent));
            }
        })(i);
    }
};