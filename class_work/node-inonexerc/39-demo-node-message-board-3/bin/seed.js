import Post from '../models/post.js';

async function main() {
    import mongoose from 'mongoose';
    mongoose.connect('mongodb://localhost/mymessages');
    
    await Post.create({ author: 'ynon', text: 'Hello World' });
    await Post.create({ author: 'ynon', text: 'Nice to meet you', color: 'red' });
    
    mongoose.disconnect();   
}

main();