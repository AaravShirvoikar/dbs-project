package models

import (
	"database/sql"

	"github.com/AaravShirvoikar/dbs-project/backend/database"
	"github.com/AaravShirvoikar/dbs-project/backend/utils"
)

type Project struct {
	ProjectId     int      `json:"project_id"`
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	ProfessorID   int      `json:"professor_id"`
	ProfessorName string   `json:"professor_name"`
	Status        string   `json:"status"`
	Tags          []string `json:"tags"`
}

func GetProjects() ([]Project, error) {
	rows, err := database.Db.Query("SELECT projects.id, title, description, professor_id, username, status, tags FROM projects join users on projects.professor_id = users.id;")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []Project{}
	for rows.Next() {
		var project Project
		var tagsArray sql.NullString
		err := rows.Scan(&project.ProjectId, &project.Title, &project.Description, &project.ProfessorID, &project.ProfessorName, &project.Status, &tagsArray)
		if err != nil {
			return nil, err
		}
		project.Tags = utils.ParsePostgresArray(tagsArray)
		projects = append(projects, project)
	}

	return projects, nil
}

func GetStudentProjects(id int) ([]Project, error) {
	query := "SELECT projects.id, title, description, professor_id, username, status, tags FROM projects JOIN project_members ON projects.id = project_members.project_id JOIN users ON project_members.user_id = users.id WHERE project_members.user_id = $1;"
	rows, err := database.Db.Query(query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []Project{}
	for rows.Next() {
		var project Project
		var tagsArray sql.NullString
		err := rows.Scan(&project.ProjectId, &project.Title, &project.Description, &project.ProfessorID, &project.ProfessorName, &project.Status, &tagsArray)
		if err != nil {
			return nil, err
		}
		project.Tags = utils.ParsePostgresArray(tagsArray)
		projects = append(projects, project)
	}

	return projects, nil
}

func GetProfessorProjects(id int) ([]Project, error) {
	rows, err := database.Db.Query("SELECT * FROM projects WHERE professor_id = $1", id)
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
		project.Tags = utils.ParsePostgresArray(tagsArray)
		projects = append(projects, project)
	}

	return projects, nil
}

func (p *Project) Create() error {
	tagsArray := utils.CreatePostgresArray(p.Tags)
	_, err := database.Db.Exec("INSERT INTO projects (title, description, professor_id, status, tags) VALUES ($1, $2, $3, $4, $5)", p.Title, p.Description, p.ProfessorID, p.Status, tagsArray)
	return err
}

func (p *Project) Update() error {
	tagsArray := utils.CreatePostgresArray(p.Tags)
	_, err := database.Db.Exec("UPDATE projects SET title = $1, description = $2, status = $3, tags = $4 WHERE id = $5", p.Title, p.Description, p.Status, tagsArray, p.ProjectId)
	return err
}
