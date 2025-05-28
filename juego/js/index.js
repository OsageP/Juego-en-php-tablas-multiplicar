document.addEventListener("DOMContentLoaded", function() {
    var currentTable = 1;

    function updateMultiplicationTable() {
        var currentTableNum = document.getElementById('currentTableNum');
        var multiplicationTable = document.querySelector('.multiplication-table');
        
        currentTableNum.textContent = currentTable;
        multiplicationTable.querySelector('thead th').textContent = 'Tabla del ' + currentTable;

        var tableContent = '';
        for (var i = 0; i < 5; i++) {
            var num1 = i + 1;
            var num2 = i + 6;
            tableContent += '<tr>';
            tableContent += '<td>' + num1 + ' x ' + currentTable + '</td><td>' + (num1 * currentTable) + '</td>';
            tableContent += '<td>' + num2 + ' x ' + currentTable + '</td><td>' + (num2 * currentTable) + '</td>';
            tableContent += '</tr>';
        }
        multiplicationTable.querySelector('tbody').innerHTML = tableContent;
    }

    document.getElementById('prevTableBtn').addEventListener('click', function() {
        currentTable = (currentTable == 1) ? 10 : (currentTable - 1);
        updateMultiplicationTable();
    });

    document.getElementById('nextTableBtn').addEventListener('click', function() {
        currentTable = (currentTable == 10) ? 1 : (currentTable + 1);
        updateMultiplicationTable();
    });

    updateMultiplicationTable();

    var showInstructionsBtn = document.getElementById('showInstructionsBtn');
    var instructions = document.getElementById('instructions');

    // Evento de clic en el botón para mostrar u ocultar las instrucciones
    showInstructionsBtn.addEventListener('click', function() {
        if (instructions.style.display === 'none') {
            instructions.style.display = 'block';
        } else {
            instructions.style.display = 'none';
        }
    });
});
