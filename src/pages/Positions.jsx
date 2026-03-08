import { useNavigate } from "react-router-dom";

function Positions() {
  const navigate = useNavigate();

  const groups = [
    {
      title: "General Secretary",
      icon: "🏛️",
      roles: ["General Secretary", "Assistant General Secretary"],
    },
    {
      title: "Joint Secretary",
      icon: "📋",
      roles: ["Joint Secretary", "Assistant Joint Secretary"],
    },
    {
      title: "Points & Tally",
      icon: "📊",
      roles: ["Head", "Co-Head"],
    },
    {
      title: "Student Pool Coordinator",
      icon: "👥",
      roles: ["Head", "Co-Head"],
    },
    {
      title: "IMC (Integrated Marketing Communication)",
      icon: "📢",
      roles: ["Head", "Co-Head"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 text-white">
          <h1 className="text-4xl font-bold mb-3">Council Positions</h1>

          <p className="text-white/80">
            Choose a role and apply to become part of the Student Council
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group, index) => (
            <div
              key={index}
              className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-3 mb-5 text-white">
                <span className="text-3xl">{group.icon}</span>
                <h3 className="text-lg font-semibold">{group.title}</h3>
              </div>

              <div className="space-y-3">
                {group.roles.map((role, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      navigate("/apply", { state: { position: role } })
                    }
                    className="w-full bg-white/40 hover:bg-white text-gray-900 font-medium py-2 rounded-lg transition"
                  >
                    Apply for {role}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Positions;
