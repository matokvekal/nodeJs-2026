
//old
// const fs = require('fs');
//new
import fs from 'fs';

const dir = './folder';

fs.readdir(dir, (err, files) => {
   console.log(files);
   
}
);
