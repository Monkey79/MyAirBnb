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

/*=====JWT=====*/
var jwt = require('jwt-simple');
var secret = 'asdasdasdsadasdasda';
var apartmentsModel = require('./models/apartments')

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
            res.status(400).send('!!Sorry, you are not registered, please create an account.');
        }
    });
});


app.get('/user/token', function(req, res) {
    console.log("-AUTH->", req.query.email);
    console.log("-AUTH->", req.query.password);

    var query = {
        email: req.query.email,
        password : req.query.password
    }

    dbModule.Employee.findOne(query,function(err,user){
        console.log('---ID---',user._id);
        if(user){
            var tokenPayload = {id:user._id}

            res.json({toke:jwt.encode(tokenPayload,secret)})
        }else{
            res.status(401).json({error:'email o password erroneos'})
        }
    });
});

app.post('/apartments', function(req,res){
    try{
        var decodeUser = jwt.decode(req.headers.authorization, secret); //me devuelve el objeto json (decodificado)
    }catch(e){
        res.status(400).json({error:'invalid token'});
    }

    if(decodeUser.id){
       var newAppartment = new apartmentsModel(req.body);
       console.log('DECODE ',decodeUser.id);
       newAppartment.owner = decodeUser.id;

       newAppartment.save(function(err){
            if(!err){
                res.json(newAppartment);
            }else{
                res.status(400).json({error:'algo paso'});
            }
        });
    }
})


//post crea un employee que no existe (INSERT)
app.post('/user', function(req, res) {
    console.log("-PUT->", req.body.email);
    console.log("-PUT->", req.body.password);
    console.log("-PUT 2->", req.get('Authorization'));

    var employee = new dbModule.Employee({
        "email": req.body.email,
        "password": req.body.password,
        "token": dbModule.TokenGenerator.generate()
    });
    employee.save(function(err) {
        res.send(employee.token);
    });
});

//put actualiza un employee ya existente (UPDATE)
app.put('/user', function(req, res) {
    console.log("-PUT->", req.body.email);
    console.log("-PUT->", req.body.password);
    console.log("-PUT 2->", req.get('Authorization'));
    /*    console.log("-PUT->",  req.headers);
     */
    dbModule.Employee.findOne({
        token: req.get('Authorization')
    }, function(err, emp) {
        console.log('[Put]', emp);
        if (!!emp) {
            emp.email = req.body.email;
            emp.password = req.body.password;
            emp.save();
            createEmployee()
        }
    });
});

//eg-> http://localhost:8045/employee/1212
app.get('/employee/:empId/:empName', function(req, res) {
    console.log("-RECIBI-GET->", req.params);
    res.send("TE ENVIO DESDE GET");
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
