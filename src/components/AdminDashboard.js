import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substr(0, 10)
  );

  useEffect(() => {
    if (!user || !user.accessToken) {
      navigate("/login");
    } else if (!user.roles.includes("ROLE_ADMIN")) {
      navigate("/error");
    }
  }, [user, navigate]);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/appointments/${selectedDate}`,
        {
          headers: {
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );
      setAppointments(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAppointments([]);
      } else {
        console.error("Getting appointments is unsucceessful", error);
      }
    }
  }, [selectedDate, user.accessToken]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getAppointmentStatus = (appointmentDate, appointmentTime) => {
    const now = new Date();
    const appointmentDateTime = new Date(
      `${appointmentDate}T${appointmentTime}:00`
    );
    if (now >= appointmentDateTime) return "past";
    return "future";
  };

  const cancelAppointment = async (
    appointmentId,
    appointmentDate,
    appointmentTime
  ) => {
    const status = getAppointmentStatus(appointmentDate, appointmentTime);
    if (status === "past") {
      alert("This is past appointment.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/admin/appointments/${appointmentId}`,
        {
          headers: {
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );
      fetchAppointments();
      alert("Appointment is successfully canceled.");
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 409:
            alert("Past appointment can't be canceled.");
            break;
          case 401:
            alert("Unauthorized user.");
            break;
          default:
            console.error("Unsuccessful cancelation:", error);
            alert("Unsuccessful cancelation:");
        }
      } else {
        console.error("Failed to cancel appointment:", error);
      }
    }
  };

  const formatTime = (timeArray) => {
    if (!Array.isArray(timeArray)) {
      console.error("timeString is not an array:", timeArray);
      return "";
    }

    const [hour, minute] = timeArray;
    return `${hour}:${String(minute).padStart(2, "0")}`;
  };

  const getLocalizedService = (serviceType) => {
    switch (serviceType) {
      case "HAIR":
        return "Haircut";
      case "BEARD":
        return "Beard";
      case "HAIR_AND_BEARD":
        return "Haircut and Beard";
      default:
        return serviceType;
    }
  };

  return (
    <div className="container">
      <h1>Schedule</h1>
      <div className="card p-3 border-0">
        <label>
          <strong>Date:</strong>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-control"
          />
        </label>

        <table
          className="table"
          style={{ border: "2px solid black", textAlign: "center" }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid black" }}>
              <th
                style={{
                  borderRight: "2px solid black",
                  borderBottom: "2px solid black",
                }}
              >
                Name
              </th>
              <th
                style={{
                  borderRight: "2px solid black",
                  borderBottom: "2px solid black",
                }}
              >
                Mobile number
              </th>
              <th
                style={{
                  borderRight: "2px solid black",
                  borderBottom: "2px solid black",
                }}
              >
                Type of haircut
              </th>
              <th
                style={{
                  borderRight: "2px solid black",
                  borderBottom: "2px solid black",
                }}
              >
                Date
              </th>
              <th
                style={{
                  borderRight: "2px solid black",
                  borderBottom: "2px solid black",
                }}
              >
                Time
              </th>
              <th style={{ borderBottom: "2px solid black" }}></th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  style={{ borderBottom: "1px solid lightgrey" }}
                >
                  <td style={{ borderBottom: "1px solid lightgrey" }}>
                    {appointment.firstName} {appointment.lastName}
                  </td>
                  <td style={{ borderBottom: "1px solid lightgrey" }}>
                    {appointment.phoneNumber}
                  </td>
                  <td style={{ borderBottom: "1px solid lightgrey" }}>
                    {appointment.service &&
                      getLocalizedService(appointment.service)}
                  </td>
                  <td style={{ borderBottom: "1px solid lightgrey" }}>
                    {new Date(appointment.date).toLocaleDateString(`en-GB`)}
                  </td>
                  <td style={{ borderBottom: "1px solid lightgrey" }}>
                    {appointment.time ? formatTime(appointment.time) : `N/A`}
                  </td>
                  <td style={{ borderBottom: "1px solid lightgrey" }}>
                    <button
                      onClick={() =>
                        cancelAppointment(
                          appointment.id,
                          appointment.date,
                          appointment.time
                        )
                      }
                      className="btn btn-dark w-100"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#dc3545",
                        borderColor: "#212529",
                        borderWidth: "3px",
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  There are no appointments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
