import React from 'react';
import Fade from 'react-reveal/Fade';

const Welcome = () => {
	return (
		<>
			<div id="welcomeParallax" style={{ backgroundImage: `url("/img/slides/bg_01.png")` }}>
				<h2>Légy vendégünk a PhD Bárban!</h2>
				<p>
					<Fade bottom distance="50px">
						Mai felgyorsult világunkban sokszor nem jut elég idő megfelelő étkezésre. Ezért nyitottuk meg szerény kis bárunkat, hogy azok,
						akik folytonos rohanásban vannak, és csak néhány percük van bekapni valamit, hozzánk bátran betérhetnek! <br /><br />
						Nálunk mindig vannak készen sütött pizzák, a hamburger 1 perc alatt elkészül, s italválasztékunk is széles skálán mozog. <br /><br />
						A rendelésedet kérheted elvitelre, vagy helyben is fogyaszthatod, ha pedig nem sietsz sehová és szerint békés, meghitt hangulatban
						enni-inni (akár társaságban), akkor foglalj nálunk asztalt, még ma! <br /><br />
						Ha pedig rendeléskor felmutatod PhD végzettséged papírját,<br />
						<Fade bottom distance="50px">
							<span>20%-ot</span><br />
						</Fade>
						elengedünk az árból!<br /><br />
						<p>Látogass el hozzánk és légy a vendégünk egy körre!</p>
					</Fade>
				</p>
			</div>
		</>
	)
}

export default Welcome;
