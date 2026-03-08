import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDashboardStats } from "../api/statsApi";
function Home() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 45,
    seconds: 30,
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        setStats({
          totalUsers: data.totalUsers,
          totalApplications: data.totalApplications,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  const statistics = [
    { label: "Active Positions", value: "12", icon: "📋" },

    {
      label: "Candidates Applied",
      value: stats.totalApplications,
      icon: "👥",
    },

    {
      label: "Students Registered",
      value: stats.totalUsers,
      icon: "🎓",
    },

    { label: "Past Elections", value: "8", icon: "🗳️" },
  ];

  const features = [
    {
      title: "Leadership Opportunities",
      description:
        "Lead initiatives and represent the student community in decision making.",
      icon: "🌟",
    },
    {
      title: "Event Management",
      description:
        "Organize cultural events and technical festivals across campus.",
      icon: "🎪",
    },
    {
      title: "Student Welfare",
      description:
        "Work towards improving academic environment and student wellbeing.",
      icon: "🤝",
    },
    {
      title: "Campus Development",
      description:
        "Contribute to infrastructure improvements and better facilities.",
      icon: "🏛️",
    },
    {
      title: "Community Outreach",
      description: "Plan social initiatives and community engagement programs.",
      icon: "🌍",
    },
    {
      title: "Digital Innovation",
      description: "Build technical solutions to improve campus communication.",
      icon: "💡",
    },
  ];

  const faqs = [
    {
      question: "Who can apply for council positions?",
      answer:
        "All currently enrolled students with minimum CGPA of 7.0 and no disciplinary cases.",
    },
    {
      question: "What is the selection process?",
      answer:
        "Application screening followed by interview and presentation of your vision.",
    },
    {
      question: "How long is the council term?",
      answer: "The council term lasts for one academic year.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ANNOUNCEMENT */}
      <div className="bg-blue-50 border-b">
        <div className="container-center py-3 flex justify-between items-center flex-wrap gap-2">
          <p className="text-sm font-medium text-blue-700">
            📢 Applications for Academic Year 2024-25 are now open!
          </p>

          <button
            className="btn-primary text-sm px-4 py-2"
            onClick={() => navigate("/positions")}
          >
            Apply by March 30 →
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container-center text-center">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm mb-4">
            🎓 Student Council 2024
          </div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Student Council Portal
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Register yourself, apply for leadership positions and contribute
            towards improving campus life and student engagement.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              className="btn-primary"
              onClick={() => navigate("/positions")}
            >
              View Positions
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="container-center py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Elections 2024</h2>
            <p className="text-white/80">
              Time remaining to submit your application
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto">
            {Object.entries(timeLeft).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/20 backdrop-blur rounded-xl p-6 text-center"
              >
                <div className="text-4xl font-bold">{value}</div>
                <div className="uppercase text-sm tracking-wider">{key}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="bg-white py-20">
        <div className="container-center grid grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-600">
                {stat.value || "..."}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gray-50">
        <div className="container-center">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Join the Student Council?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>

                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>

                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-center py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-5 shadow-sm"
            >
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20 text-white text-center">
        <div className="container-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>

          <p className="max-w-xl mx-auto mb-6 text-white/80">
            Join the Student Council and become the voice of your peers.
          </p>

          <button
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            onClick={() => navigate("/positions")}
          >
            Apply Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-gray-500 text-sm">
        <div className="container-center">© 2024 Student Council Portal</div>
      </footer>
    </div>
  );
}

export default Home;
