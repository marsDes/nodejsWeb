var express=require('express')
var path=require('path')
var bodyParser = require('body-parser')
var mongoose= require('mongoose')
var Movie=require('./modules/movie')
var _=require('underscore')
var port=process.env.POTR||3000
var app=express()

mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')
app.set('view engine','jade')
/*app.use(bodyParser.json())*/
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment=require('moment')
app.listen(port)

console.log("website started on prot"+port)

//index page
app.get('/',function(req, res){
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err)
		}
		res.render('index',{
			title:'测试 首页',
			movies:movies
		})
	})
})

//detail page
app.get('/movie/:id',function(req, res){
	var id=req.params.id;
	console.log(id);
	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}else{
			res.render('detail',{
				title:'测试'+ movie.title,
				movie:movie
			})
		}
	})
})

//admin page
app.get('/admin/movie',function(req, res){
 	res.render('admin',{
 		title:'录入页',
 		movie:[{
 			title:' ',
 			director:' ',
 			country:' ',
 			lanugage:' ',
 			year:' ',
 			poster:' ',
 			flash:' ',
 			summary:' '
 		}]
 	})
 })

//updata movie
app.get('/admin/update/:id',function(req,res){
	var id=req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.render('admin',{
					title:'后台更新页',
					movie:movie
				})
			}
		})
	}
})

app.post('/admin/movie/new',function(req,res){
	var id=req.body.movie._id
	var movieObj=req.body.movie
	var _movie
	if(id!=="undefined"){
		Movie.findById(id,function(err,movie){
			if (err) {
				console.log(err)
			}
			_movie=_.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movie._id)
			})
		})
	}else{
		_movie=new Movie({
			title:movieObj.title,
			director:movieObj.director,
 			country:movieObj.country,
 			lanugage:movieObj.lanugage,
 			year:movieObj.year,
 			poster:movieObj.poster,
 			flash:movieObj.flash,
 			summary:movieObj.summary
		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+movie._id)
		})
	}

})

app.get('/admin/list',function(req, res){
	Movie.fetch(function(err, movies){
 		if (err) {
 			console.log(err)
 		}
 		res.render('list',{
 			title:'测试 列表',
 			movies:movies
 		})
 	})
 })

//delete
app.delete('/admin/list',function(req,res){
	var id=req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
})