import React, { useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { getOpenings } from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

import Map from '../components/map';
import OpeningSection from '../components/openingSection';

const Contact = () => {
	const allData = useSelector(state => state.allData);
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getOpenings())

	}, [])

	console.log(allData)

	return (
		<div id="contactsBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<div className="headers">
				<h2 className="headerTitle">Elérhetőségeink</h2>
			</div>
			<div id="contactsContent">
				<div id="upperhalf">
					<div id="infoPart" class="contactsFlexItems">
						<Fade bottom delay={200} distance="80px">
							<p><i className="fa fa-map-marker"></i> <span>Cím:</span>
								<a href="https://www.google.hu/maps?q=1092+Budapest,+Ráday+u.+3" target="_blank" rel="noopener noreferrer"> 1092 Budapest, Ráday u. 3.</a>
							</p>
							<p><i className="fa fa-phone"></i> <span>Tel.:</span> <a href="tel:+36205762557">06 20/5762557</a></p>
							<p><i className="fa fa-envelope"></i> <span>Email:</span> <a href="mailto:info@phd.hu">info@phd.hu</a></p>
							<p><i className="fa fa-facebook"></i> <span>Facebook:<wbr /></span>
								<a href="https://www.facebook.com/PhDBar/" target="_blank" rel="noopener noreferrer">
									{" "}facebook<wbr />.com/<wbr />PhDBar/
								</a>
							</p>
						</Fade>
					</div>
					<Map />
				</div>
				<div id="downerhalf">
					<OpeningSection allData={allData} />
				</div>
			</div>
		</div>
	)
}

export default Contact;