-- Active: 1733302921162@@127.0.0.1@3306@flowers_shop


select * from customers where id in
(SELECT customer_id FROM orders where id in
(select customer_id FROM order_details where flower_id in
(SELECT id FROM flowers WHERE name LIKE "%At%"))
AND order_date BETWEEN "2024-01-01" AND "2024-12-31")

SELECT * from orders

SELECT * from order_details

show tables

customer last and first name date and status

SELECT * FROM flowers
JOIN order_details on order_details.flower_id = flowers.id
JOIN orders on orders.id = order_details.order_id
JOIN customers on customer_id = orders.customer_id
JOIN status on orders.status_id = status.id
WHERE customers.first_name like "%Aziz%"
AND customers.last_name LIKE "%Tursunov%"
AND orders.order_date BETWEEN "2024-12-01" AND "2024-12-31"
AND status.name = "Yetkazildi"


create Procedure selectCustomersById(IN customerId INT)
Begin
    SELECT * from customers WHERE id = customerId;
END

CALL selectCustomersById(5)

CREATE PROCEDURE getCustomerName(IN customerId int, OUT customerName VARCHAR(255))
BEGIN
    SELECT first_name into customerName FROM customers WHERE id = customerId;
END

CALL getCustomerName(3, @customerName)

SELECT @customerName as customer_name


CREATE PROCEDURE resOut(INOUT res int)
BEGIN
    SET res = res + 100;
END

set @res=50

CALL `resOut`(@res)

SELECT @res


CREATE Function getRowsCount() RETURNS INT DETERMINISTIC
BEGIN
    DECLARE counter INT DEFAULT 0;
    SELECT COUNT(*) into counter from flowers;
    RETURN counter;
END

SELECT `getRowsCount`()


SHOW PROCEDURE STATUS where DB="flowers_shop"




SELECT * FROM flowers

create Procedure makeAllNamesUppercase()
BEGIN
    UPDATE flowers set name = UPPER(name);
END

CALL `makeAllNamesUppercase`


create Procedure selectAllFlowers()
Begin
    SELECT * from flowers;
END