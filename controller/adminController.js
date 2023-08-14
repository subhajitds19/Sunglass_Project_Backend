const itemModel = require('../model/sunglassitem');
const contactModel = require('../model/contact');
const userModel = require('../model/user');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');




exports.login = (req, res)=>{
    loginData = {};
    loginData.email = (req.cookies.email) ? req.cookies.email : undefined;
    loginData.password = (req.cookies.password)? req.cookies.password : undefined;
    res.render('login',{
        title: "admin || login",
        message : req.flash('message'),
        data1: loginData,
        data: req.admin
    })
}

exports.adminauth = (req, res, next) => {
    if (req.admin) {
        console.log(req.admin, "aaa");
        next();
    } else {
        console.log(req.admin, "bbb");
        req.flash('message', "can not access this page ..please login first")
        // console.log("can not access this page ..please login first")
        res.redirect('/admin')
    }
}

// exports.logincreate = (req, res) => {
//     userModel.findOne({
//         email: req.body.email
//     }, (err, data) => {
//         if (data) {
//             if (data.isAdmin == true) {
//                 const haspassword = data.password
//                 if (bcrypt.compareSync(req.body.password, haspassword)) {
//                     const token = jwt.sign({
//                         id: data._id,
//                         name: data.name,
//                         image: data.image
//                     }, 'sunglassShop@2023', { expiresIn: '1h' })
//                     res.cookie('AdminToken', token)
//                     if (req.body.rememberme) {
//                         res.cookie('email', req.body.email)
//                         res.cookie('password', req.body.password)
//                     }
//                     console.log(data);
//                     req.flash('message', "You are Login Successfully")
//                     res.redirect('/admin/dashboard')
//                 } else {
//                     console.log("Incorrect password");
//                     res.redirect('/admin')
//                 }
//             } else {
//                 req.flash('message', "You are not an Admin")
//                 res.redirect('/admin')
//             }

//         } else {
//             console.log("Incorrect email");
//             res.redirect('/admin')
//         }
//     })
// }


exports.logincreate = (req, res) => {
    userModel.findOne({
        email: req.body.email
     }, (err,data)=>{
        if (data) {
            if (data.isAdmin == true ) {
                const haspassword=data.password
                if (bcrypt.compareSync(req.body.password , haspassword)) {
                    const token=jwt.sign({
                        id:data._id,
                        name:data.name,
                        image:data.image
                    }, 'sunglassShop@2023' ,{expiresIn:'1h'})
    
                    console.log("show the name",data.name);
                    console.log("show the image",data.image);
    
                    res.cookie('AdminToken',token)
                    if (req.body.rememberme) {
                        res.cookie('email',req.body.email)
                        res.cookie('password',req.body.password)
                    }
                    console.log(data);
                    req.flash('messege',"you r login successfully")
                    res.redirect('/admin/dashboard')
                } else {
                    console.log("incorrect password");
                    res.redirect('/admin')
                }   
            }else{
                req.flash('message',"you are not an admin")
                res.redirect('/admin')
            }
            
        } else{
            console.log("incorrect email");
            res.redirect('/admin')
        }
     })
    }


    exports.logout = (req, res) => {
        res.clearCookie('AdminToken')
        res.redirect('/admin')
    }
    

exports.dashboard = (req, res)=>{
    userModel.find().then(result=>{
        contactModel.find().then(result1=>{
            itemModel.find().then(result2=>{
                res.render('dashboard',{
                    title: 'Admin || Dashboard',
                        Users : result,
                        contact : result1,
                        item : result2
                    
                })
            })
        })
    })
}

exports.item = (req, res)=>{
    itemModel.find().then(result=>{
        res.render('item',{
            title:'Item Page',
            displayData: result,
            message:req.flash('message'),
            error : req.flash('error')
        })
    })
} 

exports.itemEdit = (req, res) => {
    itemId = req.params.id;
    itemModel.findById(itemId).then(result => {
        res.render('itemEdit', {
            title: 'Item Page',
            itemEditData: result
        })
    }).catch((err) => {
        console.log(err);
    })
}

exports.itemUpdate = (req, res) => {
    const st_id = req.body.itemId
    const itemName = req.body.itemName
    const itemDetails = req.body.itemDetails
    const price = req.body.price
    const image = req.file

    itemModel.findById(st_id).then((result) => {
        result.itemName = itemName
        result.itemDetails = itemDetails
        result.price = price
        result.image = image.filename
        result.save().then(data => {
            res.redirect('/admin/item')
            console.log(data, "Item Update Successfully");
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })

}

exports.itemCreate = (req, res)=>{
    itemModel({
        itemName : req.body.itemName,
        itemDetails: req.body.itemDetails,
        image: req.file.filename,
        price: req.body.price
    }).save().then(result=>{
        console.log(result);
        req.flash('message', 'Item added successfully');
        res.redirect('/admin/item');
    }).catch(err => {
        console.log(err);
        req.flash('error', "item not added ..")
        res.redirect('/admin/item')

    });
}

exports.activeItem = (req, res)=>{
    const id = req.params.id;
    itemModel.findByIdAndUpdate(id, {status:true}).then(result=>{
        console.log('Active Item', result);
        res.redirect('/admin/item');
    }).catch(err=>{
        console.log(err);
    })
}

exports.deactiveItem = (req, res) => {
    const id = req.params.id
    itemModel.findByIdAndUpdate(id, { status: false }).then(result => {
        console.log(result, "Deactived Item");
        res.redirect('/admin/item')
    }).catch(err => {
        console.log(err);
    })
}

exports.Users = (req, res)=>{
    userModel.find().then(result=>{
        res.render('users', {
            title:"Users",
            data:req.admin,
            displayData:result
        })
    })
}


exports.delete = (req, res) => {
    const sid = req.params.id
    userModel.deleteOne({ _id: sid }).then(del => {
        res.redirect('/admin/users')
        console.log(del, "data deleted successfully")
    }).catch(err => {
        console.log(err)
    })
}

exports.contact = (req, res) => {
    contactModel.find().then(result => {
        res.render('contact', {
            title: 'Contact Page',
            data: req.admin,
            displayData: result
        })
    })
}