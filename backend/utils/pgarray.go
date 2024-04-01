package utils

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
	for i, ele := range elements {
		elements[i] = strings.TrimSpace(ele)
	}
	return elements
}
