const { Socket } = require('dgram')
const express = require('express')
const app = express()
const http = require('http').Server(app)
io = require('socket.io')(http)
var multer = require('multer');
const fs = require('fs');
const handlebars = require('express-handlebars')

//app.use(express.static('./public'))

// app.get('/',(req,res)=>{
//     res.sendFile('index.html', {root: __dirname})
// })

http.listen(8080,()=>{
    console.log('Escuchando en puerto 8080')
})

io.on('connection',(socket)=>{
    console.log('usuario conectado')
})


let storage = multer.diskStorage ({
    destination: function (req, file, callback){
        callback(null, "images")
    },
    filename:function(req, file, callback){
        callback(null, file.originalname)
    }
})

var upload = multer({storage});

let productos = []

class Producto {
    constructor (title, price, thumbnail) {
        this.id = productos.length+1
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
    }
}



app.post("/guardar",upload.single("myFile"),(req, res,next) => {
    console.log(req.body)
    let title = req.body.title
    let price = parseInt(req.body.price)
    let thumbnail = req.body.thumbnail
    console.log(thumbnail)
  
            // if (!req.file) {
            //     const error = new Error("Sin archivos")
            //     error.httpStatusCode = 400
            //     return next(error)
            // }
            producto = new Producto(title, price, thumbnail)
            
            
        if(fs.existsSync('productos.txt')){
            fs.promises.readFile('productos.txt').then(data =>{
                const json = JSON.parse(data.toString('utf-8'));
                 json.push({...producto, id: json.length});
                 fs.promises
                 .writeFile('productos.txt',JSON.stringify(json, null, '\t'))
                 .then(_=>{
                     console.log("agregado con exito");
                 })
             }).catch(err=>{
                console.log(err)
             })
            }else{
                fs.promises.writeFile(('productos.txt'), JSON.stringify([{...producto, id:0}]))
             }
             res.redirect('/');
})


app.engine(
    "hbs",
    handlebars({
        extname:".hbs",
        defaultLayout:'index.hbs',
        layoutsDir: __dirname + "/public",
    })
)

app.set('view engine', 'hbs');

app.get('/',(req,res)=>{
    fs.promises.readFile('productos.txt').then(data =>{
        const products = {
            items: [{}]
        }

        const json = JSON.parse(data.toString('utf-8'));
        products.items = json
        res.render('main',products)
     }).catch(err=>{
        console.log(err)
     })
})    