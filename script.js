window.addEventListener('load', function () {
  let storedNames = JSON.parse(localStorage.getItem('names'));
  let storedAssignments = JSON.parse(localStorage.getItem('assignments'));

  let names = storedNames || [];
  let assignments = storedAssignments || [];

  const nameForm = document.querySelector('form');
  const headerRow = document.getElementById('header-row');
  const tableBody = document.getElementById('table-body');
  const nameInput = document.getElementById('new-name');
  const assignButton = document.getElementById('assign');
  const againText = document.getElementById('again');
  const printButton = document.getElementById('print');
  const clearButton = document.getElementById('clear');

  if (names.length) updateNames();

  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updateNames();
  });

  assignButton.addEventListener('click', function (event) {
    event.preventDefault();
    assignments = shuffle(names);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    updateNames();
    againText.style.visibility = 'visible';
  });

  printButton.addEventListener('click', function (event) {
    print();
    return false;
  });

  clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (
      confirm('This will completely empty the list of names. Are you sure?')
    ) {
      localStorage.clear();
      names = [];
      assignments = [];
      headerRow.innerHTML = '';
      tableBody.innerHTML = '';
      againText.style.visibility = 'hidden';
    }
  });

  function updateNames() {
    if (nameInput.value.trim().length > 0) {
      names.push(nameInput.value);
      localStorage.setItem('names', JSON.stringify(names));
    }
    headerRow.innerHTML = '<th>Name</th>';
    if (shouldShowAssignments()) {
      headerRow.innerHTML += '<th>Assignment</th>';
    }
    let body = '';
    for (let i = 0; i < names.length; i++) {
      body += `<tr><td>${names[i]}</td>`;
      if (shouldShowAssignments()) {
        body += `<td>${assignments[i]}</td>`;
      }
      body += '</tr>';
    }
    tableBody.innerHTML = body;
    nameInput.value = '';
  }

  function shouldShowAssignments() {
    return assignments.length && assignments.length === names.length;
  }
});

/* Helper functions */

function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

function shuffle(arr) {
  let arrCopy = [...arr];
  let shuffled = [];
  while (arrCopy.length > 1) {
    let index = getRandomIndex(arrCopy.length);
    if (arrCopy[index] !== arr[shuffled.length]) {
      shuffled.push(arrCopy.splice(index, 1)[0]);
    }
  }
  if (arr[arr.length - 1] === arrCopy[0]) {
    return shuffle(arr);
  } else {
    shuffled.push(arrCopy.pop());
  }
  return shuffled;
}
