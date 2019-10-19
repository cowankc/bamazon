
let mysql = require("mysql");
let inquirer = require("inquirer");
let confirm = require('inquirer-confirm');
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
    displayProducts();

})

function displayProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log(divider + "Our Products" + divider)
        for (let i = 0; i < results.length; i++) {
            console.log(
                results[i].item_id + " " 
                + results[i].product_name + " " 
                + "$" + results[i].price + " "
                + "Amount in Stock: " + results[i].stock_quantity + "\n");
            }
        console.log(divider)
        makePuchase();
    })
}       

function makePuchase () {
    connection.query("SELECT * FROM products", function(err, results){
        inquirer
        .prompt([
            {
                name: "itemNumber",
                type: "input",
                message: "Please enter the item ID of the item you would like too buy.",
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
                message: "How many would you like to purchase?"
            }
        ])
        .then(function(input) {
            let chosenItem = input.itemNumber
            let chosenQuantity =input.quantity
            let queryStr = "SELECT * FROM products WHERE ?";
            connection.query(queryStr, {item_id: chosenItem}, function(err, data) {
                if (err) throw err;
                if (data.length === 0) {
                    console.log("ERROR:Please select an Item ID from our product list.");
                    displayProducts();
                }
                else {
                    let productData = data[0];
                    if (chosenQuantity <= productData.stock_quantity) {
                        console.log("Your item is in stock!");
                        let updateQueryStr ="UPDATE products SET stock_quantity = " + (productData.stock_quantity - chosenQuantity) + " WHERE item_id = "  + chosenItem;
                        connection.query(updateQueryStr, function(err, data) {
                            if (err) throw err;
                            console.log("Your total is $" + productData.price * chosenQuantity);
                            console.log("Thank you for your Business!");
                            console.log(divider);
                            confirm('Would you like to make another purchase?')
                            .then(function confirmed() {
                                displayProducts();
                            }, function cancelled() {
                                connection.end();
                            });
                        })
                    } else {
                        console.log("Sorry we do not have enough in stock of this item to complete your order, please place another order");
                        console.log(divider);
                        displayProducts();
                    }
                }
            })          
        })
    })
}


