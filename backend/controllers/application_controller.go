package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/AaravShirvoikar/dbs-project/backend/models"
)

func GetMyApplications(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("id").(int)
	var applications []models.Application
	userType, err := models.CheckType(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if userType == "student" {
		applications, err = models.GetStudentApplications(id)
		if err != nil {
			log.Println(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	} else {
		applications, err = models.GetProfessorApplications(id)
		if err != nil {
			log.Println(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}

	err = json.NewEncoder(w).Encode(applications)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func CreateApplication(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("id").(int)
	userType, err := models.CheckType(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if userType != "student" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var application models.Application
	application.StudentID = id
	application.Status = "pending"
	err = json.NewDecoder(r.Body).Decode(&application)
	if err != nil {
		log.Println(err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	err = application.Create()
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "application created successfully",
	})
}

func ActOnApplication(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("id").(int)
	userType, err := models.CheckType(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if userType != "professor" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var application models.Application
	err = json.NewDecoder(r.Body).Decode(&application)
	if err != nil {
		log.Println(err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	err = models.UpdateStatus(id, application.ApplicationID, application.Status)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "application updated successfully",
	})
}
