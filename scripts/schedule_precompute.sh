#!/bin/bash
# This script runs the precompute_compatibility.py script daily at 2 AM using cron

# Add this line to your crontab (edit with crontab -e):
# 0 2 * * * /bin/bash /path/to/your/project/scripts/schedule_precompute.sh >> /path/to/your/project/logs/precompute.log 2>&1

# Activate your Python environment if needed
# source /path/to/your/venv/bin/activate

# Navigate to project directory
cd /Users/kireetireddy/Desktop/buddy-up-match-main

# Run the precompute script
python3 scripts/precompute_compatibility.py
