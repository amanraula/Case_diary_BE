
# 🚨 Case Diary Digitization & Analytics System  
**Odisha Police — Hack4Safety 2025 Submission**  
A comprehensive digital case management and analytics platform built to modernize the law enforcement workflow.

---

## 🧩 Problem Statement — *Odisha Police Hack4Safety 2025*
The existing **case diary system** in police stations is *manual, paper-based, and fragmented.*  
Tracking case progress, updates, and attached documents requires hours of coordination — with minimal analytical insight.

### ⚠️ Challenges Faced
- Manual record-keeping leading to data loss and redundancy.  
- No centralized platform for multi-officer collaboration.  
- Difficult to trace timeline updates or cross-reference similar cases.  
- No predictive or recommendation capabilities to aid investigation.

---

## 💡 Primary Solution
A **unified digital platform** where police officers can securely manage, update, and analyze case data — in real time.  
It digitizes investigation workflows, brings transparency, and enables **intelligent decision-making** using data-driven analytics.

### 🎯 Core Objectives
- Streamline case creation, updates, and documentation.  
- Enable secure file uploads and digital records.  
- Offer timeline-based visualization of events.  
- Provide smart recommendations based on solved cases.  
- Deliver actionable analytics dashboards for command-level insights.

---

## ⚙️ System Architecture (MERN Stack)

**Frontend:** React.js  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**Auth:** JWT  
**File Uploads:** Multer (per-case folders)  
**Analytics:** MongoDB Aggregation Pipelines  
**Recommendation Engine:** NLP-based keyword similarity  

### 🧱 Architecture Overview
```plaintext
Frontend (React)
│
├── Officer Login / JWT Authentication
├── Dashboard (Cases + Calendar + Analytics)
├── Case Details (Timeline, Files, Updates)
└── AI-Based Recommendation View

Backend (Node.js + Express)
│
├── Authentication Middleware (JWT)
├── Case Controller
├── File Upload Middleware (Multer)
├── Analytics Engine (MongoDB Aggregations)
└── Recommendation Engine (NLP)

Database (MongoDB)
│
├── Officers
├── Cases
├── Updates
├── Files
└── Schedules / Events
```

---

## 🚀 Core Features

### 🗂 Case Management
- Create, update, and monitor case records in real time.  
- Auto-generate case numbers and assign reporting officers.  
- Maintain complete **case timelines** with date-wise updates.

### 📁 Document Upload & Tracking
- Upload PDF, images, or videos for each case.  
- Auto-log upload events as updates in the case timeline.  
- Store metadata: uploader, timestamp, and file size.

### 📆 Smart Calendar & Scheduling
- Officers can add, view, and delete **public/private** events.  
- Events automatically sync with assigned stations.

### 📊 Global Analytics Dashboard
- Visualize number of pending vs. completed cases.  
- Graph trends by station, rank, or status.  
- Generate performance reports via aggregated queries.

### 🤖 AI Recommendation Engine
- Suggests **similar past cases** using NLP keyword matching.  
- Helps officers learn from previous solved investigations.

### 🔐 Secure Hierarchical Access
- Officers can only view cases from their **own station** or below their **rank level.**  
- JWT ensures secure API access and session handling.

---

## 🧠 Database Design

| Collection | Key Fields | Description |
|-------------|-------------|--------------|
| **Officers** | name, rank, badgeNumber, station, rankLevel | Officer info & hierarchy |
| **Cases** | caseNum, description, stationReported, status | Main investigation records |
| **Updates** | dateTime, description, updatedBy | Case activity logs |
| **Files** | filename, originalName, uploadedAt, uploadedBy | Document storage & metadata |
| **Schedules** | title, date, privacy, createdBy | Events & calendar data |

---

## 🎨 Frontend Modules

| Module | Description |
|--------|-------------|
| **Login Page** | JWT-based officer authentication |
| **Dashboard** | Unified view of cases, calendar, and analytics |
| **Case Detail View** | Timeline, file uploads, updates, and recommendations |
| **Analytics Page** | Charts & KPIs for high-level command view |
| **Calendar System** | Private/public scheduling for officers |

---

## 🧠 Innovation Highlights
- 📜 Real-time Case Timeline tracking.  
- ⚡ Auto-update logging for every officer action.  
- 🧩 AI-powered recommendation for similar cases.  
- 📊 Live analytics for data-driven policing.  
- 🔒 Rank-based data visibility & control.  
- ☁️ Secure file uploads and metadata tracking.

---

## 🏁 Outcome
A production-grade **Digital Case Diary System** for Odisha Police that enhances transparency, reduces manual dependency, and empowers data-driven investigation.  
Built to scale, integrate with existing police systems, and adapt for future AI integration.

---

## 🔥 Hackathon Journey — *Hack4Safety 2025*
> “2 AM commits, 5 AM debugging, and zero sleep — the perfect hackathon storm.”

- Started with scattered ideas — ended with a full-stack intelligence platform.  
- Designed backend API routes, schema models, and real-time updates from scratch.  
- Built analytics and recommendation engine in the final hours.  
- Fought with `Multer` errors, but triumphed at dawn ☕  
- Every console log felt like a medal 🥇

**Result:** A system that stunned judges — not just functional, but visionary.

---

## 🧩 Architecture Diagram
![Architecture Diagram](A_flowchart-style_architectural_diagram_illustrate.png)

---

## 🧭 Conclusion
From handwritten case diaries to intelligent digital systems —  
this project represents a **paradigm shift in law enforcement analytics.**  
It’s not just software — it’s the beginning of **Data-Driven Policing in Odisha.**  

---
🖋 **Built with heart, logic, and caffeine by Aman — Hack4Safety 2025.**
