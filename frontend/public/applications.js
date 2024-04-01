async function fetchData() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    }
    var response;
    try {
        response = await fetch("http://localhost:8080/application/", {
            method: "GET",
            headers: headersList
        });
    } catch (error) {
        console.error("Error fetching data:", error);
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
    let response = await fetchData();
    console.log(response);

    for (let i in response) {
        let application = response[i];
        let applicationCard = document.createElement("div");
        applicationCard.className = "application-card";
        // let applicationUserName = document.createElement("h3");
        // applicationUserName.innerHTML = application.student_id;
        let applicationProjectID = document.createElement("h3");
        applicationProjectID.innerHTML = application.project_id;
        let line = document.createElement("hr");
        let applicationMessage = document.createElement("p");
        applicationMessage.innerHTML = application.message;

        
        
        applicationCard.appendChild(applicationProjectID);
        applicationCard.appendChild(line);
        applicationCard.appendChild(applicationMessage);
        document.getElementById("application-results").appendChild(applicationCard);
    }
    console.log("Display Complete");
};
getData();
