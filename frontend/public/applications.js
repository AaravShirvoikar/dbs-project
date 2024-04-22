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
async function getProjects() {
    globalResponse = await fetchProjects();
}
getProjects();
// Function to display applications on the page
async function displayData() {
    globalResponse = await fetchProjects(); // Fetch and store projects in globalResponse
    console.log(globalResponse);

    globalResponse.forEach(application => {
        console.log(application);
        // Create elements for displaying each application
        let applicationButton = document.createElement("button");
        applicationButton.classList.add("application-button", "btn");
        applicationButton.setAttribute("data-bs-toggle", "modal");
        applicationButton.setAttribute("data-bs-target", "#myModal");
        applicationButton.setAttribute("data-project-id", application.application_id); // Store project_id in the button

        let applicationCard = document.createElement("div");
        applicationCard.className = "application-card";

        let headerdiv = document.createElement("div");
        headerdiv.classList.add("headerdiv");
        let applicationProjectName = document.createElement("h3");
        applicationProjectName.innerHTML = application.project_name;
        let statusDiv = document.createElement("div");
        statusDiv.classList.add("statusdiv");
        statusDiv.innerHTML = application.status;
        // let applicationStatus = document.createElement("p");
        // applicationStatus.innerHTML = application.status;
        let line = document.createElement("hr");
        let applicationMessage = document.createElement("p");
        applicationMessage.innerHTML = application.message;

        // Assemble the application card and append it to the button
        applicationButton.appendChild(applicationCard);
        headerdiv.appendChild(applicationProjectName);
        // statusDiv.appendChild(applicationStatus);
        headerdiv.appendChild(statusDiv);
        applicationCard.appendChild(headerdiv);
        applicationCard.appendChild(line);
        applicationCard.appendChild(applicationMessage);

        if(application.status == "accepted"){
            statusDiv.style.backgroundColor = "rgb(0, 200, 0, 0.75)";
        }
        else if(application.status == "rejected"){
            statusDiv.style.backgroundColor = "rgb(200, 0, 0, 0.75)";
        }
        else{
            statusDiv.style.backgroundColor = "rgb(200, 200, 0, 0.75)";
        }

        // Append the button to the application results container
        document.getElementById("application-results").appendChild(applicationButton);
    });
    console.log("Display Complete");
}
async function getUserDetails(user_id){
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("token"),
       }
       
       let bodyContent = JSON.stringify({
         user_id : user_id,
       });
       
       let response = await fetch("http://localhost:8080/user/", { 
         method: "GET",
         body: bodyContent,
         headers: headersList
       });
       
       let data = await response.text();
       console.log(data);
}
var matchingApplication;
// Function to handle button click and populate modal with application details
async function buttonClicked(details) {
    // Find the matching application based on the project_id passed as 'details'
    matchingApplication = globalResponse.find(app => app.application_id.toString() === details);

    if (!matchingApplication) {
        console.error("No matching application found.");
        return;
    }
    console.log(matchingApplication);

    // Populate modal with application details
    // Ensure that the element IDs used here match those in your HTML
    document.getElementById("modal-title").innerHTML = matchingApplication.project_name || 'No Title Provided';
    
    document.getElementById("modal-id").innerHTML = "Student ID : " + (matchingApplication.student_id || 'No ID Provided');
    document.getElementById("modal-student-name").innerHTML = "Student Name : " + (matchingApplication.student_name || 'No Name Found');
    document.getElementById("modal-message").innerHTML = matchingApplication.message || 'No Message Provided';

    if (await checkUserType() == "professor") {
        // Dynamically insert application options buttons
        const applicationOptions = document.createElement("div");
        applicationOptions.className = "application-options";
        applicationOptions.style.display = "flex";
        applicationOptions.style.justifyContent = "end";
        applicationOptions.style.gap = "5px";

        const acceptButton = document.createElement("button");
        acceptButton.type = "button";
        acceptButton.className = "btn btn-primary";
        acceptButton.style.backgroundColor = "rgb(251, 171, 126)";
        acceptButton.style.border = "none";
        acceptButton.innerHTML = "Accept";
        acceptButton.onclick = accept;

        const rejectButton = document.createElement("button");
        rejectButton.type = "button";
        rejectButton.className = "btn btn-secondary";
        rejectButton.style.backgroundColor = "rgb(251, 171, 126)";
        rejectButton.style.border = "none";
        rejectButton.innerHTML = "Reject";
        rejectButton.onclick = reject;

        // Check if the application options element already exists
        const modalOptions = document.getElementById("modal-options");
        var temp = modalOptions.childNodes;
        const modalNodes = [];
        console.log("temp", temp)
        temp.forEach(element => {
            console.log(element)
            modalNodes.push(element.innerHTML);
        });
        console.log("nodes", modalNodes)
        console.log(modalOptions.childNodes)
        if (!modalNodes.includes(acceptButton.innerHTML)) {
            // Create the application options element
            // Append the accept and reject buttons to the application options element
            modalOptions.appendChild(acceptButton);
        }
        if (!modalNodes.includes(rejectButton.innerHTML)) {
            modalOptions.appendChild(rejectButton);
        }
        // Append the application options element to the desired element
        document.getElementById("application-results").appendChild(applicationOptions);
    }
}
// Event listener for document ready to display applications and handle button clicks
document.addEventListener('DOMContentLoaded', function () {
    displayData(); // Display applications when the document is ready

    document.body.addEventListener('click', function (event) {
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

async function putApplications(status) {
    console.log(matchingApplication);
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
    console.log(matchingApplication.application_id)
    let bodyContent = JSON.stringify({
        "application_id": matchingApplication.application_id,
        "status": status
    });

    let response = await fetch("http://localhost:8080/application/act", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    });

    let data = await response.text();
    console.log(data);
}

async function accept() {
    var response = await putApplications("accepted");
    console.log(response);
}

async function reject() {
    var response = await putApplications("rejected");
    console.log(response);
}




