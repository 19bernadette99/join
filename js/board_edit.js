// shows the editing overlay - populates all fields with task data and updates UI states.
async function openEditOverlay(task) {
  if (!task) return;

  if (!window.userNames || window.userNames.length === 0) {
    window.userNames = await getUsersFromDatabase();
  }

  window.assignees = Array.isArray(task.assignedTo) ? [...task.assignedTo] : [];

  const overlay = document.getElementById("editTaskOverlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");

  const titleInput = overlay.querySelector(
    ".edit-input[placeholder='Enter a title']"
  );
  const descriptionTextarea = overlay.querySelector(
    ".edit-textarea[placeholder='Enter a Description']"
  );
  const dueDateInput = overlay.querySelector("#due-date");
  const priorityButtons = overlay.querySelectorAll(".priority-labels");
  const subtaskListContainer = document.getElementById("subtaskList");

  titleInput.value = task.title || "";
  descriptionTextarea.value = task.description || "";
  dueDateInput.value = task.dueDate || "";

  priorityButtons.forEach((btn) => {
    resetPriority(btn);
    btn.classList.remove("selected");
    if (btn.id === task.priority) {
      activatePriority(btn);
      btn.classList.add("selected");
    }
  });

  renderUsersToAssignEdit();
  renderAssignees(
    "assigned-to-dropdown-edit",
    document.getElementById("assigned-to-dropdown-edit")
  );

  renderSubtasks(task, subtaskListContainer);
  setupEditDropdownEvents();
  setupPrioritySelection();
  setupSubtaskInput();
  setupDatePicker();
}

function renderAssignees(containerId, container) {
  const assigneesContainerId =
    containerId === "assigned-to-dropdown-edit"
      ? "assignees-list-edit"
      : "assignees-list";

  const assigneesContainerRef = document.getElementById(assigneesContainerId);

  if (assignees.length > 0) {
    assigneesContainerRef.classList.remove("d_none");
    assignees.forEach((name) => {
      let initials = getInitials(name);
      let iconBackgroundColor = getIconBackgroundColor(initials);
      assigneesContainerRef.innerHTML += getAvatarTemplate(
        initials,
        iconBackgroundColor
      );
    });
  } else {
    assigneesContainerRef.classList.add("d_none");
  }
}

function renderUsersToAssignEdit() {
  const usersList = document.getElementById("assigned-to-users-list-edit");
  if (!usersList || !window.userNames) return;

  usersList.innerHTML = "";

  window.userNames.forEach((name, index) => {
    const initials = getInitials(name);
    const bgColor = getIconBackgroundColor(initials);
    const isSelected = assignees.includes(name);

    usersList.innerHTML += getUsersToAssignTemplateForEditTaskForm(
      name,
      index,
      isSelected,
      initials,
      bgColor
    );
  });
}

function getTaskById(id) {
  return tasks.find((t) => t.id === id);
}

// hides the editing overlay
function closeEditOverlay() {
  document.getElementById("editTaskOverlay").classList.add("hidden");
}

// click event for all priority buttons (Urgent, Medium, Low) in the edit overlay
function setupPrioritySelection() {
  const buttons = document.querySelectorAll("#urgent, #medium, #low");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const isSelected = button.classList.contains("selected");
      buttons.forEach((btn) => {
        resetPriority(btn);
        btn.classList.remove("selected");
      });
      if (!isSelected) {
        activatePriority(button);
        button.classList.add("selected");
      }
    });
  });
}

// resets the color and style of a priority button
function resetPriority(button) {
  button.style.backgroundColor = "#ffffff";
  button.style.color = "#000000";
  button.style.fontWeight = "normal";
  const paths = button.querySelectorAll("svg path");
  paths.forEach((path) => setDefaultColor(path, button.id));
}

// colors the icons in the button again according to the priority (if inactive)
function setDefaultColor(path, id) {
  if (id === "urgent") path.setAttribute("fill", "#FF3D00");
  if (id === "medium") path.setAttribute("fill", "#FFA800");
  if (id === "low") path.setAttribute("fill", "#7AE229");
}

