"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {

  // ================== test data =========================
  const hotels = [
    {
      id: 1,
      name: "The Grand Heritage Hotel",
      location: "Kuala Lumpur City Centre",
      price: 250,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    },
    {
      id: 2,
      name: "Serene Garden Suites",
      location: "Bukit Bintang, Kuala Lumpur",
      price: 180,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    },
    {
      id: 3,
      name: "Azure Skyline Residence",
      location: "Petaling Jaya, Selangor",
      price: 320,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    },
  ];


  const rooms = [
    {
      id: 1,
      hotelId: 1,
      name: "Deluxe King Room",
      price: 250,
      capacity: 2,
    },
    {
      id: 2,
      hotelId: 1,
      name: "Executive Suite",
      price: 450,
      capacity: 3,
    },
    {
      id: 3,
      hotelId: 2,
      name: "Standard Queen Room",
      price: 180,
      capacity: 2,
    },
    {
      id: 4,
      hotelId: 2,
      name: "Garden Suite",
      price: 300,
      capacity: 3,
    },
    {
      id: 5,
      hotelId: 3,
      name: "Skyline Deluxe Room",
      price: 320,
      capacity: 2,
    },
    {
      id: 6,
      hotelId: 3,
      name: "Premium Skyline Suite",
      price: 550,
      capacity: 4,
    },
  ];

  // ================== test data =========================

  const [stayType, setStayType] = useState("overnight");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [hasSearch, setHasSearch] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  // const checkinRef = useRef<HTMLInputElement>(null);
  // const checkoutRef = useRef<HTMLInputElement>(null);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const [activeDatePicker, setActiveDatePicker] = useState<"checkin" | "checkout" | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setActiveDatePicker(null);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!checkin) {
      alert("Please select a check in date.");
      return;
    }

    if (!checkout) {
      alert("Please seleect a check out date.");
      return;
    }

    if (checkin >= checkout) {
      alert("Check out must be after check in");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const destination = formData.get("destination");
    const rooms = formData.get("guest-rooms");
    const adults = formData.get("guest-adult");
    const childs = formData.get("guest-child");

    // alert(
    //   `Stay Type: ${stayType}
    //     Destination: ${destination}
    //     Check-in: ${checkin}
    //     Check-out: ${checkout}
    //     Rooms: ${rooms}
    //     Adults: ${adults}
    //     Children: ${childs}`
    // );

    setHasSearch(true);
  };

  return (
    <main>
      <div className="filter-section">
        <div className="title">
          <h1>Where wisdom meets welcome, and every stay feels like home</h1>
        </div>

        <form className="filter-card" onSubmit={handleSearch}>
          <div className="filter-button">
            <button type="button" onClick={() => { setStayType("overnight") }} className={stayType === "overnight" ? "selected" : ""}>Overnight Stay</button>
            <button type="button" onClick={() => { setStayType("day-use") }} className={stayType === "day-use" ? "selected" : ""}>Day Use Stay</button>
          </div>

          <input type="text" className="destination" name="destination" placeholder="Enter Destination" />

          <div className="filter-date" ref={datePickerRef}>
            <div className="date-button-wrapper">
              <button type="button" className="date-button" onClick={() => setActiveDatePicker(activeDatePicker === "checkin" ? null : "checkin")}> {checkin || "Select Check-In Date"}</button>
              {activeDatePicker === "checkin" && (
                <div className="calendar-popup">
                  <div className="calendar-header">
                    <button type="button" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>←</button>
                    <strong>
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                    <button type="button" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>→</button>
                  </div>

                  <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div key={day} className="calendar-weekday">
                          {day}
                        </div>
                      )
                    )}

                    {Array.from({ length: firstDay }).map((_, index) => (
                      <div key={`empty-${index}`} />
                    ))}

                    {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
                      (day) => (
                        <button
                          key={day}
                          type="button"
                          className="calendar-day"
                          disabled={
                            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` <
                            todayString
                          }

                          onClick={() => {
                            const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                            // Save the selected check-in date
                            setCheckin(selectedDate);

                            // Clear check-out if it is on or before the new check-in date
                            if (checkout && checkout <= selectedDate) {
                              alert("Invalid Checkin Date, Please Try Again");
                              setCheckout("");
                            }

                            // Close the calendar
                            setActiveDatePicker(null);
                          }}
                        >
                          {day}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="date-button-wrapper">
              <button type="button" className="date-button" onClick={() => setActiveDatePicker(activeDatePicker === "checkout" ? null : "checkout")}> {checkout || "Select Check-Out Date"}</button>
              {activeDatePicker === "checkout" && (
                <div className="calendar-popup">
                  <div className="calendar-header">
                    <button type="button" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>←</button>
                    <strong>
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                    <button type="button" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>→</button>
                  </div>

                  <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div key={day} className="calendar-weekday">
                          {day}
                        </div>
                      )
                    )}

                    {Array.from({ length: firstDay }).map((_, index) => (
                      <div key={`empty-${index}`} />
                    ))}

                    {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
                      (day) => (
                        <button
                          key={day}
                          type="button"
                          className="calendar-day"
                          disabled={
                            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` <
                            todayString
                          }

                          onClick={() => {
                            const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                            // Save the selected check-in date
                            setCheckout(selectedDate);

                            // Clear check-out if it is on or before the new check-in date
                            if (checkin && checkin >= selectedDate) {
                              alert("Invalid Checkout Date, Please Try Again");
                              setCheckin("");
                            }

                            // Close the calendar
                            setActiveDatePicker(null);
                          }}
                        >
                          {day}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="guest">
            <div className="guest-field">
              <label htmlFor="guest-rooms">Rooms</label>
              <input type="number" name="guest-rooms" id="guest-rooms" min="1" defaultValue={1} />
            </div>

            <div className="guest-field">
              <label htmlFor="guest-adult">Adults</label>
              <input type="number" name="guest-adult" id="guest-adult" min="1" defaultValue={1} />
            </div>

            <div className="guest-field">
              <label htmlFor="guest-child">Child</label>
              <input type="number" name="guest-child" id="guest-child" min="0" defaultValue={0} />
            </div>
          </div>

          <button type="submit" className="filter-submit">Search Rooms</button>
        </form>

        {hasSearch && (
          <section className="hotel-results">
            <h2>Available Hotels</h2>

            <div className="hotel-list">
              {hotels.map((hotel) => (
                <article key={hotel.id} className="hotel-card">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="hotel-image"
                  />

                  <div className="hotel-card-content">
                    <h3>{hotel.name}</h3>
                    <p>{hotel.location}</p>
                    <p>⭐ {hotel.rating} / 5</p>
                    <p className="hotel-price">
                      RM {hotel.price} <span>/ night</span>
                    </p>

                    <button type="button" className="view-rooms-button" onClick={() => setSelectedHotel(hotel.id)}>
                      View Rooms
                    </button>
                  </div>
                </article>
              ))}

              {selectedHotel !== null && (
                <section className="room-details">
                  <h2>
                    Rooms at {
                      hotels.find((hotel) => hotel.id === selectedHotel)?.name
                    }
                  </h2>

                  {rooms
                    .filter((room) => room.hotelId === selectedHotel)
                    .map((room) => (
                      <div key={room.id} className="room-card">
                        <h3>{room.name}</h3>
                        <p>Capacity: {room.capacity} Guests</p>
                        <p>RM {room.price} <span> / Night</span></p>
                        <button type="button" onClick={() => setSelectedRoom(room.id)}>Book Room</button>
                      </div>
                    ))
                  }

                  <button type="button" onClick={() => {
                    setSelectedHotel(null);
                    if (selectedRoom !== null) {
                      setSelectedRoom(null);
                    };
                  }}>Back To Hotels</button>
                </section>
              )}


              {selectedRoom !== null && (
                <div className="booking-form">
                  <h3>Complete Your Booking</h3>

                  <p>
                    Room: {rooms.find((room) => room.id === selectedRoom)?.name}
                  </p>

                  <p>
                    Price: RM {rooms.find((room) => room.id === selectedRoom)?.price} / night
                  </p>

                  <label htmlFor="guest-name">Full Name</label>
                  <input
                    type="text"
                    id="guest-name"
                    placeholder="Enter your full name"
                  />

                  <label htmlFor="guest-email">Email Address</label>
                  <input
                    type="email"
                    id="guest-email"
                    placeholder="Enter your email"
                  />

                  <button type="button" onClick={() => setSelectedRoom(null)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
} 