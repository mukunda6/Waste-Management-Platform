# ♻️ Waste Management Platform

A smart and eco-friendly web platform that helps users identify, classify, and manage waste responsibly.  
The project promotes sustainable practices through image-based waste recognition, user training, and efficient data management using Firebase.

🌐 **Live Demo:** [https://waste-management-platform-coral.vercel.app/](https://waste-management-platform-coral.vercel.app/)

---

## 🧩 Overview

The **Waste Management Platform** empowers users to capture waste images, learn proper disposal methods, and contribute to environmental sustainability.  
It bridges the gap between citizens, recycling agencies, and local authorities to make waste management smarter and more transparent.

---

## 🚀 Features

- 📸 **Camera Capture:**  
  Access your device camera directly from the browser to capture and upload waste images.

- 🎓 **Training Module:**  
  Educates users about different types of waste and proper disposal practices.

- 🔥 **Firebase Integration:**  
  Uses Firebase for authentication, database storage, and image uploads.

- 🌐 **Responsive Design:**  
  Works across all devices (mobile, tablet, desktop).

- ⚙️ **Real-Time Data Management:**  
  Stores and retrieves waste-related data efficiently.

- 🚀 **Deployed on Vercel:**  
  Fast, scalable, and serverless hosting for instant updates.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend Framework** | [Next.js](https://nextjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [lucide-react](https://lucide.dev/) |
| **Backend / Database** | [Firebase](https://firebase.google.com/) |
| **Hosting** | [Vercel](https://vercel.com/) |
| **Camera Access** | `navigator.mediaDevices.getUserMedia` API |

---

## 📸 How It Works

1. User visits the platform and grants **camera permission**.  
2. The app activates the camera for **real-time waste capture**.  
3. Image is uploaded to **Firebase Storage**.  
4. (Optional Future) The image is processed or classified by AI.  
5. User can access the **Training section** to learn proper waste management.

---

## 🔐 Permissions

Make sure your browser allows camera access:
- The site is served over **HTTPS (required for camera access)**.
- Check browser settings → “Site Settings” → Enable **Camera Permissions**.

---

## 🧠 Future Enhancements

- 🪄 AI-based waste type classification  
- 📍 Location tracking for waste collection  
- 🪙 Reward system for eco-friendly users  
- 🏢 Admin dashboard for municipal monitoring  
- 📊 Data analytics for waste trends  

---

## ⚙️ Deployment

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/Waste-Management-Platform.git
   cd Waste-Management-Platform
