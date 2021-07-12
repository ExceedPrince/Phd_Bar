import React from 'react';
import Slider from 'react-slick';
import Fade from 'react-reveal/Fade';

const Slideshow = () => {

	const settings = {
		arrows: false,
		dots: false,
		infinite: true,
		speed: 500,
		pauseOnHover: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000
	}

	const sliderPics = ["cover_01.png", "cover_02.png", "cover_03.png", "cover_04.png"]

	return (
		<>
			<div id="slide-container">
				<Fade bottom distance="80px">
					<div id="slide-content">
						<img src="/img/slides/logo.png" alt="logo" />
						<h2>Nem csak diplomásoknak! <br />De ha bemutatod doktori okleveledet, <br />20%-ot<br />elengedünk a rendelésed árából!</h2>
					</div>
				</Fade>
				<Slider {...settings}>
					{sliderPics.map((item, index) => (
						<div key={index}>
							<div className="item_slider" style={{ backgroundImage: `url(/img/slides/${item})` }}>
							</div>
						</div>
					))
					}
				</Slider>
			</div>
			<div id="homeHeader">
				<p>
					Pizzas - Hamburgers - Drinks
				</p>
			</div>
		</>
	)
}

export default Slideshow;
