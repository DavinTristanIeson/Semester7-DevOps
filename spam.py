import sys
import urllib.request
import time

target = sys.argv[1]
latencies = []
while True:
  time_start = time.perf_counter()
  urllib.request.urlretrieve(target)
  time_end = time.perf_counter()
  if len(latencies) > 10:
    latencies.pop(0)
  latencies.append(time_end - time_start)
  print(f"\rAvg. Latency: {sum(latencies) * 1000 / len(latencies):.4f}ms", end='')
