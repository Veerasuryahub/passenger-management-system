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
import java.util.List;

/**
 * ViewPassengerServlet - Handles viewing all passenger records
 * GET /viewPassengers
 * Also returns dashboard stats (totalPassengers, totalRevenue)
 */
@WebServlet("/viewPassengers")
public class ViewPassengerServlet extends HttpServlet {

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

            List<Passenger> passengers = passengerDAO.viewAllPassengers();
            int totalPassengers = passengerDAO.getTotalPassengers();
            double totalRevenue = passengerDAO.getTotalRevenue();

            response.setStatus(HttpServletResponse.SC_OK);
            jsonResponse.addProperty("status", "success");
            jsonResponse.add("passengers", gson.toJsonTree(passengers));
            jsonResponse.addProperty("totalPassengers", totalPassengers);
            jsonResponse.addProperty("totalRevenue", totalRevenue);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("status", "error");
            jsonResponse.addProperty("message", "Server error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }
}
