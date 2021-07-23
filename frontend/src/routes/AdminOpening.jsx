import React from 'react'
import PropTypes from 'prop-types'

const AdminOpening = props => {

	//GET request a meglévő /api/openings endpointról

	//PUT request egy új /api/admin/openings endpointra
	//szigorúan csak egyeséve llehet módosítani a napokok

	//vasárnap mindenképp maradjon tiltva

	//ha közben másik nap is zárva lesz, akkor a kalkulátort is át kell kódolni

	return (
		<div>
			AdminOpening
		</div>
	)
}

AdminOpening.propTypes = {

}

export default AdminOpening;