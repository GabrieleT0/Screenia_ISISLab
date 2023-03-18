module.exports = validateLogin = (req, res, next) => {
    const body = {...req.body};

    if(!body.email) return res.status(400).send({
        message: 'The email field is required!'
    });

    if(!body.password) return res.status(400).send({
        message: 'The password field is required!'
    });

    next();
}