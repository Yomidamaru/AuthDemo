const express       		= require("express"),
	  mongoose      		= require("mongoose"),
	  passport      		= require("passport"),
	  bodyParser    		= require("body-parser"),
	  User 					= require("./models/user"),
	  LocalStrategy  		= require("passport-local"),
	  passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("/mongodb://localhost:27017/auth_demo_app", { useNewUrlParser: true });

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
	secret: "Rise and shine",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());  // Need these lines to use passport
app.use(passport.session()); 	 //

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());		// encode and put back into session
passport.deserializeUser(User.deserializeUser());   // unencoding data from session

//=======================
// ROUTES
//=======================

//HOME DIRECTORY
app.get("/", function(req, res){
	res.render("home");
});

//SECRET ROUTE
app.get("/secret", isLoggedIn, function(req, res){
	res.render("secret");
});

//AUTH ROUTES

//show sign up form
app.get("/register", function(req, res){
	res.render("register");
});

//handling user sign up
app.post("/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		}); 
	});
});

// LOGIN ROUTES
//render login routes
app.get("/login", function(req, res){
	res.render("login");
});

// Login Logic
app.post("/login",passport.authenticate("local",{
	successRedirect: "/secret",
	failureRedirect: "/login"
}) , function(req, res){
	//empty callback for now
});

//Logout root
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});


//middleware to check if user  is logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");     // don't need else because of return next()
};

app.listen(3000, function(){
	console.log("----The AuthDemo Server Has Started!---")
});