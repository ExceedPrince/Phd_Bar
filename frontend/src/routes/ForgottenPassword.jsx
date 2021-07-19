import React, { useState } from 'react';
import Alert from '../components/Alert';
import { askNewPassword } from '../redux/actions'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ForgottenPassword = ({ askNewPassword }) => {
	const [email, setEmail] = useState('');

	const onSubmit = async (e) => {
		e.preventDefault();

		const formData = { email: email };

		await askNewPassword(formData);
		setEmail('');
	}

	return (
		<div className="reset_div" style={{ backgroundImage: `url("/img/slides/bg_01.png")` }}>
			<h1>Új jelszó kérvényezése</h1>
			<form onSubmit={e => onSubmit(e)}>
				<label htmlFor="email">Kérjük, adja meg az Admin email címet!</label><br />
				<input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} /><br /><br />
				<input type="submit" value="Új jelszót kérek" />
			</form>
			<Alert />
		</div>
	)
};

ForgottenPassword.propTypes = {
	askNewPassword: PropTypes.func.isRequired,
};

export default connect(null, { askNewPassword })(ForgottenPassword);

