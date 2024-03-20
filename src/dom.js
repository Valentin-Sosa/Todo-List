import{format} from "date-fns";


const task = document.getElementById("task");

const projectDOM = 
{
    modal : document.getElementById("project-modal"),
    form : document.querySelector("#project-modal > form"),
    list : document.getElementById("projects-list"),
    name : document.getElementById("project-name"),
    addBtn : document.getElementById("add-project"),
    cancelBtn : document.getElementById("cancel-project"),
    currentSort : "default",
    currentView : "all",

    openModal : ()=>{
        projectDOM.form.reset();
        projectDOM.modal.showModal();
    },
    closeModal : () =>
    {
        projectDOM.modal.close();
        projectDOM.list.appendChild(createProject(projectDOM.name.value));
    }  
};

const taskDOM = 
{
    modal : document.getElementById("task-modal"),
    form :  document.querySelector("#task-modal > form"),
    title : document.getElementById("task-title"),
    description : document.getElementById("task-description"),
    dueDate : document.getElementById("task-due-date"),
    lowPriority: document.getElementById("low-priority"),
    mediumPriority : document.getElementById("medium-priority"),
    highPriotity : document.getElementById("high-priority"),
    cancelBtn : document.getElementById("cancel-task"),

    openModal : ()=>
    {
        taskDOM.form.reset();
        taskDOM.modal.showModal();
        taskDOM.dueDate.min = new Date().toISOString().split("T")[0];
    },
    getPriority : ()=> taskDOM.lowPriority.checked? 1: taskDOM.mediumPriority.checked? 2: 3,
};

const generalDOM = 
{
    inboxBtn : document.getElementById("inbox-btn"),
    todayBtn : document.getElementById("today-btn"),
    weekBtn : document.getElementById("week-btn"),
    overdueBtn : document.getElementById("overdue-btn"),
    currentSort : "default",
    currentView : "all", 

    active: btnName =>
    {   
        generalDOM.inboxBtn.className = "";
        generalDOM.todayBtn.className = "";
        generalDOM.weekBtn.className = "";
        generalDOM.overdueBtn.className = "";
        projectDOM.list.childNodes.forEach(li => li.className = "project");

        switch(btnName)
        {
            case "Inbox":
                generalDOM.inboxBtn.className = "active";
                break;
            case "Today":
                generalDOM.todayBtn.className = "active";
                break;
            case "This Week":
                generalDOM.weekBtn.className = "active";
                break;
            case "Overdue":
                generalDOM.overdueBtn.className = "active";
                break;
            default:
                projectDOM.list.childNodes.forEach(li =>
                {
                    if(li.textContent === btnName) li.className = "project active";
                });
                break;
        }
    }
}

const editDOM = 
{
    currentTask : "", 
    
    // Edit date
    dateModal : document.getElementById("date-modal"),
    priorityModal : document.getElementById("priority-modal"),
    inputDate: document.getElementById("edit-date"),
    cancelDate : document.getElementById("cancel-date"),

    openDateModal : (project,taskName) =>
    {
        editDOM.currentTask = taskName;
        const task = project.getTask(taskName);
        editDOM.dateModal.showModal();
        editDOM.inputDate.value = task.dueDate.split("T")[0];
        editDOM.inputDate.min = new Date().toISOString().split("T")[0];

        editDOM.cancelDate.addEventListener("click", ()=> editDOM.dateModal.close());
    },

    // Edit priority
    inputLow : document.getElementById("low-edit"),
    inputMedium : document.getElementById("medium-edit"),
    inputHigh : document.getElementById("high-edit"),
    cancelPriority : document.getElementById("cancel-priority"),

    openPriorityModal : (project,taskName) =>
    {
        editDOM.currentTask = taskName;
        const task = project.getTask(taskName);
        task.priority === 1? editDOM.inputLow.checked = true: task.priority===2? editDOM.inputMedium.checked = true: editDOM.inputHigh.checked = true;
        editDOM.priorityModal.showModal();
        editDOM.cancelPriority.addEventListener("click", ()=> editDOM.priorityModal.close());
    },

    // General edit
    modal : document.getElementById("edit-modal"),
    title : document.getElementById("edit-title"),
    description : document.getElementById("edit-description"),
    dueDate : document.getElementById("edit-due-date"),
    lowPriority: document.getElementById("edit-low-priority"),
    mediumPriority : document.getElementById("edit-medium-priority"),
    highPriotity : document.getElementById("edit-high-priority"),
    cancelBtn : document.getElementById("cancel-edit"),

    getPriority : ()=> editDOM.lowPriority.checked? 1: editDOM.mediumPriority.checked? 2: 3,
    
    openEdit : (project,taskName)=>
    {
        editDOM.currentTask = taskName;
        const task = project.getTask(taskName);
        editDOM.title.value = task.title;
        editDOM.description.value = task.description;
        editDOM.dueDate.value = task.dueDate.split("T")[0];
        editDOM.dueDate.min = new Date().toISOString().split("T")[0];
        task.priority === 1? editDOM.lowPriority.checked = true: task.priority===2? editDOM.mediumPriority.checked = true: editDOM.highPriotity.checked = true;
        editDOM.modal.showModal();
        editDOM.cancelBtn.addEventListener("click", ()=> editDOM.modal.close());
    }
}

