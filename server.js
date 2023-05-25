//requires
require('dotenv').config()
const User = require('./models/Users.js')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
const bodyParser = require('body-parser');

//credentials
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.status(200)
    res.render('pages/login')
})

app.get('/newAccount', function(req, res){
    res.render('pages/createAccount')
})

app.get('/home', function(req, res){
    res.render('pages/index')
})

app.get('/accountSucess', function(req, res){
    res.render('pages/warningPage')
})

app.get('/nc', function(req, res){
    res.render('pages/newChapter')
})

app.post('/newAccount', async(req, res) => {
    const body = req.body
    if(body){
        const userExists = await User.findOne({email: `${body.email}`})
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(body.password, salt)
        if(!body.username){
            return res.status(422).json({msg: 'nome é um campo obrigatório!'})
        }else if(!body.email){
            return res.status(422).json({msg: 'email é um campo obrigatório!'})
        }else if(!body.password){
            return res.status(422).json({msg: 'você deve cadastrar uma senha!'})
        }else if(userExists){
            return res.status(422).json({msg: 'email já cadastrado!'})
        }
        else{
            username = body.username; email = body.email; password = body.password
            const user = new User({
                username,
                email,
                password: passwordHash
            })
            user.save()
            return res.status(201).json({msg: 'usuário cadastrado com sucesso!'})
        }    
    }else return res.status(404).json({msg: 'o payload nao chegou!'})
})

app.post('/', async function(req, res){
    const body = req.body
    const user = await User.findOne({email: body.email})
    if(!body.email) return res.status(404).json({msg: 'insira um email!'})
    else if(!user) return res.status(404).json({msg: 'usuário não cadastrado!'})
    else{
        const checkPass = await bcrypt.compare(body.password, user.password)
        if(!body.password) return res.status(404).json({msg: 'insira a senha!'})
        else if(!checkPass) return res.status(404).json({msg: 'senha inválida!'})
        else{
            const secret = process.env.SECRET
            const token = jwt.sign({
                id : user.username
            }, secret, {expiresIn: '1h'})
            res.cookie('token', token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
              });
            return res.status(200).json({msg: 'logado com sucesso!', token})
        }

    }
})



mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@cluster0.k2mglij.mongodb.net/test`).then(()=>{
    console.log('conectou ao banco!')
}).catch((err) => console.log(err))


app.listen(8080)
console.log('server is on!')

