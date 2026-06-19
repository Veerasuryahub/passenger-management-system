package controller;

import dao.PassengerDAO;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * DeletePassengerServlet - Handles deleting passenger records
 * DELETE /deletePassenger?pnr=PNR1001
 */
@WebServlet("/deletePassenger")
public class DeletePassengerServlet extends HttpServlet {

    private PassengerDAO passengerDAO;

    @Override
    public void init() throws ServletException {
        passengerDAO = new PassengerDAO();
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
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

            // Check PNR exists
            if (!passengerDAO.pnrExists(pnrNumber)) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Passenger with PNR '" + pnrNumber + "' not found.");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            boolean success = passengerDAO.deletePassenger(pnrNumber);

            if (success) {
                response.setStatus(HttpServletResponse.SC_OK);
                jsonResponse.addProperty("status", "success");
                jsonResponse.addProperty("message", "Passenger deleted successfully!");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Unable to delete passenger. Please try again.");
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
