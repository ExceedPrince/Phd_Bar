import React from 'react'
import PropTypes from 'prop-types'

const AdminReservation = props => {

	//GET request egy új /api/admin/reservations endpointról (emailek is rendesen láthatók)
	//legyen idő szerint csökkenő és oldalként 20 látható

	//legyen egy input=text, mellette 2 radiobutton, hogy név vagy email alapján szűrjünk frontenden

	//legyen egy date input is, dátum alapján szűrni

	//a szűrők figyeljék egymást

	//egyen egy gomb, ami visszaállítja az összes létező időpontot

	//újat nem lehet felvenni, de meglévőt lehet törölni módosítani
	//törlés lehetséges itt is egy törlés gombbal
	//módosításhoz is itt van egy gomb, az átvisz egy egyedi id-s oldalra
	//ott PUT request-el lehet módosítást küldeni


	return (
		<div>
			AdminReservation
		</div>
	)
}

AdminReservation.propTypes = {

}

export default AdminReservation;
