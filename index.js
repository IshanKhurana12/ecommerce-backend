const express=require('express');
const cors=require('cors');

const app=express();
app.use(cors());
require('dotenv/config');//i will be able to use specific constant to get the value from env file


//body parser is used in post req to read the body of the post req 😀
const bodyParser=require('body-parser');
const morgan = require('morgan');
const api=process.env.API_URL;
const mongoose=require('mongoose');
//importing routers
const productRouter=require('./routers/products');
const orderRouter=require('./routers/order');
const userRouter=require('./routers/user');
const categoryRouter=require('./routers/category');
const errorhandler=require('./helpers/error-handler');
const { expressjwt: expressJwt } = require('express-jwt');
const authJwt = require('./helpers/jwt');
const secret=process.env.secret

//middleware - they can interare in req,res request and wecan make changes and dont forget next when making one
app.use(bodyParser.json());//my app will read the data send from the post req as in json
app.use(morgan('tiny'));//tiny means a specific format to view the req
app.use(authJwt());

app.use(errorhandler);
//routers
app.use(`${api}/products`,productRouter);
app.use(`${api}/orders`,orderRouter);
app.use(`${api}/users`,userRouter);
app.use(`${api}/category`,categoryRouter);

//make a path static 
app.use("/public/uploads",express.static(__dirname+'/public/uploads'));



//database
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log("database connection is ready... ");
})
.catch((err)=>{
    console.log(err);
})



//listing on port 
app.listen(3000,()=>{
    console.log("listinig on port 3000");
});
