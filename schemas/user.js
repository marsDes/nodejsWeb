var mongoose= require('mongoose')
var bcrypt = require('bcryptjs')

var UserSchema=new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:{
		unique:true,
		type:String
	},
	meta:{
		createAT:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

UserSchema.pre('save',function(next){
	var user=this
	if(this.isNew){
		this.meta.createAT=this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt=Date.now()
	}
	bcrypt.genSalt(10,function(err,salt){
		if(err) return next(err)
			bcrypt.hash(user.password,salt,function(err,hash){
				if(err) next(err)
					user.password=hash
				next()
			})
	})
	//next()
})

UserSchema.methods={
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMath){
			if(err) return cb(err)
			cb(null,isMath)
		})
	}
}

UserSchema.statics={
	fetch:function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById:function(id,cb){
		return this.findOne({_id:id}).exec(cb)
	}
}

module.exports = UserSchema