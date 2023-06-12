const allowedOrigin = "http://localhost:3000";

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigin === origin) {
        res.header("Access-Control-Allow-Credentials", true)
    }
    next();
}

module.exports = credentials;