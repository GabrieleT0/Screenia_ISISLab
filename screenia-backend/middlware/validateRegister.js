const validatorEmail = require("node-email-validation");

module.exports = validateRegister = (req, res, next) => {
    const body = {...req.body};

    if(!body) return res.status(400).send({
        message: 'Please enter the required fields!'
    });

    if(!body.email) return res.status(400).send({
        message: 'The email field is required!'
    });

    if(!body.name) return res.status(400).send({
        message: 'The name field is required!'
    });

    if(!body.surname) return res.status(400).send({
        message: 'The surname field is required!'
    });

    if(!body.password) return res.status(400).send({
        message: 'The password field is required!'
    });

    if (
        !req.body.password_repeat ||
        req.body.password != req.body.password_repeat
      ) {
        return res.status(400).send({
          message: 'Both passwords must match'
        });
    }

    if(!validatorEmail.is_email_valid(body.email)) {
        return res.status(400).send({
            message: 'The email address is invalid!'
        });
    }

    if(body.name.trim().length < 3) return res.status(400).send({
        message: 'Please enter a name with min. 3 chars!'
    });

    if(body.surname.trim().length < 3) return res.status(400).send({
        message: 'Please enter a surname with min. 3 chars!'
    });

    /**
        La stringa deve contenere almeno 1 carattere alfabetico minuscolo
        La stringa deve contenere almeno 1 carattere alfabetico maiuscolo
        La stringa deve contenere almeno 1 carattere numerico
        La stringa deve contenere almeno un carattere speciale, ma evadiamo i caratteri RegEx riservati per evitare conflitti
        La stringa deve contenere almeno otto caratteri
     */
    var strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
    );

    /*if(!strongRegex.test(body.password)) return res.status(400).send({
        message: 'The password is not secure!'
    });*/

    next();
}