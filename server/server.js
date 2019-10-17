var express = require('express'),
    fs = require('fs').promises,
    fss = require('fs'),
    path = require('path'),
    cors = require('cors'),
    app = express();
    let arr = [];

// app.use(cors());

app.get('/book/:name', function (req, res) {
    let name = req.params.name;
    arr.forEach((el) => {
      if (el.name_tr == name) {
        var filePath = el.path;
        fss.readFile(__dirname + filePath , function (err,data){
            res.contentType("application/pdf");
            res.send(data);
        });        
      }
    })
});

app.get('/all', function (req, res) {
  
  let result = walk('books').then(res => {
    res.forEach((el) => {
      let book = {
        path: null,
        name: null,
        name_tr: null
      };      
      book.path = el
      book.name = el.match(/\/([^\/]*\.pdf)$/)[1]
      book.name_tr = rus_to_latin(el.match(/\/([^\/]*\.pdf)$/)[1])
      arr.push(book);
    })
    return arr
  })
  result.then(r => res.send(r))
})


app.listen(3000, function(){
    console.log('Listening on 3000');
});


function rus_to_latin ( str ) { 
  var ru = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
      'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 
      'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
      'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 
      'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
  }, n_str = [];  
  str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
  for ( var i = 0; i < str.length; ++i ) {
     n_str.push(
            ru[ str[i] ]
         || ru[ str[i].toLowerCase() ] == undefined && str[i]
         || ru[ str[i].toLowerCase() ].replace(/^(.)/, function ( match ) { return match.toUpperCase() })
     );
  }
  return n_str.join('');
}

async function walk(dir) {
  let files = await fs.readdir(dir);
  files = await Promise.all(files.map(async file => {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      // console.log(filePath)
      if (stats.isDirectory()) return walk(filePath);
      else if(stats.isFile()) return '/'+filePath.replace('\\','/');        
  }));    
  // return files.reduce((all, folderContents) => all.concat(folderContents), []);
  return files
}


