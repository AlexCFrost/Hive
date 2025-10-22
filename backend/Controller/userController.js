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

            res.status(200).json({email, username: user.username, token})
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
            // Determine the frontend URL from the request origin or environment variable
            const origin = req.headers.origin;
            const frontendURL = origin || process.env.FRONTEND_URL || 'http://localhost:5173';
            
            console.log("Google auth callback triggered");
            
            if (err) {
                console.error("Google authentication error:", err);
                return res.redirect(`${frontendURL}/login?error=${encodeURIComponent(err.message || 'Google authentication failed')}`);
            }
            
            if (!data) {
                console.error("Google authentication failed - no data returned");
                return res.redirect(`${frontendURL}/login?error=Authentication%20failed%20-%20no%20data%20returned`);
            }
            
            if (!data.user) {
                console.error("Google authentication failed - no user data");
                return res.redirect(`${frontendURL}/login?error=Authentication%20failed%20-%20no%20user%20data`);
            }
            
            if (!data.token) {
                console.error("Google authentication failed - no token generated");
                return res.redirect(`${frontendURL}/login?error=Authentication%20failed%20-%20no%20token%20generated`);
            }
            
            const user = data.user;
            const token = data.token;
            
            console.log(`Redirecting to ${frontendURL}/auth-success with token and user data`);
            return res.redirect(`${frontendURL}/auth-success?token=${token}&email=${user.email}&username=${user.username}`);
            
        })(req, res, next);
    };


    module.exports = {loginUser, signupUser, google, googleCallBack}
