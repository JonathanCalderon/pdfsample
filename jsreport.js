var http = require('http');
var jsreport = require('jsreport');
var express = require ('express');
var bodyParser = require('body-parser');
var app = express();
var pdf = '';
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

http.createServer(function (req, res) {

  jsreport.render({
  	template: {
        content: "<h2>Hello world from {{this.name}}</h2>",
        recipe: "html",
        engine: "handlebars"
    },
    data: { name: "jsreport" }
  }).catch(function(e) {    
    res.end(e.message);
  });

}).listen(1337, '127.0.0.1');

app.get('/', function (req, res) {

	jsreport.render(pdf).then(function(out) {
    out.stream.pipe(res);
  }).catch(function(e) {    
    res.end(e.message);
  });

});

app.post('/', function (req, res) {

	var jsons = req.body;
	console.log('jsons'+JSON.stringify(jsons));
	var htmlSend = '<h1 align="center">Prueba PDF Mesfix</h1>';
	for (var i = 0; i < jsons.length; i++) {
    var auction = jsons[i].auction;
    var seller = jsons[i].seller;
    var acceptor = jsons[i].acceptor;
    var invoices = auction.invoices;
    htmlSend+='<br>';
		htmlSend+='<h2 style="color:#3A7EF3;">'+(i+1)+'. Auction #'+auction.id+'</h2>';
    var fecha = new Date(auction.created);
    htmlSend+='<h3 style="margin-left:50px;">Created at '+fecha.getFullYear()+'/'+(fecha.getMonth()+1)
    +'/'+fecha.getDate()+'</h3>';
    //Seller
    htmlSend+='<h3 style="margin-left:50px;"Seller</h3>';
    htmlSend+='<h4 style="margin-left:100px;">ID: '+seller.id+'</h4>';
    htmlSend+='<h4 style="margin-left:100px;">Company name: '+seller.company.name+'</h4>';
    //Acceptor
    htmlSend+='<h3 style="margin-left:50px;">Acceptor</h3>';
    htmlSend+='<h4 style="margin-left:100px;">ID: '+acceptor.id+'</h4>';
    if(acceptor && acceptor.company && acceptor.company.name)
      htmlSend+='<h4 style="margin-left:100px;">Company name: '+acceptor.company.name+'</h4>';
    //Invoices
    htmlSend+='<h3 style="margin-left:50px;">Invoices</h3>';
    for (var j = 0; j < invoices.length; j++) {
      var invoice = invoices[j];
      htmlSend+='<h4 style="margin-left:100px;">ID: '+invoice.id+'</h4>';      
      htmlSend+='<h4 style="margin-left:150px;">Gross value: '+invoice.gross_value+'</h4>'; 
      fecha = new Date(invoice.created);     
      htmlSend+='<h4 style="margin-left:150px;">Created: '+fecha.getFullYear()+'/'+(fecha.getMonth()+1)
    +'/'+fecha.getDate()+'</h4>';
    };
    htmlSend+='<br>';
	};
	pdf=htmlSend;
	res.send('Cargado')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

require('jsreport')({ httpPort: 2000}).init();
