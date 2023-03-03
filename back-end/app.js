require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const sMessage = require('./models/message');

// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {

    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('🎉vous êtes bien connecté à la base de donnée'))
  .catch(() => console.log('🔥Opprs ! une erreur est survenue lors de la connexion à la base de donnée'));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use(express.json());

    const io = require('socket.io')(server, {
        cors: {
            origin: "http://127.0.0.1:5500",
            methods: ["GET", "POST"]
        }
    })

    require('./socket/chat')(io);

    app.use(function (req, res, next) { req.io = io; next(); });

    app.get('/test', (req, res, next) => {
        req.io.emit('notification', { type: 'new_user', data: req.body });
        res.status(200).json({ hello: 'world' })
        console.log(req);
    })

    app.post('/create', (req, res, next) => {
        //  req.io.emit('notification', { type: 'new_user', data: req.body });
         const user = new sMessage({...req.body});

         user.date = new Date();

         console.log(user);
         user.save().then(() => {
           res.status(201).json({
             message: `le message serialiser a été créé avec succès`
           })
         }).catch((error) => {
           res.status(400).json({error})
         })

    })


    app.get('/history', (req, res, next) => {
        sMessage.find()
        .then(messages => res.status(200).json(messages))
        .catch(error => res.status(400).json({ error }));
        });

    app.delete('/massage/:id', (req, res, next) => {
        let id = req.params['id'];
        sMessage.deleteOne({_id: id})
        .then(messages => res.status(200).json({
            alert: `le message serialiser "${id}" a été supprimé avec succès`
            }))
        .catch(error => res.status(400).json({ error }));

    });
      
}