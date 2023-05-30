const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController{
    static userRegistration = async(req,res)=>{
        const {name, email, password, password_confirmation, tc} = req.body;
        const user = await UserModel.findOne({email:email});

        
        if(user){
       res.send({"Status":"Faild", "massage":"email already exist"});
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                  try {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password,salt)
                    const doc = new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    });
                    await doc.save();
                    // const saved_user = await UserModel.findOne(
                    //     {email:email});
                    //     //generate JWT Token

                    //  const token = jwt.sign({userID:saved_user._id},
                    //     process.env.JWT_SECRET_KEY,{expiresIn: '10d'});

                    res.status(201).send({"Status":"succses", "massage":" registation succses"})

                  } catch (error) {
                    // console.log(err);
                    res.send({"Status":"Faild", "massage":"Unable to register"})
                  }
                }else{
                    res.send({"Status":"Faild", "massage":"password not match"});
                }

            }else{
                res.send({"Status":"Faild", "massage":"All fields are required"})
            }

        }
    }

    static userLogin = async (req,res)=>{
        try {
            const {email , password} = req.body

            if(email && password){
                const user = await UserModel.findOne({email:email});
                if(user != null){
                 const isMatch = await bcrypt.compare(password,user.password);
                 if((user.email === email) && isMatch){
                    res.send({"Status":"succes", "massage":"Login succes"}) 

                 }else{
                    res.send({"Status":"Faild", "massage":"Email or password is not valid"}) 
                 }

                }else{
                    res.send({"Status":"Faild", "massage":"You are not a registered user"}) 
                }

            }else{
                res.send({"Status":"Faild", "massage":"All fields are required"}) 
            }

        } catch (error) {
           console.log(error); 
        }
    }


    static changeUserPassword = async (req,res)=>{
        const{password, password_confirmation} = req.body;

        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"Status":"Faild", "massage":"New password or confirm password dosen't match"}) 
            }else{
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt)
            }

        }else{
            res.send({"Status":"Faild", "massage":"All fields are required"});
        }
    }
}

module.exports = UserController;