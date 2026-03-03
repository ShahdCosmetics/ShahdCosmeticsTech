# ShahdCosmetics Project

This is a full-stack e-commerce project for cosmetics, built with **Nest.js** (Backend), **Next.js** (Frontend), and **PostgreSQL** (Database), all containerized using **Docker**.

## 🚀 Getting Started

Follow these steps to set up the project on your local machine after pulling the repository.

---

### 1. Environment Configuration
The `.env` file is ignored by Git for security. You must create it manually:
* Navigate to the `backend` folder.
* Create .env file and past the folowing content
    DATABASE_URL="postgresql://shahd_user:shahd_password@localhost:5432/shahd_db"
    PORT=3000

---

### 2. Launch the Infrastructure
We use Docker Compose to manage all services. In the **root directory** (where `docker-compose.yml` is), run:

```bash
docker-compose up --build -d


### Run this command once to connect to the database.
execute this command after ensure Docker is running:
docker exec -it shahd_backend npx prisma db push

control following urls:
Frontend: http://localhost:3001
Backend API: http://localhost:3000

How to View and Add Data
To manage products or users visually, use Prisma Studio.
Open a terminal in the backend/ folder.
Run: npx prisma@5.22.0 studio
Access it at: http://localhost:5555