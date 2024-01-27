// include User and Review Schema //
const User = require('../models/user')
const Review = require('../models/review')

// create riview controller fumction //
module.exports.newReview = async (req, res) => {

    try {
        // first find recieoient //
        let recipient = await User.findById(req.params.id);
        // console.log(recipient + " recipient ");
        if (!recipient) {
            console.log(" invalid Recipient");
            return res.redirect('/');
        }

        for(let i = 0; i<req.user.userToReview.length ; i++){
            if (req.user.userToReview[i] == recipient.id) {
                let deleted = req.user.userToReview.splice(i, 1);
                req.user.save();
            }
        }

        for (let i = 0; i < recipient.reviewRecivedFrom.length; i++){
            if (req.user) {
                if (recipient.reviewRecivedFrom[i] == req.user.id) {
                    req.user.userToReview.pop(i);
                    const new_review = Review.create({
                       reviewer : recipient.id,
                        reviewed: req.user.id,
                        content: req.query.newReview,
                    });
                    if (!new_review) {
                        console.log("Review is not created");
                    }
                    // recipient.reviewRecivedFrom.splice(i, 1);

                    return res.redirect('/');
                }
            } else {
                console.log("user is not loggin");
                req.flash('error' , "Please Log in first");
                return res.redirect("/users/sign-in");
            }
        }
        return res.redirect('/');
    } catch (err) {
        console.log('error', err);
        return;
   }
}