function createProject(name)
{
    const project = document.createElement("li");
    project.textContent = name;
    project.dataset.name = name;
    project.className = "project";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = `<img class="delete" data-name="${name}" src="images/delete.png">`
    project.appendChild(deleteBtn);
    return project;
}

function removeDOMProject(name)
{
    const project = document.querySelector(`li[data-name="${name}"]`);
    project.remove();
}

function createTask(task)
{
    const taskSection = document.createElement("section");
    taskSection.className = task.priority === 1? "task-container l": task.priority === 2? "task-container m": "task-container h";

    const infoSection = document.createElement("section");
    const checkButton = document.createElement("input");
    checkButton.type = "checkbox";
    const taskName = document.createElement("span");
    taskName.textContent = task.title;
    taskName.className = "task-name";
    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;
    infoSection.appendChild(checkButton);
    infoSection.appendChild(taskName);
    infoSection.appendChild(taskDescription);
    infoSection.className = "info-container";
    taskSection.appendChild(infoSection);

    const endSection = document.createElement("section");
    endSection.className = "end-container";
    const taskDueDate = document.createElement("span");
    taskDueDate.textContent = format(task.getDueDate(), "MMM do");
    taskDueDate.className = "task-date";
    endSection.appendChild(taskDueDate);

    const buttonSection = document.createElement("section");
    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<img class="edit" data-task="${task.title}" data-project="${task.project}" src="images/edit.png" title="Edit task">`;
    const editDateBtn = document.createElement("button");
    editDateBtn.innerHTML = `<img class="edit-date" data-task="${task.title}" data-project="${task.project}" src="images/calendar.png" title="Edit due date">`;
    const editPriorityBtn = document.createElement("button");
    editPriorityBtn.innerHTML = `<img class="edit-priority" data-task="${task.title}" data-project="${task.project}" src="images/priority.png" title="Edit priority">`;
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<img class="delete" data-task="${task.title}" data-project="${task.project}" src="images/delete.png"></img>`;
    buttonSection.appendChild(editBtn);
    buttonSection.appendChild(editDateBtn);
    buttonSection.appendChild(editPriorityBtn);
    buttonSection.appendChild(deleteBtn);
    buttonSection.className = "buttons-container"
    endSection.appendChild(buttonSection);
    taskSection.appendChild(endSection);

    return taskSection;
}

function displayMenu(project)
{
    const menu = document.createElement("article");
    menu.className = "menu";
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = `<img src="images/close.png">`;

    const sortOptions = document.createElement("ul");
    const defaultOp = document.createElement("li");
    const dateOp = document.createElement("li");
    const priorityOp = document.createElement("li");
    const titleOp = document.createElement("li");
    sortOptions.textContent = "Sort by:"
    defaultOp.textContent = "Default";
    dateOp.textContent = "Date";
    priorityOp.textContent = "Priority";
    titleOp.textContent = "Title";
    sortOptions.appendChild(defaultOp);
    sortOptions.appendChild(dateOp);
    sortOptions.appendChild(priorityOp);
    sortOptions.appendChild(titleOp);

    menu.appendChild(closeBtn);
    menu.appendChild(sortOptions);
    if(project.name !== "Inbox")
    {
        const viewOptions = document.createElement("ul");
        const allOp = document.createElement("li");
        const todayOp = document.createElement("li");
        const weekOp = document.createElement("li");
        const overdueOp = document.createElement("li");
        viewOptions.textContent = "View by:"
        allOp.textContent = "All";
        todayOp.textContent = "Today";
        weekOp.textContent = "This Week";
        overdueOp.textContent = "Overdue";
        viewOptions.appendChild(allOp);
        viewOptions.appendChild(todayOp);
        viewOptions.appendChild(weekOp);
        viewOptions.appendChild(overdueOp);
        menu.appendChild(viewOptions);

        allOp.addEventListener("click", ()=>
        {
            projectDOM.currentView = "all";
            showProject(project);
        });
        todayOp.addEventListener("click",()=>
        {
            projectDOM.currentView = "today";
            showProject(project);
        });
        weekOp.addEventListener("click",()=>
        {
            projectDOM.currentView = "week";
            showProject(project);
        });
        overdueOp.addEventListener("click",()=>
        {
            projectDOM.currentView = "overdue";
            showProject(project);
        });
    }
    
    
    closeBtn.addEventListener("click", ()=>menu.remove());
    defaultOp.addEventListener("click", ()=>
    {
        if(project.name === "Inbox") generalDOM.currentSort = "default";
        else projectDOM.currentSort = "default";
        showProject(project);
    }); 
    dateOp.addEventListener("click", ()=>
    {
        if(project.name === "Inbox") generalDOM.currentSort = "date";
        else projectDOM.currentSort = "date";
        showProject(project);
    });
    priorityOp.addEventListener("click", ()=>
    {
        if(project.name === "Inbox") generalDOM.currentSort = "priority";
        else projectDOM.currentSort = "priority";
        showProject(project);
    });
    titleOp.addEventListener("click", ()=>
    {
        if(project.name === "Inbox") generalDOM.currentSort = "title";
        else projectDOM.currentSort = "title";
        showProject(project);
    });
    return menu;
}

function createHeader(project, title)
{
    const header = document.createElement("header");
    const projectTitle = document.createElement("h2");
    projectTitle.textContent = title;
    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = `<img src="images/menu.png">`;
    header.appendChild(projectTitle);
    header.appendChild(menuBtn);

    menuBtn.addEventListener("click", ()=> header.appendChild(displayMenu(project)));

    return header;
}

function createAddBtn()
{
    const addBtn = document.createElement("button");
    addBtn.innerHTML = '<span class="plus">+</span> Add Task';
    return addBtn;
}

function sortOfProject(project,projectSection, sortSelection, viewSelection)
{
    switch(sortSelection)
    {
        case "default":
            project.getTasks(viewSelection).forEach(task => projectSection.appendChild(createTask(task)));
            break;
        case "date":
            project.sortForDateTasks(viewSelection).forEach(task => projectSection.appendChild(createTask(task)));
            break;
        case "priority":
            project.sortForPriority(viewSelection).forEach(task => projectSection.appendChild(createTask(task)));
            break;
        case "title":
            project.sortForTitle(viewSelection).forEach(task => projectSection.appendChild(createTask(task)));
            break; 
    }
}

function showProject(project)
{
    task.innerHTML = "";
    
    const projectSection = document.createElement("section");
    if(project.name !== "Inbox")
    {
        task.dataset.tab = project.name;
        generalDOM.active(project.name);
        projectSection.appendChild(createHeader(project, project.name));
        sortOfProject(project,projectSection,projectDOM.currentSort,projectDOM.currentView);
        task.appendChild(projectSection);
        if(projectDOM.currentView === "all")
        {
            const addBtn = createAddBtn(project.name);
            task.appendChild(addBtn);
            addBtn.addEventListener("click", ()=> taskDOM.openModal());
        }
    }
    else
    {
        const view = generalDOM.currentView;
        const title = view==="all"?"Inbox": view==="today"? "Today": view==="week"? "This Week": "Overdue";

        generalDOM.active(title);
        task.dataset.tab = title;

        projectSection.appendChild(createHeader(project,title));
        sortOfProject(project,projectSection,generalDOM.currentSort,view);
        task.appendChild(projectSection);
        if(title === "Inbox")
        {
            const addBtn = createAddBtn(project.name);
            task.appendChild(addBtn);
            addBtn.addEventListener("click", ()=> taskDOM.openModal());
        }
    }
    
}

export {createProject,
        removeDOMProject,
        showProject,
        projectDOM,
        taskDOM,
        generalDOM,
        editDOM,
        task};