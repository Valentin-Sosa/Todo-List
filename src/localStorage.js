import { createProject,
         projectDOM,
         showProject } from "./dom";

import { projects,
         inbox, 
         Project, 
         Task } from "./logic";

function populateStorage()
{
    localStorage.setItem("projects", JSON.stringify(projects.getStorageProjects()));
    localStorage.setItem("inbox", JSON.stringify(inbox.getStorageTasks()));
}

function setStorage()
{
    const storageProject = JSON.parse(localStorage.getItem("projects"));
    const storageInbox = JSON.parse(localStorage.getItem("inbox"));

    projects.myProjects = storageProject.map(project =>
    {
            const newProject = new Project(project.name);
            const newTasks = project.tasks.map(task => new Task(task.title,task.description,task.dueDate,task.priority,task.project));
            newProject.setTasks(newTasks);
            return newProject;
    });

    inbox.tasks = storageInbox.map(task => new Task(task.title,task.description,task.dueDate,task.priority,task.project));

    projects.myProjects.forEach(project => projectDOM.list.appendChild(createProject(project.name)));

    showProject(inbox);
}

function init()
{
    if (!localStorage.getItem("inbox") && !localStorage.getItem("projects")) 
    {
        populateStorage();
        showProject(inbox);
    } 
    else 
    {
        setStorage();
    }
}

export {init, populateStorage};
