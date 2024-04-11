package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"

	"github.com/AaravShirvoikar/dbs-project/backend/middleware"
	"github.com/AaravShirvoikar/dbs-project/backend/models"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var newUser models.User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, fmt.Sprintf("error decoding request body: %s", err.Error()), http.StatusBadRequest)
		return
	}

	usernameValidation, _ := regexp.MatchString("[a-zA-Z0-9]{4,}", newUser.UserName)
	if !usernameValidation {
		http.Error(w, "username does not meet requirements", http.StatusInternalServerError)
		return
	}

	emailValidation, _ := regexp.MatchString(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, newUser.Email)
	if !emailValidation {
		http.Error(w, "email does not meet requirements", http.StatusInternalServerError)
		return
	}

	if len(newUser.Password) < 8 {
		http.Error(w, "password does not meet requirements", http.StatusInternalServerError)
		return
	}

	if err := newUser.Insert(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "registration successful",
	})
}

func Login(w http.ResponseWriter, r *http.Request) {
    var user models.User

    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    authenticated, err := user.Authenticate()
    if err != nil || !authenticated {
        http.Error(w, "invalid username or password", http.StatusUnauthorized)
        return
    }

    token, err := middleware.GenerateJWT(user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}

func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("id").(int)
	user, err := models.GetUser(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func UpdateUserDetails(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("id").(int)
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := user.Update(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "user details updated successfully",
	})
}