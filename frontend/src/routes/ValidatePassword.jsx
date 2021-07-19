import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Alert from '../components/Alert';
import { validateNewPassword } from '../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const useQuery = () => new URLSearchParams(useLocation().search)

const ValidatePassword = ({ validateNewPassword }) => {
	const [formData, setFormData] = useState({ email: '', password: '', code: '' });

	let { email, password, code } = formData;
	let history = useHistory();
	const query = useQuery();
	const time = query.get('time');

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();

		let formData = {
			email: email, password: password, code: code, time: time
		}

		await validateNewPassword(formData, history);
		setFormData({ ...formData, email: '', password: '', code: '' });
	};

	console.log(time)

	return (
		<div className="verify" style={{ backgroundImage: `url("/img/slides/bg_01.png")` }}>
			<h1>Foglalás megerősítése</h1>
			<form onSubmit={e => onSubmit(e)}>
				<label htmlFor="email">Email cím:</label><br />
				<input type="email" name="email" value={email} onChange={e => onChange(e)} required /><br /><br />
				<label htmlFor="password">Új jelszó:</label><br />
				<input type="password" name="password" value={password} onChange={e => onChange(e)} required /><br /><br />
				<label htmlFor="code">Megerősítő kód:</label><br />
				<input type="text" name="code" value={code} onChange={e => onChange(e)} required /><br /><br />
				<input type="submit" value="Megerősítem" />
			</form>
			<Alert />
		</div>
	)
}

ValidatePassword.propTypes = {
	validateNewPassword: PropTypes.func.isRequired,
};

export default connect(null, { validateNewPassword })(ValidatePassword);


