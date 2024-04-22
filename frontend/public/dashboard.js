document.addEventListener("DOMContentLoaded", async function () {
    let response = await fetchData2();
    if (response.type == "professor") {
        let createProject = document.createElement("button");
        createProject.innerHTML = "Create Project";
        createProject.id = "create-project";
        createProject.classList.add("btn");
        createProject.classList.add("btn-primary");
        createProject.classList.add("create-button");
        createProject.setAttribute("data-bs-toggle", "modal");
        createProject.setAttribute("data-bs-target", "#myModal");
        createProject.setAttribute("type", "button")
        document.getElementById("content").appendChild(createProject);
    }
    else {
        console.log("Student");
    }
})

async function fetchData1() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    }
    let response;
    try {
        response = await fetch("http://localhost:8080/projects/", {
            method: "GET",
            headers: headersList
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }

    let data = JSON.parse(await response.text());
    console.log(data);
    if (data.error == "invalid token format" || data.error == "invalid token") {
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
    return data;
}

async function fetchData2() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    }
    let response;
    try {
        response = await fetch("http://localhost:8080/user/", {
            method: "GET",
            headers: headersList
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }

    let data = JSON.parse(await response.text());
    console.log(data);
    if (data.error == "invalid token format" || data.error == "invalid token") {
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
    return data;
}
var globalresponse;
async function globalData(){
    globalresponse = await fetchData2();
    return globalresponse;
}
globalresponse = globalData();

async function getData() {
    let response = await fetchData1();
    console.log(response);
    let response2 = await fetchData2();
    console.log(response2);

    document.getElementById("welcome").innerHTML = "Welcome " + localStorage.getItem("username");
    let profileDetails = document.createElement("div");
    profileDetails.classList.add("profile-details");
    let userName = document.createElement("h4");
    userName.innerHTML = "Username: " + response2.username;
    let emailId = document.createElement("h4");
    emailId.innerHTML = "Email: " + response2.email;
    let buttonsdiv = document.createElement("div");
    buttonsdiv.classList.add("buttonsdiv");
    let skillsbtn = document.createElement("button");
    
    skillsbtn.innerHTML = "Skills";
    skillsbtn.setAttribute("id", "skillsBtn");
    skillsbtn.classList.add("skillsBtn");
    skillsbtn.classList.add("btn", "btn-primary");
    skillsbtn.setAttribute("data-bs-toggle", "modal");
    skillsbtn.setAttribute("data-bs-target", "#skills-modal");
    skillsbtn.setAttribute("type", "button")
    skillsbtn.setAttribute("onclick", "showSkillsinModal()");

    let expbtn = document.createElement("button");
    expbtn.setAttribute("id", "expBtn");
    expbtn.innerHTML = "Experiences";
    expbtn.classList.add("expBtn");
    expbtn.classList.add("btn", "btn-primary");
    expbtn.setAttribute("data-bs-toggle", "modal");
    expbtn.setAttribute("data-bs-target", "#experiences-modal");
    expbtn.setAttribute("type", "button");
    expbtn.setAttribute("onclick", "showExperiencesinModal()");

    buttonsdiv.appendChild(skillsbtn);
    buttonsdiv.appendChild(expbtn);

    profileDetails.appendChild(userName);
    profileDetails.appendChild(emailId);
    profileDetails.appendChild(buttonsdiv);
    document.getElementById("profile").appendChild(profileDetails);

    for (let i in response) {
        let project = response[i];
        // console.log(project);
        let projectCard = document.createElement("div");
        projectCard.className = "project-entry";
        let projectName = document.createElement("li");
        // console.log(project.title);
        projectName.innerHTML = project.title;
        projectCard.appendChild(projectName);
        document.getElementById("project-list").appendChild(projectCard);
    }
    console.log("Display Complete");
};
getData();

async function getSkills(userid) {
    let headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer "+localStorage.getItem("token"),
       }
       
       let response = await fetch("http://localhost:8080/user/skills/"+userid, { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.text();
       console.log(data);
    return data;   
}

async function getExperiences(userid) {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("token"),
       }
       
       let response = await fetch("http://localhost:8080/user/experience/"+userid, { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.text();
       console.log(data);
       return data;
}

async function createProject() {
    var duration;
    if (document.getElementById("lt3m").checked) {
        duration = "3 months";
    } else if (document.getElementById("bw36m").checked) {
        duration = "3-6 months";
    }
    else if (document.getElementById("gt6m").checked) {
        duration = ">6 months";
    }
    var project_type;
    if (document.getElementById("researchradio").checked) {
        project_type = "research";
    } else if (document.getElementById("projectradio").checked) {
        project_type = "mini";
    }
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    }

    let bodyContent = JSON.stringify({
        "title": document.getElementById("project-title").value,
        "description": document.getElementById("project-description").value,
        "status": "open",
        "duration": duration,
        "type" : project_type,
        "start_date": document.getElementById("project-start").value,
        //  "tags": document.getElementById("project-tags").value,
        //  "min-reqs": document.getElementById("project-requirements").value,
    }
    );
    console.log(bodyContent);

    let response = await fetch("http://localhost:8080/projects/create", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    });

    let data = await response.text();
    console.log(data);
    return data;
}
async function createProj() {
    let response = await createProject();
    console.log(response);
    let message = JSON.parse(response).message;
    console.log(message);
    if (message == "project created successfully") {
        window.location.reload();
        alert("Project created successfully");
    }
    else if (response.error == "invalid token format" || response.error == "invalid token") {
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const width = document.getElementById("detail-modal").offsetWidth;
    document.getElementById("detail-modal-div").style.width = width + "px";
    document.getElementById("detail-modal").style.visibility = "hidden";
})

async function showSkillsinModal() {
    console.log("Skills");
    let response = await getSkills(globalresponse.user_id);
    response = JSON.parse(response);
    skillsArray = response.skills;
    let allSkillsContainer = document.getElementById("skill-div");
    allSkillsContainer.innerHTML = ""; // Clear the existing skills

    skillsArray.forEach(element => {
        if (!allSkillsContainer.querySelector(`[data-skill="${element}"]`)) {
            addskills(element, "userskills");
        }
    })
}

async function showExperiencesinModal() {
    console.log("Experiences");
    let response = await getExperiences(globalresponse.user_id);
    response = JSON.parse(response);
    let allExpContainer = document.getElementById("exp-list");
    allExpContainer.innerHTML = ""; // Clear the existing skills
    response.forEach(element => {
        addexp(element);
    });
}

function addskills(skill, tag) {
    if (skill != null && skill != "" && skill != " ") {
        var btn = document.createElement("button");
        btn.innerHTML = skill
        btn.className = "skill-btn"
        if(tag=="userskills")
        btn.classList.add("userskills");
        btn.setAttribute('onclick', "removing(this)")
        document.getElementById("skill-div").appendChild(btn);
    }
}

document.getElementById('skills').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        console.log("working")
        var skill = document.getElementById("skills").value;
        console.log(skill)
        skill.trim();
        addskills(skill);
        document.getElementById('skills').value = null
    }
});
function removing(element) {
    element.remove();
    console.log("removed");
}

