let stage1 = document.getElementById("stage1")
let stage2 = document.getElementById("stage2")
let stage3 = document.getElementById("stage3")
var email, password, username, fname, lname, acctype, skills = [];

function next() {
    if (!stage1.classList.contains("hidden")) {
        stage1.classList.add("hidden");
        stage2.classList.remove("hidden");
        document.getElementById("back").classList.remove("hidden");
        document.getElementById("next").classList.add("hidden");
        document.getElementById("submiting").classList.remove("hidden");
    }
}

function back() {
    if (!stage2.classList.contains("hidden")) {
        stage1.classList.remove("hidden");
        stage2.classList.add("hidden");
        document.getElementById("back").classList.add("hidden");
        document.getElementById("next").classList.remove("hidden");
        document.getElementById("submiting").classList.add("hidden");
    }
    }

function register1() {
    mail = document.getElementById("mail").value;
    pass1 = document.getElementById("password1").value;
    pass2 = document.getElementById("password2").value;
    if(mail == "" || pass1 == "" || pass2 == ""){
        alert("Please fill all the fields");}
    else if(pass1 != pass2){
        alert("Passwords do not match");
        document.getElementById("password1").value = '';
        document.getElementById("password2").value = '';
    }
    else{
        localStorage.setItem("email", mail);
        localStorage.setItem("password", pass1);
        window.location.href = "./public/register.html";
        console.log(email, password);
        console.log(mail, pass1, pass2);
    }
}

async function submit(){
    username = document.getElementById("username").value;
    fname = document.getElementById("fname").value;
    lname = document.getElementById("lname").value;
    if (document.getElementById("studentradio").checked) {
        acctype = "student";
    } else if (document.getElementById("profradio").checked) {
        acctype = "professor";
    }
    console.log(acctype);
    email = localStorage.getItem("email");
    password = localStorage.getItem("password");
    let children = document.getElementById("allskills").childNodes;
    children.forEach(element => {
        if(element.className == "skill-btn" && !skills.includes(element.innerHTML))
        skills.push(element.innerHTML);
    });
    console.log(skills);
    let response = await register();
    let message1 = JSON.parse(response).message;
    let message2 = JSON.parse(response).message;
    if(message1 == "registration successful"){
        localStorage.clear();
        location.replace("./login.html");
        alert("registration successful");
    }
    else{
        location.replace("../index.html");
        alert("Registration failed");
    }
}

async function register(){
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let bodyContent = JSON.stringify({
         "username": username,
         "password": password,
         "email": email,
         "first_name": fname,
         "last_name": lname,
         "type": acctype
       }
       );
       
       let response = await fetch("http://localhost:8080/register", { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       
       let data = await response.text();
       return data;
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
        document.getElementById("allskills").insertBefore(btn, document.getElementById("skills-bar"));
    }
    let children = document.getElementById("allskills").childNodes;
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
        let children = Array.from(document.getElementById("allskills").childNodes);
        // Filter out non-button elements (like the input field itself)
        let skillButtons = children.filter(child => child.className === "skill-btn");
        if (skillButtons.length > 0) {
            // Only remove the last skill button, if any exist
            skillButtons[skillButtons.length - 1].remove();
        }
    }
});


