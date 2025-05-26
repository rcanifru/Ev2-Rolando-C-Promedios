const students = [];
const tableBody = document.querySelector('#studentsTable tbody');
const averageDiv = document.getElementById('average');
const totalSpan = document.getElementById('totalStudents');
const passedSpan = document.getElementById('passedCount');
const failedSpan = document.getElementById('failedCount');
const form = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const lastNameInput = document.getElementById('lastName');
const gradeInput = document.getElementById('grade');
const editIndexInput = document.getElementById('editIndex');
const submitBtn = document.getElementById('submitBtn');

// Patrón y validación de nota
const gradePattern = /^([1-6](\.[0-9])?|7(\.0)?)$/;
function validateGrade(value) {
  return gradePattern.test(value);
}

// Restricciones de entrada para la nota
gradeInput.addEventListener('input', () => {
  gradeInput.value = gradeInput.value.replace(/[^0-9.]/g, '');
  const parts = gradeInput.value.split('.');
  if (parts.length > 2) {
    gradeInput.value = parts[0] + '.' + parts.slice(1).join('');
  }
  if (parts[1] && parts[1].length > 1) {
    gradeInput.value = parts[0] + '.' + parts[1].charAt(0);
  }
  if (gradeInput.value && !validateGrade(gradeInput.value)) {
    gradeInput.setCustomValidity('La calificación debe estar entre 1.0 y 7.0.');
  } else {
    gradeInput.setCustomValidity('');
  }
});

// Solo letras para nombre y apellido
[nameInput, lastNameInput].forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
    if (input.value.length > 25) {
      input.value = input.value.substring(0, 25);
    }
    input.setCustomValidity('');
  });
});

// Manejo de envío (agregar o actualizar)
form.addEventListener('submit', function(e) {
  e.preventDefault();

  if (!nameInput.checkValidity()) { nameInput.reportValidity(); return; }
  if (!lastNameInput.checkValidity()) { lastNameInput.reportValidity(); return; }
  if (!validateGrade(gradeInput.value)) { gradeInput.setCustomValidity('La calificación debe estar entre 1.0 y 7.0.'); gradeInput.reportValidity(); return; }
  else { gradeInput.setCustomValidity(''); }

  const studentData = {
    name: nameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    grade: parseFloat(gradeInput.value)
  };

  const idx = editIndexInput.value;
  if (idx === '') {
    // Agregar nuevo
    students.push(studentData);
  } else {
    // Actualizar existente
    students[idx] = studentData;
    editIndexInput.value = '';
    submitBtn.textContent = 'Agregar Estudiante';
  }

  renderTable();
  calculateAverage();
  form.reset();
});

// Renderiza la tabla completa
function renderTable() {
  tableBody.innerHTML = '';
  students.forEach((student, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.lastName}</td>
      <td>${student.grade.toFixed(1)}</td>
      <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Eliminar</button>
      </td>
    `;
    row.querySelector('.edit-btn').addEventListener('click', () => loadStudentForEdit(i));
    row.querySelector('.delete-btn').addEventListener('click', () => deleteEstudiante(i));
    tableBody.appendChild(row);
  });
}

// Carga datos en el formulario para editar
function loadStudentForEdit(index) {
  const s = students[index];
  nameInput.value = s.name;
  lastNameInput.value = s.lastName;
  gradeInput.value = s.grade.toFixed(1);
  editIndexInput.value = index;
  submitBtn.textContent = 'Actualizar Estudiante';
}

// Elimina un estudiante y actualiza promedio
function deleteEstudiante(index) {
  students.splice(index, 1);
  renderTable();
  calculateAverage();
}

// Calcula y muestra el promedio general y estadísticas
function calculateAverage() {
  if (students.length === 0) {
    averageDiv.textContent = 'Promedio de Calificaciones: No Disponible';
    updateStats();
    return;
  }
  const avg = students.reduce((sum, s) => sum + s.grade, 0) / students.length;
  averageDiv.textContent = `Promedio de Calificaciones: ${avg.toFixed(2)}`;
  updateStats();
}

// Calcula y muestra estadísticas adicionales
function updateStats() {
  const totalCount = students.length;
  const passedCount = students.filter(s => s.grade >= 4.0).length;
  const failedCount = totalCount - passedCount;
  totalSpan.textContent = totalCount;
  passedSpan.textContent = passedCount;
  failedSpan.textContent = failedCount;
}
