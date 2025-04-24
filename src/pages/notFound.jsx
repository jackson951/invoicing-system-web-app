import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        Oops! The page you’re looking for doesn’t exist.
      </h2>
      <p className="text-gray-600 max-w-md mb-6">
        It looks like the page you’re trying to reach has been moved, deleted,
        or never existed. But don’t worry, we’ll help you get back on track.
      </p>
      <Link
        to="/"
        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
      >
        Go Back Home
      </Link>
      <p className="text-sm text-gray-400 mt-8">
        If you believe this is a mistake, please{" "}
        <a href="/contact" className="underline text-indigo-500">
          contact support
        </a>
        .
      </p>
    </div>
  );
};

export default NotFound;
