function projectDisplay() {
    window.location.href = "./project.html";
    let projectTitle = document.getElementById("title");
    projectTitle.innerHTML = project.title;
    let projectDescription = document.createElement("p");
    projectDescription.innerHTML = project.description;
    let projectTags = document.createElement("p");
    projectTags.innerHTML = project.tags;

}