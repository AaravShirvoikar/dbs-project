function submitForm(event) {
    event.preventDefault();
    getData();
}

function getData(username, password){
    if(username == undefined || password == undefined){
        username = document.getElementById("floatingInput").value;
        password = document.getElementById("floatingPassword").value;
        console.log(username, password);
    }
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let bodyContent = JSON.stringify({
         "username": username,
         "password": password,
        }
       );
       
    const fetchData = async () => {
        try {
            let response = await fetch("http://localhost:8080/login", {
                method: "POST",
                body: bodyContent,
                headers: headersList
            });

            let data = await response.text();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    (async () => {
        let data = await fetchData();
        let token = data.toString();
        console.log(typeof token);
        console.log("token is : "+token);
        let json = JSON.parse(token);
        console.log(json.token);
        localStorage.setItem("token",json.token);
        localStorage.setItem("username",username);
        location.replace("./dashboard.html");
    })();
}

function print(){
    console.log("Hello");
}