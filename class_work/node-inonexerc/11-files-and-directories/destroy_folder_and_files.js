import fsExtra from 'fs-extra';

fsExtra.remove('tmp', (err) => {
    console.log('tmp folder is dead');
});