document.getElementById('skills').addEventListener('keydown', function (event) {
    if ((event.key === 'Backspace') && document.getElementById("skills").value.trim() == '') {
        let children = Array.from(document.getElementById("skills-div").childNodes);
        // Filter out non-button elements (like the input field itself)
        let skillButtons = children.filter(child => child.className === "skill-btn");
        if (skillButtons.length > 0) {
            // Only remove the last skill button, if any exist
            skillButtons[skillButtons.length - 1].remove();
        }
    }
});

function addexp(element) {
    console.log(element);
    let div = document.createElement("div");
    div.classList.add("exp-entry");
    let title = document.createElement("h4");
    title.innerHTML = element.title + " at " + element.company;
    let date = document.createElement("p");
    date.innerHTML = " from " +  element.start_date.split("T")[0] + " to " + element.end_date.split("T")[0];
    let desc = document.createElement("p");
    desc.innerHTML = element.description;
    div.appendChild(title);
    div.appendChild(date);
    div.appendChild(desc);
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "<img src='../assets/del.svg' alt='delete' width='20px' height='20px'>";
    deleteButton.classList.add("delete-button");
    deleteButton.setAttribute("onclick", "deleteExp(this)");
    div.appendChild(deleteButton);
    document.getElementById("exp-list").appendChild(div);
}


async function postUpdateSkills(skillsArray) {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("token"),
       }
       
       let bodyContent = JSON.stringify({
         "user_id" : globalresponse.user_id,
         "skills" : skillsArray
       });
       
       let response = await fetch("http://localhost:8080/user/skills/add", { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       
       let data = await response.text();
       console.log(data);
       return data;
}
  
async function updateSkills(){
    let skillsArray = [];
    let skills = document.getElementsByClassName("skill-btn");
    for(let i=0; i<skills.length; i++){
        skillsArray.push(skills[i].innerHTML);
    }
    console.log(skillsArray);
    let response = await postUpdateSkills(skillsArray);
    console.log(response);
    if(JSON.parse(response).message == "skills added successfully"){
        alert("Skills added successfully");
        window.location.reload();
    }
}

async function updateExperiences(){
    if(document.getElementById("exp-title").value == "" || document.getElementById("exp-company").value == "" || document.getElementById("exp-start").value == "" || document.getElementById("exp-end").value == "" || document.getElementById("exp-desc").value == ""){
        alert("Please fill all the fields");
        return;
    }
    let response = await postUpdateExperience();
    console.log(response);
    if(JSON.parse(response).message == "experience added successfully"){
        alert("Experience added successfully");
        window.location.reload();
    }
}
async function postUpdateExperience(experience) {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("token"),
       }
       
       let bodyContent = JSON.stringify({
         "title": document.getElementById("exp-title").value,
         "company": document.getElementById("exp-company").value,
         "start_date": document.getElementById("exp-start").value,
         "end_date": document.getElementById("exp-end").value,
         "description": document.getElementById("exp-desc").value,
       });
       
       let response = await fetch("http://localhost:8080/user/experience/add", { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       
       let data = await response.text();
       console.log(data);
       return data;
}


function deleteExp(element){

    element.parentElement.remove();
}