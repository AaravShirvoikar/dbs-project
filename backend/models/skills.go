package models

import (
	"database/sql"

	"github.com/AaravShirvoikar/dbs-project/backend/database"
	"github.com/AaravShirvoikar/dbs-project/backend/utils"
)

type UserSkills struct {
	UserID int      `json:"user_id"`
	Skills []string `json:"skills"`
}

func GetSkills(userID int) (UserSkills, error) {
	var skills UserSkills
	var skillsArray sql.NullString
	err := database.Db.QueryRow("SELECT * FROM user_skills WHERE user_id = $1", userID).Scan(&skills.UserID, &skillsArray)
	if err != nil {
		return skills, err
	}

	skills.Skills = utils.ParsePostgresArray(skillsArray)
	return skills, nil
}

func AddSkills(userID int, skills []string) error {
	skillsArray := utils.CreatePostgresArray(skills)
	_, err := database.Db.Exec("INSERT INTO user_skills (user_id, skills) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET skills = $2", userID, skillsArray)
	return err
}

func RemoveSkills(userID int, skills []string) error {
	skillsArray := utils.CreatePostgresArray(skills)
	_, err := database.Db.Exec("UPDATE user_skills SET skills = array_remove(skills, unnest($2)) WHERE user_id = $1", userID, skillsArray)
	return err
}
