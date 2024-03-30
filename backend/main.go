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
	subrouter.HandleFunc("GET /user/", controllers.GetUser)

	subrouter.HandleFunc("GET /projects/", controllers.GetMyProjects)
	subrouter.HandleFunc("GET /projects/all", controllers.GetAllProjects)
	subrouter.HandleFunc("POST /projects/create", controllers.CreateProject)

	subrouter.HandleFunc("GET /peers/", controllers.GetPeers)

	router.Handle("/", middleware.AuthenticateToken(subrouter))

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	log.Println("Server listening on port :8080")
	server.ListenAndServe()
}
