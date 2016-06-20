-- CREATE DATABASE Bamazon;

USE Bamazon;

-- CREATE TABLE Products(ItemID int(4) PRIMARY KEY NOT NULL,
                      ProductName varchar(25),
                      DepartmentName varchar(30),
                      Price float(5,2),
                      StockQuantity int(2))
                      
SELECT * FROM products 


ALTER TABLE products
CHANGE COLUMN ItemID ItemID int(4) NOT NULL auto_increment

INSERT INTO products (productname, 
                      departmentname,
                      price,
                      stockquantity) VALUES ('Samsung Galaxy S7 Edge', 'Electronics', 750, 20) 


ALTER TABLE products auto_increment=1000

SELECT * FROM products

INSERT INTO products (productname, 
                      departmentname,
                      price,
                      stockquantity) VALUES ('Apple Ipad', 'Electronics', 999, 70), ('Mandarin oranges', 'grocery', 0.50, 90), ('kiwi', 'grocery', 0.25, 99)
                      
ALTER TABLE products MODIFY COLUMN Price float(7,2)  

UPDATE products SET StockQuantity=150 WHERE ItemID=1001  

UPDATE products SET StockQuantity=101 WHERE ItemID=1003 

ALTER TABLE products MODIFY COLUMN StockQuantity int(3)   

ALTER TABLE products MODIFY COLUMN ProductName varchar(35)  
ALTER TABLE products MODIFY COLUMN ProductName varchar(40)             

INSERT INTO products (productname, departmentname, price, stockquantity) 
	VALUES ('MREs', 'outdoor sports', 80, 15), 
		   ('Air Jordan 12 Retro', 'shoes', 725, 5), 
           ('Louis Vuitton Paradiso Sandal', 'shoes', 1070, 2),
           ('Joyce Meyer\'s BattleField of the Mind', 'Movies, Music, & Books', 8.50, 50), 
           ('Captain America: Civil War', 'Movies, Music, & Books', 19.99, 15), 
           ('Alienware 13', 'Electronics', 1020, 3)  