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
    displayMenu();
})

function displayMenu() {
    inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "Would you like to view products, view low inventory, add to inventory, or add new product?",
      choices: ["view products", "view low inventory", "add to inventory", "add products", "exit"]
    })
    .then(function(answer) {
      if (answer.menu === "view products") {
        viewProducts();
      }
      else if(answer.menu === "view low inventory") {
        lowInventory();
      }
      else if(answer.menu === "add to inventory") {
        addInventory();
      }
      else if(answer.menu === "add products") {
        addProduct();
      } else{
        connection.end();
      }
    });
}

function viewProducts() {
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
   displayMenu();
}       

function lowInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            if(results[i].stock_quantity < 5) {
            console.log(
                results[i].item_id + " " 
                + results[i].product_name + " " 
                + "$" + results[i].price + " "
                + "Amount in Stock: " + results[i].stock_quantity + "\n");
            }
        }
    })
   displayMenu();
}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, results){
        inquirer
        .prompt([
            {
                name: "itemName",
                type: "rawlist",
                choices: function (){
                    let choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Please select the item ID of the item you would like to add too."
            },
            {
                name: "quantity",
                type: "input",
                message: "How much would you be adding??"
            }
        ])
        .then(function(answer) {
            let chosenItem = answer.choice
            let chosenQuantity =answer.quantity
           updateInventory(chosenItem, chosenQuantity)
        })
    })
}

function updateInventory(name, quantity){
    connection.query("SELECT * FROM products WHERE product_name ? ",
    [{product_name: name }],
    function(err,res){
		if(err){console.log(err)};
		connection.query("UPDATE products SET stock_quantity = stock_quantity + " + quantity + "WHERE product_name =" + name);

		displayMenu();
	});
};


function addProduct() {
    inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the name of the item you would like to add?"
      },
      {
        name: "department",
        type: "input",
        message: "What department would you like to place your item in?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of the item?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many do you have to add?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
      }
    ])
    .then(function(answer) {
      connection.query("INSERT INTO products SET ?",
        {
          product_name: answer.item,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("Your items were successfully added!");
          displayMenu();
        }
      );
    });
}