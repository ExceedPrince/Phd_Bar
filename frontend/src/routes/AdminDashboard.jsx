import React from 'react';
import Fade from 'react-reveal/Fade';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AdminDashboard = ({ isAuthenticated }) => {

	if (!isAuthenticated) {
		return <Redirect to='/' />
	}

	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<h1>Admin felület</h1>
			<h2>Opciók:</h2>
			<ul>
				<Fade bottom distance="80px">
					<Link to="/admin/reservation" ><li>Asztalfoglalások módosítása</li></Link>
					<Link to="/admin/menu" ><li>Menükínálat módosítása</li></Link>
					<Link to="/admin/opening" >	<li>Nyitvatartási idők módosítása</li></Link>
				</Fade>
			</ul>
		</div>
	)
}

AdminDashboard.propTypes = {
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(AdminDashboard);
