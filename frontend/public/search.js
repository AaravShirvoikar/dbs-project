async function fetchData() {
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJvbWthciIsImV4cCI6MTcxMTczMzIxMCwiaWF0IjoxNzExNjQ2ODEwfQ.PKKHQhtTNbcHCDcSIrFfRB44Qnytp0PBbK0riRnJ_N8"
    }
    
    let response;
    try {
        response = await fetch("http://localhost:8080/projects", { 
            method: "GET",
            headers: headersList
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
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
    projectCard.className = "project-card";
    let projectName = document.createElement("h3");
    // console.log(project.title);
    projectName.innerHTML = project.title;
    let line = document.createElement("hr");

    let projectDescription = document.createElement("p");
    projectDescription.innerHTML = project.description;
    let projectTags = document.createElement("p");
    projectTags.innerHTML = project.tags;
    projectCard.appendChild(projectName);
    projectCard.appendChild(line);
    projectCard.appendChild(projectDescription);
    projectCard.appendChild(projectTags);
    document.getElementById("search-results").appendChild(projectCard);
}
    console.log("Display Complete");
};
getData();
