// This version removes all `react-bootstrap` components and replaces them with Tailwind CSS
// No logic is changed; only classNames and structure are adapted.
// External libraries like `react-select` are retained for functionality.

import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Select from 'react-select';

export default function MarbleSaleApp() {
  const [product, setProduct] = useState({ description: '', type: '', length: '', width: '', rate: '', discount: '' });
  const [customerName, setCustomerName] = useState('');
  const [productCustomerType, setProductCustomerType] = useState('full');
  const [partialCustomerDetails, setPartialCustomerDetails] = useState({ contact: '', cnic: '' });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [marbleOptions, setMarbleOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [feet, setFeet] = useState(0);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [received, setReceived] = useState('');
  const [fullInvoices, setFullInvoices] = useState([]);
  const [partialInvoices, setPartialInvoices] = useState([]);
  const printContainerRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await window.electron.getProducts();
        products.sort((a, b) => a.name.localeCompare(b.name));
        setAvailableProducts(products);
        const uniqueNames = [...new Set(products.map(p => p.name))];
        const uniqueTypes = [...new Set(products.map(p => p.type))];
        setMarbleOptions(uniqueNames.map(name => ({ label: name, value: name })));
        setTypeOptions(uniqueTypes.map(type => ({ label: type, value: type })));
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      }
    };
    fetchProducts();
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const full = await window.electron.getAllFullInvoices();
      const partial = await window.electron.getAllPartialInvoices();
      setFullInvoices(full);
      setPartialInvoices(partial);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  };

  useEffect(() => {
    const { length, width } = product;
    const calcFeet = parseFloat(length) * parseFloat(width);
    setFeet(isNaN(calcFeet) ? 0 : calcFeet);
  }, [product.length, product.width]);

  useEffect(() => {
    const { rate, discount } = product;
    const amount = feet * parseFloat(rate);
    const discounted = amount - parseFloat(discount || 0);
    setTotal(isNaN(discounted) ? 0 : discounted);
  }, [feet, product.rate, product.discount]);

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selected, field) => {
    const value = selected ? selected.value : '';
    const updated = { ...product, [field]: value };
    const match = availableProducts.find(p =>
      p.name === (field === 'description' ? value : updated.description) &&
      p.type === (field === 'type' ? value : updated.type)
    );
    if (match) updated.rate = match.rate.toString();
    setProduct(updated);
  };

  const addProduct = () => {
    if (!product.description || !product.length || !product.width || !product.rate) {
      alert('Please fill all required product fields.');
      return;
    }
    if (productCustomerType === 'partial') {
      if (!partialCustomerDetails.contact || !partialCustomerDetails.cnic) {
        alert("⚠️ Please provide CNIC and Contact for partial customer.");
        return;
      }
    }
    const newItem = {
      ...product,
      name: customerName,
      customerType: productCustomerType,
      contact: productCustomerType === 'partial' ? partialCustomerDetails.contact : '',
      cnic: productCustomerType === 'partial' ? partialCustomerDetails.cnic : '',
      feet: feet.toFixed(2),
      total: total.toFixed(2)
    };
    setProductList([...productList, newItem]);
    setProduct({ description: '', type: '', length: '', width: '', rate: '', discount: '' });
    setFeet(0);
    setTotal(0);
  };

  const deleteProduct = (indexToDelete) => {
    const updatedList = productList.filter((_, index) => index !== indexToDelete);
    setProductList(updatedList);
  };

  const handlePrint = useReactToPrint({ content: () => printContainerRef.current });
  const grandTotal = productList.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const remaining = grandTotal - parseFloat(received || 0);

  return (
    <div className="p-6 max-h-screen overflow-auto bg-white">
      <div className="mb-6 border rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold text-green-600 mb-4">➕ Add Marble Product</h2>
        <form className="space-y-4">
          {/* Tailwind grid layout replaces bootstrap Row/Col */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1">Name</label>
              <input type="text" name="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border rounded p-2" placeholder="Name" />
            </div>
            <div>
              <label className="block mb-1">Customer Type</label>
              <select value={productCustomerType} onChange={(e) => setProductCustomerType(e.target.value)} className="w-full border rounded p-2">
                <option value="full">Full</option>
                <option value="partial">Partial</option>
              </select>
            </div>
            {productCustomerType === 'partial' && (
              <>
                <div>
                  <label className="block mb-1">CNIC</label>
                  <input type="text" name="cnic" value={partialCustomerDetails.cnic} onChange={(e) => setPartialCustomerDetails({ ...partialCustomerDetails, cnic: e.target.value })} className="w-full border rounded p-2" placeholder="e.g. 35201-xxxxxxx-x" />
                </div>
                <div>
                  <label className="block mb-1">Contact</label>
                  <input type="text" name="contact" value={partialCustomerDetails.contact} onChange={(e) => setPartialCustomerDetails({ ...partialCustomerDetails, contact: e.target.value })} className="w-full border rounded p-2" placeholder="Enter contact number" />
                </div>
              </>
            )}
            <div>
              <label className="block mb-1">Description</label>
              <Select options={marbleOptions} value={marbleOptions.find(opt => opt.value === product.description)} onChange={(selected) => handleSelectChange(selected, 'description')} placeholder="Select Marble" isClearable />
            </div>
            <div>
              <label className="block mb-1">Type</label>
              <Select options={typeOptions} value={typeOptions.find(opt => opt.value === product.type)} onChange={(selected) => handleSelectChange(selected, 'type')} placeholder="Select Type" isClearable />
            </div>
            <div>
              <label className="block mb-1">Length (ft)</label>
              <input name="length" type="number" value={product.length} onChange={handleProductChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Width (ft)</label>
              <input name="width" type="number" value={product.width} onChange={handleProductChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Rate per ft² (₨)</label>
              <input name="rate" type="number" value={product.rate} onChange={handleProductChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Discount (₨)</label>
              <input name="discount" type="number" value={product.discount} onChange={handleProductChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Total ft²</label>
              <input value={feet.toFixed(2)} readOnly className="w-full border rounded p-2 bg-gray-100" />
            </div>
            <div>
              <label className="block mb-1">Total Amount (₨)</label>
              <input value={total.toFixed(2)} readOnly className="w-full border rounded p-2 font-bold text-green-600 bg-gray-100" />
            </div>
          </div>
          <div className="text-right">
            <button type="button" onClick={addProduct} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
