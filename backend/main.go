package main

import (
	"context"
	"log"
	"net/http"

	"github.com/AaravShirvoikar/dbs-project/backend/middleware"
)

func main() {
	router := http.NewServeMux()

	InitDB()

	stack := middleware.CreateStack(
		middleware.Logging,
	)

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var username string
		query := "SELECT username FROM users where username = 'user2'"
		err := Db.QueryRowContext(context.Background(), query).Scan(&username)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Write([]byte(username))
	})

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	log.Println("Server listening on port :8080")
	server.ListenAndServe()
}
