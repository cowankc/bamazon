
// var mysql = require("mysql");
// var inquirer = require("inquirer");
// var Table = require("cli-table");

// var connection = mysql.createConnection({
// 	host:"localhost",
// 	port:3306,
// 	user:"root",
// 	password:"password",
// 	database:"bamazon"
// });

// connection.connect(function(err){
// 	if(err)throw err;
// 	console.log("connected as id" + connection.threadId);
// });

// var displayProducts = function(){
// 	var query = "Select * FROM products";
// 	connection.query(query, function(err, res){
// 		if(err) throw err;
// 		var displayTable = new Table ({
// 			head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"],
// 			colWidths: [10,25,25,10,14]
// 		});
// 		for(var i = 0; i < res.length; i++){
// 			displayTable.push(
// 				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
// 				);
// 		}
// 		console.log(displayTable.toString());
// 		purchasePrompt();
// 	});
// }

// function purchasePrompt(){
// 	inquirer.prompt([
// 	{
// 		name: "ID",
// 		type: "input",
// 		message:"Please enter Item ID you like to purhcase.",
// 		filter:Number
// 	},
// 	{
// 		name:"Quantity",
// 		type:"input",
// 		message:"How many items do you wish to purchase?",
// 		filter:Number
// 	},

//  ]).then(function(answers){
//  	var quantityNeeded = answers.Quantity;
//  	var IDrequested = answers.ID;
//  	purchaseOrder(IDrequested, quantityNeeded);
//  });
// };

// function purchaseOrder(ID, amtNeeded){
// 	connection.query('Select * FROM products WHERE item_id = ' + ID, function(err,res){
// 		if(err){console.log(err)};
// 		if(amtNeeded <= res[0].stock_quantity){
// 			var totalCost = res[0].price * amtNeeded;
// 			console.log("Good news your order is in stock!");
// 			console.log("Your total cost for " + amtNeeded + " " +res[0].product_name + " is " + totalCost + " Thank you!");

// 			connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amtNeeded + "WHERE item_id = " + ID);
// 		} else{
// 			console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + "to complete your order.");
// 		};
// 		displayProducts();
// 	});
// };

// displayProducts(); 




let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    displayProducts();

})

function displayProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            console.log(
                results[i].item_id + " " 
                + results[i].product_name + " " 
                + "$" + results[i].price + " "
                + "Amount in Stock: " + results[i].stock_quantity + "\n");
            }
    })
    makePuchase();
}       

function makePuchase () {
    connection.query("SELECT * FROM products", function(err, results){
        inquirer
        .prompt([
            {
                name: "itemNumber",
                type: "rawlist",
                choices: function (){
                    let choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id);
                    }
                    return choiceArray;
                },
                message: "Please enter the item ID of the item you would like too buy."
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?"
            }
        ])
        .then(function(answer) {
            let chosenItem = answer.choice
            let chosenQuantity =answer.quantity
           updateStock(chosenItem, chosenQuantity)
        })
    })
}

function updateStock(item, quantity) {
    let oldQuantity = connection.query("SELECT * FROM products WHERE item_id = " + item)
    let newQuantity = oldQuantity - quantity
    connection.query("UPDATE products SET stock_quantity = " + newQuantity
     + " WHERE item_id = " + item)
	
    
    displayProducts();
    }  

