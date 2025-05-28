<?php
session_start(); // Iniciar la sesión

// Si se envió el formulario, procesar las opciones
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener las opciones seleccionadas
    $showAnimations = isset($_POST['showAnimations']) ? true : false;
    $difficulty = $_POST['difficulty'];

    // Guardar las opciones en la sesión
    $_SESSION['config'] = array(
        'showAnimations' => $showAnimations,
        'difficulty' => $difficulty
    );

    // Redireccionar al usuario a juego.php
    header("Location: juego.php");
    exit;
} else { // Si no se envió el formulario, definir las variables de configuración en un script
    // Obtener las opciones de la sesión si están disponibles
    $showAnimations = isset($_SESSION['config']['showAnimations']) ? $_SESSION['config']['showAnimations'] : false;
    $difficulty = isset($_SESSION['config']['difficulty']) ? $_SESSION['config']['difficulty'] : 'easy';
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Tablas de Multiplicar</title>
    <meta name="description" content="¡Bienvenido a Tablas de Multiplicar!. Aprende y practica jugando las tablas de multiplicar, hecho para niños de 8 años en adelante">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="apple-touch-icon" sizes="180x180" href="ico/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="ico/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="ico/favicon-16x16.png">
	<link rel="manifest" href="ico/site.webmanifest">
	<link rel="mask-icon" href="ico/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="theme-color" content="#ffffff">
	<link rel="stylesheet" type="text/css" href="css/stylesindex.css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">
	<!-- Script para definir las variables de configuración en JavaScript -->
    	<script>
        var showAnimations = <?php echo $showAnimations ? 'true' : 'false'; ?>;
        var difficulty = '<?php echo $difficulty; ?>';
    	</script>
	<meta name="robots" content="noindex, nofollow">
</head>
<body>
<div class="main-container">
    <div class="container">
        <h1>Tablas de Multiplicar</h1>
		
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div class="difficulty-buttons">
                <button type="submit" name="difficulty" value="easy">Fácil</button>
                <button type="submit" name="difficulty" value="medium">Medio</button>
                <button type="submit" name="difficulty" value="hard">Difícil</button>
                <button type="submit" name="difficulty" value="pro">Pro</button>
            </div>
            <label>
                <span>Mostrar Animaciones:</span>
                <br>
                <label class="switch">
                    <input type="checkbox" name="showAnimations" value="true">
                    <span class="slider"></span>
                </label>
            </label>
        </form>

		<button type="button" id="showInstructionsBtn">Instrucciones</button>

	    <div id="instructions" style="display: none;">
                        <h1>¡Bienvenido al juego de las tablas de multiplicar!</h1>
        
            <p>En este emocionante desafío, te convertirás en un experto en matemáticas mientras te diviertes.</p>
        
            <h2>Niveles de Dificultad:</h2>
            <ul>
                <li><strong>Fácil:</strong> No hay límite de tiempo para responder cada pregunta. ¡Tómate tu tiempo y diviértete!</li>
                <li><strong>Medio:</strong> Tienes 10 segundos para responder cada pregunta. ¡Presta atención al reloj y sé rápido!</li>
                <li><strong>Difícil:</strong> Tienes solo 5 segundos para responder cada pregunta. ¡Desafía tu mente y sé ágil!</li>
                <li><strong>Pro:</strong> ¡Aquí la concentración es clave! Solo tienes 3 segundos para responder cada pregunta. ¡Demuestra tu agilidad mental!</li>
            </ul>
				<p>Una vez dentro del juego, si quieres volver a seleccionar un nivel, haz clic en la imagen <img src="img/configuracion.svg" alt="Configuraciones" style="width: 20px; height: 20px;"> para regresar a la pantalla inicial. Cuando domines las tablas,<strong> atrévete a buscar el nivel Hacker:</strong> tendrás solo 2 segundos para responder. Es una manera de mejorar la concentración y ejercitar la mente. <strong>¡No te dejes distraer ni por una mosca!</strong></p>

            <h2>Animaciones:</h2>
            <p>Si activas el botón "Mostrar Animaciones", podrás ver divertidas animaciones de tus personajes favoritos de juegos como <em>Brawl Stars</em>, <em>Stumble Guys</em>, ¡y muchos más! Pero recuerda, ¡no habrá animaciones en el nivel Pro para que puedas mantenerte concentrado al máximo!</p>
        
            <h2>Puntuación y Celebraciones:</h2>
            <p>En todos los niveles, ¡cada 100 puntos será motivo de celebración! Verás confeti por toda la pantalla para felicitarte por tu logro.</p>
            <ul>
                <li><strong>Nivel Fácil:</strong> ¡Cada 25 puntos que consigas serán motivo de celebración! Un personaje te felicitará.</li>
                <li><strong>Nivel Medio:</strong> Cada 50 puntos serán tu objetivo para ver a tus personajes favoritos.</li>
                <li><strong>Nivel Difícil:</strong> ¡Cada 75 puntos merecerán un gran aplauso! De tus personajes favoritos.</li>
                <li><strong>Nivel Pro:</strong> La concentración es clave. No habrá animaciones.</li>
            </ul>
        
            <h2>Desafío de Puntuación:</h2>
            <p>Si superas alguna puntuación mostrada en la tabla, ¡tendrás la oportunidad de poner tu nombre y entrar en el Top 5 de cada nivel! ¿Estás listo para el desafío?</p>
        
            <p>¡Prepárate para disfrutar y aprender al mismo tiempo!</p>
			
			
			<p><strong>¡Buena suerte, aventurero de las matemáticas!</strong></p>
		
        </div>
		
		<!-- Contenedor para las flechas de navegación -->
        <div class="nav-arrows">
            <button id="prevTableBtn">&#9664;</button>
            <span class="table-heading">Tabla del <span id="currentTableNum">1</span></span>
            <button id="nextTableBtn">&#9654;</button>
        </div>
        
        <!-- Tabla de multiplicar -->
        <table class="multiplication-table">
            <thead>
                <tr>
                    <th colspan="4">Tabla del 1</th>
                </tr>
            </thead>
            <tbody>
                <?php
                // Generar la tabla de multiplicar del 1
                for ($i = 0; $i <= 4; $i++) {
                    echo "<tr>";
                    echo "<td>" . ($i + 1) . " x 1</td>";
                    echo "<td>" . (($i + 1) * 1) . "</td>";
                    echo "<td>" . ($i + 6) . " x 1</td>";
                    echo "<td>" . (($i + 6) * 1) . "</td>";
                    echo "</tr>";
                }
                ?>
            </tbody>
        </table>
    </div> 
	 <!-- Elemento oculto para almacenar los datos de configuración -->
    <div id="config-data" data-show-animations="<?php echo $showAnimations ? 'true' : 'false'; ?>" data-difficulty="<?php echo $difficulty; ?>" style="display: none;"></div>
	
<!-- Mensaje de error -->
<div class="error-message-container" id="errorMessage">
<div  <div class="error-message-content">
    <p class="error-message">Este código es de libre uso, pero por favor no modifiques este código sin consultar al creador.</p>
	</br>
	<div>
    <pre class="error-message-logo" id="Osagep">  
                           ++++++++++++++++++++                          
                     ++++++++++++      ++++++++++++                     
                 +++++++                        +++++++                 
               +++++     +++++++++                  +++++               
            +++++    ++++++++++++++++   +++     +++    +++++            
          +++++   +++++++++++++++++++ +++++      +++++   +++++          
         ++++   ++++++++           +++++++  +++   ++++++   ++++         
       ++++   ++++++   ++++++++++++++++++++ ++    +++++++++  ++++       
      ++++  +++++  +++++++++++++++++++++++++++++++++++++++++  ++++      
     +++   ++++  +++++++++++++++++++++++++++++++++ ++++++++++   +++     
   ++++  ++++  +++++++++++++++++++++++++++++++++   +++++++++++   +++    
   +++  +++  +++++++++++++++++++++++++++++++       +++++++++++    +++   
  +++  +++  ++++++++++++++++++++++++ +++++++       ++++++++++   +  +++  
 +++   +   ++++++++++++++++ ++++++++++++++++       ++++++++++ +++   +++ 
 +++      +++++++++++++++ ++++++++++++++++++       +++++++++ +++++  +++ 
++++     +++++++++++++++ ++  +++++++++++++++      +++++++++ +++++++ ++++
+++     +++++++++++++++ +++    +++++++++++++      +++++++++++++++++  +++
+++    +++++++++++++++  +++      +++++++++++     ++++++++++++++++++  +++
+++    ++++++++++++++  +++++     +++++++++++    +++++++++++++++++++  +++
+++    +++++++++++++  ++++++     +++++++++++   +++++++++++++++++++   +++
+++    +++++++++++++  ++++++     ++++++++++   +++++++++++++++++++    +++
+++    ++++++++++++  ++++++++       +++++   +++++++++++++++++   +++  +++
+++    ++++++++++++  ++++++++             ++++++++++++++ ++++++++++  +++
++++   +++++++++++   +++++++         ++++++++++++++++++++++++++++++ ++++
 +++   +++++++++++   +++++++++++++++++++++++++++++++++++++++++++++  +++ 
 +++   +++++++++++  +++++++++++++++++++++++++++++++++++++++++++++   +++ 
  +++   ++++++++++  ++++++++++++++++++++++++++++++++++++++++++++   +++  
   +++   ++++++++   +++++++++++++++++++++++++++++++++++++++++     +++   
   ++++  ++++++++   +++++++++++++++++++++++++++                  +++    
     +++   ++++++    ++++++++++++++++++++++++++++++++++         +++     
      ++++  +++++    +++++++++++++++++++++++++++++++++++++++  ++++      
       ++++   +++    +++++++++++ ++++++++++++++++++++++++++  ++++       
         ++++   +    +++++++++++++   +++++++++++++++++++   ++++         
          +++++       +++++++++++++++     ++++++++++++   +++++          
            +++++      ++++++++++++++++++              +++++            
               +++++     +++++++++++++++++++++      +++++               
                 +++++++       ++++++++++       +++++++                 
                     ++++++++++++      ++++++++++++                     
                          ++++++++++++++++++++                          
</pre>
</div>
</div>
</div>

    <footer>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div>
                <button type="submit" name="difficulty" value="hacker" style="background-color: transparent; border: none; color: rgba(0, 0, 0, 0.5); opacity: 0.5;">👹</button>
            </div>
            <!-- Opción de mostrar animaciones oculta y desactivada -->
            <label style="display: none;">
                <span>Mostrar Animaciones:</span>
                <br>
                <label class="switch">
                    <input type="checkbox" name="showAnimations" value="true" disabled>
                    <span class="slider"></span>
                </label>
            </label>
        </form>
        <p>&copy; <?php echo date("Y"); ?> Tablas de Multiplicar by <a href="https://dinoswords.gg/" target="_self" style="text-decoration: none; color: inherit;">Osagep</a>. V.1.0.2.</p>
    </footer>
</div>

<!-- Aquí incluimos el archivo JavaScript -->
    <script>
        // Tu código JavaScript ofuscado aquí
        document.addEventListener("DOMContentLoaded",function(){var t=1;function n(){var n=document.getElementById("currentTableNum"),o=document.querySelector(".multiplication-table");n.textContent=t,o.querySelector("thead th").textContent="Tabla del "+t;var a="";for(var e=0;e<5;e++){var r=e+1,i=e+6;a+="<tr>",a+="<td>"+r+" x "+t+"</td><td>"+r*t+"</td>",a+="<td>"+i+" x "+t+"</td><td>"+i*t+"</td>",a+="</tr>"}o.querySelector("tbody").innerHTML=a}document.getElementById("prevTableBtn").addEventListener("click",function(){t=1===t?10:t-1,n()}),document.getElementById("nextTableBtn").addEventListener("click",function(){t=10===t?1:t+1,n()}),n();var o=document.getElementById("showInstructionsBtn"),a=document.getElementById("instructions");o.addEventListener("click",function(){"none"===a.style.display?a.style.display="block":a.style.display="none"}),(function(){var t=document.querySelector("footer").innerText.toLowerCase();if(!t.includes("osagep")){var n=document.getElementById("errorMessage");n.style.display="flex",document.body.style.backgroundColor="red"}})()});
    </script>
</body>
</html>
