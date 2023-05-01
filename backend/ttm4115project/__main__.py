from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

from ttm4115project.mqtt_handle import MQTTWrapperClient
from ttm4115project.stm.session_manager import SessionManager
from ttm4115project.rat import read_rat_from_json
from stmpy import Driver


rat = read_rat_from_json("example_rat.json")

client = MQTTWrapperClient()
driver = Driver()

# Create session manager state machine and install it on the driver
session_manager = SessionManager(client, rat)
session_manager.install(driver)

# Start the driver
driver.start()
driver.wait_until_finished()
