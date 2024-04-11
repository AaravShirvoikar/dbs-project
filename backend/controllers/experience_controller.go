package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/AaravShirvoikar/dbs-project/backend/models"
)

func GetUserExperience(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("id").(int)
	experience, err := models.GetExperience(userID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(experience)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error 1", http.StatusInternalServerError)
		return
	}
}

func AddExperience(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("id").(int)
	var experience models.Experience
	err := json.NewDecoder(r.Body).Decode(&experience)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	err = models.AddExperience(userID, experience)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
