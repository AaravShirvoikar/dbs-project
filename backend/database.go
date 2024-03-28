package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var Db *sql.DB

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	connStr := os.Getenv("DB_STRING")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	} else {
		Db = db
	}
}
