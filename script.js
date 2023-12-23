window.addEventListener('load', function () {
  const addToggle = document.getElementById('add-toggle');
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

  let buttonsDisabled = false;

  if (names.length) {
    updateNames();
  } else {
    buttonsDisabled = true;
  }

  updateButtons();

  shouldShowAssignments() ? setReassign() : resetAssign();

  document.addEventListener('click', event => {
    if (event.target.className.includes('remove-btn')) {
      names.splice(event.target.id, 1);
      assignments = [];
      localStorage.setItem('names', JSON.stringify(names));
      localStorage.setItem('assignments', JSON.stringify(assignments));
      updateNames();
    }
  });

  addToggle.addEventListener('click', () => {
    addToggle.style.display = "none";
    nameForm.style.display = "flex";
    nameInput.focus();
  });

  nameForm.addEventListener('submit', event => {
    event.preventDefault();
    if (names.includes(nameInput.value)) {
      alert('\nEach name must be unique.\n');
    } else {
      updateNames();
    }
    nameForm.style.display = "none";
    addToggle.style.display = "block";
  });

  assignButton.addEventListener('click', event => {
    event.preventDefault();
    if (names.length > 1) {
      assignments = shuffle(names);
      localStorage.setItem('assignments', JSON.stringify(assignments));
      updateNames();
      setReassign();
    } else if (names.length) {
      alert('\nYou must have at least 2 names to generate assignments.\n');
    }
  });

  printButton.addEventListener('click', () => {
    if (names.length) print();
    return false;
  });

  clearButton.addEventListener('click', event => {
    event.preventDefault();
    if (names.length) {
      if (
        confirm('\nThis will delete all names. Are you sure?\n')
      ) {
        localStorage.clear();
        names = [];
        assignments = [];
        headerRow.innerHTML = '';
        tableBody.innerHTML = '';
        resetAssign();
        buttonsDisabled = true;
        updateButtons();
      }
    }
  });

  function updateNames() {
    if (nameInput.value.trim().length > 0) {
      names.push(nameInput.value);
      localStorage.setItem('names', JSON.stringify(names));
    }

    if (names.length) {
      buttonsDisabled = false;
      headerRow.innerHTML = '<th>Name</th>';
    } else {
      buttonsDisabled = true;
    }
    updateButtons();

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
          <i class="fa-solid fa-square-xmark remove-btn" id="${i}"></i>
          <span class="name">${names[i]}</span>
        </td>`;
      if (shouldShowAssignments()) {
        body += `<td><span class="name">${assignments[i]}</span></td>`;
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

  function updateButtons() {
    const buttons = [assignButton, printButton, clearButton];
    buttonsDisabled
      ? buttons.forEach(btn => btn.classList.add("disabled"))
      : buttons.forEach(btn => btn.classList.remove("disabled"));
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
