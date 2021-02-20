const routes = require('./routes');

const functions = {};


// Helper function to send result
functions.send_result = (req, res, obj, status = 200, no_send = false) => {
    if (!obj) routes.default(req, res);
    else {
        if (obj.error) status = 400;
        if (no_send) res.status(status).end();
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



module.exports = functions;
