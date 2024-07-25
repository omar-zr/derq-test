import random
import time
import threading
from datetime import datetime
from typing import Optional
import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class DataGenerator:
    def __init__(self, config):
        self.config = config
        self.running = False
        self.base_url = config.get('base_url', 'http://backend/api/v1/sensors')
        self.generate_event = threading.Event()
        self.auth_header = {}
        self.sensor_id = None

    def authenticate(self):
        """Authenticate and set the authorization token."""
        login_url = os.getenv('LOGIN_URL')
        username = os.getenv('ADMIN_EMAIL')
        password = os.getenv('ADMIN_PASSWORD')

        try:
            response = requests.post(
                login_url,
                headers={
                    'Accept': 'application/json',
                    'Referer': 'http://backend/login',
                    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                    'sec-ch-ua-mobile': '?0',
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                    'sec-ch-ua-platform': '"Linux"',
                },
                files={
                    'username': (None, username),
                    'password': (None, password)
                }
            )
            response.raise_for_status()
            token = response.json().get('access_token')
            if token:
                self.auth_header = {
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
            else:
                print("Authentication failed: No token received")
    
        except requests.RequestException as e:
            print(f"Error during authentication: {e}")

    def fetch_sensor_id(self, sensor_name: str) -> Optional[str]:
        try:
            response = requests.get(f'{self.base_url}/info', headers=self.auth_header)
            response.raise_for_status()
            sensors = response.json()
            for sensor in sensors:
                if sensor.get('name') == sensor_name:
                    return sensor.get('id')
            return None
    
        except requests.RequestException as e:
            print(f"Error fetching sensors: {e}")
            return None

    def generate_counts_data(self):
        approaches = ['NB', 'SB', 'WB', 'EB']
        class_types = ['car', 'motorcycle', 'pedestrian', 'bicycle']
        sensor_id = self.sensor_id
        while self.running:
            payload = []
            for _ in range(self.config['counts_rate']):
                approach = random.choices(approaches, self.config['approach_prob'])[0]
                class_type = random.choices(class_types, self.config['class_prob'])[0]
                time_str = datetime.now().isoformat() + "Z"  # Append 'Z' to match ISO format

                data = {
                    'sensor_id': sensor_id,
                    'time': time_str,
                    'approach': approach,
                    'class_type': class_type
                }
                payload.append(data)

            self.send_data('/sensordata', payload)
            time.sleep(60)  # Wait for a minute before sending the next batch

    def generate_health_data(self):
        sensor_id = self.sensor_id
        while self.running:
            payload = []
            for _ in range(self.config['counts_rate']):  # Assuming counts_rate is used to generate multiple records
                health_status = 'down' if random.random() < self.config['downtime_prob'] else 'up'
                online = health_status == 'up'
                fault = not online

                data = {
                    'sensor_id': sensor_id,
                    'time': datetime.now().isoformat() + "Z",  # Append 'Z' for ISO format
                    'dcp': 100,  # Default value, replace with actual logic if needed
                    'online': online,
                    'fault': fault
                }
                payload.append(data)

            self.send_data('/health', payload)
            time.sleep(60)  # Send health data every minute

    def send_data(self, endpoint, data):
        try:
            response = requests.post(f"{self.base_url}{endpoint}", json=data, headers=self.auth_header)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Error sending data: {e}")

    def start(self):
        if not self.auth_header:
            self.authenticate()
        if not self.sensor_id:
            self.sensor_id = self.fetch_sensor_id('Sensor1')
            if not self.sensor_id:
                raise ValueError("Sensor ID not found for 'Sensor1'")
        
        self.running = True
        self.generate_event.set()
        threading.Thread(target=self.generate_counts_data).start()
        threading.Thread(target=self.generate_health_data).start()

    def stop(self):
        self.running = False
        self.generate_event.clear()

    def update_config(self, new_config):
        self.config.update(new_config)