// activates the clicked priority button (color, style, icon white)
function activatePriority(button) {
  const paths = button.querySelectorAll("svg path");
  button.style.fontWeight = "bold";
  button.style.color = "#ffffff";
  if (button.id === "urgent") button.style.backgroundColor = "#FF3D00";
  if (button.id === "medium") button.style.backgroundColor = "#FFA800";
  if (button.id === "low") button.style.backgroundColor = "#7AE229";
  paths.forEach((path) => path.setAttribute("fill", "#ffffff"));
}

// controls the dropdown for "Assigned to" in the edit overlay including the arrow behavior
function setupAssignedToDropdown() {
  if (!window.userNames || window.userNames.length === 0) {
    window.userNames = ["Max Mustermann", "Erika Musterfrau"];
  }
}

function setupEditDropdownEvents() {
  const arrow = document.getElementById("select-arrow-edit");
  const wrapper = document.querySelector(".dropdown-field-wrapper");
  const dropdown = document.getElementById("assigned-to-dropdown-edit");

  if (!arrow || !wrapper || !dropdown) return;

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains("d_none");

    if (isOpen) {
      closeEditDropdown(dropdown, arrow);
    } else {
      openEditDropdown(dropdown, arrow);
    }
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      closeEditDropdown(dropdown, arrow);
    }
  });
}

function openEditDropdown(dropdown, arrow) {
  dropdown.classList.remove("d_none");
  arrow.classList.remove("closed");
  arrow.classList.add("open");
}

function closeEditDropdown(dropdown, arrow) {
  dropdown.classList.add("d_none");
  arrow.classList.remove("open");
  arrow.classList.add("closed");
}

function toggleAssigned(name, containerId) {
  const index = assignees.indexOf(name);
  if (index > -1) {
    assignees.splice(index, 1);
  } else {
    assignees.push(name);
  }

  const dropdown = document.getElementById(containerId);
  renderAssignees(containerId, dropdown);
  renderUsersToAssignEdit();
}

function renderUsersToAssignEdit() {
  const usersList = document.getElementById("assigned-to-users-list-edit");
  if (!usersList || !window.userNames) return;

  usersList.innerHTML = "";

  window.userNames.forEach((name, index) => {
    if (typeof name === "string") {
      const initials = getInitials(name);
      const bgColor = getIconBackgroundColor(initials);
      const styling = checkIsAssigned(name);

      usersList.innerHTML += getUsersToAssignTemplate(
        name,
        index,
        styling.wrapperClass,
        styling.checkboxClass,
        initials,
        bgColor
      );
    }
  });
}

