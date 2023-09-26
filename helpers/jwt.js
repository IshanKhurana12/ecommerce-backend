
const { expressjwt: expressJwt } = require('express-jwt');
const secret=process.env.secret
const api=process.env.API_URL;
function authJwt(){
  return expressJwt({
        secret:secret,
        algorithms:['HS256'],
        isRevoked:isRevoked
    }).unless({
        path:[
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
}



    async function isRevoked(req, token){
        if (!token.payload.isAdmin) {
          return true;
        }
      }





module.exports=authJwt;