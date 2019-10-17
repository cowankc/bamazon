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
            let chosenItem;
            let newQuantity;
            for (let i = 0; i < results.length; i++) {
                if (results[i].item_id === answer.choice) {
                    chosenItem = results[i];
                    newQuantity = chosenItem.stock_quantity - answer.quantity
                }
            }
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                {
                    stock_quantity: newQuantity
                },
                {
                    item_id: chosenItem
                }
                ],
                function(error) {
                    if (error) throw err;
                    console.log("thank you for your Puchase!");
                    displayProducts();
                  }
            )
    })
})
}