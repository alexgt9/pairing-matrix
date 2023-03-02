import { NavLink } from "react-router-dom";
import {
  CalendarIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
} from "@heroicons/react/24/solid";

export default () => {
  const activeStyle = {
    backgroundColor: "#535353",
    color: "white",
  };

  return (
    <nav className="bg-white px-2 sm:px-4 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <a href="" className="flex items-center">
          <UserCircleIcon className="h-10 w-10 mr-2" />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Extreme programming
          </span>
        </a>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className=" hover:bg-gray-100">
              <NavLink
                to={`/`}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                className="py-8 px-4 relative flex flex-row items-center h-11 focus:outline-none  text-gray-600 hover:text-gray-800 border-l-4 border-transparent"
              >
                <span className="inline-flex justify-center items-center">
                  <CalendarIcon className="h-8 w-8" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Calendar
                </span>
              </NavLink>
            </li>
            <li className=" hover:bg-gray-100">
              <NavLink
                to={`/pairs`}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                className="py-8 px-4 relative flex flex-row items-center h-11 focus:outline-none  text-gray-600 hover:text-gray-800 border-l-4 border-transparent"
              >
                <span className="inline-flex justify-center items-center">
                  <UserCircleIcon className="h-8 w-8" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Pairs
                </span>
              </NavLink>
            </li>
            <li className=" hover:bg-gray-100">

            <a
              href="https://github.com/alexgt9/pairing-matrix"
              target="_blank"
              rel="noreferrer"
              className="py-8 px-4 relative flex flex-row items-center h-11 focus:outline-none  text-gray-600 hover:text-gray-800 border-l-4 border-transparent"
              >
                <span className="inline-flex justify-center items-center">
                  <CodeBracketSquareIcon className="h-8 w-8" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Github
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
