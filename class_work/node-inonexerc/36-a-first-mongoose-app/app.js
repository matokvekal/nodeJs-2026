import mongoose from 'mongoose';

import Contact from './models/contact.js';

async function mainWithInsertMany() {
    const connection = await mongoose.connect($1);

    const [c1, c2] = await Contact.insertMany([
        { name: 'ynon' },
        { name: 'jj', email: 'jj@gmail.com' }
    ]);
    
    const contactItems = await Contact.find({});
    console.log(contactItems);

    mongoose.disconnect($1);
    
    const c1 = await Contact.create({ name: 'ynon' });
    const c2 = await Contact.create({ name: 'jj', email: 'jj@gmail.com' });

    const contactItems = await Contact.find({});
    console.log(contactItems);

    mongoose.disconnect($1);
    
    const c1 = new Contact({ name: 'ynon' });
    const c2 = new Contact({ name: 'jj', email: 'jj@gmail.com' });

    await c1.save();
    await c2.save();
    const contactItems = await Contact.find({});
    console.log(contactItems);

    mongoose.disconnect($1);

    const ynon = await Contact.find({ email: /@gmail.com$/ });
    console.log(ynon);

    const contact = await Contact.findOne({});
    console.log(contact.id);
    mongoose.disconnect();
}

findExamples();