const express = require('express');
const routes = require('./api/routes');
const config = require('./config');

const app = express();
const { port, api_link, entrypoints } = config;


app.use(express.json());
//app.use(routes.logger);

Object.entries(entrypoints).forEach(ep => {
    const [entrypoint, entries] = ep;
    Object.entries(entries).forEach(ent => {
        const [entry, data] = ent;
        data[1].forEach(method => {
            fn = `${method}_${entrypoint}` + (!entry ? '' : '_' + entry);    // function name to call
            link = api_link + entrypoint + (!data[0] ? '' : '/' + data[0]);  // link where to add routing
            if (fn in routes && typeof routes[fn] === "function") app[method](link, routes[fn]);
        });
    });
});

['get', 'post', 'patch', 'delete'].forEach(val => {
    app[val]('*', routes.default);
});


app.listen(port, () => {
    console.log('Server is running on port:', port);
});
