var Movie=require('../modules/movie')
var User=require('../modules/user')
var _=require('underscore')
module.exports=function(app){
	//pre hanle user
	 app.use(function(req,res,next){
	 	var _user=req.session.user
	 	if(_user){
	 		app.locals.user=_user
	 	}
	 	return next()
	 })

	//index page
	app.get('/',function(req, res){
		console.log('user in session')
		console.log(req.session.user)
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
	 		title:'测试 录入页',
	 		movie:{
	 			'title':'',
	 			'director':'',
	 			'country':'',
	 			'language':'',
	 			'year':'',
	 			'poster':'',
	 			'flash':'',
	 			'summary':''
	 		}
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
		if(id=="undefined"){
			_movie=new Movie({
				title:movieObj.title,
				director:movieObj.director,
	 			country:movieObj.country,
	 			language:movieObj.language,
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
		}else{
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

	//signup
	app.post('/user/signup',function(req,res){
		var _user=req.body.user
		User.findOne({name:_user.name},function(err,user){
			if (err) {
				console.log(err)
			}if (user){
				return res.redirect('/')
			}else{
				var user=new User(_user)
				user.save(function(err,user){
					if(err){
						console.log(err)
					}
					res.redirect('/admin/userlist')
				})
			}
		})
	})
	//userlist
	app.get('/admin/userlist',function(req, res){
		User.fetch(function(err, users){
	 		if (err) {  
	 			console.log(err)
	 		}
	 		res.render('userlist',{
	 			title:'用户 列表',
	 			users:users
	 		})
	 	})
	 })

	//singin
	app.post('/user/signin',function(req,res){
		var _user=req.body.user
		var name=_user.name
		var password=_user.password
		User.findOne({name:name},function(err,user){
			if(err){
				console.log(err)
			}if(!user){
				console.log("do not find this one")
				return res.redirect('/')
			}
			user.comparePassword(password,function (err,isMatch) {
				if(err){
					console.log(err)
				}if(isMatch){
					req.session.user=user
					return res.redirect('/')
				}else{
					console.log('password is not match')
				}
			})
		})
	})

	//logout
	app.get('/logout',function(req,res){
		delete req.session.user
		delete app.locals.user
		res.redirect('/')
	})
}