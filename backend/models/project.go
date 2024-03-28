package models

import (
	"database/sql"
	"strings"

	"github.com/AaravShirvoikar/dbs-project/backend/database"
)

type Project struct {
	ProjectId   int      `json:"project_id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	ProfessorID int      `json:"professor_id"`
	Status      string   `json:"status"`
	Tags        []string `json:"tags"`
}

func GetProjects() ([]Project, error) {
	rows, err := database.Db.Query("SELECT * FROM projects")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []Project{}
	for rows.Next() {
		var project Project
		var tagsArray sql.NullString
		err := rows.Scan(&project.ProjectId, &project.Title, &project.Description, &project.ProfessorID, &project.Status, &tagsArray)
		if err != nil {
			return nil, err
		}
		project.Tags = ParsePostgresArray(tagsArray)
		projects = append(projects, project)
	}

	return projects, nil
}

func ParsePostgresArray(tagsArray sql.NullString) []string {
	if !tagsArray.Valid {
		return []string{}
	}
	tagsStr := tagsArray.String
	tagsStr = strings.Trim(tagsStr, "{}")
	tags := strings.Split(tagsStr, ",")
	for i, tag := range tags {
		tags[i] = strings.TrimSpace(tag)
	}
	return tags
}
