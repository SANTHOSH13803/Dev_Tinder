export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <h1 className="text-8xl font-bold text-blue-500">404</h1>

      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>

      <p className="text-slate-400 mt-2">
        The page you're looking for doesn't exist.
      </p>

      <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  );
}
