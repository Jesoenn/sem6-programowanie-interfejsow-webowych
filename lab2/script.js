"use strict"

let lastDeleted = null; // { li, ulId }
let elementToDelete = null; // { li, ulId }

document.getElementById("todo-search-input").addEventListener("input", searchTasks);
document.getElementById("todo-search-checkbox").addEventListener("change", searchTasks);

function addItem() {
    const descInput = document.getElementById("todo-desc");
    const selectedList = document.getElementById("todo-select");
    const desc = descInput.value.trim();

    if (!desc) {
        console.log("Empty task description. Task not added.");
        return;
    }

    let ulId = "";
    if(selectedList.value === "Mało pilne") {
        ulId = "ul-malo-pilne";
    } else if(selectedList.value === "Pilne") {
        ulId = "ul-pilne";
    } else if(selectedList.value === "Na wczoraj") {
        ulId = "ul-na-wczoraj";
    }

    // Toggling completion
    const li = document.createElement("li");
    li.innerText = desc;
    li.onclick = toggleCompleted;

    // Deleting task 
    const removeBtn = document.createElement("button");
    removeBtn.innerText= "X";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = () => showModal(li, ulId);
    li.appendChild(removeBtn);

    // Add task to the list
    const ul = document.getElementById(ulId);
    ul.appendChild(li);
    descInput.value = "";
}


function toggleCompleted() {
    this.classList.toggle("completed");
    // Find if element with class completed-date exists
    let dateElement = this.querySelector(".completed-date");

    if (this.classList.contains("completed")) {
        const date = new Date().toLocaleString();
        console.log(`Task "${this.innerText}" completed on ${date}.`);

        if (!dateElement) {
            dateElement = document.createElement("span");
            dateElement.classList.add("completed-date");
            this.appendChild(dateElement);
        }

        dateElement.innerText = `(${date})`;
    } else {
        if (dateElement){
            dateElement.remove();
        }
    }
}


function removeItem() {
    if (elementToDelete) {
        console.log("Removing task:", elementToDelete.li.innerText);
        lastDeleted = { li: elementToDelete.li, ulId: elementToDelete.ulId };
        elementToDelete.li.remove();
        elementToDelete = null;
    }
}


function showModal(li, ulId) {
    elementToDelete = { li, ulId };
    document.getElementById("modal-task-desc").innerText = li.innerText;
    document.getElementById("todo-modal").showModal();
}


function undoDelete() {
    if (lastDeleted) {
        const ul = document.getElementById(lastDeleted.ulId);
        ul.appendChild(lastDeleted.li);
        lastDeleted = null;
    }
}

function searchTasks() {
    const checkSize = !document.getElementById("todo-search-checkbox").checked;
    let query = document.getElementById("todo-search-input").value.trim();
    
    if (!checkSize) {
        query = query.toLowerCase();
    }

    const allTasks = document.querySelectorAll("#ul-malo-pilne li, #ul-pilne li, #ul-na-wczoraj li");
    for (let i = 0; i < allTasks.length; i++) {
        let text = allTasks[i].innerText;
        if(!checkSize) {
            text = text.toLowerCase();
        } 

        if (text.includes(query)) {
            allTasks[i].style.display = "";
        } else {
            allTasks[i].style.display = "none";
        }
    }
}