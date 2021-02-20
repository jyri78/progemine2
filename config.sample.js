const config = {
    port: 3000,
    api_link: '/api/',
    entrypoints: {
        book: {
            bid: [':bid', ['get', 'patch', 'delete']],
            '':  ['', ['get', 'post']],
        },
    }
}

module.exports = config;
