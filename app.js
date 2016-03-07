var express=require('express')
var path=require('path')
var bodyParser = require('body-parser')
var port=process.env.POTR||3000
var app=express()

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(path.join(__dirname,'bower_components')))
app.listen(port)

console.log("website started on prot"+port)

//index page
 app.get('/',function(req, res){
 	res.render('index',{
 		title:'测试 首页',
 		movies:[{title:'机械战警',
 		_id:1,
 		poster:'http://img.mukewang.com/566532b30001c09c06000338-240-135.jpg'

 	},{
 		title:'地狱战警',
 		_id:2,
 		poster:'http://img.mukewang.com/566532b30001c09c06000338-240-135.jpg'
 	},{
 		title:'x战警',
 		_id:3,
 		poster:'http://img.mukewang.com/566532b30001c09c06000338-240-135.jpg'
 	}]
 	})
 })

  app.get('/movie/:id',function(req, res){
 	res.render('detail',{
 		title:'测试 详情页'
 	})
 })

   app.get('/admin/movie',function(req, res){
 	res.render('admin',{
 		title:'测试 录入页'
 	})
 })

    app.get('/admin/list',function(req, res){
 	res.render('list',{
 		title:'测试 列表'
 	})
 })