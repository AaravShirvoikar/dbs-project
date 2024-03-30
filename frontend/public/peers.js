async function fetchData() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    }
    var response;
    try {
        response = await fetch("http://localhost:8080/peers", {
            method: "GET",
            headers: headersList
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    if(response.error == "invalid token"){
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
    let data = JSON.parse(await response.text());
    console.log(data);   
    return data;
}

async function getData() {
    let response = await fetchData();

    console.log(response);

    for (let i in response) {
        let peer = response[i];
        // console.log(peer);
        let peerCard = document.createElement("div");
        peerCard.className = "peer-card";
        let peerUserName = document.createElement("h3");
        // console.log(peer.title);
        peerUserName.innerHTML = peer.username;
        let line = document.createElement("hr");

        let peerName = document.createElement("p");
        peerName.innerHTML = peer.first_name + " " + peer.last_name;
        let peerMail = document.createElement("p");
        peerMail.innerHTML = peer.email;
        peerCard.appendChild(peerUserName);
        peerCard.appendChild(line);
        peerCard.appendChild(peerName);
        peerCard.appendChild(peerMail);
        document.getElementById("peer-results").appendChild(peerCard);
    }
    console.log("Display Complete");
};
getData();
