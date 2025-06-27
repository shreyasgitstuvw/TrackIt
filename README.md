# 📊 TrackIT

**TrackIT** is a modern, student-focused attendance tracking web app that helps users log their attendance, monitor patterns, set attendance goals, and get notified when attendance is low or unmarked — all in one sleek interface.

🌐 **Live Demo:** [https://detainproof.netlify.app](https://detainproof.netlify.app)

---

## 🚀 Features

- 🔐 **Authentication**  
  Secure sign-up and login using **Email** or **Google**.

- 📅 **Attendance Logging**  
  Log daily attendance per subject with a simple interface.

- 📊 **Analytics Dashboard**  
  View subject-wise attendance trends:
  - Monthly reports  
  - Weekly summaries  
  - Percentage tracking

- 🎯 **Goal Setting**  
  Set attendance targets for each subject and track your progress.

- ⚠️ **Smart Notifications**  
  Receive alerts when:
  - Attendance is **not marked** for the day  
  - Your attendance drops **below the goal threshold**

- 🗓️ **Calendar Integration**  
  A visual calendar to view daily attendance status.

---

## 🛠 Tech Stack

- **Frontend:** TypeScript, CSS, TailwindCSS  
- **UI Design & Components:** [Lovable AI](https://lovable.so) – Used to generate and refine frontend UI
- **Backend:** Supabase (PostgreSQL, Auth, RLS Policies)  
- **Auth:** Supabase (Email + Google OAuth)  
- **Hosting:** Git & Netlify

---
 UI Credits

The initial UI design and components were created using Lovable AI – an AI-based UI builder that accelerates frontend development.

📝 License

This project is open-source and available under the MIT License.
🙌 Acknowledgements

    Lovable AI for frontend generation

    Supabase for backend infrastructure

    Netlify for seamless deployment

    Inspiration from real student productivity needs

📬 Contact

Have feedback or suggestions? Reach out at:
📧 thakurshreyas70@gmail.com

🧩 Dependencies

Some of the key libraries used:

    Supabase JS – Backend as a Service

    React Calendar – Calendar view

    TailwindCSS – UI Styling

    React Icons – Icons

    Date-fns – Date formatting & calculations

⚙️ Environment Variables

You need to configure the following in your .env file:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

## 📦 Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/trackit.git
cd trackit

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a `.env` file and add your Supabase credentials
cp .env.example .env

# 4. Run the development server
npm run dev





