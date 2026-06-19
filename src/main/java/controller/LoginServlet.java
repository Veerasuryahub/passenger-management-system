package controller;

import dao.PassengerDAO;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.BufferedReader;

/**
 * LoginServlet - Handles user authentication
 * POST /login
 * Validates credentials and creates session.
 */
@WebServlet("/login")
public class LoginServlet extends HttpServlet {

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
            // Read JSON body
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            com.google.gson.JsonObject jsonRequest = com.google.gson.JsonParser.parseString(sb.toString()).getAsJsonObject();
            String userId = jsonRequest.has("userId") ? jsonRequest.get("userId").getAsString().trim() : "";
            String password = jsonRequest.has("password") ? jsonRequest.get("password").getAsString() : "";

            // Server-side validation
            if (userId.isEmpty() || password.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "User ID and Password are required.");
                out.print(jsonResponse.toString());
                return;
            }

            if (userId.length() < 8) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "User ID must be at least 8 characters.");
                out.print(jsonResponse.toString());
                return;
            }

            // Password validation regex
            String passwordRegex = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$";
            if (!password.matches(passwordRegex)) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Password must be at least 10 characters with 1 uppercase, 1 number, and 1 special character.");
                out.print(jsonResponse.toString());
                return;
            }

            // Authenticate
            String fullName = passengerDAO.authenticateUser(userId, password);

            if (fullName != null) {
                // Create session
                HttpSession session = request.getSession(true);
                session.setAttribute("userId", userId);
                session.setAttribute("fullName", fullName);
                session.setMaxInactiveInterval(30 * 60); // 30 minutes

                response.setStatus(HttpServletResponse.SC_OK);
                jsonResponse.addProperty("status", "success");
                jsonResponse.addProperty("message", "Login successful! Welcome, " + fullName);
                jsonResponse.addProperty("fullName", fullName);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                jsonResponse.addProperty("status", "error");
                jsonResponse.addProperty("message", "Invalid User ID or Password.");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("status", "error");
            jsonResponse.addProperty("message", "Server error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }

    /**
     * GET /login - Check session status
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("userId") != null) {
            jsonResponse.addProperty("status", "authenticated");
            jsonResponse.addProperty("userId", (String) session.getAttribute("userId"));
            jsonResponse.addProperty("fullName", (String) session.getAttribute("fullName"));
        } else {
            jsonResponse.addProperty("status", "unauthenticated");
            jsonResponse.addProperty("message", "Please login to continue.");
        }

        out.print(jsonResponse.toString());
        out.flush();
    }

    /**
     * DELETE /login - Logout (destroy session)
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        jsonResponse.addProperty("status", "success");
        jsonResponse.addProperty("message", "Logged out successfully.");

        out.print(jsonResponse.toString());
        out.flush();
    }
}
