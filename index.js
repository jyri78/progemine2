const express = require('express');
const routes = require('./routes');

const app = express();

const port = 3000;
const api_link = '/api/';


const entrypoints = {
    teacher: {
        tid: [':tid', ['get', 'patch', 'delete']],
        '':  ['', ['get', 'post']],
    },
    student: {
        sid: [':sid', ['get', 'patch', 'delete']],
        '':  ['', ['get', 'post']],
    },
    course:  {
        cid: [':cid', ['get', 'patch', 'delete']],
        '': ['', ['get', 'post']],
    },
    grades:  {
        sid: [':sid', ['get', 'patch', 'delete']],
        '':  ['', ['get', 'post']],
    },
};


app.use(express.json());

Object.entries(entrypoints).forEach(ep => {
    const [entrypoint, entries] = ep;
    Object.entries(entries).forEach(ent => {
        const [entry, data] = ent;
        data[1].forEach(method => {
            fn = `${method}_${entrypoint}` + (!entry ? '' : '_' + entry);    // funktsiooni nimi, mida välja kutsuda
            link = api_link + entrypoint + (!data[0] ? '' : '/' + data[0]);  // link, millele ruutingut määrata
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


/*
const excuses = [
  {
    id: 1,
    description: 'Ei tahtnud teha'
  },
  {
    id: 2,
    description: 'Ei osanud'
  },
  {
    id: 3,
    description: 'Ei viitsinud'
  },
  {
    id: 4,
    description: 'Ei teadnud, et oleks vaja midagi teha'
  },
];

app.use(express.json());

app.get('/hello', (req, res) => {
    fn = global['test'];
  res.status(200).json({message: fn()});
});


app.get('/excuses', (req, res) => {
  res.status(200).json({
    excuses: excuses
  });
});

app.get('/excuses/:id', (req, res) => {
  const key = req.query.key;
  const id = req.params.id;
  const excuse = excuses[id - 1];
  res.status(200).json({
    excuse: excuse
  });
});

app.post('/excuses', (req, res) => {
  const description = req.body.description;
  if (description) {
    const excuse = {
      id: excuses.length + 1,
      description: description
    };
    excuses.push(excuse);
    res.status(201).json({
      id: excuse.id
    });
  } else {
    res.status(400).json({
      error: 'Description is missing'
    });
  }
});

app.delete('/excuses/:id', (req, res) => {
  const id = req.params.id;
  excuses.splice(id - 1, 1);
  res.status(200).end();
});

app.patch('/excuses/:id', (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  excuses[id - 1].description = description;
  res.status(200).json({
    success: true
  });
});

app.listen(port, () => {
  console.log('Server is running on port:', port);
});
*/