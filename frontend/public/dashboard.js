document.getElementById("welcome-text").innerHTML = "Welcome "+localStorage.getItem("username");
let profileDetails = document.createElement("div");
profileDetails.classList.add("profile-details");
let userName = document.createElement("h4");
userName.innerHTML = "Username: "+localStorage.getItem("username");
profileDetails.appendChild(userName);
document.getElementById("profile").appendChild(profileDetails);



async function fetchData() {
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
    console.log(response);
    if(response.error == "invalid token"){
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
    let data = JSON.parse(await response.text());
    return data;
}

async function getData() {
    let response = await fetchData();

    console.log(response);
    
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



