require('dotenv').config();

module.exports = function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_PORT);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
};