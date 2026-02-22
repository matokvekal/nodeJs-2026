import mongoose from 'mongoose';
import Band from './models/band.js';
import Artist from './models/artist.js';
import _ from 'lodash';

async function main() {
    await mongoose.connect($1);

    const vu = await Band.find({ name: 'The Velvet Underground'}).populate('members');
    console.log(vu);

    mongoose.disconnect($1);

    const artist = await Artist.findOne({ name });
    const bands = await Band.find({ members: artist });
    console.log(bands);

    mongoose.disconnect($1);

    const artist = await Artist.findOne({ name });
    const bands = await Band.find({ members: artist }).populate('members');
    const members = _.chain(bands).map('members').flatten().uniqBy('_id').value();
    console.log(members);

    mongoose.disconnect();

}

// main();
whoDidYouPlayWith('John Cale');

