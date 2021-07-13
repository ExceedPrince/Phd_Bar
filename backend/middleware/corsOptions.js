require('dotenv').config();

//Can post from frontend
exports.corsOptions = {
	origin: process.env.FRONTEND_PORT,
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};