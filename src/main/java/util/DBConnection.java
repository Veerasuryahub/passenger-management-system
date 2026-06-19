package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Database Connection Utility
 * Manages MySQL database connections for the Passenger Management System.
 * Uses JDBC with MySQL Connector/J driver.
 */
public class DBConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/passenger_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "root";
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";

    static {
        try {
            Class.forName(DRIVER);
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found: " + e.getMessage());
            throw new RuntimeException("Failed to load MySQL JDBC Driver", e);
        }
    }

    /**
     * Returns a new database connection.
     * Each caller is responsible for closing the connection.
     *
     * @return Connection object to passenger_db
     * @throws SQLException if connection fails
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    /**
     * Closes a database connection safely.
     *
     * @param connection the connection to close
     */
    public static void closeConnection(Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}
