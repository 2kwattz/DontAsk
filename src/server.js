const express = require('express'); // Express Framework
const mongoose = require('mongoose');
const moment = require('moment');
mongoose.connect("mongodb://localhost:27017/appointment")
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));
const app = express(); // Express Instance
const path = require('path');
const bodyParser = require('body-parser');
const port = 80; 

// Paths
const staticPath = path.join(__dirname, "../public");
app.use(bodyParser.urlencoded({ extended: true })); 
console.log("StaticPath ",staticPath)

// Middlewares
app.use(express.static(staticPath));

// View Engine
app.set('view engine','hbs')

// Appointment Schema

const appointmentSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
  },

  lastName:{
    type: String,
    required: true,
  },

  email:{
    type:String,
    required: true,
  },

  subject:{
    type:String,
    required: true,
  },


    // The date of the appointment
    date: {
      type: Date,
      required: true,
      unique: true, // Ensure each date is unique, preventing multiple bookings on the same date
    },
    // Array to store time slots for the day
    timeSlots: [
      {
        timeSlot: { 
          type: String, 
          required: true 
        },
        isBooked: { 
          type: Boolean, 
          default: false 
        },
      },
    ],
    // track creation date for auditing purposes
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Appointment = mongoose.model('Appointment', appointmentSchema);

  function getNextFiveDaysWithTimeSlots() {
    const days = [];
    const today = moment(); // Get today's date using Moment.js

    for (let i = 0; i < 5; i++) {
        const nextDay = today.clone().add(i, 'days'); // Clone today and add i days

        // Define an object for each day with time slots
        const dayObject = {
            formattedDate: nextDay.format('DD MMMM'), // Formatted date as '18 November'
            year: nextDay.year(), // Year (e.g., 2024)
            day: nextDay.date(), // Day of the month (e.g., 18)
            month: nextDay.format('MMMM'), // Full month name (e.g., November)
            date: nextDay.toDate(), // The full JavaScript Date object
        };

        console.log("Days Object", dayObject)

        days.push(dayObject); // Add the day object with time slots to the array
    }

    return days;
}

// Routes

// Display the next five days with available time slots
app.get("/", function (request, response) {
    const nextFiveDays = getNextFiveDaysWithTimeSlots();
    console.log("Next 5 days", nextFiveDays);
    response.render("index", { nextFiveDays });
});

// Handle form submission for appointment
app.post("/", function (request, response) {
    const { firstName, lastName, email, phone, subject, enquiry, selectedDate, selectedTime } = request.body;

    // Convert selected date and time into a Date object
    const appointmentDateTime = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD hh:mm A').toDate();

    console.log("Received Appointment Request:");
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Subject:", subject);
    console.log("Enquiry:", enquiry);
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);

    // Create the time slot object to mark as booked
    const timeSlot = {
        timeSlot: selectedTime, // Store the selected time
        isBooked: true, // Mark it as booked
    };

    // Create a new appointment object that matches your schema
    const newAppointment = new Appointment({
        firstName,
        lastName,
        email,
        phone,
        subject,
        enquiry,
        date: appointmentDateTime, // Use the 'date' field from the schema
        timeSlots: [timeSlot] // Store the time slot in the 'timeSlots' array
    });

    // Save the appointment to MongoDB
    newAppointment.save()
        .then(() => {
            console.log("Appointment saved successfully!");
            const successPrompt = "Successfull"
            // Send confirmation message and redirect to a success page or homepage
            response.status(200).render('index', {nextFiveDays,successPrompt});
        })
        .catch(err => {
            console.error("Error saving appointment:", err);
            response.status(500).send('Error saving appointment');
        });
});

// App Listen
app.listen(port, function(){
    console.log(`Node Server is running, listening on port ${port} `)
})

