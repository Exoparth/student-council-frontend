import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyForCouncil } from "../api/applicationApi";

function ApplyForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPosition = location.state?.position || "";

  const [formData, setFormData] = useState({
    domainId: "",
    department: "",
    rollNo: "",
    currentYear: "",
    phone: "",
    position: selectedPosition,
    statement: "",
    experience: "",
    kts: "",
    pointer: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...formData,
        currentYear: Number(formData.currentYear),
        kts: Number(formData.kts),
        pointer: Number(formData.pointer),
      };

      await applyForCouncil(payload);

      setSuccess("Application submitted successfully!");

      setTimeout(() => {
        navigate("/my-application");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex justify-center py-10">
      <div className="card w-[600px]">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Student Council Application
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="domainId"
            placeholder="Domain ID"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="rollNo"
            placeholder="Roll No"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="currentYear"
            placeholder="Current Year"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />

          <select
            name="position"
            className="border p-2 rounded"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="">Select Position</option>
            <option value="General Secretary">General Secretary</option>
            <option value="Assistant General Secretary">
              Assistant General Secretary
            </option>
            <option value="Joint Secretary">Joint Secretary</option>
            <option value="Assistant Joint Secretary">
              Assistant Joint Secretary
            </option>
            <option value="Points and Tally Head">
              Points and Tally (Head)
            </option>
            <option value="Points and Tally Co-Head">
              Points and Tally (Co-Head)
            </option>
            <option value="Student Pool Coordinator Head">
              Student Pool Coordinator (Head)
            </option>
            <option value="Student Pool Coordinator Co-Head">
              Student Pool Coordinator (Co-Head)
            </option>
            <option value="IMC Head">
              IMC - Integrated Marketing Communication (Head)
            </option>
            <option value="IMC Co-Head">
              IMC - Integrated Marketing Communication (Co-Head)
            </option>
          </select>

          <input
            type="number"
            name="kts"
            placeholder="No. of KTs"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="number"
            name="pointer"
            placeholder="Pointer"
            step="0.01"
            min="0"
            max="10"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <textarea
            name="statement"
            placeholder="Why do you want this position?"
            className="border p-2 rounded col-span-2"
            onChange={handleChange}
          />

          <textarea
            name="experience"
            placeholder="Previous Experience"
            className="border p-2 rounded col-span-2"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn-primary col-span-2"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyForm;
