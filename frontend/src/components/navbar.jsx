import React, { useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import Fade from 'react-reveal/Fade';
import Alert from './Alert'
import { login } from '../redux/actions/index';
import { logout } from '../redux/actions/index';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Navbar = ({ login, isAuthenticated, logout, history }) => {
	const [clicked, setClicked] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({ email: '', password: '' });

	const { email, password } = formData;

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	function clickEvent() {
		document.querySelector("body").classList.toggle("clicked");
		setClicked(!clicked);
		console.log(document.querySelector("body").classList.contains("clicked"));
	}

	async function openForm() {
		await clickEvent();

		if (document.getElementById("formOpenBtn") !== null) {
			const link = document.getElementById('formOpenBtn');
			link.click();
		}
	}

	const onSubmit = async (e) => {
		e.preventDefault();
		login(email, password, history, clickEvent);
		setFormData({ ...formData, email: '', password: '' })
	}

	return (
		<>
			<div id="open" onClick={() => { clickEvent(); setShowForm(false); setFormData({ ...formData, email: '', password: '' }) }}>
				<svg viewBox="0 0 40 40">
					<rect className="a" x="0" y="0" width="20" height="2"></rect>
					<rect className="b" x="0" y="0" width="20" height="2"></rect>
					<rect className="c" x="0" y="0" width="20" height="2"></rect>
				</svg>
			</div>
			<nav id="nav">
				<Fade right when={clicked} delay={200}>
					{!showForm && (isAuthenticated === true || isAuthenticated === false) ? (
						<ul>
							<Link to="/#" exact ><li onClick={clickEvent}>Főoldal</li></Link>
							<Link to="/menu/#" exact ><li onClick={clickEvent}>Kínálataink</li></Link>
							<Link to="/#form_container" exact ><li onClick={openForm}>Asztalfoglalás</li></Link>
							<Link to="/reservations/#" exact ><li onClick={clickEvent}>Aktuális Foglalások</li></Link>
							<Link to="/contacts/#" exact ><li onClick={clickEvent}>Elérhetőségeink</li></Link>
							{isAuthenticated ? (
								<>
									<Link to="/admin/#" exact ><li onClick={clickEvent}>Admin Felület</li></Link>
									<Link to="/#" exact ><li onClick={() => { logout(); setShowForm(!showForm); setFormData({ ...formData, email: '', password: '' }) }}>
										<i className="fa fa-sign-out"></i>{' '}Kijelentkezés
									</li></Link>
								</>
							) : (
								<li id="login_icon" onClick={() => setShowForm(!showForm)}><i className="fa fa-sign-in"></i></li>
							)}
						</ul>
					) : (showForm && !isAuthenticated) &&
					(<div id="formItems">
						<h1 id="admin-title">Admin belépés</h1>
						<form className="login-form" onSubmit={e => onSubmit(e)}>
							<label htmlFor="email">Email: </label> <br />
							<input type="email" name="email" placeholder="admin@email.com" value={email} onChange={e => onChange(e)} /><br />
							<label htmlFor="password">Jelszó: </label><br />
							<input type="password" name="password" placeholder="Jelszó" value={password} onChange={e => onChange(e)} /><br />
							<Link to="/reset-password" exact ><span onClick={clickEvent}>Elfelejtettem a jelszavam</span></Link><br /><br />
							<div>
								<input type="submit" value="Belépés" />
								<button onClick={() => { setShowForm(!showForm); setFormData({ ...formData, email: '', password: '' }) }}>Visszalépek</button>
							</div>
						</form>
					</div>
					)
					}
				</Fade>
				<div id="forAlert">
					<Alert />
				</div>
			</nav>
		</>
	)
};

Navbar.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	logout: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login, logout })(withRouter(Navbar));
