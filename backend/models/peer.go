package models

import "github.com/AaravShirvoikar/dbs-project/backend/database"

type Peer struct {
	UserName  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

func GetPeers(id int) ([]Peer, error) {
	userType, err := CheckType(id)
	if err != nil {
		return nil, err
	}

	rows, err := database.Db.Query("SELECT username, email, first_name, last_name FROM users where type = $1 and id != $2", userType, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	peers := []Peer{}
	for rows.Next() {
		var peer Peer
		err := rows.Scan(&peer.UserName, &peer.Email, &peer.FirstName, &peer.LastName)
		if err != nil {
			return nil, err
		}
		peers = append(peers, peer)
	}

	return peers, nil
}
