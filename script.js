//   DATA MANAGEMENT

let tasks = JSON.parse(localStorage.getItem('study_flow_tasks')) || [];
let timerInterval;
let timeLeft = 60 * 60; // 25 minutes
let isTimerRunning = false;


//.slecting elements ELEMENTS

const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const taskContainer = document.getElementById('task-list-container');
const addBtn = document.getElementById('add-btn');
const themeToggle = document.getElementById('theme-toggle');
const fabBtn = document.getElementById('fab-add');

// . UPDATE UI & STATISTICS

function updateApp() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Update Progress Indicators
    document.getElementById('top-percentage').innerText = `${percent}% Complete`;
    document.getElementById('circle-text').innerText = `${percent}%`;
    document.getElementById('done-num').innerText = completed;
    document.getElementById('pending-num').innerText = total - completed;
    document.getElementById('flat-bar').style.width = `${percent}%`;
    document.getElementById('circle-ui').style.background =
        `conic-gradient(var(--primary-blue) 0% ${percent}%, #eee ${percent}% 100%)`;

    // Save tasks in localStorage
    localStorage.setItem('study_flow_tasks', JSON.stringify(tasks));

    // Render tasks on UI
    renderTasks();
}
 

// Apply previous theme if any
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.classList.replace('fa-moon', 'fa-sun');
}

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});


// RENDER TASK LIST

function renderTasks() {
    taskContainer.innerHTML = '';
    tasks.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'done' : ''}`;
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                <div>
                    <span>${task.name}</span><br>
                    <small style="color:#888; font-size:11px">${task.date ? task.date.replace('T', ' ') : 'No deadline'}</small>
                </div>
            </div>
            <i class="fas fa-trash" style="color:#ffb3b3; cursor:pointer" onclick="deleteTask(${index})"></i>
        `;
        taskContainer.appendChild(div);
    });
}


//  TASK ACTIONS
addBtn.addEventListener('click', () => {
    const name = taskInput.value.trim();
    if (!name) return alert("Fadlan qor magaca casharka!");
    tasks.push({ name, date: dateInput.value, completed: false });
    taskInput.value = '';
    dateInput.value = '';
    updateApp();
});

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    updateApp();
}

function deleteTask(index) {
    if (confirm("Ma hubtaa inaad tirtirto?")) {
        tasks.splice(index, 1);
        updateApp();
    }
}

// . POMODORO TIMER

function toggleTimer() {
    const btn = document.getElementById('timer-btn');
    if (isTimerRunning) {
        clearInterval(timerInterval);
        btn.innerText = "Start";
    } else {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert("Waqtigu waa dhamaaday! Naso xoogaa.");
                resetTimer();
            }
        }, 1000);
        btn.innerText = "Pause";
    }
    isTimerRunning = !isTimerRunning;
}

function updateTimerDisplay() {
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const secs = String(timeLeft % 60).padStart(2, '0');
    document.getElementById('timer-display').innerText = `${mins}:${secs}`;
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 60 * 60;
    isTimerRunning = false;
    updateTimerDisplay();
    document.getElementById('timer-btn').innerText = "Start";
}


// SMART SORT (AI LOGIC)

function smartSort() {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    document.getElementById('schedule-status').innerText = "Sorted by nearest date!";
    updateApp();
}


// 9. EVENT LISTENERS (Extra)

if (fabBtn) {
    fabBtn.onclick = function () {
        showPage('planner');
        taskInput.focus();
    };
}

taskInput.onkeypress = (e) => { if (e.key === 'Enter') addBtn.click(); };


//  NAVIGATION FUNCTIONALITY

function showPage(pageName) {
    const sections = document.querySelectorAll('.page-content');
    sections.forEach(section => section.style.display = 'none');

    const selectedSection = document.getElementById(pageName + '-section');
    if (selectedSection) selectedSection.style.display = 'block';

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}


//  INITIALIZE APP

document.addEventListener('DOMContentLoaded', () => {
    showPage('home');  // Show home page on start
    updateApp();       // Render tasks & UI
});






