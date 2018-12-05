const jsonfile = require('jsonfile');
const uuidv4 = require('uuid/v4');
const file_path = "./DB/users.json";

module.exports = function (app) {
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
          next();
      });

    app.get("/students", (req, res) => {
        console.log("fetching all users");

        // jsonfile reading
        jsonfile.readFile("./DB/users.json", function (err, content) {
            // send file contents back to sender
            res.send(content);
        });
    });

    app.post("/students/new", (req, res) => {

        let {id, studentName, pastWatch, nextWatch, pastWatchSubject, watchSubject } = req.body;

        jsonfile.readFile(file_path, function (err, content) {
            pastWatch = new Array();
            pastWatchSubject = new Array();
            nextWatch = "";
            watchSubject = "";
            id = uuidv4();
            
            content.push({id, studentName, pastWatch, nextWatch, pastWatchSubject, watchSubject });

            console.log("added " + studentName + " to DB");

            jsonfile.writeFile(file_path, content, function (err) {
                console.log(err);
            });

            res.sendStatus(200);
        });
    });

    app.put("/student", (req, res) => {
        let user;
        let id = req.query.id;
        let studentName = req.query.studentName;
        let nextWatch = req.body.nextWatch;
        let watchSubject = req.body.watchSubject;
        
        jsonfile.readFile(file_path, function (err, content) {
                for (var i = content.length - 1; i >= 0; i--) {
                    if (content[i].id === id) {
                        console.log("updated user " + studentName + " has now username : ");
                        
                        user = content[i];
                        user.nextWatch = nextWatch;
                        user.pastWatch.push(nextWatch);
                        user.watchSubject = watchSubject;
                        user.pastWatchSubject.push(watchSubject);
                    }
                }
    
                jsonfile.writeFile(file_path, content, function (err) {
                    console.log(err);
                });
        });
        res.send(user);
    });

    app.delete("/students/destroy", (req, res) => {
        let studentName = req.body.studentName;
        jsonfile.readFile(file_path, function (err, content) {
            for (let i = content.length - 1; i >= 0; i--) {

                if (content[i].studentName === studentName) {
                    console.log("removing " + content[i].studentName + " from DB");
                    content.splice(i, 1);
                }
            }
            jsonfile.writeFile(file_path, content, function (err) {
                console.log(err);
            });
            res.sendStatus(200);
        })
    });

    app.get("/studentManage", (req, res) => {
        let user;
        let id = req.query.id;
      
        jsonfile.readFile(file_path, function(err, content) {
          for (var i = content.length - 1; i >= 0; i--) {
            if (content[i].id === id) {
              console.log("found user" + content[i]);
              user = content[i];
            }
          }
      
          res.send(user);
        });
      });

}