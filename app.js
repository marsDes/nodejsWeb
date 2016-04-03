var express=require('express')
var cookieParser=require('cookie-parser')
var session=require('express-session')
var path=require('path')
var bodyParser = require('body-parser')
var mongoose= require('mongoose')
var mongoStore=require('connect-mongo')(session)

var port=process.env.POTR||3000
var app=express()
var dburl='mongodb://localhost/imooc'

mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
app.use(session({
	secret:'mars',
	store:new mongoStore({
		url:dburl,
		collection:'sessions'
	})
}))

require('./config/routes')(app)
app.locals.moment=require('moment')
app.listen(port)

console.log("website started on prot"+port)