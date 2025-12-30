import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch clients from Supabase
  const fetchClients = async () => {
    const { data, error } = await supabase.from("Clients").select("*");
    if (error) console.log("Error fetching clients:", error);
    else setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Add new client
  const addClient = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const { data, error } = await supabase
      .from("Clients")
      .insert([{ name, email, notes }])
      .select();

    if (error) console.log("Error adding client:", error);
    else setClients([...clients, ...data]);

    setName("");
    setEmail("");
    setNotes("");
  };

  // Delete client
  const deleteClient = async (id) => {
    const { error } = await supabase.from("Clients").delete().eq("id", id);
    if (error) console.log("Error deleting client:", error);
    else setClients(clients.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Client Manager</h1>
          <p className="text-gray-600">Manage your clients with ease</p>
        </div>

        {/* Add client form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Client</h2>
          <form onSubmit={addClient} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Client Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
              <input
                type="email"
                placeholder="Client Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
            >
              Add Client
            </button>
          </form>
        </div>

        {/* Client list */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Clients ({clients.length})
          </h2>
          {clients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No clients yet. Add your first client above!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {clients.map((client) => (
                <li
                  key={client.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all bg-gray-50 hover:bg-white"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {client.name}
                        </h3>
                      </div>
                      <p className="text-indigo-600 font-medium mb-1">{client.email}</p>
                      {client.notes && (
                        <p className="text-gray-600 italic text-sm mt-2">{client.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all self-start md:self-auto"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
