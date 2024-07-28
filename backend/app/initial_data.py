import logging
import os

from sqlmodel import Session

from app.core.db import engine, init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    with Session(engine) as session:
        init_db(session)


def main() -> None:
    logger.info("Creating initial data")
    should_init = os.getenv("SHOULD_INIT", "False").lower() in ('true', '1', 't')
    if should_init:
        init()
        logger.info("Initial data created")
    else:
        logger.info("Initialization skipped")


if __name__ == "__main__":
    main()
