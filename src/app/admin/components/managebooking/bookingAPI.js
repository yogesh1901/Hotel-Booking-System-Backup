const API_URL = "https://68669d5b89803950dbb35bfc.mockapi.io/Data/bookings";

// Enhanced bookings data with modification tracking and availability
const bookingsData = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  bookingId: `B${String(i + 1).padStart(3, '0')}`,
  name: `Customer ${i + 1}`,
  aadharNumber: `1234-5678-90${String(i + 10).padStart(2, '0')}`,
  mobileNumber: `98765432${String(i + 10).padStart(2, '0')}`,
  roomType: i % 3 === 0 ? "Deluxe" : i % 3 === 1 ? "Standard" : "Suite",
  roomNumber: `${100 + (i % 15)}`,
  checkIn: `2025-07-${String(5 + (i % 20)).padStart(2, '0')}`,
  checkOut: `2025-07-${String(6 + (i % 20)).padStart(2, '0')}`,
  bookingStatus: ["Confirmed", "Pending", "Cancelled"][i % 3],
  noOfGuests: (i % 4) + 1,
  specialRequest: i % 2 === 0 ? "Extra pillows" : "Late check-in",
  amount: 2000 + (i * 500),
  originalBookingId: null,
  modificationRequest: null,
  modificationStatus: null,
  originalCheckIn: null,
  originalCheckOut: null,
  originalRoomType: null,
  originalRoomNumber: null,
  originalAmount: null,
  isModified: false,
  refundAmount: 0,
  modificationDate: null,
  modificationType: null // 'checkInChange', 'checkOutChange', 'roomChange'
}));

// Room availability data
const roomsInventory = {
  Deluxe: Array.from({ length: 5 }, (_, i) => ({
    roomNumber: `20${i + 1}`,
    bookings: []
  })),
  Standard: Array.from({ length: 10 }, (_, i) => ({
    roomNumber: `10${i + 1}`,
    bookings: []
  })),
  Suite: Array.from({ length: 3 }, (_, i) => ({
    roomNumber: `30${i + 1}`,
    bookings: []
  }))
};

// Function to check room availability
function checkAvailability(roomType, checkIn, checkOut, excludeBookingId = null) {
  const rooms = roomsInventory[roomType];
  const availableRooms = rooms.filter(room => {
    return !room.bookings.some(booking => {
      if (excludeBookingId && booking.bookingId === excludeBookingId) return false;
      return (
        (new Date(checkIn) < new Date(booking.checkOut) && 
         new Date(checkOut) > new Date(booking.checkIn))
      );
    });
  });
  return availableRooms;
}

// Upload Function with enhanced data
async function uploadFullData() {
  try {
    // Clear existing data
    const clearResponse = await fetch(API_URL);
    const existingData = await clearResponse.json();
    await Promise.all(existingData.map(item => 
      fetch(`${API_URL}/${item.id}`, { method: 'DELETE' })
    ));

    // Upload new data
    const uploadPromises = bookingsData.map(booking => 
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
      })
    );

    const results = await Promise.all(uploadPromises);
    console.log("✅ All Bookings Uploaded Successfully");
  } catch (err) {
    console.error("❌ Upload Failed:", err.message);
  }
}

uploadFullData();