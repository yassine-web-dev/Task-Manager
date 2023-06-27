// Setting Up Variables
let theInput = document.querySelector(".add-task input");
let theAddButton = document.querySelector(".add-task .plus");
let tasksContainer = document.querySelector(".tasks-content"); 
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompleted = document.querySelector(".tasks-completed span");
let deleteAllButton = document.querySelector('.delete-all');
let finishAllButton = document.querySelector('.finish-all');

// Adding The Task
theAddButton.onclick = function () {

    // If Input is Empty
    if (theInput.value === '') {
        
        Swal.fire({
            title: `This Field Can't Be Empty`,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
        });
  
    } else {

        let noTasksMsg = document.querySelector(".no-tasks-message");
        
        // Check If Span With No Tasks Message Is Exist
        if (document.body.contains(noTasksMsg)) {
        
            // Remove No Tasks Message
            noTasksMsg.remove();
        
        }
        
        // Create Main Span Element
        let mainSpan = document.createElement("span");
        
        // Create Delete Button
        let deleteElement = document.createElement("span");
        
        // Create The Main Span Text
        let text = document.createTextNode(theInput.value);
        
        // Create The Delete Button Text
        let deleteText = document.createTextNode("Delete");
        
        // Add Text To Main Span
        mainSpan.appendChild(text);
        
        // Add Class To Main Span
        mainSpan.className = 'task-box';
        
        // Add Text To Delete Button
        deleteElement.appendChild(deleteText);
        
        // Add Class To Delete Button
        deleteElement.className = 'delete';
        
        // Add Delete Button To Main Span
        mainSpan.appendChild(deleteElement);
        
        // Add The Task To The Container
        tasksContainer.appendChild(mainSpan);

        // Check If Task Already Exists
        let taskEls = document.querySelectorAll('.tasks-content .task-box');
        let result = [];

        for (let task of taskEls) {
            result.push(task.firstChild.textContent);
        }

        let tsks = JSON.stringify(result);
        let retrievedVal = JSON.parse(tsks)

        preventRepeatedTask(retrievedVal);
        
        // Empty The Input
        theInput.value = '';
        
        // Focus On Field
        theInput.focus();
        
        // Calculate Tasks
        calculateTasks();

        // Delete All Tasks Button
        deleteAllButton.addEventListener('click', function () {
            document.querySelectorAll('.tasks-content .task-box').forEach(task => {
                task.remove();
            })
        });

        // Finish All Tasks Button
        finishAllButton.addEventListener('click', function () {
            document.querySelectorAll('.tasks-content .task-box').forEach(task => {
                task.classList.add('finished');
            })
        });

        // Store all tasks in local storage
        let tasksBoxes = document.querySelectorAll('.tasks-content .task-box');
        let tasks = [];

        for (let tasksBox of tasksBoxes) {
            tasks.push(tasksBox.firstChild.textContent);
        }

        localStorage.setItem('Tasks', JSON.stringify(tasks));
    }
  
};

// Actions Onload
window.onload = function () {
    theInput.focus();

    // Empty The Input
    theInput.value = '';
  
    retrieveTasksFromLocalStorage();
  
    // Delete All Tasks Button
    deleteAllButton.addEventListener('click', function () {
        tasksContainer.innerHTML = "";
        createNoTasks();
        localStorage.removeItem('Tasks');

        // Empty The Input
        theInput.value = '';
    });
  
    // Finish All Tasks Button
    finishAllButton.addEventListener('click', function () {
        document.querySelectorAll('.tasks-content .task-box').forEach(task => {
            task.classList.add('finished');
        })
    });

    // Check If Span With No Tasks Message Exists
    if (document.body.contains(document.querySelector(".no-tasks-message"))) {
        
        // Remove No Tasks Message
        document.querySelector(".no-tasks-message").remove();
    }

    // Check Number Of Tasks Inside The Container
    if (tasksContainer.childElementCount == 0) {
    
        createNoTasks();

    }
};


