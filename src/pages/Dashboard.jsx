import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function Dashboard({ setIsAuth }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [decisions, setDecisions] = useState([]);
  const [factors, setFactors] = useState({});
  const [results, setResults] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState({});
  const [editingFactor, setEditingFactor] = useState({});

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const res = await API.get("/decisions");
      setDecisions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/");
  };

  const handleCreate = async () => {
    if (!title) return alert("Escribí algo");
    try {
      await API.post("/decisions", { title });
      setTitle("");
      fetchDecisions();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleAddFactor = async (decisionId) => {
    const factor = factors[decisionId];
    if (!factor?.description || !factor?.value) return alert("Completa los campos");

    try {
      await API.post("/factors", {
        decision_id: decisionId,
        description: factor.description,
        value: Number(factor.value),
      });
      alert("Factor agregado 🔥");
      setFactors({ ...factors, [decisionId]: { description: "", value: "" } });
      fetchDecisions(); // actualizamos factores
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleDeleteDecision = async (id) => {
    try {
      await API.delete(`/decisions/${id}`);
      alert("Decisión eliminada 🔥");
      setDecisions(decisions.filter((d) => d.id !== id));
    } catch (err) {
      console.log(err);
      alert("Error al eliminar");
    }
  };

  const handleDeleteFactor = async (factorId, decisionId) => {
    try {
      await API.delete(`/factors/${factorId}`);
      alert("Factor eliminado 🔥");
      fetchDecisions();
      setFactors({ ...factors, [decisionId]: { description: "", value: "" } });
    } catch (err) {
      console.log(err);
      alert("Error al eliminar factor");
    }
  };

  const handleEditFactor = (factor) => {
    setEditingFactor({ ...editingFactor, [factor.id]: factor });
  };

  const handleUpdateFactor = async (factorId, decisionId) => {
    const f = editingFactor[factorId];
    if (!f?.description || !f?.value) return alert("Completa los campos");

    try {
      await API.put(`/factors/${factorId}`, {
        description: f.description,
        value: Number(f.value),
      });
      alert("Factor actualizado 🔥");
      setEditingFactor({ ...editingFactor, [factorId]: null });
      fetchDecisions();
    } catch (err) {
      console.log(err);
      alert("Error al actualizar factor");
    }
  };

  const handleCalculate = async (decisionId) => {
    try {
      const res = await API.get(`/decisions/${decisionId}/result`);
      setResults({ ...results, [decisionId]: res.data });
    } catch (err) {
      console.log(err);
      alert("Error al calcular");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-200 to-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Decisiones.App</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>

      {/* CREAR DECISION */}
      <div className="bg-white p-6 rounded-2xl shadow-lg flex gap-4 mb-8 hover:shadow-xl transition duration-300">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva decisión..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleCreate}
          className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300"
        >
          Crear
        </button>
      </div>

      {/* LISTA DECISIONES */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decisions.map((d) => (
          <div
            key={d.id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 relative transform hover:-translate-y-1"
          >
            {/* TITULO / EDIT */}
            {editingId === d.id ? (
              <div className="flex gap-2 mb-2">
                <input
                  value={editTitle[d.id] || d.title}
                  onChange={(e) => setEditTitle({ ...editTitle, [d.id]: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={() => { handleUpdate(d.id); }}
                  className="bg-green-500 text-white px-3 rounded hover:bg-green-600 transition duration-300"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{d.title}</h3>
            )}

            <p className="text-sm text-gray-500 mb-3">Decisión #{d.id}</p>

            {/* BOTONES DECISION */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleCalculate(d.id)}
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition duration-300"
              >
                Calcular
              </button>
              <button
                onClick={() => { setEditingId(d.id); setEditTitle({ ...editTitle, [d.id]: d.title }); }}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition duration-300"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteDecision(d.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
              >
                Eliminar
              </button>
            </div>

            {results[d.id] && (
              <div className="p-3 bg-gray-100 rounded mb-3 shadow-inner">
                <p>Total: {results[d.id].total}</p>
                <p className="font-bold">{results[d.id].recommendation}</p>
              </div>
            )}

            {/* FACTORES */}
            <div className="mt-3 space-y-2">
              {d.factors?.map((f) => (
                <div key={f.id} className="flex gap-2 items-center">
                  {editingFactor[f.id] ? (
                    <>
                      <input
                        value={editingFactor[f.id].description}
                        onChange={(e) =>
                          setEditingFactor({
                            ...editingFactor,
                            [f.id]: { ...editingFactor[f.id], description: e.target.value },
                          })
                        }
                        className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <input
                        type="number"
                        value={editingFactor[f.id].value}
                        onChange={(e) =>
                          setEditingFactor({
                            ...editingFactor,
                            [f.id]: { ...editingFactor[f.id], value: e.target.value },
                          })
                        }
                        className="w-24 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <button
                        onClick={() => handleUpdateFactor(f.id, d.id)}
                        className="bg-green-500 text-white px-3 rounded hover:bg-green-600 transition duration-300"
                      >
                        Guardar
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="flex-1">{f.description} ({f.value})</p>
                      <button
                        onClick={() => handleEditFactor(f)}
                        className="bg-yellow-400 text-white px-3 rounded hover:bg-yellow-500 transition duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteFactor(f.id, d.id)}
                        className="bg-red-500 text-white px-3 rounded hover:bg-red-600 transition duration-300"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              ))}

              {/* AGREGAR NUEVO FACTOR */}
              <div className="flex gap-2 mt-2">
                <input
                  placeholder="Factor"
                  className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={factors[d.id]?.description || ""}
                  onChange={(e) =>
                    setFactors({
                      ...factors,
                      [d.id]: { ...factors[d.id], description: e.target.value },
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="+ / -"
                  className="w-24 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={factors[d.id]?.value || ""}
                  onChange={(e) =>
                    setFactors({
                      ...factors,
                      [d.id]: { ...factors[d.id], value: e.target.value },
                    })
                  }
                />
                <button
                  onClick={() => handleAddFactor(d.id)}
                  className="bg-green-500 text-white px-3 rounded hover:bg-green-600 transition duration-300"
                >
                  +
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}