function renderAssignees(containerId, container) {
  const assigneesContainerId =
    containerId === "assigned-to-dropdown-edit"
      ? "assignees-list-edit"
      : "assignees-list";

  const assigneesContainerRef = document.getElementById(assigneesContainerId);
  if (!assigneesContainerRef) return;

  assigneesContainerRef.innerHTML = "";

  if (Array.isArray(assignees) && assignees.length > 0) {
    assigneesContainerRef.classList.remove("d_none");

    assignees.forEach((name) => {
      const initials = getInitials(name);
      const bgColor = getIconBackgroundColor(initials);
      const avatarHTML = getAvatarTemplate(initials, bgColor);

      const wrapper = document.createElement("div");
      wrapper.innerHTML = avatarHTML;
      assigneesContainerRef.appendChild(wrapper.firstElementChild);
    });
  } else {
    assigneesContainerRef.classList.add("d_none");
  }
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function toggleDropdownSelection(dropdownId, event) {
  event.stopPropagation();

  const dropdown = document.getElementById(dropdownId);
  const arrowClosed = document.getElementById(`${dropdownId}-closed`);
  const arrowOpen = document.getElementById(`${dropdownId}-open`);

  const isOpen = !dropdown.classList.contains("d_none");

  if (isOpen) {
    dropdown.classList.add("d_none");
    arrowClosed.classList.remove("d_none");
    arrowOpen.classList.add("d_none");
  } else {
    dropdown.classList.remove("d_none");
    arrowClosed.classList.add("d_none");
    arrowOpen.classList.remove("d_none");
  }
}

// binds buttons for adding or canceling subtask inputs in the overlay
function setupSubtaskInput() {
  const input = document.getElementById("subtasks-edit");
  const addBtn = document.getElementById("edit-add-subtask-icon");
  const confirmWrap = document.getElementById("confirm-icons");
  const confirmBtn = document.getElementById("confirm-icon");
  const clearBtn = document.getElementById("clear-icon");
  addBtn.addEventListener("click", () =>
    showConfirm(input, confirmWrap, addBtn)
  );
  clearBtn.addEventListener("click", () =>
    resetInput(input, confirmWrap, addBtn)
  );
  confirmBtn.addEventListener("click", () =>
    resetInput(input, confirmWrap, addBtn)
  );
}

// shows the check mark/cancel symbol on the subtask input
function showConfirm(input, confirm, add) {
  add.classList.add("d-none");
  confirm.classList.remove("d-none");
  input.focus();
}

// resets the subtask input field
function resetInput(input, confirm, add) {
  input.value = "";
  confirm.classList.add("d-none");
  add.classList.remove("d-none");
}

/**
 * Rendert die Subtasks eines Tasks in das angegebene Container-Element.
 *
 * @param {object} task - Der Task mit den Subtasks.
 * @param {HTMLElement} container - Das HTML-Element für die Subtask-Liste.
 */
function renderSubtasks(task, container) {
  container.innerHTML = "";

  if (Array.isArray(task.subtasks)) {
    task.subtasks.forEach((subtask, index) => {
      const [key, value] = Object.entries(subtask)[0];

      const subtaskItem = document.createElement("div");
      subtaskItem.classList.add("subtask-list-item");
      subtaskItem.style.listStyle = "none";
      subtaskItem.style.display = "flex";
      subtaskItem.style.justifyContent = "space-between";
      subtaskItem.style.alignItems = "center";
      subtaskItem.style.padding = "6px 16px";

      subtaskItem.innerHTML = `
        <div class="subtask-list-item-content-wrapper" style="width: 100%;">
          <span> ${value}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <span class="edit-icon" data-index="${index}"></span>
          <span class="delete-icon" data-index="${index}"></span>
        </div>
      `;

      container.appendChild(subtaskItem);
    });
  }
}

function populateEditOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  const titleInput = overlay.querySelector(
    ".edit-input[placeholder='Enter a title']"
  );
  const descriptionTextarea = overlay.querySelector(
    ".edit-textarea[placeholder='Enter a Description']"
  );
  const dueDateInput = overlay.querySelector("#due-date");
  const subtaskInput = overlay.querySelector("#subtasks-edit");
  const addSubtaskIcon = document.getElementById("edit-add-subtask-icon");
  const subtaskListContainer = document.getElementById("subtaskList");
  const priorityButtons = overlay.querySelectorAll(".priority-labels");

  fillFormFields(task, titleInput, descriptionTextarea, dueDateInput);
  updatePrioritySelection(task.priority, priorityButtons);
  renderSubtasks(task, subtaskListContainer);
  subtaskInput.value = "";
  openEditOverlay(task);
  setupSubtaskAdd(addSubtaskIcon, subtaskInput, task, subtaskListContainer);
  setupSubtaskListEvents(subtaskListContainer, task);
}

function fillFormFields(task, titleInput, descriptionTextarea, dueDateInput) {
  titleInput.value = task.title;
  descriptionTextarea.value = task.description;
  dueDateInput.value = task.dueDate;
}

function updatePrioritySelection(priority, buttons) {
  buttons.forEach((btn) => {
    resetPriority(btn);
    btn.classList.remove("selected");
    if (btn.id === priority) {
      activatePriority(btn);
      btn.classList.add("selected");
    }
  });
}

