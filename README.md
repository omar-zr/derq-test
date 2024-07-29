Here's the revised `README.md` file with the additional instructions included:

---

# Derq Test

## Technology Stack and Features

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) for the Python backend API.
    - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) for the Python SQL database interactions (ORM).
    - 🔍 [Pydantic](https://docs.pydantic.dev), used by FastAPI, for data validation and settings management.
    - 💾 [PostgreSQL](https://www.postgresql.org) as the SQL database.
- 🚀 [React](https://react.dev) for the frontend.
    - 💃 Using TypeScript, hooks, Vite, and other parts of a modern frontend stack.
    - 🎨 [Chakra UI](https://chakra-ui.com) for frontend components.
    - 🦇 Dark mode support.
- 🐋 [Docker Compose](https://www.docker.com) for development and production.
- 🔒 Secure password hashing by default.
- 🔑 JWT (JSON Web Token) authentication.
- 📞 [Traefik](https://traefik.io) as a reverse proxy/load balancer.
- 🚢 Deployment instructions using Docker Compose, including how to set up a frontend Traefik proxy to handle automatic HTTPS certificates.
- 🏭 CI (continuous integration) and CD (continuous deployment) based on GitHub Actions.

## How To Use It

To run the application, use:

```bash
docker compose up -d
```

✨ It just works. ✨

### Login Details

- **Username:** admin@example.com
- **Password:** changethis

You can go to `localhost` to find the login page.

### Environment Variable

There is an environment variable called `SHOULD_INIT` which is responsible for seeding the data. To avoid re-seeding the data when running the app multiple times, set `SHOULD_INIT` to `false` after the first run.

### Projects

You will find three projects, all of which will work synchronously without any issues.

### Generator

The generator will generate data at the path `/minutes`. This can also be configured.

### Important Note 

- Due to time constraints, it was a bit challenging to complete all requirements, such as displaying the out-of-service time on the charts.
- I am seeding the Sensors Info. Also, it doesn't make sense to rely on a sequential ID. 
- Sensor1 is the one with ID 0 (For Filtering).
- I didn't get the full picture behind the Downtime (is it down if there was no data, if there was corruption, if there was an offline status, or what exactly it is).
- For APIs you can check `http://localhost/docs`
- Let me know if you found anything questionable. 
- Please  read each project ReadMe will gives you more insights.
- There is a Dark Mode also.

## Backend Documentation

Backend docs: [backend/README.md](./backend/README.md).

## Frontend Documentation

Frontend docs: [frontend/README.md](./frontend/README.md).

## Generator Documentation

Generator docs: [generator/README.md](./generator/README.md).

---