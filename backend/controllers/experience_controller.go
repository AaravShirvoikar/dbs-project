package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

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

func GetUserExperienceById(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	userID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

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
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "experience added successfully",
	})
}

func RemoveExperience(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("id").(int)
	var experience models.Experience
	err := json.NewDecoder(r.Body).Decode(&experience)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	err = models.RemoveExperience(userID, experience.ID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "experience deleted successfully",
	})
}
