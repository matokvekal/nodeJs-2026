import mongoose from 'mongoose';
const URL = require('url').URL;
import request from 'request-promise';
const parse = require('node-html-parser').parse;

const linkSchema = mongoose.Schema({
    href: { type: String },
});

/*
linkSchema.methods.protocol = function() {
    return new URL(this.href).protocol;
};
*/

linkSchema.virtual('protocol').get(function() {
    return new URL(this.href).protocol;
});

linkSchema.methods.getTitle = async function() {
    const html = await request.get(this.href);
    const root = parse(html);
    return root.querySelector('title').rawText;
};

linkSchema.query.https = function() {
    return this.where({ href: /^https:/ });
};

export default mongoose.model('Link', linkSchema);