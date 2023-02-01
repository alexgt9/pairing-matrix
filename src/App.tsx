import "./App.css";
import { Outlet, Link } from "react-router-dom";

const App = () => {
  return (
    <div className="flex">
      <aside id="sidebar" className="pr-4 bg-green-100 border-solid border-2 border-r-green-300 min-h-screen">
        <nav>
          <ul>
            <li>
              <Link to={`/`} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg fill="#000000" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g id="Calendar">
                        <path d="M18.438,4.954H16.5c0-0.346,0-0.691,0-1.036c0-0.124,0-0.248,0-0.372c0-0.262-0.23-0.512-0.5-0.5
                            c-0.271,0.012-0.5,0.22-0.5,0.5c0,0.469,0,0.939,0,1.408h-7c0-0.346,0-0.691,0-1.036c0-0.124,0-0.248,0-0.372
                            c0-0.262-0.23-0.512-0.5-0.5c-0.271,0.012-0.5,0.22-0.5,0.5c0,0.469,0,0.939,0,1.408H5.562c-1.378,0-2.5,1.122-2.5,2.5v11
                            c0,1.379,1.122,2.5,2.5,2.5h12.875c1.379,0,2.5-1.121,2.5-2.5v-11C20.938,6.076,19.816,4.954,18.438,4.954z M5.562,5.954H7.5
                            c0,0.073,0,0.147,0,0.22c0,0.124,0,0.248,0,0.372c0,0.262,0.23,0.512,0.5,0.5c0.271-0.012,0.5-0.22,0.5-0.5c0-0.197,0-0.394,0-0.592
                            h7c0,0.073,0,0.147,0,0.22c0,0.124,0,0.248,0,0.372c0,0.262,0.23,0.512,0.5,0.5c0.271-0.012,0.5-0.22,0.5-0.5
                            c0-0.197,0-0.394,0-0.592h1.937c0.827,0,1.5,0.673,1.5,1.5v1.584H4.062V7.454C4.062,6.627,4.735,5.954,5.562,5.954z M18.438,19.954
                            H5.562c-0.827,0-1.5-0.673-1.5-1.5v-8.416h15.875v8.416C19.938,19.281,19.265,19.954,18.438,19.954z"/>
                    </g>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Calendar</span>
              </Link>
            </li>
            <li>
              <Link to={`pairs`} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg fill="#000000" width="32px" height="32px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 47.9219 C 16.9374 47.9219 8.1014 39.0625 8.1014 28 C 8.1014 16.9609 16.9140 8.0781 27.9765 8.0781 C 39.0155 8.0781 47.8983 16.9609 47.9219 28 C 47.9454 39.0625 39.0390 47.9219 27.9999 47.9219 Z M 27.9999 26.6875 C 31.3983 26.7109 34.1171 23.8047 34.1171 19.9844 C 34.1171 16.4219 31.3983 13.4453 27.9999 13.4453 C 24.6014 13.4453 21.8827 16.4219 21.8827 19.9844 C 21.8827 23.8047 24.6014 26.6641 27.9999 26.6875 Z M 17.0780 39.9766 L 38.8983 39.9766 C 39.8358 39.9766 40.3046 39.3437 40.3046 38.5 C 40.3046 35.8750 36.3671 29.1016 27.9999 29.1016 C 19.6327 29.1016 15.6952 35.8750 15.6952 38.5 C 15.6952 39.3437 16.1640 39.9766 17.0780 39.9766 Z"/></svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">About us</span>
              </Link>
            </li>
            <li>
              <a href="https://github.com/alexgt9/pairing-matrix" target="_blank" rel="noreferrer" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg height="30" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true">
                    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Github</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <section id="detail" className="w-full">
        <Outlet />
      </section>
    </div>
  );
};

export default App;

