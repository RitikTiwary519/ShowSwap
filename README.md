# 🎟️ ShowSwap

**ShowSwap** is a modern web application where users can **buy and sell tickets** for events such as concerts, festivals, garba nights, flights, trains, and more.  
Built with **Firebase** and a **modern dark-themed UI**, ShowSwap provides a seamless platform for secure ticket swapping.

---

## 🚀 Features

### 👤 User
- Login via **Google Authentication**.  
- View a feed of available tickets.  
- Post new tickets for sale (only after authentication).  
- See ticket details (event, seller info, price, etc.).  
- Contact sellers directly.  

### 🛠️ Admin
- View all tickets posted by users.  
- Remove inappropriate or fake tickets.  

### 🎫 Ticket Feed
- Displays key details:
  - Event Name  
  - Category (Concert, Festival, Train, Flight, etc.)  
  - Seller Name  
  - Seller Contact  
  - Event Price  
  - Event Date  
- Clicking a ticket → opens a **detailed view** with full information.  
- Expired tickets (past event date) are **automatically hidden** from the feed.  

### 📝 Ticket Posting
- Dynamic ticket posting form with fields based on category:
  - **Concert/Festival/Garba:** Artist, Venue, Date, Seat details, Price  
  - **Train/Flight:** Departure, Arrival, Date, Seat/PNR/Flight Number, Price  
  - **Other:** Custom description field  
- Only authenticated users can post.  

---

## 🏗️ Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion  
- **Backend & Database:** Firebase Firestore  
- **Authentication:** Firebase (Google Sign-In)  
- **Hosting:** Firebase Hosting  

---

## 🎨 UI/UX
- Modern **dark theme** with neon-style highlights.  
- Smooth animations and transitions.  
- Responsive design (mobile + desktop).  
- Ticket feed in clean grid/list format.  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/showswap.git
cd showswap
