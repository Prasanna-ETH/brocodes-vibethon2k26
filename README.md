# ResQ AI: Intelligent Emergency Response System

ResQ AI is a state-of-the-art emergency reporting and management platform designed to bridge the gap between citizens and first responders. By leveraging artificial intelligence, ResQ AI ensures that every second counts, providing instant analysis, precise routing, and real-time tracking during critical situations.

## 🚀 Key Features

### 1. AI-Driven Incident Analysis
- **Natural Language Reporting**: Users can describe emergencies in their own words. Our AI engine extracts key details, identifies incident types, and classifies severity in real-time.
- **Automated Severity Classification**: Instantly categorizes reports from 'Low' to 'Critical' based on the description and reported victims.
- **Smart Service Routing**: Automatically determines the necessary response teams (Police, Ambulance, and Fire) required for the situation.

### 2. Comprehensive Dashboards
- **Citizen Dashboard**: A centralized hub for users to report emergencies, view local community alerts, and monitor the status of their previous reports.
- **Responder Command Center**: A high-level administrative interface for emergency services to manage active cases, update statuses, and monitor team availability.

### 3. Real-Time Tracking & Coordination
- **Live Responder Tracking**: Interactive map integration showing the real-time location and ETA of assigned response units.
- **Dynamic Status Timeline**: A step-by-step visual tracker for every report, from 'Received' to 'Resolved'.
- **Evidence Management**: Secure upload of photos and videos to provide first responders with immediate visual context.

### 4. Optimized Experience
- **Emergency Mode**: A high-visibility, simplified UI state designed for rapid reporting under high stress.
- **One-Click Demo Access**: Integrated shortcuts for quick evaluation of both Citizen and Admin workflows.

## 🛠 Technical Stack

ResQ AI is built with a modern, high-performance stack to ensure reliability and speed:

- **Core Framework**: [React](https://reactjs.org/) (TypeScript)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Routing**: [React Router](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [Next Themes](https://github.com/pacocoursey/next-themes)

## 📦 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd brocodes-vibethon2k26
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8080`.

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (shadcn/ui + custom)
├── hooks/          # Custom React hooks
├── lib/            # Utilities, contextProviders, and mock data
├── pages/          # Application views (Auth, Dashboards, Reporting, etc.)
└── types/          # TypeScript definitions
```

---

*ResQ AI – Every Second Counts.*
