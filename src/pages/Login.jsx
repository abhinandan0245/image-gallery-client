import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useGoogleLoginMutation } from "../features/auth/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();

  const handleGoogleLogin = async () => {
    try {
      // 1️⃣ Firebase popup
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // 2️⃣ Backend via RTK Query
      const res = await googleLogin(idToken).unwrap();

      // 3️⃣ Store auth data
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.data?.message || "Google authentication failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Image Gallery
        </h2>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
        >
          <FcGoogle size={22} />
          <span className="font-medium">
            {isLoading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          Secure login powered by Google
        </p>
      </div>
    </div>
  );
};

export default Login;
