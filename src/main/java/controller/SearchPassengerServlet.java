package controller;

import dao.PassengerDAO;
import model.Passenger;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * SearchPassengerServlet - Handles searching for a passenger by PNR
 * GET /searchPassenger?pnr=PNR1001
 */
@WebServlet("/searchPassenger")
public class SearchPassengerServlet extends HttpServlet {

    private PassengerDAO passengerDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        passengerDAO = new PassengerDAO();
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
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

            String pnrNumber = request.getParameter("pnr");

            if (pnrNumber == null || pnrNumber.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "PNR Number is required.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            pnrNumber = pnrNumber.trim();
            Passenger passenger = passengerDAO.searchPassenger(pnrNumber);

            if (passenger != null) {
                response.setStatus(HttpServletResponse.SC_OK);
                jsonResponse.addProperty("status", "success");
                jsonResponse.add("passenger", gson.toJsonTree(passenger));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Passenger with PNR '" + pnrNumber + "' not found.");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("status", "error");
            jsonResponse.addProperty("message", "Server error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }
}
