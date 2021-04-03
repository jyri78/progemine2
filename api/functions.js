const routes = require('./routes');

const functions = {};


// Helper function to send result
functions.send_result = (req, res, obj, status = 200) => {
    if (!obj) routes.default(req, res);
    else {
        if (obj.error) {
            status = obj.errCode ?? 400;
            delete obj.errCode;
        }
        if (status == 204 && !obj.error) res.status(status).end();
        else res.status(status).json(obj);
    }
};

// Helper function to find teachers/students ID
functions.get_id = (obj, name) => {
    let result = 0;
    obj.forEach(o => {
        if (o.name == name) result = o.id;
    });
    return result;
};

// Helper function to output DB error and return as server error
functions.db_error = (func, err) => {
    console.error(func +'() service ERROR:', err);
    return {errCode: 500, error: '500 Internal Server Error', message: 'Something went wrong with DB query'};
};


module.exports = functions;
