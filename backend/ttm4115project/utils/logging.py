import logging
import sys
import os

formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")


def create_logger(name, log_file, level=None):
    if level is None:
        # We don't want spammy debug messages when we are running in production
        do_debug_logging = os.environ.get("DEBUG_LOGGING", False)
        level = logging.DEBUG if do_debug_logging else logging.INFO

    handler = logging.FileHandler(log_file)
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger
