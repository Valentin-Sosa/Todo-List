import { init, 
        populateStorage } from './localStorage';

import {Task,
        Project,
        projects,
        inbox} from './logic';

import {removeDOMProject,
        showProject,
        projectDOM,
        taskDOM,
        generalDOM,
        editDOM,
        task as taskContainer} from './dom';

import './style.css';

init();

/* GENERAL SECTION EVENTS */

generalDOM.inboxBtn.addEventListener("click", ()=>
{
    generalDOM.currentView = "all";
    showProject(inbox);   
});

generalDOM.todayBtn.addEventListener("click", ()=>
{
    generalDOM.currentView = "today";
    showProject(inbox);   
});

generalDOM.weekBtn.addEventListener("click", ()=>
{
    generalDOM.currentView = "week";
    showProject(inbox);   
});

generalDOM.overdueBtn.addEventListener("click", ()=>
{
    generalDOM.currentView = "overdue";
    showProject(inbox);   
});

/* PROJECT SECTION EVENTS */

projectDOM.addBtn.addEventListener("click", ()=> projectDOM.openModal());

projectDOM.cancelBtn.addEventListener("click", ()=> projectDOM.modal.close());

projectDOM.form.addEventListener("submit", e =>
{
    e.preventDefault();
    projectDOM.closeModal();
    projects.addProject(new Project(projectDOM.name.value));
    populateStorage();
});

projectDOM.list.addEventListener("click", e =>
{
    const project = projects.getProject(e.target.dataset.name);

    if(e.target.className === "project") showProject(project);
    else if(e.target.className === "delete")
    {
        project.tasks.forEach(task => inbox.removeTask(task.title));
        projects.removeProject(project);
        removeDOMProject(e.target.dataset.name);
        showProject(inbox);
    } 

   populateStorage();
});

/* TASK SECTION EVENTS */

taskDOM.cancelBtn.addEventListener("click",()=> taskDOM.modal.close());

taskDOM.form.addEventListener("submit",e=>
{
    e.preventDefault();
    taskDOM.modal.close();
    const currentProject = taskContainer.dataset.tab;
    const task = new Task(taskDOM.title.value,
                          taskDOM.description.value,
                          taskDOM.dueDate.value,
                          taskDOM.getPriority(),
                          currentProject);

    if(currentProject !== "Inbox")
    {
        inbox.addTask(task);
        const project = projects.getProject(currentProject);
        project.addTask(task);
        showProject(project);
    }
    else
    {
        inbox.addTask(task);
        showProject(inbox);
    }

    populateStorage();
})

/* TASK EDIT FEATURES*/

taskContainer.addEventListener("click", e =>
{
    const projectName = e.target.dataset.project;
    const project = projects.getProject(projectName);
    const taskName = e.target.dataset.task;
    const className = e.target.className;

    switch(className)
    {
        case "delete":
            if(projectName!=="Inbox")
            {
                project.removeTask(taskName);
                inbox.removeTask(taskName);
            }
            else inbox.removeTask(taskName);

            const tab = taskContainer.dataset.tab;
            if(tab === "Inbox" 
            ||tab === "Today"
            ||tab === "This Week"
            ||tab === "Overdue") showProject(inbox);
            
            else showProject(project);

            populateStorage();
            break;

        case "edit-date":
            if(projectName !== "Inbox") editDOM.openDateModal(project, taskName);
            else editDOM.openDateModal(inbox,taskName);
            break;

        case "edit-priority":
            if(projectName !== "Inbox") editDOM.openPriorityModal(project, taskName);
            else editDOM.openPriorityModal(inbox,taskName);
            break;

        case "edit":
            if(projectName !== "Inbox") editDOM.openEdit(project, taskName);
            else editDOM.openEdit(inbox,taskName);
            break;

        default:
            break;
    }

});

editDOM.priorityModal.addEventListener("submit", e =>
{
    e.preventDefault();
    editDOM.priorityModal.close();
    const tab = taskContainer.dataset.tab;
    const taskTitle = editDOM.currentTask;
    const priority = editDOM.inputLow.checked? 1: editDOM.inputMedium.checked? 2: 3;

    if(tab === "Inbox" || tab === "Today" || tab === "This Week" || tab === "Overdue")
    {
        inbox.getTask(taskTitle).editPriority(priority);
        showProject(inbox);
    }
    else
    {
        projects.getProject(tab).getTask(taskTitle).editPriority(priority);
        showProject(projects.getProject(tab));
    }

    populateStorage();

});

editDOM.dateModal.addEventListener("submit", e =>
{
    e.preventDefault();
    editDOM.dateModal.close();
    const tab = taskContainer.dataset.tab;
    const taskTitle = editDOM.currentTask;
    const newDate = editDOM.inputDate.value;

    if(tab === "Inbox" || tab === "Today" || tab === "This Week" || tab === "Overdue")
    {
        inbox.getTask(taskTitle).editDuedate(newDate);
        showProject(inbox);
    }
    else
    {
        projects.getProject(tab).getTask(taskTitle).editDuedate(newDate);
        showProject(projects.getProject(tab));
    }
    populateStorage();
});

editDOM.modal.addEventListener("submit",e=>
{
    e.preventDefault();
    editDOM.modal.close();
    const tab = taskContainer.dataset.tab;
    const task = editDOM.currentTask;
    const taskTitle = editDOM.title.value;
    const description = editDOM.description.value;
    const dueDate = editDOM.dueDate.value;
    const priority = editDOM.getPriority();

    if(tab === "Inbox" || tab === "Today" || tab === "This Week" || tab === "Overdue")
    {
        inbox.getTask(task).editTask(taskTitle,description,dueDate,priority);
        showProject(inbox);
    }
    else
    {
        projects.getProject(tab).getTask(taskTitle).editTask(taskTitle,description,dueDate,priority);
        showProject(projects.getProject(tab));
    }    
    populateStorage();
});



