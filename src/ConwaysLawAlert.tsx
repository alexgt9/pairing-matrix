const ConwaysLawAlert = () => {
  return (
    <div>
      <p className="bg-orange-200 border-l-4 border-orange-500 text-orange-700 p-4">
        The participants & rotation frequency numbers are so high that probably
        you don't want to know the results,
        <a
          className="underline ml-2"
          href="https://en.wikipedia.org/wiki/Conway%27s_law"
          target="_blank"
          rel="noreferrer"
        >
          check this out
        </a>
      </p>
    </div>
  );
};

export default ConwaysLawAlert;