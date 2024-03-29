package models

import (
	"context"
	"fmt"

	"github.com/AaravShirvoikar/dbs-project/backend/database"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	UserID    int    `json:"user_id"`
	UserName  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Type      string `json:"type"`
}

func (u *User) Insert() error {
	var userID int

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(u.Password), 12)
	if err != nil {
		return fmt.Errorf("error generating hashed password: %s", err.Error())
	}

	query := "INSERT INTO users (username, password, email, first_name, last_name, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;"
	err = database.Db.QueryRowContext(context.Background(), query, u.UserName, string(hashedPass), u.Email, u.FirstName, u.LastName, u.Type).Scan(&userID)
	if err != nil {
		return fmt.Errorf("error inserting user into database: %s", err.Error())
	}

	u.UserID = userID
	return nil
}

func (u *User) Authenticate() (bool, error) {
	var passwordHash string
	var id int

	query := "SELECT id, password FROM users WHERE username = $1;"
	err := database.Db.QueryRowContext(context.Background(), query, u.UserName).Scan(&id, &passwordHash)
	if err != nil {
		return false, fmt.Errorf("invalid username or password")
	}

	u.UserID = id

	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(u.Password))
	if err != nil {
		return false, fmt.Errorf("invalid username or password")
	}

	return true, nil
}

func CheckType(userID int) (string, error) {
	var userType string

	query := "SELECT type FROM users WHERE id = $1;"
	err := database.Db.QueryRowContext(context.Background(), query, userID).Scan(&userType)
	if err != nil {
		return "", fmt.Errorf("error getting user type: %s", err.Error())
	}

	return userType, nil
}