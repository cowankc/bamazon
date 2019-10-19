let mysql = require("mysql");
let inquirer = require("inquirer");
let divider = "\n---------------------------------------------------------------------\n"

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
  console.log(divider)
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
  console.log(divider)
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log(divider + "All Products" + divider)
        for (let i = 0; i < results.length; i++) {
            console.log(
                results[i].item_id + " " 
                + results[i].product_name + " " 
                + "$" + results[i].price + " "
                + "Amount in Stock: " + results[i].stock_quantity + "\n");
            }
            console.log(divider)
            displayMenu();
    })
}       

function lowInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log(divider + "Low Products" + divider)
        for (let i = 0; i < results.length; i++) {
            if(results[i].stock_quantity < 5) {
            console.log(
                results[i].item_id + " " 
                + results[i].product_name + " " 
                + "$" + results[i].price + " "
                + "Amount in Stock: " + results[i].stock_quantity + "\n");
            }
        }
        console.log(divider)
        displayMenu();
    })
}

function addInventory() {
  connection.query("SELECT * FROM products", function(err, results){
    inquirer
      .prompt([
        {
          name: "itemNumber",
          type: "input",
          message: "Please enter the item ID of the item you would like to add too.",
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
          message: "How many will you be adding?"
        }
        ])
      .then(function(input) {
        let chosenItem = input.itemNumber
        let chosenQuantity =input.quantity
        let queryStr = "SELECT * FROM products WHERE ?";
        connection.query(queryStr, {item_id: chosenItem}, function(err, data) {
          if (err) throw err;
          if (data.length === 0) {
            console.log("ERROR: Please use an Item ID from the product list.");
            displayMenu();
            }
          else {
            let productData = data[0];
            let updateQueryStr ="UPDATE products SET stock_quantity = " + (productData.stock_quantity + chosenQuantity) + " WHERE item_id = "  + chosenItem;
            connection.query(updateQueryStr, function(err, data) {
              if (err) throw err;
              console.log("You succefully added " + chosenQuantity + " more to item " + chosenItem + "!");
              console.log(divider);
              displayMenu();
              })
            }
          })          
        })
    })
}



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
          console.log(divider)
          console.log("Your items were successfully added!");
          console.log(divider)
          displayMenu();
        }
      );
    });
}