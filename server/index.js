/*=====DataBase=====*/
var dbModule = require('./database/DBMongoose');

/*=====Request=====*/
var request = require('request');

/*=====Express=====*/
var express = require('express');
var app = express();

/*=====Body-Parser=====*/
var bodyParser = require('body-parser');
app.use(bodyParser.json()); //este midleword "agrega" el body al objeto request (y en forma automatica hace un next)

/*=====CORS=====*/
var cors = require('cors')
    //Soluciona el problema de cross domain o cross origin 'Access-Control-Allow-Origin'
app.use(cors());

function refreshEmployeeToken(employee, res) {
    console.log('----REFRESH EMPLOYEE TOKEN----');
    var newToken = dbModule.TokenGenerator.generate();

    var conditions = {
        email: employee.email,
        password: employee.password
    };
    var newInfo = {
        token: newToken
    };

    dbModule.Employee.update(conditions, newInfo, {
        multi: false
    }, function(err, raw) {
        console.log('******************UPDATE USSER***************************/n');
        console.log("--ERR [?]--", err);
        console.log('--UPDATE STATUS OK--', !!(raw.ok));
        console.log('--UPDATED USSERS AMMOUNT :--', raw.nModified);

        console.log("===ENVIO ESTE TOKEN====", newToken);
        res.send(newToken);
        console.log('********************************************************/n');

    });
    return employee.token;
}

function createEmployee(email, password, res) {
    console.log('********************CREATE USER*************************/n');
    var newToken = dbModule.TokenGenerator.generate();

    var employee = new dbModule.Employee({
        "email": email,
        "password": password,
        "token": newToken
    });

    employee.save(function(err) {
        if (err) {
            console.log("[SAVE] !!Error", err);
        } else {
            console.log("[SAVE] !!Ok");
            console.log("===ENVIO ESTE TOKEN====", newToken);
            res.send(newToken);
        }
        console.log('********************************************************/n');
    });
}

/*================================================================================================= */
//eg-> auth?email=pepe@test.com&password=testpassword
app.get('/auth', function(req, res) {
    console.log("-AUTH->", req.query.email);
    console.log("-AUTH->", req.query.password);
    var newToken = '';

    dbModule.Employee.findOne({
        email: req.query.email,
        password: req.query.password
    }, function(err, emp) {
        console.log('[MONGO-GET]', emp);
        if (emp) {
            refreshEmployeeToken(emp, res);
        } else {
            /*createEmployee(req.query.email, req.query.password, res);*/
            res.status(400).send('!!Error. Account does not exist');
        }
    });
});

//eg-> http://localhost:8045/employee/1212
app.get('/employee/:empId/:empName', function(req, res) {
    console.log("-RECIBI-GET->", req.params);
    res.send("TE ENVIO DESDE GET");
});
//post crea un employee que no existe (INSERT)
app.put('/employee', function(req, res) {
    console.log("-PUT->", req.body.email);
    console.log("-PUT->", req.body.password);
    console.log("-PUT 2->", req.get('Authorization'));
    /*    console.log("-PUT->",  req.headers);
     */
    dbModule.Employee.findOne({
        token: req.get('Authorization')
    }, function(err, emp) {
        console.log('[Put]', emp);
        if (emp !== null) {
            emp.email = req.body.email;
            emp.password = req.body.password;
            emp.save();
        }
    });

    //var employee = new Employee(req.body);

    /*   employee.save(function(err) {
           if (err) {
               //err.status(400).
               console.log("[Post] !!Error", err);
           } else {
               console.log("[Post] !!Ok", employee);
           }
       });*/
});
//put actualiza un employee que existe (UPDATE)
/*app.put('/employee/:empId', function(req, res) {
    console.log("-PUT->", req.params.empId);

    Employee.find({
        name: req.params.empId
    }, function(err, doc) {
        console.log('[Put]', doc);
    });
});*/
//delte lo borra (por eso necesista el empId como el get (DELETE))
app.delete('/employee/:empId', function(req, res) {
    console.log("-DELETE->", req.params.empId);

    Employee.remove({
        name: req.params.empId
    }, function(err) {
        console.log('[DELETE]', err);
    });
});


/*================================================================================================= */
var q = "";
var limit = "";

/*app.use(express.static('../client/'));*/
app.post('/meliProxy', function(req, res) {
    console.log("MENSAJE ", req.body);
    console.log("req.query.q ", req.query.q);
    console.log("req.query.limit ", req.query.limit);
    q = req.query.q;
    limit = req.query.limit;

    request('https://api.mercadolibre.com/sites/MLA/search?q=' + q + '&limit=' + limit, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var myJson = JSON.parse(body);
            res.json(myJson.results);
        }
    });
});

app.get('/meliProxyGet', function(req, res) {
    console.log("req.query.q ", req.query.q);
    console.log("req.query.limit ", req.query.limit);
    q = req.query.q;
    limit = req.query.limit;

    request('https://api.mercadolibre.com/sites/MLA/search?q=' + q + '&limit=' + limit, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var myJson = JSON.parse(body);
            res.json(myJson.results);
        }
    });
});

var server = app.listen(3030, function() {
    console.log("+++[AppFinal.jss Running Port 3030]+++++++");
});

/*================================================================================================= */
