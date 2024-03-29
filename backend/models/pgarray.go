package models

import (
	"database/sql"
	"strings"
)

func ParsePostgresArray(array sql.NullString) []string {
	if !array.Valid {
		return []string{}
	}
	str := array.String
	str = strings.Trim(str, "{}")
	elements := strings.Split(str, ",")
	for i, tag := range elements {
		elements[i] = strings.TrimSpace(tag)
	}
	return elements
}
