var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bazaar',
  debug	   : false,
  multipleStatements: true,
  timezone: '-05:30'
});

connection.connect(function(err){
	if(err){
		console.log('Some Errors');
		throw err
	}
	else
	{
		console.log('Database Connected');
	}

});

module.exports = connection;