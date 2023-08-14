const itemModel = require('../model/sunglassitem');
const UserModel = require('../model/user');
const contactModel = require('../model/contact');
const buyNowModel = require('../model/buynow');
const config = require('../config/config');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


const securePassword = async (password)=>{
    try{
        const HashPassword = await bcryptjs.hash(password, 10);
        return HashPassword;
    } catch(error){
        res.status(400).json(error.message)
    }
}

const createToken = async (id)=>{
    try{
        const token = await jwt.sign({_id : id}, config.secret_key, {expiresIn:'5m'});
        return token;
    }catch(error){
        res.status(400).json(error.message);
    }
}

exports.addUser = async(req, res)=>{
    try{
       const  passwordhash = await securePassword(req.body.password);
        const user = await new UserModel({
            name:req.body.name,
            email:req.body.email,
            contact:req.body.contact,
            password: passwordhash,
            image:req.file.filename
        })

        const duplicateEmail = await UserModel.findOne({email:req.body.email})
        if(duplicateEmail){
            res.status(400).json({ success: false, message: "email already exist" });
        }else{
            const result = await user.save();
            const token = await createToken(result._id);
            res.status(200).json({ success: true, msg: "User Registered Successfully", data: result, status: 200,'token':token })

        }
    }catch (error) {
        console.log(error);
        res.status(201).json({ success: false, msg: "User Not Registered" })
    }
}

exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!(email && password)){
            return res.status(401).json({ success: false, message: "All input are required", status:401 });
        }
        const users = await UserModel.findOne({email})
        if(users && (await bcryptjs.compare(password, users.password))){
            const token = await createToken(users._id);
            return res.status(200).json({ success: true, msg: "Login Successfully", "user": users, status: 200, token: token });
        }
        return res.status(401).json({ success: false, message: "Invalid Credentials", status:401 });
    }catch(err){
        console.log(err);
    }
}

exports.item = async (req, res) => {
    try {

        const item = await itemModel.find()
        // const item = await itemModel.find(req.params._id)
        res.status(200).json({ success: true, msg: "Item fetch Successfully", data: item , status:200 })
    } catch (error) {
        res.status(201).json({ success: false, msg: "Item Not fetch" })

    }
}


exports.singleItem=async(req,res)=>{
    try {
        const single_id= await itemModel.findById(req.params.id)
        console.log(single_id);
        res.status(200).json({success:true,msg:'single data fetch successfilly..!',data:single_id , status:200})
        
    } catch (error) {
        res.status(201).json({success:false, msg:'data not fetched..!'})
        
    }
}

exports.contact = async (req, res)=>{
    try{
        const contactData = await new contactModel({
            name : req.body.name,
            email: req.body.email,
            phone : req.body.phone,
            message : req.body.message
        })

        const contactResult = await contactData.save();
        res.status(200).json({ success: true, msg: "Contact Added Successfully", data: contactResult, status: 200 })
    }catch (error) {
        res.status(201).json({ success: false, msg: "Contact Not Added" })

    }
}


exports.profile=async(req,res)=>{
    try {
        const users_Profile= await UserModel.findById(req.params.id)
        console.log(users_Profile);
        res.status(200).json({success:true,msg:'profile fetch successfilly..!',data:users_Profile , status:200})
        
    } catch (error) {
        console.log(error);
        res.status(201).json({success:false, msg:'profile not fetched..!'})
        
    }
}

exports.BuyNow = async (req, res) => {
    try {
        const buy = await new buyNowModel({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            contact: req.body.contact
            

        })
        const result = await buy.save()
        res.status(200).json({ success: true, msg: "sucessfully Order",Alldata:result ,status:200})

    } catch (error) {
        console.log(error);
        res.status(201).json({ success: false, msg: "sucessfully not order" })
    }
}