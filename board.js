// Sample tasks data - in production this would come from a JSON file or API
let tasks = [
    {
        id: '1',
        title: 'Wire up real self-monitoring data to dashboard',
        description: 'Connect the self-monitor system to feed live data to the dashboard',
        type: 'feature',
        priority: 'high',
        status: 'in-progress',
        project: 'dashboard',
        created: '2026-02-16T07:00:00Z'
    },
    {
        id: '2',
        title: 'Refactor early CLI projects for code quality',
        description: 'Clean up code in git-time-machine, smart-memory, local-search',
        type: 'refactor',
        priority: 'medium',
        status: 'backlog',
        project: 'portfolio',
        created: '2026-02-16T06:00:00Z'
    },
    {
        id: '3',
        title: 'Build automated README generator',
        description: 'Generate READMEs from code analysis and project structure',
        type: 'feature',
        priority: 'medium',
        status: 'backlog',
        project: 'other',
        created: '2026-02-16T05:00:00Z'
    },
    {
        id: '4',
        title: 'Add Telegram notifications for task start/finish',
        description: 'Send messages when starting and completing tasks',
        type: 'feature',
        priority: 'high',
        status: 'done',
        project: 'self-monitor',
        created: '2026-02-16T07:30:00Z'
    },
    {
        id: '5',
        title: 'Create project management database',
        description: 'Track all projects with status, health, metrics, backlog',
        type: 'feature',
        priority: 'high',
        status: 'done',
        project: 'self-monitor',
        created: '2026-02-16T07:33:00Z'
    },
    {
        id: '6',
        title: 'Fix Surebet Detector GitHub SSH issue',
        description: 'Switch from SSH to HTTPS for automated pushes',
        type: 'bug',
        priority: 'high',
        status: 'done',
        project: 'surebet-detector',
        created: '2026-02-16T07:00:00Z'
    },
    {
        id: '7',
        title: 'Integrate booking system with Supabase',
        description: 'Complete backend integration for appointment booking',
        type: 'feature',
        priority: 'medium',
        status: 'todo',
        project: 'booking-system',
        created: '2026-02-15T00:00:00Z'
    },
    {
        id: '8',
        title: 'Add email notifications to booking system',
        description: 'Send confirmation emails when appointments are booked',
        type: 'feature',
        priority: 'low',
        status: 'backlog',
        project: 'booking-system',
        created: '2026-02-15T00:00:00Z'
    }
];

// Render tasks to columns
function renderTasks() {
    const columns = ['backlog', 'todo', 'in-progress', 'review', 'done'];
    
    columns.forEach(status => {
        const container = document.getElementById(status);
        const columnTasks = tasks.filter(t => t.status === status);
        
        container.innerHTML = columnTasks.map(task => createTaskCard(task)).join('');
        document.getElementById(`count-${status}`).textContent = columnTasks.length;
    });
    
    updateStats();
}

// Create task card HTML
function createTaskCard(task) {
    const typeLabels = {
        feature: '✨ Feature',
        bug: '🐛 Bug',
        refactor: '🔄 Refactor',
        docs: '📝 Docs',
        research: '🔍 Research'
    };
    
    return `
        <div class="task-card" draggable="true" data-id="${task.id}"
             ondragstart="dragStart(event)" ondragend="dragEnd(event)"
             data-type="${task.type}" data-priority="${task.priority}">
            <div class="task-header">
                <span class="task-type ${task.type}">${typeLabels[task.type]}</span>
                <span class="task-priority ${task.priority}">${task.priority === 'high' ? '🔥' : ''}</span>
            </div>
            <div class="task-title">${task.title}</div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            <div class="task-footer">
                ${task.project ? `<span class="task-project">${task.project}</span>` : ''}
                <div class="task-actions">
                    <button class="task-btn" onclick="editTask('${task.id}')">✏️</button>
                    <button class="task-btn" onclick="deleteTask('${task.id}')">🗑️</button>
                </div>
            </div>
        </div>
    `;
}

// Update stats
function updateStats() {
    document.getElementById('total-tasks').textContent = tasks.length;
    document.getElementById('in-progress').textContent = tasks.filter(t => t.status === 'in-progress').length;
    document.getElementById('completed').textContent = tasks.filter(t => t.status === 'done').length;
}

// Drag and drop
let draggedTask = null;

function dragStart(e) {
    draggedTask = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

// Setup drop zones
document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    
    column.addEventListener('drop', e => {
        e.preventDefault();
        const newStatus = column.dataset.status;
        const taskId = draggedTask.dataset.id;
        
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            renderTasks();
        }
    });
});

// Modal functions
function showAddTask(status) {
    document.getElementById('task-status').value = status;
    document.getElementById('add-task-modal').classList.add('active');
}

function hideAddTask() {
    document.getElementById('add-task-modal').classList.remove('active');
    document.getElementById('add-task-form').reset();
}

// Add task form
document.getElementById('add-task-form').addEventListener('submit', e => {
    e.preventDefault();
    
    const newTask = {
        id: Date.now().toString(),
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        type: document.getElementById('task-type').value,
        priority: document.getElementById('task-priority').value,
        project: document.getElementById('task-project').value,
        status: document.getElementById('task-status').value,
        created: new Date().toISOString()
    };
    
    tasks.push(newTask);
    renderTasks();
    hideAddTask();
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        applyFilter(filter);
    });
});

function applyFilter(filter) {
    const allCards = document.querySelectorAll('.task-card');
    
    allCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === 'high') {
            card.style.display = card.dataset.priority === 'high' ? 'block' : 'none';
        } else {
            card.style.display = card.dataset.type === filter ? 'block' : 'none';
        }
    });
}

// Search
document.getElementById('search').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    
    document.querySelectorAll('.task-card').forEach(card => {
        const title = card.querySelector('.task-title').textContent.toLowerCase();
        const desc = card.querySelector('.task-description')?.textContent.toLowerCase() || '';
        
        card.style.display = (title.includes(query) || desc.includes(query)) ? 'block' : 'none';
    });
});

// Task actions
function editTask(id) {
    alert('Edit task ' + id + ' - would open edit modal');
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
}

// Close modal on outside click
document.getElementById('add-task-modal').addEventListener('click', e => {
    if (e.target.id === 'add-task-modal') {
        hideAddTask();
    }
});

// Initialize
renderTasks();
