import React from 'react';

const Modal = ({ itemData, type, close }) => {


	return (
		<div id="myModal" className="modal" style={{ display: "flex" }}>
			<div className="modal-content">
				<div className="inner">
					<span id="closeBtn" className="close cursor" onClick={close(false)}>X</span>
					{itemData.name ?
						<div className="innerContent">
							<p id="ModalGluten" className="ModalText">{itemData.glutenfree ? "Gluténmentes" : null}</p>
							<img id="modalPic" src={`/img/${type}/${itemData.pic}.png`} />
							<p id="modalName" className="ModalText">{itemData.name}</p>
							<p id="modalPrice" className="ModalText">{itemData.price}{type === "drinks" ? " Ft/dl" : " Ft"}</p>
							{type !== "drinks" ?
								<div>
									<p id="modalIngr" className="ModalText"><u>Összetevők:</u>  {itemData.ingredients.join(", ")}</p>
									<p id="modalAller" className="ModalText"><u>Allergének:</u> {itemData.allergens.join(", ")}</p>
								</div>
								: null
							}
						</div>
						: null
					}
				</div>
			</div>
		</div>
	)
}

export default Modal;
