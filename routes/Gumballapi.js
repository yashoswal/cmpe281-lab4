var restClient = require('node-rest-client').Client;
var ejs = require('ejs');

restClient = new restClient();

var args = {
	data : {},
	headers:{"Content-Type": "application/json"}
};

exports.listGumballs = function(req, res){
		
		restClient.get('http://ashishn-grailsgumballmachinever2.cfapps.io/gumballs.json', function(data, response){

			var gumballInfo = {};
			gumballInfo = data;

			var gumballData = [];

			 gumballData.push(gumballInfo[0].modelNumber);
	         gumballData.push(gumballInfo[0].serialNumber);
	         gumballData.push("NoCoinState");
	         gumballData.push(gumballInfo[0].countGumballs);
	         gumballData.push("Insert coin and then turn the crank to buy gumball");


			 res.render('index', { responsemsg : gumballData , errormsg:""});
		});
};

exports.handleOrders = function(req, res){

				var event = req.param('event');
				var gbstate = req.param('state');
				var gumballcount = req.param('count');
				var modelNo = req.param('modelNumber');
				var serialNo = req.param('serialNumber');
		
		if(event === "InsertQuarter" && gbstate === "NoCoinState"){

			gbstate='HasACoin';
			var gumballData=[];
		
			gumballData.push(modelNo);
			gumballData.push(serialNo);
			gumballData.push(gbstate);
			gumballData.push(gumballcount);
			gumballData.push("Please turn the crank");
			res.render('index', { responsemsg: gumballData });
		}


		if(event==='TurnTheCrank' && gbstate==='HasACoin'){

			var postresdata = [];

			restClient.get("http://ashishn-grailsgumballmachinever2.cfapps.io/gumballs.json", function(gbdata, response){

				var gumballInfo = {};
            	gumballInfo = gbdata;
            	var gumballcount = gumballInfo[0].countGumballs;

            	if(gumballcount !== 0){

            		gumballcount = gumballcount - 1;

            		var postargs = {
            			  data: { countGumballs: gumballcount },
            			  headers:{"Content-Type": "application/json"} 
            			};

            		restClient.put("http://ashishn-grailsgumballmachinever2.cfapps.io/gumballs/1", postargs, function(data,response) {
            	      // parsed response body as js object
            	    console.log(gbdata);
            	    // raw response
            	    console.log(response);
            	    
            	    postresdata.push(modelNo);
            	    postresdata.push(serialNo);
            	    postresdata.push("NoCoinState");
            	    postresdata.push(gumballcount);
            	    postresdata.push("Here is your gumball. Enjoy!");
            	    
            		res.render('index', { responsemsg: postresdata, errormsg:"" });
            	});
            	
            	}
            	else if(gumballcount === 0)
            	{
            		var postdata = []

            	    postdata.push(modelNo);
            	    postdata.push(serialNo);
            	    postdata.push("NoCoinState");
            	    postdata.push(0);
					postdata.push("Out of Inventory");
	          		res.render('index', { responsemsg: postdata });
            	}
			});
		}
		if(event==='TurnTheCrank' && gbstate==='NoCoinState'){

			var gumballData=[];
		
			gumballData.push(modelNo);
			gumballData.push(serialNo);
			gumballData.push(gbstate);
			gumballData.push(gumballcount);
			gumballData.push("Error Occured : Please insert quarter then turn the crank");
			res.render('index', { responsemsg: gumballData });
		}
};