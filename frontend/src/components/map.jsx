import React from 'react';
import Fade from 'react-reveal/Fade';

const Map = () => {
	return (
		<div id="map" class="contactsFlexItems">
			<Fade bottom delay={200} distance="80px">
				<div style={{ overflow: "hidden", resize: "none", maxWidth: "100%", width: "600px", height: "350px", border: "solid 3px white" }}>
					<div id="mymap-canvas" style={{ height: "100%", width: "100%", maxWidth: "100%" }}>
						<iframe style={{ height: "100%", width: "100%", border: "0" }} frameborder="0" src="https://www.google.com/maps/embed/v1/place?q=1092+Budapest,+Ráday+u.+3&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"></iframe>
					</div>
					<a class="googlemaps-html" href="https://www.embed-map.com" id="authmap-data">https://www.embed-map.com</a>
				</div>
			</Fade>
		</div>
	)
}

export default Map;
