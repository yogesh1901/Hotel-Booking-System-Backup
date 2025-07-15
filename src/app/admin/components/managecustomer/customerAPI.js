// Correct API Endpoint
const API_URL = "https://68669d5b89803950dbb35bfc.mockapi.io/Data/customers";

// Generate customers array directly (without the wrapper object)
const customersData = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  customerId: `CUST${String(i + 1).padStart(3, '0')}`,
  fullName: `Customer ${i + 1}`,
  mobileNumber: `98765432${String(i + 10).padStart(2, '0')}`,
  email: `customer${i + 1}@example.com`,
  aadharNumber: `1234-5678-90${String(i + 10).padStart(2, '0')}`,
  address: `Address ${i + 1}`,
  country: i % 2 === 0 ? "India" : "USA",
  state: i % 2 === 0 ? "Tamil Nadu" : "California",
  totalBooking: Math.floor(Math.random() * 10) + 1,
  status: i % 2 === 0 ? "Unblock" : "Block"
}));

// Upload Function
async function uploadFullData() {
  try {
    // First, clear existing data (optional)
    const clearResponse = await fetch(API_URL);
    const existingData = await clearResponse.json();
    await Promise.all(existingData.map(item => 
      fetch(`${API_URL}/${item.id}`, { method: 'DELETE' })
    ));

    // Upload new data
    const uploadPromises = customersData.map(customer => 
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      })
    );

    const results = await Promise.all(uploadPromises);
    console.log("✅ All Customers Uploaded Successfully");
  } catch (err) {
    console.error("❌ Upload Failed:", err.message);
  }
}

uploadFullData();