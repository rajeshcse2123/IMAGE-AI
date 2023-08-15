//jshint esversion:6
const express = require("express"); 
const bodyParser = require("body-parser");
const { OpenAIApi, Configuration } = require("openai");
require("dotenv").config();

const app = express();

// setting view folder
app.set('view engine', 'ejs');

//get info in consloe after posting
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const port = 3000;
const exampleUrl = ['./images/exapmle/1.png' , './images/exapmle/2.png' , './images/exapmle/3.png' , './images/exapmle/4.png' , './images/exapmle/5.png' , './images/exapmle/6.png'];
let imgUrl = [];  

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);


app.get("/" , (req , res)=>{
    res.render("home" , {
        titleRender : "Some IMAGE AI Generated Results",
        imageRender : exampleUrl
    });
})

app.post("/" , async (req , res)=>{
    console.log("posted");
    imgUrl = [];

    var prompt = req.body.search;
        
    // try block if search is successful
    try{
            const result = await openai.createImage({
                prompt,
                n: 5,
                size: "512x512"
            });
            
            for(var i=0 ; i<5 ; i++){
                imgUrl.push(result.data.data[i].url);
            }
        }

    // catch block if search is invalid generate error
    catch (error){
            prompt = "error(invalid search)";
            console.log(error);
        }

    res.render("home" , {
        titleRender : prompt,
        imageRender : imgUrl,
    })
})




app.listen(process.env.PORT || port, ()=>{
    console.log("server started : " + port);
  })
  