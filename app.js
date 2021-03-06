const express = require('express');
const routes = require('./api/routes');
const { debug, api_link, entrypoints } = require('./config');

const app = express();


app.use(express.json());

/*-*/debug && console.log("\n-------------------------------\nAPI links and routes\n-------------------------------");
Object.entries(entrypoints).forEach(ep => { // goes through all entrypoints
    const [entrypoint, entries] = ep;

    /*-*/debug && console.log("\n:", entrypoint, ':');
    Object.entries(entries).forEach(ent => {  // goes through all entries in entrypoint
        const [entry, data] = ent;

        data[1] && data[1].forEach(method => { // data[1] is methods array (or array of methods and middlewares)
            let m = method, mw = false;

            if (Array.isArray(method)) { // method is array (method name and middlewares)
                m = method[0];
                mw = method[1];
                if (!Array.isArray(mw)) mw = [mw];
            }
            const fn = `${m}_${entrypoint}` + (!entry ? '' : '_' + entry);    // function name to call
            const link = `${api_link}/${entrypoint}` + (!data[0] ? '' : '/' + data[0]);  // link where to add routing

            /*-*/debug && console.log(link, '|', fn);
            if (fn in routes && typeof routes[fn] === "function") {
                if (!mw) app[m](link, routes[fn]);
                else app[m](link, ...mw, routes[fn]); // include also middlewares
            }
        });
    });
});

['get', 'post', 'patch', 'delete'].forEach(val => {
    app[val]('*', routes.default);
});
/*-*/debug && console.log("\n-------------------------------\nEND links and routes\n-------------------------------\n");


module.exports = app;
