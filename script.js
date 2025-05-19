const students = [];
const tableBody = document.querySelector('#studentsTable tbody');
const averageDiv = document.getElementById('average');
const form = document.getElementById('studentForm');

// campos del formulario
const nameInput = document.getElementById('name');
const lastNameInput = document.getElementById('lastName');
const gradeInput = document.getElementById('grade');

// Función para validar la calificación
function validateGrade(value) {
  // numeros entre 1.0 y 7.0
  const gradePattern = /^([1-6](\.[0-9])?|7(\.0)?)$/;
  return gradePattern.test(value);
}

// restricciones de entrada
gradeInput.addEventListener('input', function() {
  // solo numeros y punto como decimal (no comas)
  this.value = this.value.replace(/[^0-9.]/g, '');
  

  const parts = this.value.split('.');
  if (parts.length > 2) {
    this.value = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // decimales
  if (parts.length > 1 && parts[1].length > 1) {
    this.value = parts[0] + '.' + parts[1].charAt(0);
  }
  
  // validacion del rango
  if (this.value !== '' && !validateGrade(this.value)) {
    this.setCustomValidity('La calificación debe estar entre 1.0 y 7.0.');
  } else {
    this.setCustomValidity('');
  }
});

// cant letras
nameInput.addEventListener('input', function() {
  // solo letras
  this.value = this.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
  
  // cant caracteres
  if (this.value.length > 25) {
    this.value = this.value.substring(0, 25);
  }
  
  this.setCustomValidity('');
});

// letras y 25caracteres
lastNameInput.addEventListener('input', function() {
  // solo letras
  this.value = this.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
  
  //limitamos la longitud de los caracteres
  if (this.value.length > 25) {
    this.value = this.value.substring(0, 25);
  }
  
  this.setCustomValidity('');
});

// envio del formulario
form.addEventListener('submit', function(e) {
  e.preventDefault();


  if (!nameInput.checkValidity()) {
    nameInput.reportValidity();
    return;
  }
  
  if (!lastNameInput.checkValidity()) {
    lastNameInput.reportValidity();
    return;
  }
  
  // Validación manual
  if (!validateGrade(gradeInput.value)) {
    gradeInput.setCustomValidity('La calificación debe estar entre 1.0 y 7.0.');
    gradeInput.reportValidity();
    return;
  } else {
    gradeInput.setCustomValidity('');
  }

  // Si todo es valido
  const student = {
    name: nameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    grade: parseFloat(gradeInput.value)
  };
  students.push(student);
  addStudentToTable(student);
  calculateAverage();

  form.reset();
});

function addStudentToTable(student) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.lastName}</td>
    <td>${student.grade.toFixed(1)}</td>
  `;
  tableBody.appendChild(row);
}

function calculateAverage() {
  if (students.length === 0) {
    averageDiv.textContent = 'Promedio de Calificaciones: No Disponible';
    return;
  }
  const total = students.reduce((sum, s) => sum + s.grade, 0);
  const avg = total / students.length;
  
  // Actualizar el promedio
  averageDiv.textContent = `Promedio de Calificaciones: ${avg.toFixed(2)}`;
}