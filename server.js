const express = require("express")
const axios = require("axios")

const app = express()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

let token = null
let tokenExpire = 0

async function getToken(){

if(token && Date.now() < tokenExpire){
return token
}

const res = await axios.post(
"https://open-api.guesty.com/oauth2/token",
"grant_type=client_credentials&scope=open-api",
{
headers:{ "Content-Type":"application/x-www-form-urlencoded" },
auth:{ username:CLIENT_ID, password:CLIENT_SECRET }
}
)

token = res.data.access_token
tokenExpire = Date.now() + (res.data.expires_in - 600)*1000

return token
}

app.get("/reservations", async (req,res)=>{

try{

const access = await getToken()

const r = await axios.get(
"https://open-api.guesty.com/v1/reservations",
{
headers:{ Authorization:`Bearer ${access}` }
}
)

res.json(r.data)

}catch(e){

res.status(500).send("error")

}

})

app.listen(process.env.PORT || 3000)
