const config = {
    port: 3000,
    api_link: '/api/',
    entrypoints: {
        book: {
            bid: [':bid', ['get', 'patch', 'delete']],
            '':  ['', ['get', 'post']],
        },
    }
    database: {
        host: 'localhost',
        port: 3306,
        user: '',
        pwd: '',
        db: ''
    }
}

module.exports = config;
