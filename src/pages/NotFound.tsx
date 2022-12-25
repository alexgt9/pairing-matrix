import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>The page you are looking for does not exists.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}