function setupSubtaskAdd(addBtn, input, task, container) {
  addBtn.addEventListener("click", () => {
    const newTitle = input.value.trim();
    if (newTitle) {
      if (!Array.isArray(task.subtasks)) task.subtasks = [];
      task.subtasks.push({ [newTitle]: newTitle });
      renderSubtasks(task, container);
      input.value = "";
    }
  });
}

function setupSubtaskListEvents(container, task) {
  container.addEventListener("click", (e) => {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains("delete-icon")) {
      task.subtasks.splice(index, 1);
      renderSubtasks(task, container);
    } else if (e.target.classList.contains("edit-icon")) {
      startEditingSubtask(e, task, index, container);
    }
  });
}

function startEditingSubtask(e, task, index, container) {
  const item = e.target.closest(".subtask-list-item");
  const textWrapper = item.querySelector(".subtask-list-item-content-wrapper");
  const textEl = textWrapper.querySelector("span");
  const oldText = textEl.textContent.trim();

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldText;
  input.classList.add("subtask-item-input");

  const iconWrapper = document.createElement("div");
  iconWrapper.classList.add("edit-subtask-icons", "d-flex-space-between");

  const cancelBtn = createIcon(
    "cancel-icon",
    `<img src="/assets/img/icons/delete_icon.png" alt="Cancel" width="16">`
  );
  const confirmBtn = createIcon(
    "confirm-icon",
    `<img src="/assets/img/icons/confirm_icon.png" alt="Confirm" width="16">`
  );

  iconWrapper.appendChild(cancelBtn);
  iconWrapper.appendChild(confirmBtn);

  textWrapper.innerHTML = "";
  textWrapper.appendChild(input);
  textWrapper.appendChild(iconWrapper);
  input.focus();

  item.classList.add("subtask-list-item-active");

  cancelBtn.onclick = () => {
    renderSubtasks(task, container);
  };

  confirmBtn.onclick = () => {
    const newText = input.value.trim();
    if (newText) {
      const key = Object.keys(task.subtasks[index])[0];
      task.subtasks[index] = { [key]: newText };
      renderSubtasks(task, container);
    }
  };
}

function createIcon(className, content) {
  const span = document.createElement("span");
  span.classList.add(className);
  span.innerHTML = content;
  return span;
}

function bindEditSaveCancel(
  input,
  confirmBtn,
  cancelBtn,
  task,
  index,
  container,
  item
) {
  confirmBtn.addEventListener("click", () => {
    const newText = input.value.trim();
    if (newText) {
      const key = Object.keys(task.subtasks[index])[0];
      task.subtasks[index] = { [key]: newText };
      renderSubtasks(task, container);
    }
    item.classList.remove("subtask-list-item-active");
  });

  cancelBtn.addEventListener("click", () => {
    renderSubtasks(task, container);
    item.classList.remove("subtask-list-item-active");
  });

  input.addEventListener("click", (ev) => ev.stopPropagation());
}

function saveEdit() {
  const overlay = document.getElementById("editTaskOverlay");
  const taskId = document
    .getElementById("task-card-modal")
    .getAttribute("data-task-id");
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  const updatedTask = { ...tasks[taskIndex] };
  updatedTask.title = overlay
    .querySelector(".edit-input[placeholder='Enter a title']")
    .value.trim();
  updatedTask.description = overlay
    .querySelector(".edit-textarea[placeholder='Enter a Description']")
    .value.trim();
  updatedTask.dueDate = overlay.querySelector("#due-date").value;
  updatedTask.priority =
    overlay.querySelector(".priority-labels.selected")?.id || "";
  updatedTask.assignedTo = [...assignees];

  const subtaskItems = overlay.querySelectorAll(
    "#subtaskList .subtask-item span:first-child"
  );
  updatedTask.subtasks = Array.from(subtaskItems).map((el) => {
    const label = el.textContent.replace(/^\u2022\s*/, "").trim();
    return { [label]: label };
  });

  tasks[taskIndex] = updatedTask;
  saveTasksToStorageOrFirebase();
  renderAllColumns();
  closeEditOverlay();
}
