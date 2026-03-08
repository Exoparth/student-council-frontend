import { useState } from "react";
import { sendContactMessage } from "../api/contactApi";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendContactMessage(form);

      alert("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container-center">
        {/* PAGE TITLE */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Contact Student Council
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            Have questions about council applications or events? Reach out to us
            and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* ADDRESS CARD */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📍 College Address
              </h3>

              <p className="text-gray-700 mb-2">
                K.C. College of Engineering and Management Studies and Research
              </p>

              <p className="text-gray-600 text-sm mb-4">
                Mith Bunder Road, Near Sadguru Garden, Kopri, Thane - 400603,
                Maharashtra, India
              </p>

              <div className="space-y-2 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  📧 info@kccemsr.edu.in
                </p>

                <p className="flex items-center gap-2">📞 +91 22 2532 6085</p>
              </div>
            </div>

            {/* GOOGLE MAP */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <iframe
                title="college map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.348598561609!2d72.97785037580792!3d19.17997074869926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8da14eacea9%3A0xb4f1e032d9e4fc41!2sK.C.%20College%20of%20Engineering%20%26%20Management%20Studies%20%26%20Research!5e0!3m2!1sen!2sin!4v1772979511390!5m2!1sen!2sin"
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                required
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                required
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={form.message}
                required
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
