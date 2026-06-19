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
 * UpdatePassengerServlet - Handles updating existing passenger records
 * PUT /updatePassenger
 * PNR Number cannot be modified.
 */
@WebServlet("/updatePassenger")
public class UpdatePassengerServlet extends HttpServlet {

    private PassengerDAO passengerDAO;

    @Override
    public void init() throws ServletException {
        passengerDAO = new PassengerDAO();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
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

            String pnrNumber = getJsonString(jsonRequest, "pnrNumber");
            String passengerName = getJsonString(jsonRequest, "passengerName");
            String ageStr = getJsonString(jsonRequest, "age");
            String gender = getJsonString(jsonRequest, "gender");
            String origin = getJsonString(jsonRequest, "origin");
            String destination = getJsonString(jsonRequest, "destination");
            String trainNumber = getJsonString(jsonRequest, "trainNumber");
            String ticketPriceStr = getJsonString(jsonRequest, "ticketPrice");

            // Validate
            if (pnrNumber.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "PNR Number is required.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            if (passengerName.isEmpty() || ageStr.isEmpty() || gender.isEmpty() ||
                origin.isEmpty() || destination.isEmpty() || trainNumber.isEmpty() ||
                ticketPriceStr.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "All fields are mandatory.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            // Check PNR exists
            if (!passengerDAO.pnrExists(pnrNumber)) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Passenger with PNR '" + pnrNumber + "' not found.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

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

            Passenger passenger = new Passenger(pnrNumber, passengerName, age, gender, origin, destination, trainNumber, ticketPrice);
            boolean success = passengerDAO.updatePassenger(passenger);

            if (success) {
                response.setStatus(HttpServletResponse.SC_OK);
                jsonResponse.addProperty("status", "success");
                jsonResponse.addProperty("message", "Passenger updated successfully!");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Unable to update passenger. Please try again.");
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
