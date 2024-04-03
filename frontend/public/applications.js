async function fetchProjects() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    };
    try {
        const response = await fetch("http://localhost:8080/application/", {
            method: "GET",
            headers: headersList
        });
        const data = await response.json(); // Directly parsing JSON from the response
        console.log(data);
        if (data.error === "invalid token format" || data.error === "invalid token") {
            alert("Session Expired. Please login again.");
            window.location.href = "./login.html";
        }
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // Return an empty array in case of error
    }
}
// Global variable to store fetched projects
var globalResponse;
async function getProjects(){
    globalResponse = await fetchProjects();
}

// Function to display applications on the page
async function displayData() {
    globalResponse = await fetchProjects(); // Fetch and store projects in globalResponse
    console.log(globalResponse);

    globalResponse.forEach(application => {
        // Create elements for displaying each application
        let applicationButton = document.createElement("button");
        applicationButton.classList.add("application-button", "btn");
        applicationButton.setAttribute("data-bs-toggle", "modal");
        applicationButton.setAttribute("data-bs-target", "#myModal");
        applicationButton.setAttribute("data-project-id", application.project_id); // Store project_id in the button

        let applicationCard = document.createElement("div");
        applicationCard.className = "application-card";
        let applicationUserID = document.createElement("h3");
        applicationUserID.innerHTML = application.student_id;
        let applicationProjectID = document.createElement("h3");
        applicationProjectID.innerHTML = application.project_id;
        let line = document.createElement("hr");
        let applicationMessage = document.createElement("p");
        applicationMessage.innerHTML = application.message;

        // Assemble the application card and append it to the button
        applicationButton.appendChild(applicationCard);
        applicationCard.appendChild(applicationProjectID);
        applicationCard.appendChild(applicationUserID);
        applicationCard.appendChild(line);
        applicationCard.appendChild(applicationMessage);

        // Append the button to the application results container
        document.getElementById("application-results").appendChild(applicationButton);
    });
    console.log("Display Complete");
}

var matchingApplication;
// Function to handle button click and populate modal with application details
function buttonClicked(details) {
    matchingApplication = globalResponse.find(app => app.project_id == details);
    if (!matchingApplication) {
        console.error("No matching application found.");
        return;
    }
    console.log(matchingApplication);
    // Populate modal with application details
    document.getElementById("modal-title").innerHTML = matchingApplication.title || 'No Title Provided';
    document.getElementById("modal-appId").innerHTML = "Application ID : "+ matchingApplication.application_id;
    document.getElementById("modal-id").innerHTML = "Student ID : " + matchingApplication.student_id || 'No ID Provided';
    document.getElementById("modal-message").innerHTML = matchingApplication.message || 'No Message Provided';
}

// Event listener for document ready to display applications and handle button clicks
document.addEventListener('DOMContentLoaded', function() {
    displayData(); // Display applications when the document is ready

    document.body.addEventListener('click', function(event) {
        let targetElement = event.target;
        do {
            if (targetElement.classList.contains('application-button')) {
                const details = targetElement.getAttribute('data-project-id'); // Retrieve project_id from the button
                buttonClicked(details);
                return;
            }
            targetElement = targetElement.parentNode;
        } while (targetElement !== document.body);
    });
});

async function putApplications(status){
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer "+ localStorage.getItem("token")
       }
       let bodyContent = JSON.stringify({
         "application_id": matchingApplication.application_id,
         "status": status
       });
       let response = await fetch("http://localhost:8080/application/act", { 
           method: "POST",
           body: bodyContent,
           headers: headersList
        });
        
        console.log(headersList,bodyContent);
        let data = await response.text();
        console.log(data);
       
       return data;
}

async function accept(){
    var response = await putApplications("accept");
    console.log(response);
}

async function reject(){
    var response = await putApplications("reject");
    console.log(response);
}