const Account = require("../models/createAccount");
const { ValidateAccount, validateLogin } = require("../models/validation");
const byCrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.createAccount = async(req, res) => {
    // hashPassword 
    const lvlup = await byCrypt.genSalt(10);
    const hashedPass = await byCrypt.hash(req.body.password, lvlup)

    const { error } = ValidateAccount(req.body);
    const exists = await Account.findOne({email: req.body.email})   
    const newAccount = Account({...req.body, password: hashedPass});
    try {
        if(!error){
            if(!exists){
                const saveInfo = await newAccount.save()
                console.log(saveInfo)
                return res.status(201).json({ data: saveInfo, message: 'Account Created', status: "success"})
            }else{
                return res.status(500).json({message: 'Account already exist ', status: "error"})
            }
        }else{
            return res.status(501).json({message:error.details[0].message, status:"error"})
        }
    } catch (error) {
        return res.status(500).json({message: error, status: "error"})
    }
}



exports.accountLogin = async (req, res) => {
    const {error} = validateLogin(req.body);
    const userInfo = await Account.findOne({$or: [{email: req.body.email}, {register_id: req.body.email}]})    
    
    try {
        if(error){
            return res.status(501).json({message:error.details[0].message, status:"error"})
        }else{
            if(!userInfo){
                return res.status(501).send({message:"Invalid email or password!", status: "error"});
            }else{            
                const validPass = await byCrypt.compare(req.body.password, userInfo.password);    
                if(!validPass) {
                    return res.status(501).send({message:"Invalid email or password!", status: "error"});
                }else{
                    const accessToken = jwt.sign(
                        {
                            userId: userInfo._id,
                        },
                        process.env.JWT_USER_TOKEN,
                        {expiresIn:"60h"}
                    )
                    const {password, ...otherDetails} = userInfo._doc;
                    return res.status(201).send({ data:{...otherDetails, accessToken}, message:'logged in', status: "success"});
                }
            }
        }
    } catch (error) {
        return res.status(500).send({message:"server error", status:"error"})
    }
};
