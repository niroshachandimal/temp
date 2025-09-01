import { Link } from "react-router-dom";

interface CommonErrorPageProps {
  title?: string;
  description?: string;
  secondaryDescription?: string;
  errorCode?: string;
  link?: string;
  linkText?: string;
}

const CommonErrorPage = ({
  title = "Something went wrong!",
  description = "Sorry, we can't that page.",
  secondaryDescription = "Please try again later or contact support if the issue persists.",
  errorCode = "500",
  link = "/dashboard",
  linkText = "Back to Dashboard",
}: CommonErrorPageProps) => {
  return (
    <section className="flex justify-center items-center h-[80vh]">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-3xl tracking-tight font-extrabold lg:text-9xl text-red-500">
            {errorCode}
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 dark:text-white md:text-4xl">
            {title}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            {description} <br />{" "}
            <span className="text-sm font-light text-gray-500">
              Note: {secondaryDescription}
            </span>
          </p>
          <Link
            to={link}
            className="inline-flex text-white bg-primary  hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommonErrorPage;
