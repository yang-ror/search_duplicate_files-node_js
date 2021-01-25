// =============================================================================
//  searchDuplicateFiles.js
//  project: search_duplicate_files
//  author: Zifan Yang
//  date created: 2021-01-24
//  last modified: 2021-01-24
// =============================================================================

//jshint esversion: 8

const fs = require('fs');

var files = [];

var path = './';
scanDir(path);

findDuplicate(files);

//recursion through all directories, and record information for all files scanned.
function scanDir(path){
    var items = fs.readdirSync(path);

    var folders = [];
    for (let item of items) {
        if(item[0] != '.'){
            let stats = fs.lstatSync(path + item);
            if(stats.isDirectory()){
                folders.push(path + item + '/');
            }
            else if(stats.isFile()){
                fileInfo = {
                    'name': item,
                    'size': stats.size.toString() + ' bytes',
                    'date': stats.mtime.toString(),
                    'path': path + item
                };
                files.push(fileInfo);
            }
        }
    }

    for(let folder of folders){
        scanDir(folder);
    }
}

//T(n) = O(3n)
//use filename as the key in a dictionary, then set each value as a list; lastly, push any index has the name to the list.
//any list has more than 1 element is a duplicate file.
function findDuplicate(files){
    var fileDictionary = {};
    var foundDuplicate = false;
    for(let file of files){
        fileDictionary[file.name] = [];
    }
    for(let i = 0; i < files.length; i++){
        fileDictionary[files[i].name].push(i);
    }
    console.log("Scanned ", files.length, " files");
    for(let key in fileDictionary){
        if(fileDictionary[key].length > 1){
            foundDuplicate = true;
            console.log('\n');
            console.log(key);
            var table = [];
            for(let index of fileDictionary[key]){
                table.push({
                    'path': files[index].path,
                    'size': files[index].size,
                    'last modified': files[index].date,
                });
            }
            console.table(table);
        }
    }
    if(!foundDuplicate){
        console.log('Found ', 0, ' duplicate files.');
    }
}