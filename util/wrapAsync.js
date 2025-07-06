exports.wrapAsync = (fu)=>{
    return function (req, res, next){
        fu(req, res, next).catch((err)=> next(err));
    };
};