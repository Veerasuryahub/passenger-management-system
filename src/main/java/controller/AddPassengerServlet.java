package controller;

import dao.PassengerDAO;
import model.Passenger;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * AddPassengerServlet - Handles adding new passenger records
 * POST /addPassenger
 */
@WebServlet("/addPassenger")
public class AddPassengerServlet extends HttpServlet {

    private PassengerDAO passengerDAO;

    @Override
    public void init() throws ServletException {
        passengerDAO = new PassengerDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        try {
            // Session check
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Please login to continue.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            // Read JSON body
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            JsonObject jsonRequest = JsonParser.parseString(sb.toString()).getAsJsonObject();

            // Extract fields
            String pnrNumber = getJsonString(jsonRequest, "pnrNumber");
            String passengerName = getJsonString(jsonRequest, "passengerName");
            String ageStr = getJsonString(jsonRequest, "age");
            String gender = getJsonString(jsonRequest, "gender");
            String origin = getJsonString(jsonRequest, "origin");
            String destination = getJsonString(jsonRequest, "destination");
            String trainNumber = getJsonString(jsonRequest, "trainNumber");
            String ticketPriceStr = getJsonString(jsonRequest, "ticketPrice");

            // Validate all fields are present
            if (pnrNumber.isEmpty() || passengerName.isEmpty() || ageStr.isEmpty() ||
                gender.isEmpty() || origin.isEmpty() || destination.isEmpty() ||
                trainNumber.isEmpty() || ticketPriceStr.isEmpty()) {

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "All fields are mandatory.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            // Check for duplicate PNR
            if (passengerDAO.pnrExists(pnrNumber)) {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "PNR Number '" + pnrNumber + "' already exists. Duplicate PNR not allowed.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            // Parse and validate age
            int age;
            try {
                age = Integer.parseInt(ageStr);
                if (age <= 0 || age > 120) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.addProperty("status", "error");
                    jsonResponse.addProperty("message", "Age must be between 1 and 120.");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Age must be a valid number.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            // Parse and validate ticket price
            double ticketPrice;
            try {
                ticketPrice = Double.parseDouble(ticketPriceStr);
                if (ticketPrice <= 0) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.addProperty("status", "error");
                    jsonResponse.addProperty("message", "Ticket price must be greater than 0.");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Ticket price must be a valid number.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            // Create passenger object
            Passenger passenger = new Passenger(pnrNumber, passengerName, age, gender, origin, destination, trainNumber, ticketPrice);

            // Insert into database
            boolean success = passengerDAO.insertPassenger(passenger);

            if (success) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                jsonResponse.addProperty("status", "success");
                jsonResponse.addProperty("message", "Passenger added successfully!");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Unable to add passenger. Please try again.");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("status", "error");
            jsonResponse.addProperty("message", "Server error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }

    private String getJsonString(JsonObject json, String key) {
        return json.has(key) && !json.get(key).isJsonNull() ? json.get(key).getAsString().trim() : "";
    }
}
