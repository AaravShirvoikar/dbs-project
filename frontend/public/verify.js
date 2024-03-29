if(localStorage.getItem("token") == null){
    location.replace("../index.html");
    alert("You are not logged in. Please login to continue");
}