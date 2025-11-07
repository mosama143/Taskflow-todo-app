// active js btn type 



let tasks_types = document.querySelectorAll(".btn-task-all");
tasks_types.forEach((btn)=>{

    btn.addEventListener("click",()=>{
let active_type = document.querySelectorAll(".active_type")[0];

   active_type.classList.remove("active_type");
   btn.classList.add("active_type");
   display_tasks();
   console.log(type_displayed());
    })
    
   
});

////////////////
function values() {
    let totalval = document.getElementById("total_value");
    let completedval = document.getElementById("completed_value");
    let pindingval = document.getElementById("pinding_value");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let l = tasks.length;
    let comp = 0;

    // reset values
    totalval.innerText = 0;
    completedval.innerText = 0;
    pindingval.innerText = 0;

    // حساب عدد المهام المكتملة
    for (let t of tasks) {
        if (t.type === "completed_tasks") comp++;
    }

    let pendingTarget = l - comp;

    // ---- انيميشن عداد total ----
    if (l > 0) {
        let totalCounter = setInterval(() => {
            totalval.innerText = parseInt(totalval.innerText) + 1;
            if (parseInt(totalval.innerText) >= l) {
                clearInterval(totalCounter);
            }
        }, 100);
    }

    // ---- انيميشن عداد completed ----
    if (comp > 0) {
        let completedCounter = setInterval(() => {
            completedval.innerText = parseInt(completedval.innerText) + 1;
            if (parseInt(completedval.innerText) >= comp) {
                clearInterval(completedCounter);
            }
        }, 100);
    }

    // ---- انيميشن عداد pending ----
    if (pendingTarget > 0) {
        let pendingCounter = setInterval(() => {
            pindingval.innerText = parseInt(pindingval.innerText) + 1;
            if (parseInt(pindingval.innerText) >= pendingTarget) {
                clearInterval(pendingCounter);
            }
        }, 100);
    } else {
        // مفيش pending tasks
        pindingval.innerText = 0;
    }
}

window.addEventListener("load", () => {
    values();
    display_tasks();
});

/////  task main 



if(window.localStorage.getItem("tasks") == null){

    window.localStorage.setItem("tasks",JSON.stringify([]));

}


function type_displayed() {
    let task_types = document.querySelectorAll(".btn-task-all");
    for (let btn of task_types) {
        if (btn.classList.contains("active_type")) {
            return btn.innerText.trim().replace(" ", "_").toLowerCase();
        }
    }
    return "all_tasks"; // fallback لو مفيش زرار active
}

function display_tasks() {
    let type = type_displayed();
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let task_disp = document.getElementById("display_task");

    // فضي المكان قبل العرض
    task_disp.innerHTML = "";

    // لو مفيش مهام
    let notask = document.getElementById("no_task_massge");
    let tottask=tasks;
   if(type!=="all_tasks"){
       tasks=tasks.filter(task=>task.type===type);
   }
    if (tasks.length === 0) {

            task_disp.innerHTML = "";
            task_disp.innerHTML = `
                <div class="m-auto mt-5 mb-5 p-3 text-center mb-2">
                    <i class="fs-3 fa-solid fa-circle-exclamation mb-2"></i>
                    <h3 class="text-secondary">No tasks yet</h3>
                    <p class="text-secondary fs-4">Add a new task to get started!</p>
                </div>
            `;
    }
 
    tasks.forEach((task, index) => {
        
            // ===== إنشاء الكارد =====
            let taskCard = document.createElement("div");
            taskCard.className = "task_card d-flex g-2 my-5 px-3";

            // ===== Checkbox =====
            let label = document.createElement("label");
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "circle-checkbox mt-3 me-2";
            label.appendChild(checkbox);

            // ===== Task Text =====
            let taskText = document.createElement("div");
            taskText.className = "task_text d-flex flex-column gap-4 ms-2";

            let taskDescription = document.createElement("h5");
            taskDescription.className = "task_description";
            taskDescription.innerText = task.description;

            let taskDetail = document.createElement("div");
            taskDetail.className = "task_detail";

            let taskStat = document.createElement("span");
            taskStat.className = "task_stat badge fs-6 d-inline-block me-2";
            taskStat.innerText =
                task.type === "completed_tasks"
                    ? "complete"
                    : task.type === "high_priority"
                    ? "high priority"
                    : "low priority";
            taskStat.classList.add(
                task.type === "completed_tasks"
                    ? "comp"
                    : task.type === "high_priority"
                    ? "high"
                    : "low"
            );

            let taskDate = document.createElement("span");
            taskDate.className = "task_date text-secondary d-inline-block";
            taskDate.innerText = task.date;

            taskDetail.appendChild(taskStat);
            taskDetail.appendChild(taskDate);
            taskText.appendChild(taskDescription);
            taskText.appendChild(taskDetail);

            // لو التاسك مكتمل مسبقًا
            if (task.type === "completed_tasks") {
                taskDescription.style.textDecoration = "line-through";
                taskCard.classList.add("completed");
                checkbox.checked = true;
            }

            // ===== Actions =====
            let taskActions = document.createElement("div");
            taskActions.className =
                "task_actions d-flex flex-column flex-md-row align-items-center gap-2 ms-auto";

            let editBtn = document.createElement("button");
            editBtn.className = "edit_btn btn btn-lg text-secondary";
            editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
            editBtn.addEventListener("click", function () {
                editTask(task, index);
            });

            let deleteBtn = document.createElement("button");
            deleteBtn.className = "delete_btn btn btn-lg text-secondary";
            deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            deleteBtn.addEventListener("click", function () {
                deleteTask(index);
            });

            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);

            // ===== تحديث الحالة عند تغيير الـ checkbox =====
            checkbox.addEventListener("change", function () {
                if (checkbox.checked) {
                    taskCard.classList.add("completed");
                    task.type = "completed_tasks";
                    taskDescription.style.textDecoration = "line-through";
                    taskStat.innerText = "complete";
                    taskStat.className = "task_stat badge fs-6 comp d-inline-block me-2";
                    
                } else {
                    taskCard.classList.remove("completed");
                    task.type = task.state;
                    taskDescription.style.textDecoration = "none";
                    taskStat.innerText = task.state === "completed_tasks" ? "complete" : task.state === "high_priority" ? "high priority" : "low priority";
                    taskStat.className = "task_stat badge fs-6  d-inline-block me-2";
                    let task_class = task.state === "completed_tasks" ? "comp" : task.state === "high_priority" ? "high" : "low";
                    taskStat.classList.add(task_class);
                    
                }
                localStorage.setItem("tasks", JSON.stringify(tottask));
                values();
            });

            // ===== تجميع الكارد =====
            taskCard.appendChild(label);
            taskCard.appendChild(taskText);
            taskCard.appendChild(taskActions);
            task_disp.appendChild(taskCard);
        
    });
}




