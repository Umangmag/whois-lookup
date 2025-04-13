import { useState } from "react";
import axios from "axios";
// Importing necessary module

function App() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("domain");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const fetchWhois = async () => {
    if (!domain) {
      setError("Please enter a domain name.");
      return;
    }

    setError("");
    setResult(null);

    
    try {
      const response = await axios.post("http://localhost:5000/whois", {
        domain,
        type,
      });
      setResult(response.data);
    } catch (err) {
      setError("Failed to fetch data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Whois Domain Lookup</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Enter domain (e.g., amazon.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="domain">Domain Information</option>
          <option value="contact">Contact Information</option>
        </select>
        <button
          onClick={fetchWhois}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lookup
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {result && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Results</h2>
          <pre className="mt-2 p-2 bg-gray-100">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
