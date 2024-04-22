package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/AaravShirvoikar/dbs-project/backend/models"
)

func GetAllProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := models.GetProjects()
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(projects)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func GetMyProjects(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("id").(int)
	var projects []models.Project
	userType, err := models.CheckType(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if userType == "student" {
		projects, err = models.GetStudentProjects(id)
		if err != nil {
			log.Println(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	} else {
		projects, err = models.GetProfessorProjects(id)
		if err != nil {
			log.Println(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}

	err = json.NewEncoder(w).Encode(projects)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func GetProjectById(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	userID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	var projects []models.Project
	userType, err := models.CheckType(userID)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if userType == "student" {
		projects, err = models.GetStudentProjects(userID)
		if err != nil {
			log.Println(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	} else {
		projects, err = models.GetProfessorProjects(userID)
		if err != nil {
			log.Println(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}

	err = json.NewEncoder(w).Encode(projects)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func CreateProject(w http.ResponseWriter, r *http.Request) {
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

	var project models.Project
	err = json.NewDecoder(r.Body).Decode(&project)
	project.ProfessorID = id
	if err != nil {
		log.Println(err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	err = project.Create()
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "project created successfully",
	})
}

func UpdateProject(w http.ResponseWriter, r *http.Request) {
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

	var project models.Project
	err = json.NewDecoder(r.Body).Decode(&project)
	if err != nil {
		log.Println(err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	err = project.Update()
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "project updated successfully",
	})
}
