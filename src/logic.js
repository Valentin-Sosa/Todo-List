import { isPast,
         isToday, 
         isThisWeek, 
         compareAsc } from "date-fns";

class StorageTask
{
    constructor(title,description,dueDate,priority,projectName)
    {
        this.title = title;
        this.project = projectName;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

class StorageProject
{
    constructor(name,tasks)
    {
        this.name = name;
        this.tasks = tasks;
    }
}

class Task 
{
    constructor(title,description,dueDate,priority,projectName)
    {
        this.title = title;
        this.project = projectName;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    editTask = (title,description,dueDate,priority) =>
    {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    editPriority = newPriority => this.priority = newPriority;

    editDuedate = newDuedate => this.dueDate = newDuedate;

    getDueDate = ()=> processDate(this.dueDate);
}

class Project
{
    constructor(name)
    {
        this.name = name;
        this.tasks = [];
    }

    addTask = task => this.tasks.push(task);

    removeTask = taskName => this.tasks = this.tasks.filter( task => task.title !== taskName);

    getAmountTask = () => this.tasks.length();

    setTasks = newTasks => this.tasks = newTasks;

    getTasks = (state) => state==="all"?this.tasks: state==="today"? this.getTodayTasks(): state==="week"? this.getThisWeekTasks(): this.getOverdueTasks();

    getTask = taskName => this.tasks.find(task => task.title === taskName);

    getTodayTasks = () => this.tasks.filter(task => isToday(task.getDueDate()));

    getThisWeekTasks = () => this.tasks.filter(task => isThisWeek(task.getDueDate()) && !isPast(task.getDueDate()));s

    getOverdueTasks = ()=> this.tasks.filter(task => isPast(task.getDueDate()));

    getStorageTasks = ()=> this.tasks.map(task => new StorageTask(task.title,task.description,task.dueDate,task.priority,this.name));

    sortForDateTasks = (state) =>
    {
        const newSortArray = state==="all"?this.tasks.slice(): state==="today"? this.getTodayTasks().slice(): state==="week"? this.getThisWeekTasks().slice(): this.getOverdueTasks().slice();
        return newSortArray.sort(compareDate);
    };

    sortForPriority = (state) =>
    {
        const newSortArray = state==="all"?this.tasks.slice(): state==="today"? this.getTodayTasks().slice(): state==="week"? this.getThisWeekTasks().slice(): this.getOverdueTasks().slice();
        return newSortArray.sort(comparePriority);
    }; 
    sortForTitle = (state) =>
    {
        const newSortArray = state==="all"?this.tasks.slice(): state==="today"? this.getTodayTasks().slice(): state==="week"? this.getThisWeekTasks().slice(): this.getOverdueTasks().slice();
        return newSortArray.sort(compareTitle);
    }; 
} 

const projects = 
{
    myProjects : [],
    addProject : project => projects.myProjects.push(project),
    removeProject : project => projects.myProjects = projects.myProjects.filter( e => e !== project),
    getProject : nameProject => projects.myProjects.find( project => project.name === nameProject),
    getStorageProjects : ()=> projects.myProjects.map(project => new StorageProject(project.name,project.getStorageTasks())), 
};

function compareTitle(task1,task2)
{
    return task1.title.toLowerCase() > task2.title.toLowerCase()? 1: task1.title.toLowerCase() < task2.title.toLowerCase()? -1: 0;
}

function comparePriority(task1,task2)
{
    return task1.priority > task2.priority? 1: task1.priority < task2.priority ? -1: 0
}

function compareDate(task1, task2)
{
    return compareAsc(task1.getDueDate(), task2.getDueDate());
}

function processDate(date)
{
    const dateElements = date.split('-');
    const year = parseInt(dateElements[0]);
    const month = parseInt(dateElements[1])-1;
    const day = parseInt(dateElements[2]);

    return new Date(year,month,day,23,59,59);
}

const inbox = new Project("Inbox");

export {Task,Project,projects, inbox};
