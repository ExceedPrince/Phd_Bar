import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminOpeningModify = props => {

	const { id } = useParams();

	console.log(id)
	return (
		<div>
			<Link to="/admin/opening"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			választott nap: {id}
		</div>
	)
}

AdminOpeningModify.propTypes = {

}

export default AdminOpeningModify;
