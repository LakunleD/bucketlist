const express = require('express');

const Bucketlist = require('../models/bucketlist');
const Item = require('../models/item');

const tokenManagement = require('../library/token');

const router = express.Router();

router.post('/', tokenManagement.verifyToken, (req, res) => {
    const {name} = req.body;

    Bucketlist.create({name})
        .then(bucketlist => {
            res.send(bucketlist);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.get('/', tokenManagement.verifyToken, (req, res) => {
    const {page, limit, q}= req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };
    if(q){
        Bucketlist.find({name:q})
            .select('-__v')
            .populate('items')
            .then(bucketlists => res.send(bucketlists))
            .catch(err => {
                return res.status(500).send(err);
            });
    }
    else{
        Bucketlist.find({})
            .select('-__v')
            .populate('items')
            .then(bucketlists => res.send(bucketlists))
            .catch(err => {
                return res.status(500).send(err);
            });
    }
});

router.get('/:id', tokenManagement.verifyToken, (req, res) => {
    const {id} = req.params;

    Bucketlist.findById(id)
        .populate('items')
        .then(bucketlist => res.send(bucketlist))
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.put('/:id', tokenManagement.verifyToken, (req, res) => {
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

router.delete('/:id', tokenManagement.verifyToken, (req, res) => {
    const {id} = req.params;
    Bucketlist.findByIdAndDelete(id)
        .then(deleted => res.send({message: 'bucketlist deleted', deleted}))
        .catch(err => {
            console.log(err);
            return res.status(500).send(err);
        });
});

router.post('/:bucketlist/items', tokenManagement.verifyToken, (req, res) => {
    const {bucketlist} = req.params;

    const {name} = req.body;

    Bucketlist.findById(bucketlist)
        .then(bucketlist => {
            if (bucketlist !== null) {
                return bucketlist;
            }
            else {
                return res.status(403).send({message: 'unknown bucketlist'});
            }
        })
        .then(async (bucketlist) => {
            const item = await Item.create({name})
                .then(item => item)
                .catch(err => {
                    return res.status(500).send(err);
                });

            const item_id = item._id;
            bucketlist.items.push(item_id);
            bucketlist.date_modified = Date.now();
            return bucketlist;
        })
        .then((bucketlist) => {
            const updateBucketlist = new Bucketlist(bucketlist);
            updateBucketlist.save(err => {
                if (err) return res.status(500).send(err);
                return res.send(updateBucketlist);
            })
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});


router.get('/:bucketlist/items', tokenManagement.verifyToken, (req, res) => {
    const {bucketlist} = req.params;

    Bucketlist.findById(bucketlist)
        .select('-__v')
        .populate('items')
        .then(bucketlists => res.send(bucketlists.items))
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.get('/:bucketlist/items/:itemid', tokenManagement.verifyToken, (req, res) => {
    const {bucketlist, itemid} = req.params;

    Bucketlist.findById(bucketlist)
        .select('-__v')
        .populate('items')
        .then(bucketlists => {
            if (bucketlist !== null) {
                const items = bucketlists.items;
                const item = items.filter((item) => item._id.toHexString() === itemid);
                if (item.length !== 0) {
                    res.send(item[0]);
                }
                else {
                    return res.status(403).send({message: 'item doesn\'t belong to this bucketlist'});
                }
            }
            else {
                return res.status(403).send({message: 'unknown bucketlist'});
            }
        })
        .catch(err => {
            return res.status(500).send(err);
        });

});

router.put('/:bucketlist/items/:itemid', tokenManagement.verifyToken, (req, res) => {
    const {bucketlist, itemid} = req.params;

    const {name, done} = req.body;

    Bucketlist.findById(bucketlist)
        .select('-__v')
        .populate('items')
        .then(bucketlists => {
            if (bucketlist !== null) {
                const items = bucketlists.items;
                const item = items.filter((item) => item._id.toHexString() === itemid);
                if (item.length !== 0) {
                    return item[0];
                }
                else {
                    return res.status(403).send({message: 'item doesn\'t belong to this bucketlist'});
                }
            }
            else {
                return res.status(403).send({message: 'unknown bucketlist'});
            }
        })
        .then(item => {
            let data = {};

            if (name) {
                data.name = name;
            }
            if (done) {
                data.done = done;
            }
            data.date_modified = Date.now();

            Item.findByIdAndUpdate(item._id, data, {new: true})
                .then(updated => res.send({message: 'item updated', updated}))
                .catch(err => {
                    console.log(err);
                    return res.status(500).send(err);
                });
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.delete('/:bucketlist/items/:itemid', tokenManagement.verifyToken, (req, res) => {
    const {bucketlist, itemid} = req.params;

    Bucketlist.findById(bucketlist)
        .select('-__v')
        .populate('items')
        .then(bucketlists => {
            if (bucketlists !== null) {
                const items = bucketlists.items;
                const item = items.filter((item) => item._id.toHexString() === itemid);
                if (item.length !== 0) {
                    return item[0];
                }
                else {
                    return res.status(403).send({message: 'item doesn\'t belong to this bucketlist'});
                }
            }
            else {
                return res.status(403).send({message: 'unknown bucketlist'});
            }
        })
        .then(item => {
            Item.findByIdAndDelete(item._id)
                .then(deleted => deleted)
                .catch(err => {
                    console.log(err);
                    return res.status(500).send(err);
                });
        })
        .then(async () => {

            const bucketlists = await Bucketlist.findById(bucketlist)
                .select('-__v')
                .then(bucketlists => bucketlists)
                .catch(err => {
                    return res.status(500).send(err);
                });

            return bucketlists;
        })
        .then(async (bucketlists) => {
            const items = await bucketlists.items.filter((item) => item._id.toHexString() !== itemid);
            bucketlists.items = items;
            bucketlists.date_modified = Date.now();
            return bucketlists
        })
        .then(bucketlists => {
            const updateBucketlist = new Bucketlist(bucketlists);
            updateBucketlist.save(err => {
                if (err) return res.status(500).send(err);
                res.send(updateBucketlist);
            })
        })
        .catch(err => {
            return res.status(500).send(err);
        });

});

module.exports = router;
