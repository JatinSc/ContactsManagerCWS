const jwt = require('jsonwebtoken')

const User = require('../Models/userModal')

module.exports = (req , res , next) =>{
  // # we will be sending our token with headers so we are requiring it
    const authHeader = req.headers.authorization;

    if (authHeader) {
  // # authHeader comes with bearer token , we are taking only token from it [bearer , token]
        const token = authHeader.split(" ")[1]; // $ [bearer , token] [0 , 1]
jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
  // # we have created this payload in login route const payload = {_id : doesUserExists._id}
  // # it contains logged in user id
    try {
      if (err) {
        return res.status(401).json({ error: "Unauthorized!" });
      }

      const user = await User.findOne({ _id: payload._id }).select(
        "-password"
      );
      // # we are removing password by using select {-} sign indicates that we don't want that, because we don't want to show 
      req.user = user;
      next(); // # this will jump onto our routes
    } catch (err) {
      console.log(err);
    }
  });
} else {
  return res.status(403).json({ error: "Forbidden 🛑🛑" });
}
};

// $ now we will create protected route in app.js