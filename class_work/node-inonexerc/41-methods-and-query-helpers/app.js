import mongoose from 'mongoose';
import Link from './link.js';

async function main() {
    await mongoose.connect($1);
    // l = await Link.create({ href: 'https://www.duckduckgo.com' });
    // console.log(l.id);
    links = await Link.find().secure();
    console.log(links);

    mongoose.disconnect();
}


main();