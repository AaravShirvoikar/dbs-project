if(localStorage.getItem("token") == null){
    location.replace("../index.html");
    alert("You are not logged in. Please login to continue");
}

function logout(){
    localStorage.clear();
    location.replace("../index.html");
}

async function fetchUserType() {
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

async function checkUserType(){
    let response = await fetchUserType();
    return response.type;
}