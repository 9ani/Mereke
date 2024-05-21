const User = require('./User');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    try {
        const { email, full_name, password, re_password } = req.body;

        if (!(email && full_name && password && re_password)) {
            return res.redirect('/register?error=1');
        }

        if (password !== re_password) {
            return res.redirect('/register?error=2');
        }

        const findUser = await User.findOne({ email }).countDocuments();

        if (findUser) {
            return res.redirect('/register?error=3');
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                await new User({
                    email,
                    full_name,
                    isAdmin: false,
                    password: hash,
                }).save();
                res.redirect('/login');
            });
        });
    } catch (error) {
        console.error(error);
        res.redirect('/register?error=4'); 
    }
};

const signIn = (req, res)=>{
    if(req.user.isAdmin){
        res.redirect(`/admin/${req.user._id}`)

    }else{
        res.redirect(`/`)

    }
}

const signOut = (req,res)=>{
    req.logout(function(err){
        if(err){
            console.log(err);
        }
    })
    res.redirect('/')
}

module.exports = { signUp, signIn, signOut };
