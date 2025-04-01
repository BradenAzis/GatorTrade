//protect routes with this function. Only authenticated users will have access
function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401); //send unauthorized if not logged in
  }
  
  module.exports = isLoggedIn;
