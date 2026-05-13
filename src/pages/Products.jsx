import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, onSnapshot,
  addDoc, updateDoc,
  deleteDoc, doc,
  orderBy, query,
} from "firebase/firestore";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // ✅ Load products real-time
  useEffect(() => {
    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white text-2xl font-bold">📦 Products</h1>
          <p className="text-slate-400 text-sm mt-1">
            {products.length} total products
          </p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-xs px-2 py-1 rounded-lg">
                  {product.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold truncate">{product.name}</h3>
                <p className="text-blue-400 font-bold text-lg mt-1">
                  ${product.price?.toFixed(2)}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Stock: {product.stock} units
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setEditProduct(product); setShowModal(true); }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-xl transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm py-2 rounded-xl transition-colors"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}

// ✅ Product Modal with Firestore
function ProductModal({ product, onClose }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || "Shoes",
    stock: product?.stock || "",
    image: product?.image || "",
  });
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;
    setLoading(true);
    try {
      const data = {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        image: form.image,
      };

      if (isEdit) {
        // ✅ Update
        await updateDoc(doc(db, "products", product.id), data);
      } else {
        // ✅ Add
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: Date.now(),
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-xl">
            {isEdit ? "✏️ Edit Product" : "➕ Add Product"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nike Air Max"
              className="w-full bg-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Price ($)</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="99.99"
                className="w-full bg-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full bg-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              {["Shoes", "Clothing", "Electronics", "Bags", "Accessories"].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-full h-32 object-cover rounded-xl"
              onError={(e) => e.target.style.display = "none"}
            />
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;