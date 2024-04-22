async function fetchPeers() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    };

    let response = await fetch("http://localhost:8080/peers", {
        method: "GET",
        headers: headersList
    });

    let data = await response.json(); // Parse the response as JSON
    console.log(data);

    if (data.error === "invalid token format" || data.error === "invalid token") {
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
    return data;
}

var globalResponse;
const peerlist = [];
async function getProjects() {
    globalResponse = await fetchPeers();
    globalResponse.forEach(peer => {
        peerlist.push(peer.username);
    });
}
getProjects();


async function displayData() {
    let response = await fetchPeers(); // Fetch and store peers in response
    console.log(response);

    response.forEach(peer => {
        console.log(peer);
        // Create elements for displaying each peer
        let peerButton = document.createElement("button");
        peerButton.classList.add("peer-button", "btn");
        peerButton.setAttribute("data-bs-toggle", "modal");
        peerButton.setAttribute("data-bs-target", "#myModal");
        peerButton.setAttribute("data-peer-id", peer.id); // Store peer_id in the button

        let peerCard = document.createElement("div");
        peerCard.className = "peer-card";

        let headerdiv = document.createElement("div");
        headerdiv.classList.add("headerdiv");
        let peerUsername = document.createElement("h3");
        peerUsername.innerHTML = peer.username;
        peerUsername.classList.add("peer-username");
        let line = document.createElement("hr");
        let peerName = document.createElement("p");
        peerName.innerHTML = "Name: " + peer.first_name + " " + peer.last_name;
        let peerEmail = document.createElement("p");
        peerEmail.innerHTML = "Email: " + peer.email;

        // Assemble the peer card and append it to the button
        peerButton.appendChild(peerCard);
        headerdiv.appendChild(peerUsername);
        peerCard.appendChild(headerdiv);
        peerCard.appendChild(line);
        peerCard.appendChild(peerName);
        peerCard.appendChild(peerEmail);

        // Append the button to the peer results container
        document.getElementById("peer-results").appendChild(peerButton);

        let noResults = document.createElement("h3");
        noResults.innerHTML = "No results found";
        noResults.classList.add("hide");
        noResults.setAttribute("id", "no-results");
        document.getElementById("peer-results").appendChild(noResults);
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
    // Find the matching peer based on the peer_id passed as 'details'
    matchingPeer = globalResponse.find(peer => peer.id.toString() === details);

    if (!matchingPeer) {
        console.error("No matching peer found.");
        return;
    }
    console.log(matchingPeer);

    // Populate modal with peer details
    // Ensure that the element IDs used here match those in your HTML
    document.getElementById("modal-title").innerHTML = matchingPeer.username || 'No Username Provided';
    
    document.getElementById("modal-id").innerHTML = "Peer ID : " + (matchingPeer.id || 'No ID Provided');
    document.getElementById("modal-peer-name").innerHTML = "Peer Name : " + (matchingPeer.first_name + " " + matchingPeer.last_name || 'No Name Found');
    document.getElementById("modal-peer-email").innerHTML = "Peer Email : " + (matchingPeer.email || 'No Email Found');
    let skills = await fetchSkills(matchingPeer.id);
    if(skills.includes("No Skills Found")){
        skills = "No Skills Found";
    }
    else{
        skills = JSON.parse(skills);
        console.log(typeof skills, skills);
        skills = skills.skills; 
    }
   
    document.getElementById("modal-peer-skills").innerHTML = "Peer Skills : " + (skills|| 'No Skills Found');
    let experiences = await fetchExperiences(matchingPeer.id);
    let expstring = "";
    if(experiences.includes("No Experiences Found")){
        expstring = "No Experiences Found";
    }
    else{
        experiences = JSON.parse(experiences);
        console.log(typeof experiences, experiences);
        
        for(let i=0; i<experiences.length; i++){
            console.log(experiences[i])
            expstring = expstring + experiences[i].title + ", ";
        }
    }

    document.getElementById("modal-peer-experiences").innerHTML = "Peer Experience : " + expstring;

    let projects = await fetchProjects(matchingPeer.id);
    let projectstr = "";
    if(projects.includes("No Projects Found")){
        projectstr = "No Projects Found";
    }
    else{
        projects = JSON.parse(projects);
        console.log(typeof projects, projects);
        
        for(let i=0; i<projects.length; i++){
            console.log(projects[i])
            projectstr = projectstr+ projects[i].title + ",<br /> ";
        }
    }

    document.getElementById("modal-peer-projects").innerHTML = "Peer Projects : " + projectstr;
}



document.addEventListener('DOMContentLoaded', function () {
    displayData(); // Display peers when the document is ready

    document.body.addEventListener('click', function (event) {
        let targetElement = event.target;
        do {
            if (targetElement.classList.contains('peer-button')) {
                const details = targetElement.getAttribute('data-peer-id'); // Retrieve peer_id from the button
                buttonClicked(details);
                return;
            }
            targetElement = targetElement.parentNode;
        } while (targetElement !== document.body);
    });
});


async function fetchSkills(id){
    let headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer "+localStorage.getItem("token"),
       }
       
       let response = await fetch("http://localhost:8080/user/skills/"+id, { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.text();
        if (data.includes("Internal server error 1")) {
        data = "No Skills Found";
    }
    return data;
}

async function fetchExperiences(id){
    let headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer "+localStorage.getItem("token"),
       }
       
       let response = await fetch("http://localhost:8080/user/experience/"+id, { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.text();
       if(data.includes("[]")){
        data = "No Experiences Found";
       }
       console.log(data);
       return data;
}

async function fetchProjects(id){
    let headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer "+localStorage.getItem("token"),
       }
       
       let response = await fetch("http://localhost:8080/projects/"+id, { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.text();
       console.log(data);
       if(data.includes("[]")){
        data = "No Projects Found"
       }
       return data;       

}


function search() {
    const search_results = [];
    let input = document.getElementById("searchbar").value;
    console.log(input);
    if (input != "") {
        input = input.toLowerCase();
        let x = Array.from(document.querySelectorAll(".peer-button"));
        for (let i = x.length - 1; i >= 0; i--) {
            let username = x[i].querySelectorAll(".peer-username");
            username = username[0].innerHTML.toLowerCase();
            if (username.includes(input)) {
                search_results.push(x[i]);
            } else {
                x[i].classList.add("hide");
            }
        }
        if (search_results.length == 0) {
            document.getElementById("no-results").classList.remove("hide");
        } else {
            for (let i in search_results) {
                search_results[i].classList.remove("hide");
            }
            document.getElementById("no-results").classList.add("hide");

        }
    } else {
        document.getElementById("no-results").classList.add("hide");
        let x = Array.from(document.querySelectorAll(".peer-button"));
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("hide");
        }
    }
}

document.getElementById('searchbar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        search();
    }
});