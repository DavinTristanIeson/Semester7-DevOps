from dataclasses import dataclass
from typing import Optional, Sequence, Tuple, Union, cast, ClassVar
import urllib.request
import os

import numpy.typing as npt
import numpy as np
import math
import cv2 as cv
import scipy.spatial.distance
import skimage.feature

def clamp(value: int, min_value: int, max_value: int):
  return max(min_value, min(max_value, value))
def deg2rad(deg: float):
  return deg * 3.14 / 180.0
def rad2deg(rad: float):
  return rad * 180.0 / 3.14

@dataclass
class Point:
  x: int
  y: int
  @property
  def row(self):
    return self.y
  @property
  def col(self):
    return self.x
  @property
  def tuple(self)->tuple[int, int]:
    return (int(self.x), int(self.y))
  @property
  def ndarray(self)->npt.NDArray:
    return np.array(self.tuple)
  @property
  def as_cell(self)->Tuple[int, int]:
    return (self.row, self.col)
  @staticmethod
  def cell(row: int, col:int):
    return Point(col, row)
  def forward(self, angle: float, shift: float)->"Point":
    # https://stackoverflow.com/questions/22252438/draw-a-line-using-an-angle-and-a-point-in-opencv
    angle = deg2rad(angle)
    return Point(
      int(self.x + shift * math.cos(angle)),
      int(self.y + shift * math.sin(angle))
    )
  def translate(self, dx: int, dy: int):
    return Point(self.x + dx, self.y + dy)
  def __eq__(self, value: object) -> bool:
    if isinstance(value, Point):
      return self.x == value.x and self.y == value.y
    return False
  def radians_to(self, point: "Point"):
    return np.arctan2(point.x - self.x, point.y - self.y)
  
  @staticmethod
  def from_tuple(src: Union[Tuple[int, int], npt.NDArray]):
    return Point(src[0], src[1])
  
  def project_to(self, from_rect: "Rectangle", to_rect: "Rectangle")->"Point":
    x_new = int(self.x * to_rect.width / from_rect.width)
    y_new = int(self.y * to_rect.height / from_rect.height)
    return Point(x_new, y_new)

@dataclass
class Dimension:
  width: int
  height: int
  @property
  def tuple(self)->tuple[int, int]:
    return (self.width, self.height)
  @property
  def ndarray(self)->npt.NDArray:
    return np.array((self.width, self.height))
  @property
  def area(self):
    return self.width * self.height
  def resize(self, *, width: Optional[int] = None, height: Optional[int] = None)->"Dimension":
    if width is not None and height is not None:
      ratio = max(width / self.width, height / self.height)
      return Dimension(round(self.width * ratio), round(self.height * ratio))
    elif width is not None:
      ratio = width / self.width
      return Dimension(width, round(self.height * ratio))
    elif height is not None:
      ratio = height / self.height
      return Dimension(round(self.width * ratio), height)
    else:
      return Dimension(self.width, self.height)
  @property
  def center(self)->Point:
    return Point(
      self.width // 2,
      self.height // 2
    )

  @staticmethod
  def sized(value: int)->"Dimension":
    return Dimension(value, value)
  @staticmethod
  def from_shape(shape: Sequence[int])->"Dimension":
    return Dimension(shape[1], shape[0])
  def can_encapsulate(self, rect: Union["Rectangle", "Dimension"])->bool:
    return (self.width >= rect.width and self.height >= rect.height) or (self.width >= rect.height and self.height >= rect.width)
  def scale(self, scale: float)->"Dimension":
    return Dimension(int(self.width * scale), int(self.height * scale))


