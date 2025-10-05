# Linux-System-Monitoring
# Real-Time System Resource Monitoring Dashboard

A simple, real-time web dashboard to monitor system resources (CPU, RAM, Disk, Network).

## Features
- Live CPU, Memory, Disk, Network charts
- System info display
- Alerts for thresholds
- Export data (CSV/JSON)
- WebSocket for real-time updates
- Mobile-friendly design

## Setup Instructions

### Clone the Repository
git clone https://github.com/your-username/resource-monitoring.git
cd resource-monitoring
### Create a Virtual Environment
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

### Install Dependencies
pip install -r requirements.txt

### Run the Application
python run.py

### Access the Dashboard
Open your browser and go to:
- [http://localhost:5000](http://localhost:5000)

## Usage
- View real-time system metrics on the dashboard.
- Access system info, alerts, and historical data.
- Filter and export data.

## Testing
Run the initial tests:
python -m unittest discover tests/

## Project Structure
resource-monitoring/
├── README.md
├── requirements.txt
├── .gitignore
├── app.py
├── run.py
├── config.py
├── monitors/
│ ├── init.py
│ └── system_monitor.py
├── templates/
│ ├── base.html
│ └── index.html
├── static/
│ └── ...
├── api/
│ ├── init.py
│ └── routes.py
└── tests/
└── test_basic.py

## Contribution
- Create feature branches
- Push code regularly
- Open pull requests for review
- Follow coding standards
  
## License
This project is licensed under MIT License.

## Support
- Submit issues for bugs or enhancements
- Contact the team via GitHub discussions

---
**End of setup instructions.**
