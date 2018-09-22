const express = require('express');

const Bucketlist = require('../models/bucketlist');

const router = express.Router();

router.post('/', (req, res) => {
    const {name} = req.body;

    Bucketlist.create({name})
        .then(bucketlist => {
            res.send(bucketlist);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.get('/', (req, res) => {
    Bucketlist.find({})
        .select('-__v')
        .populate('items')
        .then(bucketlists => res.send(bucketlists))
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.get('/:id', (req, res) => {
    const {id} = req.params;

    Bucketlist.findById(id)
        .populate('items')
        .then(bucketlist => res.send(bucketlist))
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {name, created_by} = req.body;

    let data = {
        date_modified: Date.now()
    };

    if (name) {
        data.name = name;
    }
    if (created_by) {
        data.created_by = created_by
    }

    Bucketlist.findByIdAndUpdate(id, data, {new: true})
        .then(updated => res.send({message: 'bucketlist updated', updated}))
        .catch(err => {
            console.log(err);
            return res.status(500).send(err);
        });
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    Bucketlist.findByIdAndDelete(id)
        .then(deleted => res.send({message: 'bucketlist deleted', deleted}))
        .catch(err => {
            console.log(err);
            return res.status(500).send(err);
        });
});


module.exports = router;
