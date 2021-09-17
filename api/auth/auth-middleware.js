const Auth = require('./auth-model');

const checkUsernameTaken = (req, res, next) => {
    
    if (req.body.username && req.body.password) {
        const { username } = req.body
  
        Auth.findBy({username})
        .then((credentials) => {
          if(credentials.length > 0) {
            next({ message: 'username taken', status: 400})
          } else {
            next()
          }
        })
        .catch(next)
    } else {
        next({ message: 'username and password required', status: 400})
    }

}

const getUsername = (req, res, next) => {
    
    if(req.body.username && req.body.password) {
        const { username } = req.body

        Auth.findBy({username})
            .then((user) => {
                if(user.length > 0) {
                    req.user = user[0]
                    next()
                } else {
                    next({ message: "invalid credentials", status: 400})
                }
            })
            .catch(next)
    } else {
        next({message: "username and password required", status: 400})
    }
}

module.exports = {
    checkUsernameTaken,
    getUsername
}