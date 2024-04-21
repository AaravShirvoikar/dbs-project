package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/AaravShirvoikar/dbs-project/backend/models"
)

func GetUserSkills(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("id").(int)
	skills, err := models.GetSkills(userID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(skills)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func GetUserSkillsById(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	userID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid user id", http.StatusBadRequest)
		return
	}

	skills, err := models.GetSkills(userID)
	if err != nil {
		http.Error(w, "Internal server error 1", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(skills)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error 2", http.StatusInternalServerError)
		return
	}
}

func AddSkills(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("id").(int)
	var skills models.UserSkills
	err := json.NewDecoder(r.Body).Decode(&skills)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = models.AddSkills(userID, skills.Skills)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "skills added successfully",
	})
}

func RemoveSkills(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("id").(int)
	var skills models.UserSkills
	err := json.NewDecoder(r.Body).Decode(&skills)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = models.RemoveSkills(userID, skills.Skills)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "skills removed successfully",
	})
}
