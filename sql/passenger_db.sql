-- =========================================================
-- Passenger Management System - Database Script
-- Database: passenger_db
-- Author: Passenger Management System Team
-- Date: 2026-06-19
-- =========================================================

-- =========================================================
-- CREATE DATABASE
-- =========================================================

CREATE DATABASE IF NOT EXISTS passenger_db;

USE passenger_db;

-- =========================================================
-- CREATE USERS TABLE (for login authentication)
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    userId      VARCHAR(50)     PRIMARY KEY,
    password    VARCHAR(255)    NOT NULL,
    fullName    VARCHAR(100)    NOT NULL
);

-- =========================================================
-- CREATE PASSENGER TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS passenger (
    pnrNumber       VARCHAR(20)     PRIMARY KEY,
    passengerName   VARCHAR(100)    NOT NULL,
    age             INT             NOT NULL,
    gender          VARCHAR(20)     NOT NULL,
    origin          VARCHAR(50)     NOT NULL,
    destination     VARCHAR(50)     NOT NULL,
    trainNumber     VARCHAR(20)     NOT NULL,
    ticketPrice     DOUBLE          NOT NULL
);

-- =========================================================
-- INSERT DEFAULT ADMIN USER
-- =========================================================

INSERT INTO users (userId, password, fullName) VALUES
('admin001', 'Admin@1234', 'System Administrator'),
('agent001', 'Agent@12345', 'Travel Agent Surya'),
('agent002', 'Agent@67890', 'Travel Agent Arun');

-- =========================================================
-- INSERT SAMPLE PASSENGER DATA (15 records)
-- =========================================================

INSERT INTO passenger (pnrNumber, passengerName, age, gender, origin, destination, trainNumber, ticketPrice) VALUES
('PNR1001', 'Surya Kumar',       22, 'Male',   'Madurai',      'Chennai',      'TN001', 650.00),
('PNR1002', 'Arun Prakash',      25, 'Male',   'Coimbatore',   'Salem',        'TN002', 500.00),
('PNR1003', 'Priya Sharma',      30, 'Female', 'Delhi',        'Mumbai',       'RJ001', 1250.00),
('PNR1004', 'Rajesh Verma',      45, 'Male',   'Bangalore',    'Hyderabad',    'KA001', 850.00),
('PNR1005', 'Meena Kumari',      28, 'Female', 'Kolkata',      'Patna',        'WB001', 450.00),
('PNR1006', 'Vikram Singh',      35, 'Male',   'Jaipur',       'Ahmedabad',    'RJ002', 700.00),
('PNR1007', 'Ananya Reddy',      21, 'Female', 'Hyderabad',    'Visakhapatnam','AP001', 550.00),
('PNR1008', 'Karthik Rajan',     33, 'Male',   'Chennai',      'Trichy',       'TN003', 350.00),
('PNR1009', 'Divya Nair',        27, 'Female', 'Kochi',        'Trivandrum',   'KL001', 300.00),
('PNR1010', 'Arjun Patel',       40, 'Male',   'Ahmedabad',    'Surat',        'GJ001', 400.00),
('PNR1011', 'Sneha Iyer',        24, 'Female', 'Pune',         'Mumbai',       'MH001', 250.00),
('PNR1012', 'Rahul Gupta',       29, 'Male',   'Lucknow',      'Delhi',        'UP001', 600.00),
('PNR1013', 'Kavitha Pillai',    31, 'Female', 'Trivandrum',   'Bangalore',    'KL002', 950.00),
('PNR1014', 'Deepak Mishra',     38, 'Male',   'Varanasi',     'Kolkata',      'UP002', 750.00),
('PNR1015', 'Lakshmi Devi',      26, 'Female', 'Madurai',      'Coimbatore',   'TN004', 280.00);

-- =========================================================
-- VERIFICATION QUERIES
-- =========================================================

-- SELECT * FROM users;
-- SELECT * FROM passenger;
-- SELECT COUNT(*) AS total_passengers FROM passenger;
-- SELECT SUM(ticketPrice) AS total_revenue FROM passenger;

-- =========================================================
-- DROP COMMANDS (Use with caution!)
-- =========================================================

-- DROP TABLE IF EXISTS passenger;
-- DROP TABLE IF EXISTS users;
-- DROP DATABASE IF EXISTS passenger_db;
