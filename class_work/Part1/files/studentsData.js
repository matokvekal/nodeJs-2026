// import {promises as fsPromises} from 'fs';


// const fileName= 'students.json';

// async function readStudentsdata(){
//    try{
//       const data = await fsPromises.readFile(fileName,"utf8");
//       const students=JSON.parse(data).students;
//       console.log("id, name,course, grade")
//       students.forEach((student)=>{
//          console.log(`${student.id},${student.name},${student.course},${student.grade}`);
//       })

//    }
//    catch(err){
//       console.log("Error : ",err);
//    }
// }

// readStudentsdata()
// ////////////////////////////////write into file

//  const newFile = "studentsFile2.json";

// async function writeStudentsdata() {
//     try {
//         const data = await fsPromises.readFile(fileName, "utf8");
//         const json = JSON.parse(data).students;

//         await fsPromises.writeFile(newFile,JSON.stringify(json));


//     } catch (err) {
//         console.log("Error:", err);
//     }
// }

// // writeStudentsdata();


// ////////////////////////////Append////////////

// async function appendStudentsdata() {
//     try {
//         const data = await fsPromises.readFile(fileName, "utf8");
//         const json = JSON.parse(data).students;

//         await fsPromises.appendFile(newFile, JSON.stringify(json, null, 2) + "\n"); //null means you're not providing any replacer,
//       //   2 means you want to format the resulting JSON string with an indentation of 2 spaces for each level.

//         console.log(`Data appended to ${newFile}`);

//     } catch (err) {
//         console.log("Error:", err);
//     }
// }

// // appendStudentsdata();
// // ///////////////////////////delete file
// const newFile = "studentsFile2.json";
// async function deleteFile(name) {
//    await fsPromises.unlink(name);
//    console.log("File deleted");
// }
// deleteFile(newFile);


