const express = require('express');
//const bodyParser = require('body-parser');
/* const multipart = require('connect-multiparty'); */
const multer = require('multer');
const fs = require('fs');
const url = require('url');
const cors = require('cors');
const PORT = 3000;
const app = express();

app.use(cors());

app.use(express.json());

var upload = multer({ dest: './subidas/' })
/* const multiPartMiddleware = multipart({
    uploadDir: './subidas'
}); */
//app.use(bodyParser.json());
/* app.use(bodyParser.urlencoded({
    extended: true
})); */

/* app.post('/api/subir', multiPartMiddleware, (req,res) => {
    res.json({
        'mensaje':'datos guardados'
    });
}); */
app.use('/subidas', express.static(__dirname + '/subidas'));  
app.use(express.static(__dirname + '/subidas')); 

app.post('/api/subir', function(request, respond) {
    var body = '';
    filePath = __dirname + '/subidas/data.json';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.writeFile(filePath, body, function() {
            respond.json({
                'mensaje':'datos guardados'
            });
        });
    });
    
});
app.post('/api/almacenar', function(request, respond) {
    var body = '';
    filePath = __dirname + '/subidas/historico.json';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.writeFile(filePath, body, function() {
            respond.json({
                'mensaje':'datos almacenados'
            });
        });
    });
    
});
app.get('/api/descargar', function(request, respond){
    filePath = __dirname + '/subidas/data.json';
    fs.readFile(filePath, (err,data) =>{
        if (err) throw err;
        //console.log(JSON.parse(data));
        respond.send(data);
        
    });
})
app.get('/api/descargarHistorico', function(request, respond){
    filePath = __dirname + '/subidas/historico.json';
    fs.readFile(filePath, (err,data) =>{
        if (err) throw err;
        //console.log(JSON.parse(data));
        respond.send(data);
        
    });
})

/* app.post('/api/subir', function (req, res) {
    fs.writeFileSync('assets/data.json', theJSON);
    res.json({
        'mensaje':'datos guardados'
    });
}) */

app.get('/', (req,res) => {
    res.send('Hola Mundo');
});

app.listen(PORT, () => console.log(`App running on port: ${PORT}`))