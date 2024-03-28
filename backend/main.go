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

	database.InitDB()

	stack := middleware.CreateStack(
		middleware.Logging,
	)

	router.HandleFunc("POST /register", controllers.Register)
	router.HandleFunc("POST /login", controllers.Login)

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	log.Println("Server listening on port :8080")
	server.ListenAndServe()
}
