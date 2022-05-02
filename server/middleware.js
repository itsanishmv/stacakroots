const jwt = require("jsonwebtoken")

function authenticate(req, res, next) {
    try {
        
         jwt.verify(req.headers['authorization'], "topsecret", (err, payload) => {
            if (err) {
                return res.status(403).send("unautharized")
            }
            req.payload = payload
        })
        
    } catch (err) {
        res.status(404).send(err)
    }
   
next()
}

module.exports = {
    authenticate
}