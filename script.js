document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoItems = document.getElementById('todo-items');
    const calendarSection = document.getElementById('calendar-section');
    let selectedTask = null; 

    addBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        const taskText = todoInput.value.trim();
        if (taskText) {
            addTask(taskText);
            todoInput.value = ''; 
        } else {
            alert('Please enter a task');
        }
    });

    function addTask(taskText) {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'done-checkbox';
        checkbox.addEventListener('change', () => li.classList.toggle('done'));

        const taskLabel = document.createElement('span');
        taskLabel.textContent = taskText;

        const editBtn = createButton('Edit', () => editTask(li));
        const deleteBtn = createButton('Delete', () => {
            const reminderDate = li.dataset.reminder;
            if (reminderDate) {
                delete markedDates[reminderDate]; 
                renderCalendar(); 
            }
            li.remove(); 
        });
        const reminderBtn = createButton('Set Reminder', () => openCalendar(li));
        const uploadBtn = createButton('Upload Image', () => uploadImage(li));

        li.append(checkbox, taskLabel, editBtn, deleteBtn, reminderBtn, uploadBtn); 
        todoItems.appendChild(li);
    }
    
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        return btn;
    }

    function openCalendar(taskElement) {
        calendarSection.style.display = 'block'; 
        selectedTask = taskElement; 
    }

    function uploadImage(taskElement) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100px';
                    img.style.marginTop = '5px';
                    taskElement.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
        input.click();
    }

    let currentDate = new Date();
    const markedDates = {};

    function renderCalendar() {
        const monthYear = document.getElementById('month-year');
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = ''; 

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYear.textContent = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + year;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const paddingDays = (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1);

        for (let i = 0; i < paddingDays; i++) {
            calendarGrid.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            if (day === currentDate.getDate() && month === new Date().getMonth()) {
                dayDiv.classList.add('today');
            }

            const dateString = new Date(year, month, day).toLocaleDateString();
            if (markedDates[dateString]) {
                dayDiv.style.backgroundColor = 'red';
            }

            dayDiv.addEventListener('click', () => {
                const dateString = new Date(year, month, day).toLocaleDateString();
                if (markedDates[dateString]) {
                    const task = Array.from(todoItems.children).find(item => item.dataset.reminder === dateString);
                    if (task) {
                        alert(`Task for ${dateString}: ${task.querySelector('span').textContent}`);
                    }
                }
                setReminderDate(day, month, year);
            });

            calendarGrid.appendChild(dayDiv);
        }
    }

    function setReminderDate(day, month, year) {
        if (selectedTask) {
            const reminderDate = new Date(year, month, day);
            const dateString = reminderDate.toLocaleDateString();
            selectedTask.dataset.reminder = dateString; 

            markedDates[dateString] = true;
            renderCalendar();

            alert(`Reminder set for: ${dateString}`);
            selectedTask = null;
        } else {
            alert('Please select a task first!');
        }
    }

    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar(); // Initialize calendar
});
