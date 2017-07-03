let request = new XMLHttpRequest();

/**
 * sends a request
 * @param {string} command 
 * @param {function} callback a function with signature (err:Error,response:string)=>void 
 */
function sendReq(command /*string*/ , callback /*:function*/ ) {

    var link = "http://localhost:3000" + command;
    request.open('GET', link, true);
    request.send();

    request.addEventListener("readystatechange", function () {
        if (request.readyState == 4) {
            const text = request.responseText;
            callback(null, text)
        }
    });

}

function initTaskList() {
    sendReq("/", function (err, tasksAsString /*string*/ ) {

            common.setTaskList(tasksAsString);
            printTaskList();

    });
}

function clearTasks() {
    if (confirm("Are you sure you want to clear all your tasks?")) {
        sendReq("/clear", function (err, tasksAsString) {

                common.setTaskList(tasksAsString);
                printTaskList();
            
        });
        alert("Task list was cleared");
    }
}



function addTaskBrowser(x) {
    var addTask = "/add?task=" + x;
    sendReq(addTask, function (err, tasksAsString /*string*/ ) {

            common.setTaskList(tasksAsString);
            printTaskList();
            document.getElementById('addBox').value = "";
        
    });
}

function deleteTaskBrowserDone(x) {


    if (confirm("Are you sure you want to delete task number: " + (x + 1))) {
        var delDone = "/deleteDone?id=" + x;
        sendReq(delDone, function (err, tasksAsString /*string*/ ) {

                common.setTaskList(tasksAsString);
                printTaskList();
            
        });
    }
}

function deleteTaskBrowserUndone(x) {
    if (confirm("Are you sure you want to delete task number: " + (x + 1))) {
        var delUndone = "/deleteUndone?id=" + x;
        sendReq(delUndone, function (err, tasksAsString /*string*/ ) {

                common.setTaskList(tasksAsString);
                printTaskList();
            
        });
    }
}


function editTaskBrowser(x, str) {
    var editTask = "/edit?id=" + x + "&task=" + str;
    sendReq(editTask, function (err, tasksAsString /*string*/ ) {
 
            common.setTaskList(tasksAsString);
            printTaskList();
        
    });
}

function doneBrowser(x) {
    var done="/done?id="+x;
    sendReq(done, function (err, tasksAsString /*string*/ ) {

            common.setTaskList(tasksAsString);
            printTaskList();
        
    });
}

function undoneBrowser(x) {
    var done="/undone?id="+x;
    sendReq(done, function (err, tasksAsString /*string*/ ) {

            common.setTaskList(tasksAsString);
            printTaskList();
        
    });
}

function taskTemplate(done, task, i) {
    return "<input type='text' value='" + task.name + "' id='task" + i + "' " + (done ? "disabled" : "") + ">" +
        "<input type='button' value='DELETE' onclick='" + (done ? "deleteTaskBrowserDone(" : "deleteTaskBrowserUndone(") + i + ")'/>" +
        "<input type='button' value='" + (done ? "UNDO" : "DO") + "' onclick='" + (done ? "undoneBrowser" : "doneBrowser") + "(" + i + ")'/>" +
        (done ? "" : "<input type='button' value='SAVE' onclick='editTaskBrowser(" + i + ",document.getElementById(\"task" + i + "\").value)'>");
}

const taskDoneTemplate = taskTemplate.bind(null, false)
const taskUndoneTemplate = taskTemplate.bind(null, true)

const undoneList = document.getElementById('undoneList');
const doneList = document.getElementById('doneList');

function printTaskList() {

    let strUndone = "";
    let strDone = "";

    const tasks = common.getTasks();
    const doneTasks = tasks.doneTasks;
    const undoneTasks = tasks.undoneTasks;

    for (let i = 0; i < undoneTasks.length; i++) {

        strUndone += "<li>" + taskDoneTemplate(undoneTasks[i], i) + "</li>\n";
    }

    for (let i = 0; i < doneTasks.length; i++) {

        strDone += "<li>" + taskUndoneTemplate(doneTasks[i], i) + "</li>\n";

    }


    undoneList.innerHTML = strUndone;
    doneList.innerHTML = strDone;
}

document.getElementById('add').addEventListener("click", function () {
    addTaskBrowser(document.getElementById('addBox').value);
});
document.getElementById('reset').addEventListener("click", clearTasks);
document.getElementById('addBox').addEventListener("keydown", function (e) {
    if (e.keyCode == 13) addTaskBrowser(document.getElementById('addBox').value);
});

initTaskList();