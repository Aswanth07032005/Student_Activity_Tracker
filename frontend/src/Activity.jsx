
import { useState, useEffect } from "react";
import axios from "axios";
import "./Activity.css";

import {
  ClipboardList,
  GraduationCap,
  Clock,
  Trophy,
  Plus,
  Check,
  AlertCircle,
  Trash2,
} from "lucide-react";

const API_URL = "/api";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState({
    total_entries: 0,
    total_hours: 0,
    most_active_user: "N/A",
  });

  const [formData, setFormData] = useState({
    name: "",
    activity: "",
    hours: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    const response = await axios.get(`${API_URL}/activities/`);
    setActivities(response.data);
  };

  const fetchSummary = async () => {
    const response = await axios.get(`${API_URL}/summary/`);
    setSummary(response.data);
  };

  const refreshData = async () => {
    await Promise.all([fetchActivities(), fetchSummary()]);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        await refreshData();
      } catch (err) {
        setError("Unable to load data. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const name = formData.name.trim();
    const activity = formData.activity.trim();
    const hours = Number(formData.hours);

    if (!name || !activity || !formData.hours) {
      setError("Please fill in all fields.");
      return;
    }

    if (!Number.isInteger(hours) || hours <= 0) {
      setError("Please enter valid hours greater than zero.");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${API_URL}/activities/`, {
        name,
        activity,
        hours,
      });

      setFormData({
        name: "",
        activity: "",
        hours: "",
      });

      await refreshData();
      setMessage("Activity added successfully!");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to add activity. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteActivity = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");
    setError("");

    try {
      await axios.delete(`${API_URL}/activities/${id}/`);
      await refreshData();
      setMessage("Activity deleted successfully!");
    } catch (err) {
      setError("Unable to delete activity. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app-container">

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">

          <div className="brand">
            <div className="brand-logo">
              <GraduationCap size={27} strokeWidth={2} />
            </div>

            <div>
              <h2>Student Activity</h2>
              <span>Tracker</span>
            </div>
          </div>



        </div>
      </nav>

      <main className="main-container">

        {/* Welcome Section */}
        <section className="welcome-section">

          <div>
            <span className="welcome-tag">
              ACTIVITY MANAGEMENT
            </span>

            <h1>Welcome to Student Activity Tracker</h1>

            <p>
              Track student activities, monitor participation,
              and manage activity records in one place.
            </p>
          </div>

          <div className="welcome-icon">
            <GraduationCap size={65} strokeWidth={1.5} />
          </div>

        </section>

        {/* Summary Cards */}
        <section className="summary-grid">

          {/* Total Entries */}
          <div className="summary-card">

            <div className="summary-icon icon-blue">
              <ClipboardList size={26} strokeWidth={2} />
            </div>

            <div>
              <p>Total Entries</p>
              <h2>{summary.total_entries}</h2>
              <span>Activities recorded</span>
            </div>

          </div>

          {/* Total Hours */}
          <div className="summary-card">

            <div className="summary-icon icon-purple">
              <Clock size={26} strokeWidth={2} />
            </div>

            <div>
              <p>Total Hours</p>
              <h2>{summary.total_hours}</h2>
              <span>Hours completed</span>
            </div>

          </div>

          {/* Most Active Student */}
          <div className="summary-card">

            <div className="summary-icon icon-orange">
              <Trophy size={26} strokeWidth={2} />
            </div>

            <div>
              <p>Most Active Student</p>

              <h2 className="active-user">
                {summary.most_active_user || "N/A"}
              </h2>

              <span>Top activity contributor</span>
            </div>

          </div>

        </section>

        {/* Messages */}
        {message && (
          <div className="alert success-alert">
            <Check size={16} strokeWidth={2.5} />
            {message}
          </div>
        )}

        {error && (
          <div className="alert error-alert">
            <AlertCircle size={16} strokeWidth={2.5} />
            {error}
          </div>
        )}

        {/* Add Activity Form */}
        <section className="content-card form-card">

          <div className="section-heading">

            <div>
              <span className="section-tag">NEW RECORD</span>
              <h2>Add Student Activity</h2>
              <p>Enter the student activity details below.</p>
            </div>

            <div className="heading-icon">
              <Plus size={25} />
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="name">Student Name</label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="activity">Activity</label>

                <input
                  id="activity"
                  type="text"
                  name="activity"
                  placeholder="Enter activity name"
                  value={formData.activity}
                  onChange={handleChange}
                  maxLength={200}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours">Hours</label>

                <input
                  id="hours"
                  type="number"
                  name="hours"
                  placeholder="Enter hours"
                  min="1"
                  step="1"
                  value={formData.hours}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                "Adding..."
              ) : (
                <>
                  <Plus size={16} />
                  Add Activity
                </>
              )}
            </button>

          </form>

        </section>

        {/* Recent Activities */}
        <section className="content-card activities-card">

          <div className="section-heading activities-heading">

            <div>
              <span className="section-tag">RECORDS</span>
              <h2>Recent Activities</h2>
              <p>View and manage student activity records.</p>
            </div>

            <div className="record-count">
              {activities.length} Records
            </div>

          </div>

          {loading ? (

            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading activities...</p>
            </div>

          ) : activities.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                <ClipboardList size={38} strokeWidth={1.5} />
              </div>

              <h3>No Activities Yet</h3>

              <p>
                Add your first student activity using the form above.
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table className="activity-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Activity</th>
                    <th>Hours</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {activities.map((item, index) => (

                    <tr key={item.id}>

                      <td className="serial-number">
                        {index + 1}
                      </td>

                      <td>
                        <div className="student-cell">

                          <div className="student-avatar">
                            {item.name?.charAt(0).toUpperCase()}
                          </div>

                          <span>{item.name}</span>

                        </div>
                      </td>

                      <td className="activity-description">
                        {item.activity}
                      </td>

                      <td>
                        <span className="hours-badge">
                          <Clock size={14} />
                          {item.hours} hrs
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteActivity(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? (
                            "Deleting..."
                          ) : (
                            <>
                              <Trash2 size={14} />
                              Delete
                            </>
                          )}
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="footer">

        <p>
          © {new Date().getFullYear()} Student Activity Tracker.
          All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Activity;
