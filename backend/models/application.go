package models

import (
	"github.com/AaravShirvoikar/dbs-project/backend/database"
)

type Application struct {
	ApplicationID int    `json:"application_id"`
	StudentID     int    `json:"student_id"`
	ProjectID     int    `json:"project_id"`
	Message       string `json:"message"`
	Status        string `json:"status"`
}

func (a *Application) Create() error {
	_, err := database.Db.Exec("INSERT INTO applications (student_id, project_id, message, status) VALUES ($1, $2, $3, $4)", a.StudentID, a.ProjectID, a.Message, a.Status)
	return err
}

func GetStudentApplications(id int) ([]Application, error) {
	query := "SELECT project_id, id, message, status FROM applications WHERE student_id = $1"
	rows, err := database.Db.Query(query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	applications := []Application{}
	for rows.Next() {
		var application Application
		err := rows.Scan(&application.ProjectID, &application.ApplicationID, &application.Message, &application.Status)
		if err != nil {
			return nil, err
		}
		applications = append(applications, application)
	}

	return applications, nil
}

func GetProfessorApplications(id int) ([]Application, error) {
	rows, err := database.Db.Query("SELECT applications.project_id, applications.id, message, applications.status, applications.student_id FROM applications JOIN projects ON applications.project_id = projects.id WHERE projects.professor_id = $1", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	applications := []Application{}
	for rows.Next() {
		var application Application
		err := rows.Scan(&application.ProjectID, &application.ApplicationID, &application.Message, &application.Status, &application.StudentID)
		if err != nil {
			return nil, err
		}
		applications = append(applications, application)
	}

	return applications, nil
}

func CheckOwnerOfProject(applicationid int, userid int) (bool, error) {
	var projectid int
	err := database.Db.QueryRow("SELECT project_id FROM applications WHERE id = $1", applicationid).Scan(&projectid)
	if err != nil {
		return false, err
	}

	var professorid int
	err = database.Db.QueryRow("SELECT professor_id FROM projects WHERE id = $1", projectid).Scan(&professorid)
	if err != nil {
		return false, err
	}

	return professorid == userid, nil
}

func UpdateStatus(id int, appid int, status string) error {
	_, err := database.Db.Exec("UPDATE applications SET status = $1 WHERE id = $2", status, appid)

	if status == "accepted" {
		_, err = database.Db.Exec("INSERT INTO project_members (project_id, user_id) SELECT project_id, student_id FROM applications WHERE id = $1", appid)
	}

	return err
}
