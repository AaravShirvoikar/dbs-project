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

//TODO: update databae schema to include company, start_date, end_date

func GetExperience(userID int) ([]Experience, error) {
	rows, err := database.Db.Query("SELECT id, title, description FROM experience WHERE user_id = $1", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	experience := make([]Experience, 0)
	for rows.Next() {
		var exp Experience
		err := rows.Scan(&exp.ID, &exp.Title, &exp.Description)
		if err != nil {
			return nil, err
		}
		experience = append(experience, exp)
	}

	return experience, nil
}
