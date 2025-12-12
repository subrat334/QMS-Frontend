
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import logo from "../../assets/utkal.png";
import { ROLE_ROUTES, type UserRoleType } from "../../constants/AllConstants";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  setErrorMessage(""); // clear previous error

    try {
      const payload = {
        Username: username,
        Password: password,
      };

      const res = await api.post("/Account/ValidateLogin", payload);
      const data = res.data;

      if (data?.AccessToken) {
        localStorage.setItem("AccessToken", data.AccessToken);
        localStorage.setItem("RefreshToken", data.RefreshToken);
        localStorage.setItem("AccessTokenExpire", data.AccessTokenExpire);
        localStorage.setItem("RefreshtokenExpire", data.RefreshtokenExpire);
        localStorage.setItem("UserId", data.Id);
        localStorage.setItem("UserName", data.Name);
        localStorage.setItem("UserType", data.UserType);

        toast.success("Login successful!");
        login(data);

        const userType = Number(data.UserType) as UserRoleType;
        const redirectPath = ROLE_ROUTES[userType] || "/";
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMessage("Invalid server response");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 overflow-hidden">

      {/* Background Logo */}
      <img
        src={logo}
        alt="Utkal Hospital Logo"
        className="absolute inset-0 w-90% h-90% object-cover opacity-10 pointer-events-none select-none"
      />

      <form
        onSubmit={handleLogin}
        className="relative space-y-6 w-full max-w-md bg-white rounded-lg shadow-xl p-8 ring-1 ring-gray-200 z-10"
      >
        <div className="flex justify-center">
          <img src={logo} alt="Utkal Hospital" className="w-32 mb-2" />
        </div>

        <h2 className="text-3xl font-semibold text-center text-green-700">
          Utkal Health Care Pvt. Ltd.
        </h2>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-gray-700 mb-1">
            User Name
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            placeholder="Enter username"
            required
          />
        </div>

        {/* Password with Eye Icon */}
        <div className="relative">
          <label htmlFor="password" className="block text-gray-700 mb-1">
            Password
          </label>

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            placeholder="••••••••"
            required
          />
          {errorMessage && (
            <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
          )}


          {/* Professional eye icon */}
          <div
            className="absolute right-4 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
          } text-white py-2 rounded-md text-lg font-medium transition`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* <p className="text-center text-gray-600">
          Forgot Password?{" "}
          <Link to="/register" className="text-green-700 hover:underline">
            Click Here
          </Link>
        </p> */}
      </form>
    </div>
  );
};

export default Login;
