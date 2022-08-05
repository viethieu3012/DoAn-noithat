const express = require('express');
var app = express();
var bodyParser = require('body-parser');
const AccountModel = require('./models/account');
const path = require('path');
var http = require('http').Server(app);

app.use('/public',express.static(path.join(__dirname,'/public')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',(req,res,next)=>{
    res.sendFile(__dirname + '/index.html');
})

app.post('/register',(req,res,next)=>{
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username,
    })
    .then(data =>{
        if(data){
            res.json('User này đã tồn tại')
        }else{
            return AccountModel.create({
                username: username,
                password: password
            })
        }
    })
    .then(data =>{
        res.json('Tạo tài khoản thành công')
    })
    .catch(err =>{
        res.status(500).json('Tạo tài khoản thất bại')
    })
})

app.post('/login',(req,res,next)=>{
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne ({
        username: username,
        password: password
    })
    .then(data =>{
        if(data){
            res.json('Đăng nhập thành công')
        }else{
            res.status(300).json('Account không đúng')
        }
    })
    .catch(err => {
        res.status(500).json('Có lỗi bên server')
    })
})

var accountRouter = require('./Routers/account')
app.use('/api/account/',accountRouter);


app.listen(3000, () => {
    console.log('Server started on port');
});