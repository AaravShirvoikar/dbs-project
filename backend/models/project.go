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
	StartDate     string   `json:"start_date"`
	Duration      string   `json:"duration"`
	MinReqs       []string `json:"min_reqs"`
	Status        string   `json:"status"`
	Tags          []string `json:"tags"`
}

func GetProjects() ([]Project, error) {
	rows, err := database.Db.Query("SELECT projects.id, title, description, username, start_date, duration, min_reqs, status, tags FROM projects join users on projects.professor_id = users.id;")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []Project{}
	for rows.Next() {
		var project Project
		var tagsArray sql.NullString
		var reqsArray sql.NullString
		err := rows.Scan(&project.ProjectId, &project.Title, &project.Description, &project.ProfessorName, &project.StartDate, &project.Duration, &reqsArray, &project.Status, &tagsArray)
		if err != nil {
			return nil, err
		}
		project.MinReqs = utils.ParsePostgresArray(reqsArray)
		project.Tags = utils.ParsePostgresArray(tagsArray)
		projects = append(projects, project)
	}

	return projects, nil
}

func GetStudentProjects(id int) ([]Project, error) {
	query := "SELECT projects.id, title, description, username, start_date, duration, status, tags FROM projects JOIN project_members ON projects.id = project_members.project_id JOIN users ON project_members.user_id = users.id WHERE project_members.user_id = $1;"
	rows, err := database.Db.Query(query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []Project{}
	for rows.Next() {
		var project Project
		var tagsArray sql.NullString
		err := rows.Scan(&project.ProjectId, &project.Title, &project.Description, &project.ProfessorName, &project.StartDate, &project.Duration, &project.Status, &tagsArray)
		if err != nil {
			return nil, err
		}
		project.Tags = utils.ParsePostgresArray(tagsArray)
		projects = append(projects, project)
	}

	return projects, nil
}

func GetProfessorProjects(id int) ([]Project, error) {
	rows, err := database.Db.Query("SELECT id, title, description, start_date, duration, min_reqs, status, tags FROM projects WHERE professor_id = $1", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []Project{}
	for rows.Next() {
		var project Project
		var tagsArray sql.NullString
		var reqsArray sql.NullString
		err := rows.Scan(&project.ProjectId, &project.Title, &project.Description, &project.StartDate, &project.Duration, &reqsArray, &project.Status, &tagsArray)
		if err != nil {
			return nil, err
		}
		project.Tags = utils.ParsePostgresArray(tagsArray)
		project.MinReqs = utils.ParsePostgresArray(reqsArray)
		projects = append(projects, project)
	}

	return projects, nil
}

func (p *Project) Create() error {
	tagsArray := utils.CreatePostgresArray(p.Tags)
	reqsArray := utils.CreatePostgresArray(p.MinReqs)
	_, err := database.Db.Exec("INSERT INTO projects (title, description, professor_id, status, tags, start_date, duration, min_reqs) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", p.Title, p.Description, p.ProfessorID, p.Status, tagsArray, p.StartDate, p.Duration, reqsArray)
	return err
}

// Update this for new schema
func (p *Project) Update() error {
	tagsArray := utils.CreatePostgresArray(p.Tags)
	_, err := database.Db.Exec("UPDATE projects SET title = $1, description = $2, status = $3, tags = $4 WHERE id = $5", p.Title, p.Description, p.Status, tagsArray, p.ProjectId)
	return err
}
