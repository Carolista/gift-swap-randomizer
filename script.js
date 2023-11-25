window.addEventListener('load', function () {
  const addText = document.getElementById("add-text");
  const nameForm = document.querySelector('form');
  const headerRow = document.getElementById('header-row');
  const tableBody = document.getElementById('table-body');
  const nameInput = document.getElementById('new-name');
  const assignButton = document.getElementById('assign');
  const printButton = document.getElementById('print');
  const clearButton = document.getElementById('clear');

  let storedNames = JSON.parse(localStorage.getItem('names'));
  let storedAssignments = JSON.parse(localStorage.getItem('assignments'));

  let names = storedNames || [];
  let assignments = storedAssignments || [];

  if (names.length) {
    updateNames();
  }

  shouldShowAssignments() ? setReassign() : resetAssign();

  document.addEventListener('click', function (event) {
    if (event.target.className.includes('remove-btn')) {
      names.splice(event.target.id, 1);
      assignments = [];
      localStorage.setItem('names', JSON.stringify(names));
      localStorage.setItem('assignments', JSON.stringify(assignments));
      updateNames();
    }
  });

  addText.addEventListener('click', function (event){
    addText.style.display = "none";
    nameForm.style.display = "flex";
  });

  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (names.includes(nameInput.value)) {
      alert('\nEach name must be unique.\n');
    } else {
      updateNames();
    }
    nameForm.style.display = "none";
    addText.style.display = "block";
  });

  assignButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (names.length < 2) {
      alert('\nYou must have at least 2 names to generate assignments.\n');
    } else {
      assignments = shuffle(names);
      localStorage.setItem('assignments', JSON.stringify(assignments));
      updateNames();
      setReassign();
    }
  });

  printButton.addEventListener('click', function () {
    print();
    return false;
  });

  clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (
      confirm('\nThis will completely empty the list of names. Are you sure?\n')
    ) {
      localStorage.clear();
      names = [];
      assignments = [];
      headerRow.innerHTML = '';
      tableBody.innerHTML = '';
      resetAssign();
    }
  });

  function updateNames() {
    if (nameInput.value.trim().length > 0) {
      names.push(nameInput.value);
      localStorage.setItem('names', JSON.stringify(names));
    }
    if (names.length) {
      headerRow.innerHTML = '<th>Name</th>';
    }
    if (shouldShowAssignments()) {
      headerRow.innerHTML += '<th>Assignment</th>';
    } else {
      resetAssign();
    }
    let body = '';
    for (let i = 0; i < names.length; i++) {
      body += `
      <tr>
        <td>
          ${names[i]} 
          <i class="fa-solid fa-square-xmark remove-btn" id="${i}"></i>
        </td>`;
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

  function setReassign() {
    assignButton.innerHTML = 'Reassign Recipients';
  }

  function resetAssign() {
    assignButton.innerHTML = 'Assign Recipients';
  }
});

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
