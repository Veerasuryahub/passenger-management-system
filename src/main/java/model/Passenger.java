package model;

/**
 * Passenger Model / POJO
 * Represents a passenger record in the system.
 */
public class Passenger {

    private String pnrNumber;
    private String passengerName;
    private int age;
    private String gender;
    private String origin;
    private String destination;
    private String trainNumber;
    private double ticketPrice;

    /** Default constructor */
    public Passenger() {
    }

    /** Parameterized constructor */
    public Passenger(String pnrNumber, String passengerName, int age, String gender,
                     String origin, String destination, String trainNumber, double ticketPrice) {
        this.pnrNumber = pnrNumber;
        this.passengerName = passengerName;
        this.age = age;
        this.gender = gender;
        this.origin = origin;
        this.destination = destination;
        this.trainNumber = trainNumber;
        this.ticketPrice = ticketPrice;
    }

    // ==================== Getters ====================

    public String getPnrNumber() {
        return pnrNumber;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public int getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getOrigin() {
        return origin;
    }

    public String getDestination() {
        return destination;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public double getTicketPrice() {
        return ticketPrice;
    }

    // ==================== Setters ====================

    public void setPnrNumber(String pnrNumber) {
        this.pnrNumber = pnrNumber;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
    }

    public void setTicketPrice(double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    // ==================== toString ====================

    @Override
    public String toString() {
        return "Passenger{" +
                "pnrNumber='" + pnrNumber + '\'' +
                ", passengerName='" + passengerName + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", trainNumber='" + trainNumber + '\'' +
                ", ticketPrice=" + ticketPrice +
                '}';
    }
}
