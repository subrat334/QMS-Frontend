
import { useState } from "react";
import logo from "../../assets/utkal.png"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering:", { name, email, password, confirmPassword });
  
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
      {/* 🅱 Full-Screen Watermark Logo */}
      <img
        src={logo}
        alt="Utkal Hospital Logo"
        className="absolute inset-0 w-90% h-90% object-cover opacity-10 pointer-events-none select-none"
      />

      {/* 🅰 Header + Register Form */}
      <form
        onSubmit={handleRegister}
        className="relative space-y-6 w-full max-w-md bg-white rounded-lg shadow-xl p-8 ring-1 ring-gray-200 z-10"
      >
        {/* Logo Above Heading */}
        <div className="flex justify-center">
          <img src={logo} alt="Utkal Hospital" className="w-32 mb-2" />
        </div>

        <h2 className="text-3xl font-semibold text-center text-green-700">
          Retrieve Account
        </h2>

        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            placeholder="Your full name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded-md text-lg font-medium hover:bg-green-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
