import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigte = useNavigate();
  const handleNavigate = () => {
    navigte("/signUp");
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">
            Sign in to continue to DevTinder.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-slate-300">Password</label>

              <button
                type="button"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Forgot Password?
              </button>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-lg"
          >
            Sign In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>

          {/* <div className="relative flex justify-center">
            <span className="bg-slate-900 px-3 text-sm text-slate-400">OR</span>
          </div> */}
        </div>

        {/* <button
          type="button"
          className="w-full border border-slate-700 hover:bg-slate-800 transition-colors text-white py-3 rounded-lg font-medium"
        >
          Continue with Google
        </button> */}

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-500 hover:text-blue-400"
            onClick={handleNavigate}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