@dataclass
class Rectangle:
  x0: int
  y0: int
  x1: int
  y1: int
  @property
  def width(self):
    return self.x1 - self.x0
  @property
  def height(self):
    return self.y1 - self.y0
  @property
  def p0(self):
    return Point(self.x0, self.y0)
  @property
  def p1(self):
    return Point(self.x1, self.y1)
  @property
  def center(self)->Point:
    return Point(
      self.x0 + (self.width // 2),
      self.y0 + (self.height // 2)
    )
  @property
  def slice(self)->tuple[slice, slice]:
    return slice(int(self.y0), int(self.y0 + self.height)), slice(int(self.x0), int(self.x0 + self.width))
  @property
  def dimensions(self)->Dimension:
    return Dimension(self.width, self.height)
  @property
  def area(self):
    return self.width * self.height
  @property
  def dict(self):
    return {"x0": self.x0, "y0": self.y0, "x1": self.x1, "y1": self.y1}

  def start_zero(self)->"Rectangle":
    return Rectangle(0, 0, self.width, self.height)
  
  def clamp(self, rect: Union["Rectangle", Dimension])->"Rectangle":
    if isinstance(rect, Rectangle):
      min_x = rect.x0
      max_x = rect.x1
      min_y = rect.y0
      max_y = rect.y1
    else:
      min_x = 0
      max_x = rect.width
      min_y = 0
      max_y = rect.height
    return Rectangle(
      clamp(self.x0, min_x, max_x),
      clamp(self.y0, min_y, max_y),
      clamp(self.x1, min_x, max_x),
      clamp(self.y1, min_y, max_y),
    )
  def translate(self, dx: int, dy: int)->"Rectangle":
    return Rectangle(self.x0 + dx, self.y0 + dy, self.x1 + dx, self.y1 + dy)
  
  def expand(self, dx: int, dy: int)->"Rectangle":
    return Rectangle(self.x0 - dx, self.y0 - dy, self.x1 + dx, self.y1 + dy)
  
  def intersection(self, other: "Rectangle")->"Rectangle":
    # https://machinelearningspace.com/intersection-over-union-iou-a-comprehensive-guide/
    return Rectangle(
      max(self.x0, other.x0),
      max(self.y0, other.y0),
      min(self.x1, other.x1),
      min(self.y1, other.y1),
    )
  def intersection_with_union(self, other: "Rectangle")->"float":
    intersection_area = self.intersection(other).area
    union_area = self.area + other.area - intersection_area
    return intersection_area / union_area

  @staticmethod
  def around(pt: Point, dimension: Dimension)->"Rectangle":
    halfwidth = dimension.width // 2
    halfheight = dimension.height // 2
    return Rectangle(
      pt.x - halfwidth, pt.y - halfheight,
      pt.x + dimension.width - halfwidth,
      pt.y + dimension.height - halfheight
    )
  @staticmethod
  def with_dimensions(dimension: Dimension, starting_point: Optional[Point] = None):
    x = starting_point.x if starting_point is not None else 0
    y = starting_point.y if starting_point is not None else 0
    return Rectangle(
      x, y, x + dimension.width, y + dimension.height
    )
  @staticmethod
  def from_tuple(tuple: Sequence[int])->"Rectangle":
    return Rectangle(tuple[0], tuple[1], tuple[0] + tuple[2], tuple[1] + tuple[3])
  @property
  def tuple(self)->tuple[int,int,int,int]:
    return (self.x0, self.y0, self.width, self.height)

  @staticmethod
  def min_bbox(points: npt.NDArray):
    x0 = x1 = points[0][0]
    y0 = y1 = points[0][1]
    for point in points:
      x0 = min(x0, point[0])
      y0 = min(y0, point[1])
      x1 = max(x1, point[0])
      y1 = max(y1, point[1])
    return Rectangle(x0, y0, x1, y1)

def resize_image(img: cv.typing.MatLike, target_dims: Dimension):
  dimensions = Dimension(img.shape[1], img.shape[0])\
    .resize(width=target_dims.width, height=target_dims.height)
  img = cv.resize(img, dimensions.tuple, interpolation=cv.INTER_LINEAR)
  dimensions = Dimension(img.shape[1], img.shape[0])
  rectangle = Rectangle.around(dimensions.center, target_dims)
  return img[rectangle.slice]

GAUSSIAN_3X3_KERNEL = np.array([
  [1, 2, 1],
  [2, 4, 2],
  [1, 2, 1]
], dtype=float) * (1/16)

SHARPEN_KERNEL = np.array([
  [0, -1, 0],
  [-1, 5, -1],
  [0, -1, 0]
])

STANDARD_DIMENSIONS = Dimension(240, 240)
FACE_DIMENSIONS = Dimension(120, 120)
PREVIEW_DIMENSIONS = Dimension(500, 500)

LBP_HISTOGRAM_BIN_COUNT = 8
LBP_GRID_SIZE = (8,8)

MODEL_DIR_PATH = "aimodels"
EXPRESSION_RECOGNITION_MODEL_PATH = os.path.join(MODEL_DIR_PATH, "expression_recognition.keras")
LBFMODEL_PATH = os.path.join(MODEL_DIR_PATH, "lbfmodel.yaml")
CASCADE_CLASSIFIER_PATH = os.path.join(MODEL_DIR_PATH, "haarcascade_frontalface_default.xml")

CLASS_NAMES = ["angry", "disgusted", "happy", "neutral", "sad", "surprised"]

@dataclass
class FaceLandmark:
  face_shape: npt.NDArray
  eyes: npt.NDArray
  eyebrows: npt.NDArray
  nose: npt.NDArray
  lips: npt.NDArray
  dims: Dimension

  @property
  def feature_points(self)->npt.NDArray:
    return np.vstack([self.eyes, self.eyebrows, self.nose, self.lips])

  def as_feature_vector(self)->npt.NDArray:
    # https://arxiv.org/pdf/1812.04510
    # 17 points are dedicated for the shape of the face, which we don't really need.
    normalized_points = self.feature_points / np.array((self.dims.width, self.dims.height))
    interdistance_map = scipy.spatial.distance.cdist(normalized_points, normalized_points, "euclidean").flatten()
    # All diagonal values are excluded
    excluded_points = np.eye(len(self.feature_points)).flatten() == 1

    # Square the interdistance map to make larger differences more prominent
    interdistance_map = np.power(interdistance_map[~excluded_points], 2)

    # Also calculate the distance to the average point in the face
    average_point = normalized_points.mean(axis=0)
    distances_to_center = scipy.spatial.distance.cdist(np.array([average_point]), normalized_points, "euclidean")[0]

    feature_vector = np.hstack((interdistance_map, distances_to_center))

    return feature_vector


  EYE_COLOR: ClassVar[tuple[int, int, int]] = (0, 0, 255)
  LIP_COLOR: ClassVar[tuple[int, int, int]] = (0, 255, 0)
  NOSE_COLOR: ClassVar[tuple[int, int, int]] = (255, 0, 0)
  FACE_SHAPE_COLOR: ClassVar[tuple[int, int, int]] = (255, 255, 0)
  EYEBROW_COLOR: ClassVar[tuple[int, int, int]] = (0, 255, 255)

  def project_point(self, point: npt.NDArray, rect: Optional[Rectangle] = None)->Sequence[int]:
    if rect is None:
      return cast(Sequence[int], point.astype(np.int32))
    projected_point = point * rect.dimensions.ndarray / self.dims.ndarray
    return cast(Sequence[int], (projected_point + rect.p0.ndarray).astype(np.int32))
  
  def draw_on(self, img: cv.typing.MatLike, *, offset: Optional[Rectangle] = None):
    for point in self.eyes:
      cv.circle(img, self.project_point(point, offset), 1, self.EYE_COLOR, -1)
    for point in self.lips:
      cv.circle(img, self.project_point(point, offset), 1, self.LIP_COLOR, -1)
    for point in self.nose:
      cv.circle(img, self.project_point(point, offset), 1, self.NOSE_COLOR, -1)
    for point in self.face_shape:
      cv.circle(img, self.project_point(point, offset), 1, self.FACE_SHAPE_COLOR, -1)
    for point in self.eyebrows:
      cv.circle(img, self.project_point(point, offset), 1, self.EYEBROW_COLOR, -1)

  @staticmethod
  def from_raw_landmark(points: npt.NDArray, dims: Dimension):
    return FaceLandmark(
      face_shape=points[:17],
      eyebrows=points[17:27],
      nose=points[27:36],
      eyes=points[36:48],
      lips=points[48:],
      dims=dims
    )
  
def face_alignment(img: cv.typing.MatLike, landmark: FaceLandmark):
  # https://pyimagesearch.com/2017/05/22/face-alignment-with-opencv-and-python/
  dims = Dimension.from_shape(img.shape)
  desired_left_eye = Point(int(dims.width * 0.22), int(dims.height * 0.25))
  desired_right_eye_x = FACE_DIMENSIONS.width - desired_left_eye.x

  left_eye_avg = landmark.eyes[0:6].mean(axis=0)
  right_eye_avg = landmark.eyes[6:].mean(axis=0)

  delta = right_eye_avg - left_eye_avg
  angle = np.degrees(np.arctan2(delta[1], delta[0]))

  dist = np.sqrt(delta[0] ** 2 + delta[1] ** 2)
  desired_dist = desired_right_eye_x - desired_left_eye.x
  scale = desired_dist / dist

  eyes_center = np.array([left_eye_avg, right_eye_avg]).mean(axis=0)
  rotation_matrix = cv.getRotationMatrix2D(eyes_center, angle, scale)

  translation_x = FACE_DIMENSIONS.width * 0.5
  translation_y = desired_left_eye.y
  rotation_matrix[0, 2] += (translation_x - eyes_center[0])
  rotation_matrix[1, 2] += (translation_y - eyes_center[1])

  img = cv.warpAffine(img, rotation_matrix, FACE_DIMENSIONS.tuple, flags=cv.INTER_CUBIC)

  return img


def partition_grid(self, rows: int, cols: int)->list["Rectangle"]:
  row_delta = int(self.width / rows)
  col_delta = int(self.height / cols)
  rects: list["Rectangle"] = []
  for row in range(rows):
    for col in range(cols):
      row_start = row * row_delta
      col_start = col * col_delta
      rect = Rectangle(col_start, row_start, col_start + col_delta, row_start + row_delta)
      rects.append(rect)
  return rects


landmark_model = cv.face.createFacemarkLBF()
landmark_model.loadModel(LBFMODEL_PATH)

locator_model = cv.CascadeClassifier(CASCADE_CLASSIFIER_PATH)
locator_model.load(CASCADE_CLASSIFIER_PATH)

clahe = cv.createCLAHE(tileGridSize=(8, 8), clipLimit=2.0)

def face2vec(img: cv.typing.MatLike):
  # Preprocessing
  img_resized = resize_image(img, STANDARD_DIMENSIONS)
  img_grayscale = cv.cvtColor(img_resized, cv.COLOR_BGR2GRAY)
  img_clahe = clahe.apply(img_grayscale)

  # Extract face coordinates
  face_coordinates = locator_model.detectMultiScale(img_clahe)
  face_rects = list(Rectangle.from_tuple(coords) for coords in face_coordinates)
  face_rects.sort(key=lambda x: x.area)
  saved_face_rects: list[Rectangle] = []
  # Prevent overlapping face rectangles
  for face_rect_a in face_rects:
    is_overlapping = False
    for face_rect_b in saved_face_rects:
      IOU = face_rect_a.intersection_with_union(face_rect_b)
      if IOU > 0.4:
        is_overlapping = True
        break

    if not is_overlapping:
      saved_face_rects.append(face_rect_a)

  # Get faces from original image
  faces = list(
    img_clahe[pos.slice]
    for pos in face_rects
  )

  features: list[npt.NDArray] = []
  for raw_face_img in faces:
    # Additional preprocessing
    face_resized = cv.resize(raw_face_img, FACE_DIMENSIONS.tuple, interpolation=cv.INTER_CUBIC)
    face_blurred = cv.filter2D(face_resized, -1, GAUSSIAN_3X3_KERNEL)
    face_preprocessed = cv.filter2D(face_blurred, -1, SHARPEN_KERNEL)

    # Get face landmarks
    _, raw_face_landmarks = landmark_model.fit(face_preprocessed, np.array(((0, 0, face_preprocessed.shape[0], face_preprocessed.shape[1]),)))
    face_landmark_points: npt.NDArray = raw_face_landmarks[0][0]
    face_landmark = FaceLandmark(
      face_shape=face_landmark_points[:17],
      eyebrows=face_landmark_points[17:27],
      nose=face_landmark_points[27:36],
      eyes=face_landmark_points[36:48],
      lips=face_landmark_points[48:],
      dims=Dimension.from_shape(face_preprocessed.shape)
    )
    face_dims = Dimension.from_shape(raw_face_img.shape)
    face_landmark = FaceLandmark.from_raw_landmark(face_landmark_points, face_dims)
    face_aligned = face_alignment(face_preprocessed, face_landmark)

    # Split image to grids for LBP
    lbp_grid_rects = partition_grid(face_dims, *LBP_GRID_SIZE)
    histograms: list[npt.NDArray] = []

    # Perform LBP
    lbp_image: npt.NDArray = skimage.feature.local_binary_pattern(face_aligned, 8, 1)
    for lbp_grid_rect in lbp_grid_rects:
      chunk = lbp_image[lbp_grid_rect.slice]

      if chunk.size == 0:
        histograms.append(np.full((LBP_HISTOGRAM_BIN_COUNT,), 0))
        continue
      histograms.append(scipy.ndimage.histogram(chunk, 0, 255, LBP_HISTOGRAM_BIN_COUNT) / chunk.size)

    feature_vector = np.hstack(histograms)
    features.append(feature_vector)

    if len(features) == 0:
      return None
    return features, face_rects