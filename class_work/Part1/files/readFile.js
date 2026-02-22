//read folder dir then read each file in the folder and print it
import fs from "fs";

// const dir = "folder";
const dir = "./folder";
console.log("start read folder");
// const dir = process.argv[2];
/////////////////////1////////////////////////
fs.readdir(dir, (err, files) => {
  files.forEach((file) => {
    // console.log(`this is file name ${file}#########################`);
    fs.readFile(`${dir}/${file}`, "utf8", (err, data) => {  
        //  console.log(`this is file name ${file}#########################`);
      console.log(data);
    });
  });
});


/////////////////////////////////////2//////////////////////////////////
// console.log("start create new file");
//new we will read the files but we will create new file name All.txt and write all the files in it
const fileName = "all.txt";
fs.readdir(dir, (err, files) => {
  files.forEach((file) => {
    fs.readFile(`${dir}/${file}`, "utf8", (err, data) => {
      fs.appendFile(fileName, data, (err) => {
        if (err) throw err;
      });
    });
  });
});

//////////////////////////3/////////////////////////////
// delete the all.txt file
// console.log("start delete file");
const fileName = "all.txt";
if(fs.existsSync(fileName)){
    fs.unlink(fileName, (err) => {
        if (err) throw err;
        console.log('successfully deleted');
      });
}


/////////////////////////4///////////////////////////////
//write file sync


function createLongFile() {
    let content = '';
    for (let i = 0; i < 10000; i++) {
      for (let j = 0; j < 1000000; j++) {
      }
        content += 'This is a long line in the file...\n';
    }
    fs.writeFileSync('longFile.txt', content);
    console.log('Long file created synchronously!');
}

// console.log('start');

// createLongFile();

// console.log('do something.');

//6 async
// function createLongFileAsync() {
//     let content = '';
//     for (let i = 0; i < 100000; i++) {
//       for (let j = 0; j < 100000; j++) {
//         }
//         content += 'This is a long line in the file...\n';
//     }
//     fs.writeFile('longFile.txt', content, (err) => {
//         if (err) throw err;
//         console.log('Long file created asynchronously!');
//     });
// }

// console.log('start');
// createLongFileAsync();
// console.log('do something.');

