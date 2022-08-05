const express = require('express');
var router = express.Router();
const AccountModel = require('../models/account')

//Lấy dữ liệu
router.get('/',(req,res,next)=>{
    AccountModel.find({})
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(500).json('Lỗi server')
    })
})

//Thêm mới dữ liệu
router.post('/',(req,res,next)=>{
    var username = req.body.username
    var password = req.body.password
    AccountModel.create({
        username: username,
        password: password
    })
    .then(data =>{
        res.json('Thêm Account thành công')
    })
    .catch(err => {
        res.status(500).json('Lỗi server')
    })
})

//Sửa dữ liệu
router.put('/:id',(req,res,next)=>{
    var id = req.params.id
    var newPassword = req.body.newPassword

    AccountModel.findByIdAndUpdate(id,{
        password: newPassword
    })
    .then(data =>{
        res.json('Update thành công')
    })
    .catch(err =>{
        res.status(500).json('Lỗi server')
    })
})

//Xóa dữ liệu
router.delete('/:id',(req,res,next)=>{
    var id = req.params.id
    
    AccountModel.deleteOne({
        _id: id
    })
    .then(data =>{
        res.json('Xóa thành công')
    })
    .catch(err =>{
        res.status(500).json('Lỗi server')
    })
})
module.exports = router