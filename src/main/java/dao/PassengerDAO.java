package dao;

import model.Passenger;
import util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Passenger Data Access Object (DAO)
 * Handles all database CRUD operations for passenger records.
 * Uses PreparedStatement to prevent SQL injection.
 */
public class PassengerDAO {

    // ==================== INSERT PASSENGER ====================

    /**
     * Inserts a new passenger record into the database.
     *
     * @param passenger the passenger to insert
     * @return true if insertion was successful, false otherwise
     */
    public boolean insertPassenger(Passenger passenger) {
        String sql = "INSERT INTO passenger (pnrNumber, passengerName, age, gender, origin, destination, trainNumber, ticketPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            ps.setString(1, passenger.getPnrNumber());
            ps.setString(2, passenger.getPassengerName());
            ps.setInt(3, passenger.getAge());
            ps.setString(4, passenger.getGender());
            ps.setString(5, passenger.getOrigin());
            ps.setString(6, passenger.getDestination());
            ps.setString(7, passenger.getTrainNumber());
            ps.setDouble(8, passenger.getTicketPrice());

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("Error inserting passenger: " + e.getMessage());
            return false;
        } finally {
            closeResources(connection, ps, null);
        }
    }

    // ==================== UPDATE PASSENGER ====================

    /**
     * Updates an existing passenger record.
     * PNR number cannot be modified.
     *
     * @param passenger the passenger with updated details
     * @return true if update was successful, false otherwise
     */
    public boolean updatePassenger(Passenger passenger) {
        String sql = "UPDATE passenger SET passengerName=?, age=?, gender=?, origin=?, destination=?, trainNumber=?, ticketPrice=? WHERE pnrNumber=?";
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            ps.setString(1, passenger.getPassengerName());
            ps.setInt(2, passenger.getAge());
            ps.setString(3, passenger.getGender());
            ps.setString(4, passenger.getOrigin());
            ps.setString(5, passenger.getDestination());
            ps.setString(6, passenger.getTrainNumber());
            ps.setDouble(7, passenger.getTicketPrice());
            ps.setString(8, passenger.getPnrNumber());

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("Error updating passenger: " + e.getMessage());
            return false;
        } finally {
            closeResources(connection, ps, null);
        }
    }

    // ==================== DELETE PASSENGER ====================

    /**
     * Deletes a passenger record by PNR number.
     *
     * @param pnrNumber the PNR of the passenger to delete
     * @return true if deletion was successful, false otherwise
     */
    public boolean deletePassenger(String pnrNumber) {
        String sql = "DELETE FROM passenger WHERE pnrNumber=?";
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            ps.setString(1, pnrNumber);

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("Error deleting passenger: " + e.getMessage());
            return false;
        } finally {
            closeResources(connection, ps, null);
        }
    }

    // ==================== SEARCH PASSENGER ====================

    /**
     * Searches for a passenger by PNR number.
     *
     * @param pnrNumber the PNR to search for
     * @return Passenger object if found, null otherwise
     */
    public Passenger searchPassenger(String pnrNumber) {
        String sql = "SELECT * FROM passenger WHERE pnrNumber=?";
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            ps.setString(1, pnrNumber);
            rs = ps.executeQuery();

            if (rs.next()) {
                return extractPassenger(rs);
            }
            return null;

        } catch (SQLException e) {
            System.err.println("Error searching passenger: " + e.getMessage());
            return null;
        } finally {
            closeResources(connection, ps, rs);
        }
    }

    // ==================== VIEW ALL PASSENGERS ====================

    /**
     * Retrieves all passenger records from the database.
     *
     * @return List of all passengers
     */
    public List<Passenger> viewAllPassengers() {
        String sql = "SELECT * FROM passenger ORDER BY pnrNumber";
        List<Passenger> passengers = new ArrayList<>();
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                passengers.add(extractPassenger(rs));
            }

        } catch (SQLException e) {
            System.err.println("Error viewing passengers: " + e.getMessage());
        } finally {
            closeResources(connection, ps, rs);
        }

        return passengers;
    }

    // ==================== GET TOTAL PASSENGERS ====================

    /**
     * Returns the total count of passengers.
     *
     * @return total number of passenger records
     */
    public int getTotalPassengers() {
        String sql = "SELECT COUNT(*) AS total FROM passenger";
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getInt("total");
            }

        } catch (SQLException e) {
            System.err.println("Error counting passengers: " + e.getMessage());
        } finally {
            closeResources(connection, ps, rs);
        }

        return 0;
    }

    // ==================== GET TOTAL REVENUE ====================

    /**
     * Returns the total revenue from all ticket prices.
     *
     * @return sum of all ticket prices
     */
    public double getTotalRevenue() {
        String sql = "SELECT COALESCE(SUM(ticketPrice), 0) AS revenue FROM passenger";
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getDouble("revenue");
            }

        } catch (SQLException e) {
            System.err.println("Error calculating revenue: " + e.getMessage());
        } finally {
            closeResources(connection, ps, rs);
        }

        return 0.0;
    }

    // ==================== CHECK PNR EXISTS ====================

    /**
     * Checks if a PNR number already exists in the database.
     *
     * @param pnrNumber the PNR to check
     * @return true if PNR exists, false otherwise
     */
    public boolean pnrExists(String pnrNumber) {
        String sql = "SELECT COUNT(*) AS cnt FROM passenger WHERE pnrNumber=?";
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            ps.setString(1, pnrNumber);
            rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getInt("cnt") > 0;
            }

        } catch (SQLException e) {
            System.err.println("Error checking PNR: " + e.getMessage());
        } finally {
            closeResources(connection, ps, rs);
        }

        return false;
    }

    // ==================== AUTHENTICATE USER ====================

    /**
     * Authenticates a user for login.
     *
     * @param userId   the user ID
     * @param password the password
     * @return the full name if authentication succeeds, null otherwise
     */
    public String authenticateUser(String userId, String password) {
        String sql = "SELECT fullName FROM users WHERE userId=? AND password=?";
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            connection = DBConnection.getConnection();
            ps = connection.prepareStatement(sql);
            ps.setString(1, userId);
            ps.setString(2, password);
            rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getString("fullName");
            }

        } catch (SQLException e) {
            System.err.println("Error authenticating user: " + e.getMessage());
        } finally {
            closeResources(connection, ps, rs);
        }

        return null;
    }

    // ==================== HELPER METHODS ====================

    /**
     * Extracts a Passenger object from a ResultSet row.
     */
    private Passenger extractPassenger(ResultSet rs) throws SQLException {
        Passenger passenger = new Passenger();
        passenger.setPnrNumber(rs.getString("pnrNumber"));
        passenger.setPassengerName(rs.getString("passengerName"));
        passenger.setAge(rs.getInt("age"));
        passenger.setGender(rs.getString("gender"));
        passenger.setOrigin(rs.getString("origin"));
        passenger.setDestination(rs.getString("destination"));
        passenger.setTrainNumber(rs.getString("trainNumber"));
        passenger.setTicketPrice(rs.getDouble("ticketPrice"));
        return passenger;
    }

    /**
     * Closes database resources safely.
     */
    private void closeResources(Connection connection, PreparedStatement ps, ResultSet rs) {
        try {
            if (rs != null) rs.close();
        } catch (SQLException e) {
            System.err.println("Error closing ResultSet: " + e.getMessage());
        }
        try {
            if (ps != null) ps.close();
        } catch (SQLException e) {
            System.err.println("Error closing PreparedStatement: " + e.getMessage());
        }
        DBConnection.closeConnection(connection);
    }
}
