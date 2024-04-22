package main

import (
	"log"
	"net/http"

	"github.com/AaravShirvoikar/dbs-project/backend/controllers"
	"github.com/AaravShirvoikar/dbs-project/backend/database"
	"github.com/AaravShirvoikar/dbs-project/backend/middleware"
)

func main() {
	router := http.NewServeMux()

	database.Connect()

	stack := middleware.CreateStack(
		middleware.Logging,
		middleware.Cors,
	)

	router.HandleFunc("POST /register", controllers.Register)
	router.HandleFunc("POST /login", controllers.Login)

	subrouter := http.NewServeMux()
	subrouter.HandleFunc("GET /user/", controllers.GetUserDetails)
	subrouter.HandleFunc("POST /user/update", controllers.UpdateUserDetails)

	subrouter.HandleFunc("GET /user/skills/", controllers.GetUserSkills)
	subrouter.HandleFunc("GET /user/skills/{id}", controllers.GetUserSkillsById)
	subrouter.HandleFunc("POST /user/skills/add", controllers.AddSkills)
	subrouter.HandleFunc("POST /user/skills/remove", controllers.RemoveSkills)
	
	subrouter.HandleFunc("GET /user/experience/", controllers.GetUserExperience)
	subrouter.HandleFunc("GET /user/experience/{id}", controllers.GetUserExperienceById)
	subrouter.HandleFunc("POST /user/experience/add", controllers.AddExperience)

	subrouter.HandleFunc("GET /projects/", controllers.GetMyProjects)
	subrouter.HandleFunc("GET /projects/{id}", controllers.GetProjectById)
	subrouter.HandleFunc("GET /projects/all", controllers.GetAllProjects)
	subrouter.HandleFunc("POST /projects/create", controllers.CreateProject)
	subrouter.HandleFunc("POST /projects/update", controllers.UpdateProject)

	subrouter.HandleFunc("GET /application/", controllers.GetMyApplications)
	subrouter.HandleFunc("POST /application/apply", controllers.CreateApplication)
	subrouter.HandleFunc("POST /application/act", controllers.ActOnApplication)

	subrouter.HandleFunc("GET /peers", controllers.GetPeers)

	router.Handle("/", middleware.AuthenticateToken(subrouter))

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	log.Println("Server listening on port :8080")
	server.ListenAndServe()
}
