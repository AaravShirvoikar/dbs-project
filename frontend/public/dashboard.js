document.addEventListener("DOMContentLoaded", async function() {
    let response = await fetchData2();   
    if(response.type=="professor"){
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
    else{
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
    if(data.error == "invalid token format" || data.error == "invalid token"){
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
    if(data.error == "invalid token format" || data.error == "invalid token"){
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
    return data;
}

async function getData() {
    let response = await fetchData1();
    console.log(response);
    let response2 = await fetchData2();
    console.log(response2);
    
    document.getElementById("welcome").innerHTML = "Welcome "+localStorage.getItem("username");
    let profileDetails = document.createElement("div");
    profileDetails.classList.add("profile-details");
    let userName = document.createElement("h4");
    userName.innerHTML = "Username: "+response2.username;
    let emailId = document.createElement("h4");
    emailId.innerHTML = "Email: "+response2.email;
    let skills = document.createElement("h4");
    skills.innerHTML = "Skills: "+ (response2.skills!=null?response2.skills:"");
    profileDetails.appendChild(userName);
    profileDetails.appendChild(emailId);
    profileDetails.appendChild(skills);
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

async function createProject() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
       }
       
       let bodyContent = JSON.stringify({
         "title": document.getElementById("project-title").value,
         "description": document.getElementById("project-description").value,
         "status": "open",
        //  "tags": ["PLSQL","MySQL"]
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
}
async function createProj(){
    let response = await createProject();
    console.log(response);
    if(response.message == "project created successfully"){
        alert("Project created successfully");
        window.location.href = "./dashboard.html";
    }
    else if(response.error == "invalid token format" || response.error == "invalid token"){
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
    
}

