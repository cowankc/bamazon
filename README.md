# bamazon
This is a node application that can be used in two diffferent ways to simulate a virtual shop. The first way this can be used is by calling the bamazonCustomer.js file with node. This will allow the user to act as a customer and choose a product they would like to purchase, and the amount they want to purchase as well. It will then tell them they amount of their order and check to see if they would like to do another purchase. The second part of this application allows the user to act as the manager for the shop and have more control over the inventory. By entering bamazonManager.js into their CLI with node, the user will be able to 

-veiw products, which shows the products id, their name, price, and the amount in stock.  
-add new products, which lets the user enter in a new item name and set the price and quantity.
-check low inventory, which will display all the products that have intentories less then 5,
-add to their inventory, which will allow the user to restock their selected item. 

The application uses a Mysql database to keep the product data store and inquirer to create prompts for the user to choose from. In order to run the application the user must have Mysql and node.js installed along with needing to install the node packages of inquirer, mysql, and inquirer-confirm. It ws created by Kevin Cowan as a project to show how to uses node applications with a database to store and show data. For a video demo of the application please click the link below :

https://www.youtube.com/watch?v=-T-s60hax08&feature=youtu.be 
