import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Stock() {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [form, setForm] = useState({ name: '', rate: '', type: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await window.electron.getProducts();
      setAvailableProducts(products.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error('❌ Failed to fetch products', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.rate) {
      alert('Name and Rate are required');
      return;
    }

    try {
      let result;
      if (editIndex !== null) {
        result = await window.electron.updateProduct(form);
        if (result.success) {
          alert('✅ Product updated successfully!');
        } else {
          alert('❌ Failed to update product');
        }
      } else {
        result = await window.electron.addProduct(form);
        if (result.success) {
          alert('✅ Product added successfully!');
        } else {
          alert('❌ Failed to add product');
        }
      }

      setForm({ name: '', rate: '', type: '' });
      setEditIndex(null);
      fetchProducts();
    } catch (error) {
    //   console.error(error);
      alert('❌ Error occurred');
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditIndex(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure to delete "${product.name}"?`)) return;

    try {
      const result = await window.electron.deleteProduct(product);
      if (result.success) {
        alert('🗑️ Product deleted!');
        await fetchProducts();
      } else {
        alert('❌ Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      alert('❌ Error during deletion');
    }
  };

  const totalPages = Math.ceil(availableProducts.length / pageSize);
  const paginatedProducts = availableProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto">
      {/* Form Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h3 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          {editIndex !== null ? 'Update Product' : 'Add New Product'}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              name="name"
              placeholder="e.g., White Marble"
              value={form.name}
              onChange={handleChange}
              required
              disabled={editIndex !== null}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium mb-1">Rate per ft² (₨)</label>
            <input
              name="rate"
              type="number"
              value={form.rate}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type (optional)</label>
            <input
              name="type"
              placeholder="e.g., SLF, Premium"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded text-white font-semibold ${
                editIndex !== null ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h5 className="text-lg font-semibold mb-3">📦 Product List</h5>

        {availableProducts.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 py-2 border">#</th>
                    <th className="px-3 py-2 border">Name</th>
                    <th className="px-3 py-2 border">Type</th>
                    <th className="px-3 py-2 border">Rate (₨)</th>
                    <th className="px-3 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((p, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-100">
                      <td className="px-3 py-2 border text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-2 border">{p.name}</td>
                      <td className="px-3 py-2 border">{p.type || '—'}</td>
                      <td className="px-3 py-2 border">{p.rate}</td>
                      <td className="px-3 py-2 border text-center space-x-2">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          onClick={() => handleEdit(p)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1 rounded"
                          onClick={() => handleDelete(p)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// export default function AdminProductForm() {
//   const [availableProducts, setAvailableProducts] = useState([]);
//   const [form, setForm] = useState({ name: '', rate: '', type: '' });
//   const [editIndex, setEditIndex] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const products = await window.electron.getProducts();
//       setAvailableProducts(products.sort((a, b) => a.name.localeCompare(b.name)));
//     } catch (err) {
//       console.error('❌ Failed to fetch products', err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name || !form.rate) {
//       alert('Name and Rate are required');
//       return;
//     }

//     try {
//       let result;
//       if (editIndex !== null) {
//         result = await window.electron.updateProduct(form);
//         if (result.success) {
//           alert('✅ Product updated successfully!');
//         } else {
//           alert('❌ Failed to update product');
//         }
//       } else {
//         result = await window.electron.addProduct(form);
//         if (result.success) {
//           alert('✅ Product added successfully!');
//         } else {
//           alert('❌ Failed to add product');
//         }
//       }

//       setForm({ name: '', rate: '', type: '' });
//       setEditIndex(null);
//       fetchProducts();
//     } catch (error) {
//       console.error(error);
//       alert('❌ Error occurred');
//     }
//   };

//   const handleEdit = (product) => {
//     setForm(product);
//     setEditIndex(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (product) => {
//     if (!window.confirm(`Are you sure to delete "${product.name}"?`)) return;

//     try {
//       const result = await window.electron.deleteProduct(product);
//       if (result.success) {
//         alert('🗑️ Product deleted!');
//         await fetchProducts();
//       } else {
//         alert('❌ Failed to delete product');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('❌ Error during deletion');
//     }
//   };

//   const totalPages = Math.ceil(availableProducts.length / pageSize);
//   const paginatedProducts = availableProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   return (
//     <div className="py-10 px-6 max-w-7xl mx-auto">
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h3 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
//           <FontAwesomeIcon icon={faPlus} />
//           {editIndex !== null ? 'Update Product' : 'Add New Product'}
//         </h3>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Product Name</label>
//             <input
//               name="name"
//               placeholder="e.g., White Marble"
//               value={form.name}
//               onChange={handleChange}
//               required
//               disabled={editIndex !== null}
//               className="mt-1 w-full border rounded px-3 py-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Rate per ft² (₨)</label>
//             <input
//               name="rate"
//               type="number"
//               value={form.rate}
//               onChange={handleChange}
//               required
//               className="mt-1 w-full border rounded px-3 py-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Type (optional)</label>
//             <input
//               name="type"
//               placeholder="e.g., SLF, Premium"
//               value={form.type}
//               onChange={handleChange}
//               className="mt-1 w-full border rounded px-3 py-2"
//             />
//           </div>
//           <div className="flex items-end">
//             <button
//               type="submit"
//               className={`w-full py-2 px-4 rounded text-white ${editIndex !== null ? 'bg-yellow-500' : 'bg-green-600'}`}
//             >
//               {editIndex !== null ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </form>
//       </div>

//       <div className="bg-white shadow-md rounded-2xl p-6">
//         <h5 className="text-lg font-semibold mb-3">📦 Product List</h5>
//         {availableProducts.length === 0 ? (
//           <p>No products added yet.</p>
//         ) : (
//           <>
//             <div className="overflow-auto">
//               <table className="w-full border text-center">
//                 <thead className="bg-gray-800 text-white">
//                   <tr>
//                     <th className="p-2">#</th>
//                     <th className="p-2">Name</th>
//                     <th className="p-2">Type</th>
//                     <th className="p-2">Rate (₨)</th>
//                     <th className="p-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedProducts.map((p, index) => (
//                     <tr key={index} className="odd:bg-white even:bg-gray-100">
//                       <td className="p-2">{(currentPage - 1) * pageSize + index + 1}</td>
//                       <td className="p-2">{p.name}</td>
//                       <td className="p-2">{p.type || '—'}</td>
//                       <td className="p-2">{p.rate}</td>
//                       <td className="p-2 space-x-2">
//                         <button
//                           className="bg-blue-600 text-white px-3 py-1 rounded"
//                           onClick={() => handleEdit(p)}
//                         >
//                           <FontAwesomeIcon icon={faEdit} />
//                         </button>
//                         <button
//                           className="border border-red-600 text-red-600 px-3 py-1 rounded"
//                           onClick={() => handleDelete(p)}
//                         >
//                           <FontAwesomeIcon icon={faTrash} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center mt-4 space-x-2">
//               {[...Array(totalPages).keys()].map((page) => (
//                 <button
//                   key={page + 1}
//                   onClick={() => setCurrentPage(page + 1)}
//                   className={`px-3 py-1 border rounded ${currentPage === page + 1 ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
//                 >
//                   {page + 1}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
