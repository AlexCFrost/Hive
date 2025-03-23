const User = require("../Model/userModel");
const jwt = require("jsonwebtoken")
const passport = require("passport");
require("../Middleware/passport")

const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
 }


// login user 
const loginUser = async(req, res)=>{

    const {email, password} = req.body

    try{
        const user = await User.login(email, password)
        if (!user) {
            throw new Error('User not found');
        }
        // create token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    }catch (error){
        res.status(400).json({error: error.message})
    }
}

//signup user
const signupUser = async (req, res)=>{
    const {username, email, password} = req.body

    try{
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const user = await User.signup(username, email, password)
        // create token
        const token = createToken(user._id)

        res.status(200).json({username, email, token})
    }catch (error){
        res.status(400).json({error: error.message})
    }

}

//google signin
const google = passport.authenticate('google', { scope: ['email', 'profile'] })

const googleCallBack = (req, res, next) => {
    passport.authenticate("google", (err, data) => {
        if (err) {
            console.error("Google authentication error:", err);
            return res.redirect('/login?error=Google%20authentication%20failed');
        }
        
        if (!data || !data.user || !data.token) {
            console.error("Google authentication failed - incomplete data");
            return res.redirect('/login?error=Google%20authentication%20failed');
        }
        
        const user = data.user;
        const token = data.token;
        
        return res.redirect(`http://localhost:5173/auth-success?token=${token}&email=${user.email}&username=${user.username}`);
        
    })(req, res, next);
};


module.exports = {loginUser, signupUser, google, googleCallBack}
