//404 error
module.exports = function (req, res, next) {
	res.status(404).send("Nincs ilyen lekérési oldal!")
	next();
};