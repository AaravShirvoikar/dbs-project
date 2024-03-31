async function fetchData() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    }
    let response;
    try {
        response = await fetch("http://localhost:8080/projects/all", {
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
var globalResponse;
async function globalData(){
    globalResponse = await fetchData();
}
globalData();
async function getData(response) {
    if (response == undefined) {
        response = await fetchData();
        console.log("from fetchData", response);
    }

    console.log("from search", response);

    for (let i in response) {
        i = response.length - i - 1;
        let project = response[i];
        let projectButton = document.createElement("button");
        projectButton.classList.add("project-button");
        projectButton.setAttribute("data-bs-toggle", "modal");
        projectButton.setAttribute("data-bs-target", "#myModal");
        projectButton.setAttribute("type", "button")
        let projectCard = document.createElement("div");
        projectCard.className = "project-card";
        let projectName = document.createElement("h3");
        projectName.innerHTML = project.title;
        projectName.classList = "project-title";
        let projectId = document.createElement("p");
        projectId.innerHTML = project.project_id;
        projectId.classList = "project-id";
        projectId.style.display = "none";
        let line = document.createElement("hr");
        let projectDescription = document.createElement("p");
        projectDescription.innerHTML = project.description;
        projectDescription.classList = "project-description";
        let projectTags = document.createElement("p");
        projectTags.classList = "project-tags";
        projectTags.innerHTML = project.tags;
        projectButton.appendChild(projectCard);
        projectCard.appendChild(projectName);
        projectCard.appendChild(projectId);
        projectCard.appendChild(line);
        projectCard.appendChild(projectDescription);
        projectCard.appendChild(projectTags);
        document.getElementById("search-results").appendChild(projectButton);
        
        let noResults = document.createElement("h3");
        noResults.innerHTML = "No results found";
        noResults.classList.add("hide");
        noResults.setAttribute("id", "no-results");
        document.getElementById("search-results").appendChild(noResults);
    }
    console.log("Display Complete");
};
getData();

function search() {
    const search_results = [];
    let input = document.getElementById("searchbar").value;
    console.log(input);
    if (input != "") {
        input = input.toLowerCase();
        let x = Array.from(document.querySelectorAll(".project-button"));
        console.log("x", typeof x, x);
        for (let i = x.length - 1; i >=0; i--) {
            let title = x[i].querySelectorAll(".project-title");
            title = title[0].innerHTML.toLowerCase();
            let description = x[i].querySelectorAll(".project-description");
            description = description[0].innerHTML.toLowerCase();
            if (title.includes(input) || description.includes(input)) {
                search_results.push(x[i]);
                console.log(x[i]);
            }
            else {
                x[i].classList.add("hide");
            }
        }
        if (search_results.length == 0) {
            document.getElementById("no-results").classList.remove("hide");
        }
        else{
            for(let i in search_results){
                search_results[i].classList.remove("hide");
            }
            document.getElementById("no-results").classList.add("hide");

        }
        console.log(search_results);
    } else {
        document.getElementById("no-results").classList.add("hide");
        let x = Array.from(document.querySelectorAll(".project-button"));
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("hide");
        }
    }
}

// Assuming buttonClicked function is modified to accept details as a parameter
function buttonClicked(details) {
    // Function logic here
    console.log(globalResponse);
    var matchingProject;
    for(let i in globalResponse){
        if(globalResponse[i].project_id == details){
            matchingProject = globalResponse[i];
            break;
        }
    }
    console.log(matchingProject)
    document.getElementById("modal-title").innerHTML = matchingProject.title;
    document.getElementById("modal-description").innerHTML = matchingProject.description;
    document.getElementById("project-Status").innerHTML = "Status : "+ matchingProject.status;
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(event) {
        // Check if the clicked element or any of its parents have the class 'project-button'
        let targetElement = event.target;
        do {
            if (targetElement.classList.contains('project-button')) {
                console.log("Button clicked");
                // Extract details from the clicked button
                var details = targetElement.querySelector('.project-id').innerHTML;
                // Call the buttonClicked function with details
                buttonClicked(details);
                return; // Stop the loop once the correct element is found and handled
            }
            // Move up the DOM tree
            targetElement = targetElement.parentNode;
        } while (targetElement !== document.body); // Stop if the body element is reached
    });
});

document.getElementById('searchbar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        search(); // Call your search function
    }
});
