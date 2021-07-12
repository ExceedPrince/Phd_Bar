import React from 'react';

import Slideshow from '../components/slider';
import Welcome from '../components/welcome';
import HomeMenu from '../components/homeMenu';
import From from '../components/form';

const Home = () => {

	return (
		<>
			<Slideshow />
			<Welcome />
			<HomeMenu />
			<From />
		</>
	)
}

export default Home;
