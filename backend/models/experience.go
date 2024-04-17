package models

import "github.com/AaravShirvoikar/dbs-project/backend/database"

type Experience struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Company     string `json:"company"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	Description string `json:"description"`
}

func GetExperience(userID int) ([]Experience, error) {
	rows, err := database.Db.Query("SELECT id, title, company, description, start_date, end_date FROM experience WHERE user_id = $1", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	experience := make([]Experience, 0)
	for rows.Next() {
		var exp Experience
		err := rows.Scan(&exp.ID, &exp.Title, &exp.Company, &exp.Description, &exp.StartDate, &exp.EndDate)
		if err != nil {
			return nil, err
		}
		experience = append(experience, exp)
	}

	return experience, nil
}

func AddExperience(userID int, experience Experience) error {
	_, err := database.Db.Exec("INSERT INTO experience (user_id, title, company, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)", userID, experience.Title, experience.Company, experience.Description, experience.StartDate, experience.EndDate)
	if err != nil {
		return err
	}

	return nil
}
