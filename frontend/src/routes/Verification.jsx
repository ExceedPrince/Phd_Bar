import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Alert from '../components/Alert';
import { reservValidate } from '../redux/actions'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const useQuery = () => new URLSearchParams(useLocation().search)

const Verification = ({ reservValidate }) => {
	const [formData, setFormData] = useState({ email: '', validation: '' });

	let { email, validation } = formData;
	let history = useHistory();
	const query = useQuery();
	const reservDate = query.get('date');

	useEffect(() => {
		setFormData({ ...formData, email: query.get('user') })
	}, [])

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();

		let formData = {
			email: email, validation: validation, reservDate: reservDate, date: new Date()
		}

		await reservValidate(formData, history);
	};

	return (
		<div className="verify" style={{ backgroundImage: `url("/img/slides/bg_01.png")` }}>
			<h1>Foglalás megerősítése</h1>
			<form onSubmit={e => onSubmit(e)}>
				<label htmlFor="email">Email cím:</label><br />
				<input type="email" name="email" value={email} onChange={e => onChange(e)} /><br /><br />
				<label htmlFor="validation">Megerősítő kód:</label><br />
				<input type="text" name="validation" value={validation} onChange={e => onChange(e)} required /><br /><br />
				<input type="submit" value="Megerősítem" />
			</form>
			<Alert />
		</div>
	)
};

Verification.propTypes = {
	reservValidate: PropTypes.func.isRequired,
};

export default connect(null, { reservValidate })(Verification);
