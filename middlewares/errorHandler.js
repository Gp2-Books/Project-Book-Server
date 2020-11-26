module.exports = (err, req, res, next) => {
    console.log(err)
    if(err.status) {
        res.status(err.status).json({message: err.message})
    }
    else if (err.name == 'SequelizeValidationError') {
        let errorArray = []
        for(let i = 0; i < err.errors.length; i++) {
            errorArray.push(err.errors[i].message)
        }
        res.status(401).json({message: errorArray})   
    }
    else if (err.name == 'SequelizeUniqueConstraintError') {
        let errorArray = []
        for(let i = 0; i < err.errors.length; i++) {
            errorArray.push(err.errors[i].message)
        }
        res.status(401).json({message: errorArray})
    }
    else {
        res.status(500).json(err)
    }
}