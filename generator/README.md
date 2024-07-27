# Derq Project - Generator

## Requirements

- [Docker](https://www.docker.com/)
- [Poetry](https://python-poetry.org/) for Python package and environment management

## Local Development

### Generate Data Only

To start the data generator service, run:

```bash
docker compose up generator -d
```

### Interacting with the Generator

You can interact with the generator to start, stop, or configure it via the following URL: `http://localhost:8000`

**Note**: The first time you start your stack, it might take a minute for everything to be ready as the backend waits for the database and configures itself. You can monitor this process by checking the logs.

To check the logs, run:

```bash
docker compose logs generator
```

To check the logs of a specific service, use:

```bash
docker compose logs [service_name]
```

For example, to check the backend logs:

```bash
docker compose logs backend
```

If your Docker is not running on `localhost`, use the appropriate IP address or domain where your Docker is running.

### Generator Requests

To configure the generator, use the following `curl` command:

```bash
curl --location 'http://127.0.0.1:8000/configure' \
--header 'Content-Type: application/json' \
--data '{
    "counts_rate": 500,
    "approach_prob": [0.7, 0.1, 0.1, 0.1],
    "class_prob": [0.1, 0.2, 0.5, 0.2],
    "downtime_prob": 0.01
}'
```