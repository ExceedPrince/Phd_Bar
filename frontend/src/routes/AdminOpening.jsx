import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getOpenings } from '../redux/actions';
import AdminOpeningModify from './AdminOpeningModify';
import Alert from '../components/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminOpening = ({ isAuthenticated, allData, getOpenings }) => {

	useEffect(() => {
		getOpenings()
	}, [getOpenings]);

	//PUT request egy új /api/admin/openings endpointra
	//szigorúan csak egyeséve llehet módosítani a napokok

	//vasárnap mindenképp maradjon tiltva

	//ha közben másik nap is zárva lesz, akkor a kalkulátort is át kell kódolni

	if (!isAuthenticated) {
		return <Redirect to='/' />
	}

	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<Link to="/admin/"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			<h1>Nyitvatartási idők módosítása</h1>
			<div id="admin-listed-openings">
				<Alert />
				{allData.openings &&
					allData.openings.map((item, index) => (
						<>
							<AdminOpeningModify item={item} index={index} />
							<hr />
						</>
					))
				}
			</div>
		</div>
	)
}

AdminOpening.propTypes = {
	isAuthenticated: PropTypes.bool,
	getOpenings: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	allData: state.allData,
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { getOpenings })(AdminOpening);