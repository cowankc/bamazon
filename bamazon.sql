CREATE DATABASE bamazon; 
USE bamazon;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT Primary KEY ,
    product_name VARCHAR(100),
    department_name VARCHAR(150),
    price INTEGER(11),
    stock_quantity INTEGER(11)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Yellow Couch", "furniture", 650, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("wooden table", "furniture", 350, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("blue sweater", "fashion", 15, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("red jeans", "fashion", 20, 29);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("leather gloves", "fashion", 12, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("microwave", "appliances", 85, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("espresso machine", "appliances", 110, 17);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("playstation 4", "electronics", 200, 56);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("wireless headphones", "electronics", 150, 33);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("moutain bike", "sports", 235, 15);