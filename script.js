let tasks = [];

function createTaskId(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const taskInput = document.getElementById('addTask');
if (taskInput) {
    taskInput.addEventListener('input', () => {
        if (taskInput.value.trim() !== '') {
            taskInput.classList.remove('is-invalid');
        }
    });

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });
}

// add button
function addTask(){
    const input = document.getElementById('addTask');
    const taskText = input.value.trim();

    if (taskText === ''){
        input.classList.add('is-invalid');
        return;
    }

    input.classList.remove('is-invalid');
    tasks.push({ id: createTaskId(), text: taskText, completed: false });
    input.value = '';
    displayTasks();
}
 
// display tasks
function displayTasks(){
    let taskContainer = document.getElementById('taskContainer');
    let completedContainer = document.getElementById('completedContainer');
    let taskList = document.getElementById('taskList');
    let completedList = document.getElementById('completedList');

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    if (tasks.length == 0){
        taskList.style.display = 'none';
        completedList.style.display = 'none';
        return;
    }

    taskList.style.display = 'block';
    taskContainer.innerHTML = activeTasks.length > 0 ? activeTasks.map((task) => {
        const originalIndex = tasks.findIndex(t => t.id === task.id);
        return `
            <div class="alert alert-light d-flex justify-content-between align-items-center mb-2">
                <span>${originalIndex + 1}. ${task.text}</span>
                <div>
                    <button type="button" class="btn btn-sm btn-success me-2" onclick="toggleComplete('${task.id}')" aria-label="Mark task as complete">Complete</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')" aria-label="Delete task">Delete</button>
                </div>
            </div>`;
    }).join('') : '<div class="alert alert-secondary" role="status">No active tasks.</div>';

    if (completedTasks.length > 0) {
        completedList.style.display = 'block';
        completedContainer.innerHTML = completedTasks.map((task) => {
            const originalIndex = tasks.findIndex(t => t.id === task.id);
            return `
                <div class="alert alert-success d-flex justify-content-between align-items-center mb-2">
                    <span class="text-decoration-line-through">${originalIndex + 1}. ${task.text}</span>
                    <div>
                        <button type="button" class="btn btn-sm btn-warning me-2" onclick="toggleComplete('${task.id}')" aria-label="Mark task as active">Undo</button>
                        <button type="button" class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')" aria-label="Delete completed task">Delete</button>
                    </div>
                </div>`;
        }).join('');
    } else {
        completedList.style.display = 'none';
        completedContainer.innerHTML = '';
    }
}

// button delete
function deleteTask(taskId){
    tasks = tasks.filter(task => task.id !== taskId);
    displayTasks();
}

function toggleComplete(taskId) {
    tasks = tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
    displayTasks();
}

// button save 
function saveTask(){
    if(tasks.length !== 0){
        localStorage.setItem("tasks", JSON.stringify(tasks));
        alert('Tasks saved successfully.');
    } else {
        alert('Please add a task before saving.');
    }
}

// button clear
function clearTask(){
   if(tasks.length !== 0){ 
    if(confirm('Are you sure you want to clear all tasks?')){
      tasks = [];
      localStorage.removeItem("tasks");
      displayTasks();  
    }
  } else {
        alert('No tasks to clear.');
  }
}

// Load tasks from localStorage on page load
window.addEventListener("load", () => {
    try {
        const saved = localStorage.getItem("tasks");

        if (saved) {
            tasks = JSON.parse(saved);
            displayTasks();
        }

    } catch (error) {
        console.error(error);
    }
});

