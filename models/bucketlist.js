const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BucketSchema = Schema({
    name: {
        type: String,
        required: true
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    date_created: {
        type: Date,
        required: true,
        default: Date.now()
    },
    date_modified: {
        type: Date,
        required: true,
        default: Date.now()
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Bucket', BucketSchema);
