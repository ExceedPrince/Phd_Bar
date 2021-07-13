//404 error
module.exports = function (req, res, next) {
	res.status(404).send("No such page can be found")
	next();
};