import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
	if (allData.openings) {
		console.log(allData.openings[0].open[0])
	}
	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<Link to="/admin/"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			<h1>Nyitvatartási idők módosítása</h1>
			<div id="admin-listed-openings">
				{allData.openings &&
					allData.openings.map((item, index) => (
						<>
							<div className="admin-listed-opening-item" key={index}>
								<span>{item.day}</span>
								<span>
									{item.open !== null && String(item.open[0]).length === 1 ? "Nyitás: 0" + item.open.join(":") + "0"
										: item.open !== null && String(item.open[0]).length === 2 ? "Nyitás: " + item.open.join(":") + "0"
											: "Nyitás: -"}
								</span>
								<span>
									{item.open !== null && String(item.open[0]).length === 1 ? "Zárás: " + item.close.join(":") + "0"
										: item.open !== null && String(item.open[0]).length === 2 ? "Zárás: " + item.close.join(":") + "0"
											: "Zárás: -"}
								</span>
								<span>
									<Link key={index} to={`/admin/opening/${item._id}`}>
										<button>Módosítás</button>
									</Link>
								</span>
							</div>
							<hr />
						</>
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