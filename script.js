document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoItems = document.getElementById('todo-items');
    const calendarSection = document.getElementById('calendar-section');
    let selectedTask = null; // For storing the task being edited or reminder being set

    // Add task function
    addBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission
        const taskText = todoInput.value.trim();
        if (taskText) {
            addTask(taskText);
            todoInput.value = ''; // Clear input
        } else {
            alert('Please enter a task');
        }
    });

    // Add task to the list
    function addTask(taskText) {
        const li = document.createElement('li');

        // Add checkbox for marking task as done
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'done-checkbox';
        checkbox.addEventListener('change', () => li.classList.toggle('done'));

        // Create span for task text (to keep it separate from the checkbox)
        const taskLabel = document.createElement('span');
        taskLabel.textContent = taskText;

        // Edit, Delete, Set Reminder, and Upload Image buttons
        const editBtn = createButton('Edit', () => editTask(li));
        const deleteBtn = createButton('Delete', () => {
            const reminderDate = li.dataset.reminder;
            if (reminderDate) {
                delete markedDates[reminderDate]; // Remove from marked dates
                renderCalendar(); // Re-render calendar to reflect changes
            }
            li.remove(); // Remove task from list
        });
        const reminderBtn = createButton('Set Reminder', () => openCalendar(li));
        const uploadBtn = createButton('Upload Image', () => uploadImage(li));

        li.append(checkbox, taskLabel, editBtn, deleteBtn, reminderBtn, uploadBtn); // Append everything
        todoItems.appendChild(li);
    }

    // Function to create buttons
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        return btn;
    }

    function openCalendar(taskElement) {
        calendarSection.style.display = 'block'; // Show the calendar when setting reminder
        selectedTask = taskElement; // Store task for which reminder is being set
    }

    // Upload image for a specific task
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

    // Calendar logic
    let currentDate = new Date();
    const markedDates = {}; // Store dates with reminders

    function renderCalendar() {
        const monthYear = document.getElementById('month-year');
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = ''; // Clear previous grid

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYear.textContent = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + year;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Adjust for days before the first day of the month
        const paddingDays = (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1);

        // Add blank days
        for (let i = 0; i < paddingDays; i++) {
            calendarGrid.appendChild(document.createElement('div'));
        }

        // Add actual days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            if (day === currentDate.getDate() && month === new Date().getMonth()) {
                dayDiv.classList.add('today');
            }

            // Check if this date has a marked reminder
            const dateString = new Date(year, month, day).toLocaleDateString();
            if (markedDates[dateString]) {
                dayDiv.style.backgroundColor = 'red'; // Mark reminder date
            }

            // Add click event to select reminder date or display tasks for this date
            dayDiv.addEventListener('click', () => {
                const dateString = new Date(year, month, day).toLocaleDateString();
                if (markedDates[dateString]) {
                    // Find and display the task for this date
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

    // Set reminder date for the task
    function setReminderDate(day, month, year) {
        if (selectedTask) {
            const reminderDate = new Date(year, month, day);
            const dateString = reminderDate.toLocaleDateString();
            selectedTask.dataset.reminder = dateString; // Save reminder date

            // Mark this date on the calendar
            markedDates[dateString] = true;
            renderCalendar(); // Re-render calendar to show marked date

            alert(`Reminder set for: ${dateString}`);
            selectedTask = null; // Clear after setting reminder
        } else {
            alert('Please select a task first!');
        }
    }

    // Navigation for calendar
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
