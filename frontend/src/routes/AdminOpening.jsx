import React, { useState, useEffect } from 'react';
import { getOpenings } from '../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminOpening = ({ allData, getOpenings }) => {

	useEffect(() => {
		getOpenings()
	}, [getOpenings]);

	//PUT request egy új /api/admin/openings endpointra
	//szigorúan csak egyeséve llehet módosítani a napokok

	//vasárnap mindenképp maradjon tiltva

	//ha közben másik nap is zárva lesz, akkor a kalkulátort is át kell kódolni

	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<h1>Nyitvatartási idők módosítása</h1>
			<div id="admin-listed-openings">
				{allData.openings &&
					allData.openings.map((item, index) => (
						<div className="admin-listed-opening-item" style={{ color: "white" }} key={index}>
							{JSON.stringify(item)}
						</div>
					))
				}
			</div>
		</div>
	)
}

AdminOpening.propTypes = {
	getOpenings: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	allData: state.allData
})

export default connect(mapStateToProps, { getOpenings })(AdminOpening);