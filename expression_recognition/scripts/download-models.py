import os
import sys
sys.path.append(os.getcwd())

import urllib.request

MODELS_PATH = "aimodels"
HAARCASCADE_FILE = os.path.join(MODELS_PATH, "haarcascade_frontalface_default.xml")
LBFMODEL_FILE = os.path.join(MODELS_PATH, "lbfmodel.yaml")
EXPRESSION_RECOGNITION_FILE = os.path.join(MODELS_PATH, "expression_recognition.keras")

if not os.path.exists(MODELS_PATH):
  os.mkdir(MODELS_PATH)

if not os.path.exists(HAARCASCADE_FILE):
  print(f"Fetching {HAARCASCADE_FILE}...")
  urllib.request.urlretrieve("https://raw.githubusercontent.com/opencv/opencv/refs/heads/4.x/data/haarcascades/haarcascade_frontalface_default.xml", HAARCASCADE_FILE)
if not os.path.exists(LBFMODEL_FILE):
  print(f"Fetching {LBFMODEL_FILE}...")
  urllib.request.urlretrieve("https://github.com/kurnianggoro/GSOC2017/raw/master/data/lbfmodel.yaml", LBFMODEL_FILE)
if not os.path.exists(EXPRESSION_RECOGNITION_FILE):
  print(f"Fetching {EXPRESSION_RECOGNITION_FILE}...")
  urllib.request.urlretrieve("https://github.com/DavinTristanIeson/Semester7-DeepLearning/releases/download/v0.0.0/model.keras", EXPRESSION_RECOGNITION_FILE)
