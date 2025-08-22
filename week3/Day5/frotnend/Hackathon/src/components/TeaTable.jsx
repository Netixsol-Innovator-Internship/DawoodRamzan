import { useState } from "react";

export default function TeaTable({
  teas,
  newTea,
  setNewTea,
  editingTea,
  setEditingTea,
  createTea,
  updateTea,
  deleteTea,
  role,
}) {
  const [showForm, setShowForm] = useState(false);

  // ENUM OPTIONS
  const collections = [
    "Black tea",
    "Green tea",
    "White tea",
    "Chai",
    "Matcha",
    "Herbal teas",
    "Oolong",
    "Rooibos",
    "Tisane",
  ];
  const origins = ["India", "Japan", "Sri Lanka", "South Africa"];
  const flavours = [
    "Spicy",
    "Sweet",
    "Citrus",
    "Smooth",
    "Fruity",
    "Floral",
    "Grassy",
    "Minty",
    "Bitter",
    "Creamy",
  ];
  const qualities = ["Detox", "Energy", "Relax", "Digestion"];
  const caffeineLevels = [
    "No Caffeine",
    "Low Caffeine",
    "Medium Caffeine",
    "High Caffeine",
  ];
  const allergens = ["Lactose-free", "Gluten-free", "Nut-free", "Soy-free"];
  const organicOptions = ["Yes", "No"];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tea Management</h2>

      {/* Toggle Add Tea Form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition mb-4"
      >
        {showForm ? "Cancel" : "Add Tea"}
      </button>

      {/* Add Tea Form */}
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createTea(newTea);
            setNewTea({
              name: "",
              description: "",
              price: "",
              image: "",
              collection: "",
              origin: "",
              flavour: "",
              quality: "",
              caffeine: "",
              allergens: "",
              organic: "",
            });
            setShowForm(false);
          }}
          className="grid gap-3 mb-6 p-4 border rounded bg-gray-50"
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Tea Name"
            value={newTea.name || ""}
            onChange={(e) => setNewTea({ ...newTea, name: e.target.value })}
            className="border p-2 rounded"
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={newTea.description || ""}
            onChange={(e) =>
              setNewTea({ ...newTea, description: e.target.value })
            }
            className="border p-2 rounded"
          />

          {/* Price */}
          <input
            type="number"
            placeholder="Price"
            value={newTea.price || ""}
            onChange={(e) =>
              setNewTea({ ...newTea, price: Number(e.target.value) })
            }
            className="border p-2 rounded"
            required
          />

          {/* Collection */}
          <select
            value={newTea.collection || ""}
            onChange={(e) =>
              setNewTea({ ...newTea, collection: e.target.value })
            }
            className="border p-2 rounded"
            required
          >
            <option value="">Select Collection</option>
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Origin */}
          <select
            value={newTea.origin || ""}
            onChange={(e) => setNewTea({ ...newTea, origin: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Origin</option>
            {origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          {/* Caffeine */}
          <select
            value={newTea.caffeine || ""}
            onChange={(e) => setNewTea({ ...newTea, caffeine: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Caffeine Level</option>
            {caffeineLevels.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Organic */}
          <select
            value={newTea.organic || ""}
            onChange={(e) => setNewTea({ ...newTea, organic: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Organic?</option>
            {organicOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          {/* Flavour (single) */}
          <div>
            <p className="font-semibold">Flavour:</p>
            <div className="flex flex-wrap gap-2">
              {flavours.map((f) => (
                <label key={f} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="flavour"
                    checked={newTea.flavour === f}
                    onChange={() => setNewTea({ ...newTea, flavour: f })}
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          {/* Quality (single) */}
          <div>
            <p className="font-semibold">Quality:</p>
            <div className="flex flex-wrap gap-2">
              {qualities.map((q) => (
                <label key={q} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="quality"
                    checked={newTea.quality === q}
                    onChange={() => setNewTea({ ...newTea, quality: q })}
                  />
                  {q}
                </label>
              ))}
            </div>
          </div>

          {/* Allergens (single) */}
          <div>
            <p className="font-semibold">Allergen:</p>
            <div className="flex flex-wrap gap-2">
              {allergens.map((a) => (
                <label key={a} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="allergen"
                    checked={newTea.allergens === a}
                    onChange={() => setNewTea({ ...newTea, allergens: a })}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
            Add Tea
          </button>
        </form>
      )}

      {/* Tea Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full text-sm">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Edit</th>
              <th className="p-3 border">+ $1</th>
              {role === "super admin" && <th className="p-3 border">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {teas.map((t) => (
              <tr key={t._id} className="text-center hover:bg-gray-50">
                <td className="border p-2">
                  {editingTea === t._id ? (
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) =>
                        updateTea({ id: t._id, data: { name: e.target.value } })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    t.name
                  )}
                </td>
                <td className="border p-2">
                  {editingTea === t._id ? (
                    <input
                      type="number"
                      value={t.price}
                      onChange={(e) =>
                        updateTea({
                          id: t._id,
                          data: { price: Number(e.target.value) },
                        })
                      }
                      className="border p-1 rounded w-20"
                    />
                  ) : (
                    `$${t.price}`
                  )}
                </td>
                {/* Edit Column */}
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-2 rounded"
                    onClick={() =>
                      setEditingTea(editingTea === t._id ? null : t._id)
                    }
                  >
                    {editingTea === t._id ? "Save" : "Edit"}
                  </button>
                </td>

                {/* Increment Price Column */}
                <td className="border p-2">
                  <button
                    className="bg-yellow-500 text-white px-2 rounded"
                    onClick={() =>
                      updateTea({ id: t._id, data: { price: t.price + 1 } })
                    }
                  >
                    +$1
                  </button>
                </td>

                {/* Delete Column */}
                {role === "super admin" && (
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-2 rounded"
                      onClick={() => deleteTea(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
