import userModel from "../models/userModels.js";

export const getUserData=async(req, res) => {

    try{
        const {userId}=req.body
        const user= await userModel.findById(userId)
        if(!user){
            return res.json({ success: false, message: 'User Not Found' })
        }
        return res.json({  
            success:true,
            userData:{
                name:   user.name,
                isAccountVerified: user.isAccountVerified
            }
        })

    }catch(error){
        res.json({ success: false, message: error.message })
    }
}