function addTask(){

    let taskDescription = document.getElementById("input_task").value;
    let now = new Date();

// تنسيق التاريخ والوقت بالإنجليزي
let options = {  
    year: "numeric",  
    month: "short",   // short = Sep | long = September | 2-digit = 09
    day: "2-digit",  
    hour: "2-digit",  
    minute: "2-digit",  
    hour12: false     // true لو عايز AM/PM
};

let taskDate = now.toLocaleString("en-US", options);
    let taskType = document.querySelector(".priority-select").value;

    if (taskDescription.trim() === "") {
        alert("Please enter a task description.");
        return;
    }
    else {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.unshift({
            description: taskDescription,
            date: taskDate,
            type: taskType,
            state: taskType
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        document.getElementById("input_task").value = "";
        display_tasks();
    }

    values();

}

let addTaskBtn = document.getElementById("add_a_task");

addTaskBtn.addEventListener("click", function() {
    addTask();
});


display_tasks();



function deleteTask(index) {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    values();
    display_tasks();
}

function editTask(task, index) {
    // Populate the input field with the current task description
    document.getElementById("input_task").value = task.description;
    document.querySelector(".priority-select").value = task.type;

    // Remove the task from the list
    values();
    deleteTask(index);

}

















window.addEventListener("load", () => {
  clock();
  function clock() {
    const today = new Date();

    // get time components
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    //add '0' to hour, minute & second when they are less 10
    const hour = hours < 10 ? "0" + hours : hours;
    const minute = minutes < 10 ? "0" + minutes : minutes;
    const second = seconds < 10 ? "0" + seconds : seconds;

    //make clock a 12-hour time clock
    const hourTime = hour > 12 ? hour - 12 : hour;

    // if (hour === 0) {
    //   hour = 12;
    // }
    //assigning 'am' or 'pm' to indicate time of the day
    const ampm = hour < 12 ? "AM" : "PM";

    // get date components
    const month = today.getMonth();
    const year = today.getFullYear();
    const day = today.getDate();

    //declaring a list of all months in  a year
    const monthList = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    //get current date and time
    const date = monthList[month] + " " + day + ", " + year;
    const time = hourTime + ":" + minute + ":" + second + ampm;

    //combine current date and time
    const dateTime = date + " - " + time;

    //print current date and time to the DOM
    document.getElementById("date-time").innerHTML = dateTime;
    setTimeout(clock, 1000);
  }
});



let upbtn = document.getElementById("up_btn");

window.addEventListener("scroll",()=>{
   if (window.scrollY > 100) {
       upbtn.style.display = "block";
   } else {
       upbtn.style.display = "none";
   }
});

upbtn.addEventListener("click",()=>{
   window.scrollTo({
       top: 0,
       behavior: "smooth"
   });
})