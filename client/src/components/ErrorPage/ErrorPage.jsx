import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="font-golos max-w-5xl mx-auto ">
      <h1 className="text-5xl text-stone-500 text-center mt-52">
        404 Page not Found
      </h1>
      <Link to="/">
        <h1 className="text-xl text-center mt-4 mx-0 underline text-blue-600">
          Go Back
        </h1>
      </Link>
    </div>
  );
};

export default ErrorPage;
