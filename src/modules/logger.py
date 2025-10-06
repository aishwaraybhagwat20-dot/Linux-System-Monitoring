"""
Enhanced Logging Module - Day 2 Implementation
Author: Member 4
"""
from loguru import logger
import sys
import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
def setup_
logger(log_
level: str =
console
"INFO"
, log_
file: str =
"data/logs/logs.log"
_
output: bool = True, json
_
format: bool = False):
"""
Set up comprehensive logging configuration
Args:
,
log_
level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
log_
file: Path to log file
console
_
output: Whether to output to console
json
_
format: Whether to use JSON format for logs
Returns:
Configured logger instance
"""
# Create logs directory if it doesn't exist
Path(log_
file).parent.mkdir(parents=True, exist
_
ok=True)
# Remove default logger
logger.remove()
# Define formats
if json
format:
_
log_
format =
"{time} | {level} | {name}:{function}:{line} | {message} | {extra}"
else:
console
format =
_
file
format =
_
"&lt;green&gt;{time:YYYY-MM-DD HH:mm:ss}&lt;/green&gt; | &lt;level&
"{time:YYYY-MM-DD HH:mm:ss} | {level: &lt;8} | {name}:{function}:{line
# Add console logger if requested
if console
_
output:
logger.add(
sys.stderr,
level=log_
level,
format=console
colorize=True,
backtrace=True,
diagnose=True
_
format if not json
_
format else log_
format,
)
# Add file logger with rotation and compression
logger.add(
log_
file,
level=log_
level,
format=file
_
format if not json
_
format else log_
format,
rotation=
"50 MB"
, # Rotate when file reaches 50MB
retention=
"30 days"
, # Keep logs for 30 days
compression=
"zip"
, # Compress old logs
backtrace=True,
diagnose=True,
enqueue=True, # Thread-safe logging
serialize=json
_
format # JSON serialization if requested
)
# Add error file logger
error
_
file = str(Path(log_
file).parent / "error.log")
logger.add(
error
_
file,
level=
"ERROR"
,
format=file
_
format if not json
_
format else log_
format,
rotation=
"10 MB"
,
retention=
"60 days"
,
compression=
"zip"
,
backtrace=True,
diagnose=True,
enqueue=True,
serialize=json
_
format
)
logger.info("Enhanced logger initialized successfully")
return logger
def log_
system
_
stats(cpu
_
usage: float, memory_
usage: dict, disk
_
usage: list = None):
"""
Log comprehensive system statistics
Args:
cpu
_
usage: CPU usage percentage
memory_
usage: Memory usage dictionary
disk
_
usage: Optional disk usage list
"""
try:
# Log basic stats
logger.info(f"System Stats - CPU: {cpu
_
usage:.1f}%, Memory: {memory_
usage.get('perce
# Log detailed memory info
if memory_
usage:
total
gb = memory
usage.get('total'
, 0) / (1024**3)
available
gb = memory
usage.get('available'
, 0) / (1024**3)
used
gb = memory
usage.get('used'
, 0) / (1024**3)
logger.debug(f"Memory Details - Total: {total
_gb:.1f}GB, Used: {used
_gb:.1f}GB,
# Log swap usage if available
if 'swap_percent' in memory_
usage:
logger.debug(f"Swap Usage: {memory_
usage['swap_percent']:.1f}%")
# Log disk usage if provided
if disk
_
usage:
for disk in disk
_
usage:
logger.debug(f"Disk {disk['device']}: {disk['percent']:.1f}% used, {disk['fr
except Exception as e:
logger.error(f"Error logging system stats: {e}")
def log_process
_
info(processes: list, top_
n: int = 5):
"""
Log process information
Args:
processes: List of process dictionaries
top_
n: Number of top processes to log in detail
"""
try:
total
_processes = len(processes)
logger.info(f"Process Monitor - Total processes: {total
_processes}")
if processes:
# Log top processes by CPU
top_
cpu = sorted(processes, key=lambda x: x.get('cpu
_percent'
, 0), reverse=True)
logger.debug("Top CPU processes:")
for proc in top_
cpu:
logger.debug(f" PID {proc['pid']}: {proc['name']} - CPU: {proc['cpu
_percent
# Log top processes by memory
top_
memory = sorted(processes, key=lambda x: x.get('memory_percent'
, 0), reverse
logger.debug("Top Memory processes:")
for proc in top_
memory:
memory_
mb = proc.get('memory_
rss'
, 0) / (1024**2)
logger.debug(f" PID {proc['pid']}: {proc['name']} - Memory: {proc['memory_p
except Exception as e:
logger.error(f"Error logging process info: {e}")
def log_
alert(message: str, level: str =
"""
Log system alerts with additional context
Args:
message: Alert message
level: Log level for the alert
context: Additional context information
"WARNING"
, context: Dict[str, Any] = None):
"""
try:
context = context or {}
alert
_
data = {
"timestamp": datetime.now().isoformat(),
"alert
_
type": "system
monitor"
_
,
"message": message,
"context": context
}
if level.upper() ==
"CRITICAL":
logger.critical(f"ALERT: {message}"
elif level.upper() ==
"ERROR":
logger.error(f"ALERT: {message}"
elif level.upper() ==
"WARNING":
logger.warning(f"ALERT: {message}"
, extra=alert
_
data)
, extra=alert
_
data)
, extra=alert
_
data)
else:
logger.info(f"ALERT: {message}"
, extra=alert
_
data)
except Exception as e:
logger.error(f"Error logging alert: {e}")
def get
_
log_
stats(log_
file: str =
"""
Get statistics about log files
Args:
log_
file: Path to log file
Returns:
Dictionary containing log statistics
"""
try:
"data/logs/logs.log") -&gt; Dict[str, Any]:
log_path = Path(log_
file)
if not log_path.exists():
return {"error": "Log file not found"}
stats = {
"file
"last
size
_
_
mb": log_path.stat().st
_
size / (1024**2),
_
modified": datetime.fromtimestamp(log_path.stat().st
_
mtime).isoformat(),
"line
_
count": 0,
"log_
levels": {"INFO": 0,
"DEBUG": 0,
"WARNING": 0,
"ERROR": 0,
"CRITICAL": 0}
}
# Count lines and log levels
try:
with open(log_path,
'r') as f:
for line in f:
stats["line
_
count"] += 1
for level in stats["log_
levels"]:
if f" {level} " in line:
stats["log_
levels"][level] += 1
break
except Exception as e:
stats["read
_
error"] = str(e)
return stats
except Exception as e:
return {"error": f"Error getting log stats: {e}"}
def archive
"""
old
_
_
logs(log_
directory: str =
"data/logs"
, days
_
old: int = 7):
Archive old log files
Args:
log_
directory: Directory containing log files
days
_
old: Archive files older than this many days
"""
try:
if
log_
dir = Path(log_
directory)
archive
_
dir = log_
dir / "archive"
archive
_
dir.mkdir(exist
_
ok=True)
cutoff
_
date = datetime.now() - timedelta(days=days
_
archived
count = 0
old)
_
for log_
file in log_
dir.glob("*.log"):
if log_
file.is
_
file():
file
_
modified = datetime.fromtimestamp(log_
file.stat().st
_
mtime)
if file
_
modified &lt; cutoff
date:
_
# Move to archive
archive
_path = archive
_
dir / f"{log_
file.stem}_{file
_
modified.strftime(
log_
file.rename(archive
_path)
archived
count += 1
_
logger.info(f"Archived old log file: {log_
file.name}")
logger.info(f"Log archiving complete. Archived {archived
_
count} files.
")
except Exception as e:
logger.error(f"Error archiving logs: {e}")
"
name
==
main
":
__
__
__
__
# Test enhanced logging
setup_
logger("DEBUG")
logger.debug("Testing debug logging")
logger.info("Testing info logging")
logger.warning("Testing warning logging")
logger.error("Testing error logging")
# Test system stats logging
sample
_
cpu = 25.5
sample
_
memory = {
'percent': 67.8,
'total': 16 * 1024*3, 'available': 8 * 10243, 'used': 8 * 1024*3, # 8GB
'swap_percent': 12.5
# 16GB
# 8GB
}
log_
system
_
stats(sample
_
cpu, sample
_
memory)
# Test alert logging
log_
alert("High CPU usage detected"
,
"WARNING"
, {"cpu
_
usage": sample
_
cpu})
# Test log stats
stats = get
_
log_
stats()
logger.info(f"Log file stats: {stats}")
