let stage1 = document.getElementById("stage1")
let stage2 = document.getElementById("stage2")
let stage3 = document.getElementById("stage3")
function next() {
    console.log("works 0");
    if (!stage1.classList.contains("hidden")) {
        stage1.classList.add("hidden");
        stage2.classList.remove("hidden");
        stage3.classList.add("hidden");
        document.getElementById("back").classList.remove("hidden");
        console.log("works 1");
    } else if (!stage2.classList.contains("hidden")) { // Add logic for back function
        stage1.classList.add("hidden");
        stage2.classList.add("hidden");
        stage3.classList.remove("hidden");
        document.getElementById("next").classList.add("hidden");
        console.log("works 2");
    }
}

function back() {
    if (!stage2.classList.contains("hidden")) {
        stage1.classList.remove("hidden");
        stage2.classList.add("hidden");
        stage3.classList.add("hidden");
        document.getElementById("back").classList.add("hidden");
        console.log("works 3");
    } else if (!stage3.classList.contains("hidden")) {
        stage1.classList.add("hidden");
        stage2.classList.remove("hidden");
        stage3.classList.add("hidden");
        document.getElementById("next").classList.remove("hidden");
        console.log("works 4");
    }
}
function register() {

    if (username == "" || firstname == "" || lastname == "") {
        alert("Please fill all the fields");
    }
}


document.getElementById('skills').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        console.log("working")
        add();
        document.getElementById('skills').value = null
    }
});

function add() {
    var skill = document.getElementById("skills").value;
    console.log(skill)
    // skill+= " &#11198;";
    skill.trim();
    if (skill != null && skill != "" && skill != " ") {
        var btn = document.createElement("button");
        btn.innerHTML = skill
        btn.className = "skill-btn"
        btn.setAttribute('onclick', "removing(this)")
        document.getElementById("skills-bar").insertBefore(btn, document.getElementById("skills"));
    }
    let children = document.getElementById("skills-bar").childNodes;
        children.forEach(element => {
            console.log(element);
        });
}

function removing(element) {
    element.remove();
    console.log("removed");
}

document.getElementById('skills').addEventListener('keydown', function (event) {
    if ((event.key === 'Backspace') && document.getElementById("skills").value.trim() == '') {
        let children = Array.from(document.getElementById("skills-bar").childNodes);
        // Filter out non-button elements (like the input field itself)
        let skillButtons = children.filter(child => child.className === "skill-btn");
        if (skillButtons.length > 0) {
            // Only remove the last skill button, if any exist
            skillButtons[skillButtons.length - 1].remove();
        }
    }
});