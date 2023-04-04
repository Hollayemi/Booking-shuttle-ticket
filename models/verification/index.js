require('dotenv').config();
const jwt =  require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.auth
    const token = authHeader && authHeader.split(" ")[1]
    let secKey = process.env.JWT_USER_TOKEN
    
    if(authHeader){
        jwt.verify(token, secKey, (err, user)=>{
            if(err){
                res.status(401).json({message:"Invalid Token", status:"error"})
            }else{
                req.user = user
                next()
            }
        })
    }else{
        return res.status(401).json({message:"You are not authenticated! ", status: "error"})
    }
}



const verifyTokenAndAuthorization = (req, res, next) => {
    const authHeader = req.headers.auth
    const authID = authHeader && authHeader.split(" ")[0]
    verifyToken(req, res, ()=>{
        if(req.user.userId === authID){
            next()
        }else{
            res.status(403).json("permission not granted");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization }