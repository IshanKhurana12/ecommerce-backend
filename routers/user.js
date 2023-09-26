const express=require('express');

const router=express.Router();
const {User}=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

router.get('/',async(req,res)=>{
    const userList= await User.find().select('name phone email')
    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})


router.post('/',async(req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        street:req.body.street,
        city:req.body.city,
        country:req.body.country,
        zip:req.body.zip
    })

    user=await user.save();

    if(!user){
        res.status(500).json({
            success:false,
            message:"user not created"
        })
    }
    res.send(user);
})

router.get('/:id',async(req,res)=>{
    const user=await User.findById(req.params.id).select('-passwordHash');


    if(!user){
        res.status(500).json({
            success:false,
            message:"user not found"
        })
    }
    res.send(user);

})


router.post('/login',async(req,res)=>{
    const secret=process.env.secret;

    const user=await User.findOne({email:req.body.email})

    if(!user){
       return res.status(404).send('the user not found');
    }
   if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
    const token=jwt.sign({
        userId:user.id,
        isAdmin:user.isAdmin
    },
    secret,
    {
        expiresIn:'1d'
    }
    )
    res.status(200).send({user:user.email,token});
   }
   else{
    res.status(400).send("wrong Information provided");
   }
})


router.post('/register',async(req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        street:req.body.street,
        city:req.body.city,
        country:req.body.country,
        zip:req.body.zip
    })

    user=await user.save();

    if(!user){
        res.status(500).json({
            success:false,
            message:"user not created"
        })
    }
    res.send(user);
})


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments()

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})



router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})








module.exports=router;