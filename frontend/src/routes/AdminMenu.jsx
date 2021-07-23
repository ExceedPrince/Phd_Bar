import React from 'react'
import PropTypes from 'prop-types'

const AdminMenu = props => {

	//GET request egy ??? endpointról 
	//alapból pizzákkal indítunk, de lehet váltogatni a típusok között
	//ez a váltogatás egy POST request a ??? endpointra, hogy mikor melyiket kérjük le

	//legyen egy input=text, hogy név vagy email alapján szűrjünk frontenden

	//egyen egy gomb, ami visszaállítja az összes létező kínálatot

	//újat lehet felvenni egy örökösen látható üres formról legalul

	//meglévőt lehet törölni módosítani
	//törlés lehetséges itt is egy törlés gombbal
	//módosításhoz is itt van egy gomb, az átvisz egy egyedi id-s oldalra
	//ott PUT request-el lehet módosítást küldeni

	return (
		<div>
			AdminMenu
		</div>
	)
}

AdminMenu.propTypes = {

}

export default AdminMenu;