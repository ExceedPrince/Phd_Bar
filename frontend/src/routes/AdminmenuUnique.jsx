import React from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminmenuUnique = props => {

	const { id } = useParams();

	/* 	if (!isAuthenticated) {
			return <Redirect to='/' />
		} */


	return (
		<div>
			<Link to="/admin/menu"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			{id}
		</div>
	)
};

AdminmenuUnique.propTypes = {

};

export default AdminmenuUnique;
