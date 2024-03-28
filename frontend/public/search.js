async function fetchData() {
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJvbWthciIsImV4cCI6MTcxMTczMzIxMCwiaWF0IjoxNzExNjQ2ODEwfQ.PKKHQhtTNbcHCDcSIrFfRB44Qnytp0PBbK0riRnJ_N8"
    }
    
    let response = await fetch("http://localhost:8080/projects", { 
        method: "GET",
        headers: headersList
    });
    
    let data = await response.text();
    console.log(data);
    return data;
}

let response = fetchData();
// Path: dbs-project/frontend/public/search.js

response = [{"project_id":1,"title":"Project A","description":"Description for Project A","professor_id":1,"status":"in_progress","tags":[]},{"project_id":2,"title":"Project B","description":"Description for Project B","professor_id":1,"status":"closed","tags":["technology","innovation"]}];

for (let i in response) {
    let project = response[i];
    let projectCard = document.createElement("div");
    projectCard.className = "project-card";
    let projectName = document.createElement("h3");
    projectName.innerHTML = project.name;
    let projectDescription = document.createElement("p");
    projectDescription.innerHTML = project.description;
    projectCard.appendChild(projectName);
    projectCard.appendChild(projectDescription);
    document.getElementById("search-results").appendChild(projectCard);
}
   
   