document.addEventListener('click', function (e) {

    // Delete Task
    if (e.target.className == 'delete') {
  
        // Remove Current Task
        e.target.parentNode.remove();

        // Remove Task From Local Storage
        // Retrieve the remaining tasks from the DOM
        let remainingTasks = document.querySelectorAll('.tasks-content .task-box');

        // Create an empty array to store the updated task list
        let updatedTasks = [];

        // Iterate over the remaining tasks and add their text content to the updated task list
        remainingTasks.forEach(task => {
            updatedTasks.push(task.firstChild.textContent);
        });

        // Update the tasks in local storage with the updated task list
        localStorage.setItem('Tasks', JSON.stringify(updatedTasks));

  
        // Check Number Of Tasks Inside The Container
        if (tasksContainer.childElementCount == 0) {
    
            createNoTasks();
    
        }
    
    }
  
    // Finish Task
    if (e.target.classList.contains('task-box')) {
  
        // Toggle Class 'finished'
        e.target.classList.toggle("finished");
  
    }
  
    // Calculate Tasks
    calculateTasks();
});

  // Function To Create No Tasks Message
function createNoTasks() {

    // Create Message Span Element
    let msgSpan = document.createElement("span");
  
    // Create The Text Message
    let msgText = document.createTextNode("No Tasks To Show");
  
    // Add Text To Message Span Element
    msgSpan.appendChild(msgText);
  
    // Add Class To Message Span
    msgSpan.className = 'no-tasks-message';
  
    // Append The Message Span Element To The Task Container
    tasksContainer.appendChild(msgSpan);
}


// Function To Calculate Tasks
function calculateTasks() {

    // Calculate All Tasks
    let totalTasks = document.querySelectorAll('.tasks-content .task-box').length;
    
    // Calculate Completed Tasks
    let completedTasks = document.querySelectorAll('.tasks-content .finished').length;

    // Update tasksCount and tasksCompleted elements
    tasksCount.innerHTML = totalTasks;
    tasksCompleted.innerHTML = completedTasks;

    // Save Values in Local Storage
    let tasks = document.querySelectorAll('.tasks-content .task-box');
    let host = [];

    for (let task of tasks) {
        if (task.classList.contains('finished')) {
            host.push(true)
        } else {
            host.push(false)
        }
    }

    localStorage.setItem('Finished Classes', JSON.stringify(host));
}

// Function to retrieve tasks from local storage
function retrieveTasksFromLocalStorage() {
    let storedTasks = localStorage.getItem('Tasks');
    let storedFinishedClasses = localStorage.getItem('Finished Classes');

    if (storedTasks) {
        let tasks = JSON.parse(storedTasks);
        for (let task of tasks) {
            createTaskElement(task);

            // Retrieve completed tasks from local storage
            if (storedFinishedClasses) {
                let tasks = JSON.parse(storedFinishedClasses);
                let taskElems = document.querySelectorAll('.tasks-content .task-box');

                for (let i = 0; i < taskElems.length; i++) {
                    if (tasks[i] === true) {
                        taskElems[i].classList.add('finished');
                    } else {
                        taskElems[i].classList.remove('finished');
                    }
                }
            }

            // Calculate Tasks
            calculateTasks();
        }
    }
}

// Function to create a task element
function createTaskElement(task) {
    let mainSpan = document.createElement("span");
    let deleteElement = document.createElement("span");
    let text = document.createTextNode(task);
    let deleteText = document.createTextNode("Delete");
  
    mainSpan.appendChild(text);
    mainSpan.className = 'task-box';
  
    deleteElement.appendChild(deleteText);
    deleteElement.className = 'delete';
  
    mainSpan.appendChild(deleteElement);
  
    tasksContainer.appendChild(mainSpan);
}

// Prevent Already Existing Tasks Function
function preventRepeatedTask(array) {
    let taskEs = document.querySelectorAll('.tasks-content .task-box');
    let result = [];
    
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {

                for (let task of taskEs) {

                    // Check if Task was already added
                    if (task.firstChild.textContent === array[i] && task.firstChild.textContent === array[j]) {

                        // Push Repeated Tasks to Result Array
                        result.push(task);

                        // Remove Repeated Task
                        result[0].remove();

                        // Already Exists Msg
                        Swal.fire({
                            title: `This Task Already Exists`,
                            showClass: {
                              popup: 'animate__animated animate__fadeInDown'
                            },
                            hideClass: {
                              popup: 'animate__animated animate__fadeOutUp'
                            }
                        });
                    }
                }
            }
        }
    }
}