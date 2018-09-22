const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = Schema({
    name:{
        type: String,
        required: true
    },
    date_created:{
        type: Date,
        required: true,
        default: Date.now()
    },
    date_modified:{
        type: Date,
        required: true,
        default: Date.now()
    },
    done:{
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Item', ItemSchema);
