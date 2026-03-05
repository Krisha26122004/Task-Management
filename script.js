const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterbtn = document.querySelectorAll(".filters button");
const searchInput = document.getElementById("searchtask");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchText = "";
let debounceTimeout;

renderTask();

addBtn.addEventListener("click", addTask);

filterbtn.forEach(btn => {
    btn.addEventListener("click", () => {
        filterbtn.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter");
        renderTask();
    });
});

searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        searchText = searchInput.value.toLowerCase();
        renderTask();
    }, 300);
});

function addTask() {
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;

    if(!taskText || !taskDate) {
        alert('Please enter task and date');
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        date: taskDate,
        completed: false
    });

    saveandRender();
    taskInput.value = "";
    dateInput.value = "";
}

function renderTask() {
    taskList.innerHTML = "";

    tasks 
        .filter (task => {
            if (currentFilter === "completed")return task.completed;
            if (currentFilter === "pending")return !task.completed;
            return true;
        })

        .filter (task => task.text.toLowerCase().includes(searchText))
        .forEach (task => {
            const li = document.createElement("tr");

            li.innerHTML = `
                <td>
                <input type="checkbox" ${task.completed ? "checked" : ""} 
                onclick = "toggleStatus(${task.id})"/>
                ${task.text}
                </td>
                <td>${task.date}</td>
                <td>
                <span class="status ${task.completed ? "done" : "pending"}">
                    ${task.completed ? "Done" : "Pending"}
                </span>
                </td>
                <td>
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </td>
                `;

                taskList.appendChild(li);

        });
}

function toggleStatus(id) {
    tasks = tasks.map(task => 
       task.id === id ? {...task, completed: !task.completed} : task
    );

    saveandRender();

}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit task", task.text);
    if (newText) {
        task.text = newText;
        saveandRender();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveandRender();
}

function saveandRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTask();
}







