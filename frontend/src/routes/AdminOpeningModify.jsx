import React, { useState, useEffect } from 'react';
import { adminChangeOpenings } from '../redux/actions/admin';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminOpeningModify = ({ item, index, adminChangeOpenings }) => {
	const [formData, setFormData] = useState({ open: '', close: '' })

	useEffect(() => {
		if (item && item.open && item.close) {
			setFormData({ ...formData, open: item.open[0], close: item.close[0] })
		} else {
			setFormData({ ...formData, open: 0, close: 0 })
		}
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();

		let data = {
			opening: Number(formData.open), closing: Number(formData.close), id: item._id
		}

		await adminChangeOpenings(data);
	};

	return (
		<>
			<form className="admin-listed-opening-item" key={index} onSubmit={e => onSubmit(e)}>
				<span><b>{item.day}</b></span>
				<span>
					Nyitás: <input type="number" name="open" min={0} max={23} value={formData.open} onChange={e => setFormData({ ...formData, open: e.target.value })} required readOnly={item.index === 0} />:00
				</span>
				<span>
					Zárás: <input type="number" name="close" min={0} max={23} value={formData.close} onChange={e => setFormData({ ...formData, close: e.target.value })} required readOnly={item.index === 0} />:00
				</span>
				<span>
					<input type="submit" value="Módosítás" />
				</span>
			</form>
		</>
	)
};

AdminOpeningModify.propTypes = {
	adminChangeOpenings: PropTypes.func.isRequired,
	item: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired
};

export default connect(null, { adminChangeOpenings })(AdminOpeningModify);



