# 🚗 Garage Repair Tracker API

![API](https://img.shields.io/badge/api-bun-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)

This is the **backend API** for the Garage Repair Tracker app.  
It is a **fast Bun server** written in **TypeScript** that handles job creation, status updates, and deletion for garage repair tracking.

---

## Features

- Manage **jobs** with license plate, device, and status.
- **PATCH** and **DELETE** endpoints for live updates.
- **CORS-enabled** for your frontend.
- In-memory data storage for simplicity (resets on restart).
- Shared types from `@garage/shared`.

---

## 🛠 Tech Stack

- [Bun](https://bun.sh/) (server & runtime)
- TypeScript
- Shared domain models (`@garage/shared`)
- Simple in-memory store

---

## 🚀 Getting Started

```bash
bun install
bun run src/index.ts
```

Server runs at:

```bash
http://localhost:3001
```
