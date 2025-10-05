"""
CPU and Memory Monitoring Module
Author: Member 2
"""
import psutil
import time
from typing import Dict, List
def get_cpu_usage(interval: float = 1.0) -&gt; float:
"""
Get current CPU usage percentage
Args:
interval: Time interval for CPU measurement
Returns:
CPU usage percentage
"""
Member 2 (CPU/Memory Specialist)

1. Create CPU/Memory monitoring module structure
2. Install and test psutil library
3. Create placeholder functions

# TODO: Implement actual CPU monitoring
print("CPU monitoring placeholder - Day 1")
return psutil.cpu_percent(interval=interval)
def get_memory_usage() -&gt; Dict[str, float]:
"""
Get current memory usage statistics
Returns:
Dictionary containing memory statistics
"""
# TODO: Implement actual memory monitoring
print("Memory monitoring placeholder - Day 1")
memory = psutil.virtual_memory()
return {
'total': memory.total,
'available': memory.available,
'percent': memory.percent,
'used': memory.used,
'free': memory.free
}
def get_cpu_per_core() -&gt; List[float]:
"""Get CPU usage per core"""
# TODO: Implement per-core CPU monitoring
return psutil.cpu_percent(percpu=True)
def get_cpu_info() -&gt; Dict[str, any]:
"""Get CPU information"""
# TODO: Implement CPU info gathering
return {
'physical_cores': psutil.cpu_count(logical=False),
'total_cores': psutil.cpu_count(logical=True),
'max_frequency': psutil.cpu_freq().max if psutil.cpu_freq() else 'N/A',
'min_frequency': psutil.cpu_freq().min if psutil.cpu_freq() else 'N/A',
'current_frequency': psutil.cpu_freq().current if psutil.cpu_freq() else 'N/A'
}
if __name__ == "__main__":
print("Testing CPU/Memory module...")
print(f"CPU Usage: {get_cpu_usage()}%")
print(f"Memory Usage: {get_memory_usage()}")
