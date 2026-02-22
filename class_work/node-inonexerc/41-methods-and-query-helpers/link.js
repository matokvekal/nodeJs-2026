import mongoose from 'mongoose';
import request from 'request-promise';
import { parse } from 'node-html-parser';

const linkSchema = new mongoose.Schema({
    href: String,
});

linkSchema.query.secure = function() {
    return this.where({ 'href': /^https:\/\// });
}

linkSchema.virtual('protocol').get(function() {
    return new URL(this.href).protocol;
});

linkSchema.methods.getTitle = async function() {
    const html = await request(this.href);
    const root = parse(html);
    return root.querySelector('title').rawText;
};

export default mongoose.model('Link', linkSchema);
