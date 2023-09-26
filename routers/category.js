const express=require('express');

const router=express.Router();
const {Category}=require('../models/category');
const { route } = require('./products');

router.get('/',async(req,res)=>{
    const categoryList= await Category.find();
        res.send(categoryList);
})


router.post('/',async(req,res)=>{
    let category=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
    category=await category.save();
    if(!category){
        return res.status(404).send('the category cannot be created');
    }
    res.send(category);
})

router.delete('/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id).then((category)=>{
        if(category){
            return res.status(200).json({
                success:true,message:"the category is deleted"
            })
        }
        else{
            return res.status(404).jsonp({
                success:false,message:"category not found"
            })
        }
    }).catch((err)=>{
        return res.status(400).json({
            success:false,error:err
        })
    })
})



//get a particular category
router.get('/:id',async(req,res)=>{
    const category=await Category.findById(req.params.id);

    if(!category){
        res.status(500).json({
            message:'The category wuth the given ID was not found'
        })
    }
    res.status(200).send(category)
})



router.put('/:id',async(req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color
        },
        {new:true}
    )
    if(!category){
        res.status(500).json({
            message:'The category wuth the given ID was not found'
        })
    }
    res.status(200).send(category)
})

module.exports=router;