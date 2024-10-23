from dataclasses import dataclass
from enum import Enum
from functools import lru_cache
from typing import ClassVar, Optional, Sequence

import cv2 as cv
import retina
import scipy.spatial.distance
import skimage.feature

import numpy as np
import numpy.typing as npt

from retina.size import FACE_DIMENSIONS, STANDARD_DIMENSIONS, Dimension, Point, Rectangle

CASCADE_CLASSIFIER_PATH = "retina/models/haarcascade_frontalface_default.xml"
LBFMODEL_PATH = "retina/models/lbfmodel.yaml"
EXPRESSION_RECOGNITION_MODEL_PATH = "retina/models/expression_recognition.keras"


@lru_cache(maxsize=1)
def get_face_haar_classifier():
  return cv.CascadeClassifier(CASCADE_CLASSIFIER_PATH)

def haar_detect(img: cv.typing.MatLike)->Sequence[Rectangle]:
  # Source: https://towardsdatascience.com/face-detection-in-2-minutes-using-opencv-python-90f89d7c0f81
  face_cascade = get_face_haar_classifier()
  face_coordinates = face_cascade.detectMultiScale(img, 1.1, 4)

  rectangles = list(Rectangle.from_tuple(coords) for coords in face_coordinates)
  rectangles.sort(key=lambda x: x.area)
  return rectangles


@lru_cache(1)
def get_face_landmark_detector()->cv.face.Facemark:
  # https://medium.com/analytics-vidhya/facial-landmarks-and-face-detection-in-python-with-opencv-73979391f30e
  landmark = cv.face.createFacemarkLBF()
  landmark.loadModel(LBFMODEL_PATH)
  return landmark

def many_face_landmark_detection(img: cv.typing.MatLike, faces: Sequence[Rectangle])->Sequence[Sequence[Point]]:
  # Source: https://towardsdatascience.com/face-detection-in-2-minutes-using-opencv-python-90f89d7c0f81
  landmark_detector = get_face_landmark_detector()
  _, face_landmarks = landmark_detector.fit(img, np.array(list(map(lambda face: face.tuple, faces))))
  print(face_landmarks)

  wrapped_landmarks: list[list[Point]] = []
  for face in face_landmarks:
    points: list[Point] = []
    for point in face[0]:
      points.append(Point(point[0], point[1]))
    wrapped_landmarks.append(points)

  return wrapped_landmarks

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
    return np.vstack([self.eyes, self.nose, self.lips])

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
  def draw_on(self, img: cv.typing.MatLike, *, offset: Point = Point(0, 0)):
    offsetnp = offset.nparray
    for point in self.eyes:
      cv.circle(img, tuple(point.astype(np.int32) + offsetnp), 1, self.EYE_COLOR, -1)
    for point in self.lips:
      cv.circle(img, tuple(point.astype(np.int32) + offsetnp), 1, self.LIP_COLOR, -1)
    for point in self.nose:
      cv.circle(img, tuple(point.astype(np.int32) + offsetnp), 1, self.NOSE_COLOR, -1)
    for point in self.face_shape:
      cv.circle(img, tuple(point.astype(np.int32) + offsetnp), 1, self.FACE_SHAPE_COLOR, -1)
    for point in self.eyebrows:
      cv.circle(img, tuple(point.astype(np.int32) + offsetnp), 1, self.EYEBROW_COLOR, -1)

def face_landmark_detection(img: cv.typing.MatLike)->FaceLandmark:
  # Source: https://towardsdatascience.com/face-detection-in-2-minutes-using-opencv-python-90f89d7c0f81
  landmark_detector = get_face_landmark_detector()
  _, face_landmarks = landmark_detector.fit(img, np.array(((0, 0, img.shape[0], img.shape[1]),)))

  points: npt.NDArray = face_landmarks[0][0]

  return FaceLandmark(
    face_shape=points[:17],
    eyebrows=points[17:27],
    nose=points[27:36],
    eyes=points[36:48],
    lips=points[48:],
    dims=Dimension.from_shape(img.shape)
  )

def lbp_histograms(img: cv.typing.MatLike, rectangles: Sequence[Rectangle])->npt.NDArray:
  histograms: list[npt.NDArray] = []
  BIN_COUNT = 10
  for rect in rectangles:
    chunk = img[rect.slice]
    radius = 1

    if chunk.size == 0:
      histograms.append(np.full((BIN_COUNT,), 0))
      continue
    lbp: npt.NDArray = skimage.feature.local_binary_pattern(chunk, 8 * radius, radius)
    histograms.append(scipy.ndimage.histogram(lbp, 0, 255, BIN_COUNT) / lbp.size)

  return np.hstack(histograms)

def grid_lbp(img: cv.typing.MatLike):
  dims = Dimension.from_shape(img.shape)
  grid_rects = dims.partition(7, 7)
  return lbp_histograms(img, grid_rects)

class FacialExpressionLabel(Enum):
  Angry = 0
  Disgusted = 1
  Happy = 2
  Neutral = 3
  Sad = 4
  Surprised = 5

  @staticmethod
  def target_names():
    return tuple(map(lambda x: x.name, sorted(FacialExpressionLabel.__members__.values(), key=lambda x: x.value)))



FACIAL_EXPRESSION_MAPPER: dict[str, FacialExpressionLabel] = {
  "angry": FacialExpressionLabel.Angry,
  "disgusted": FacialExpressionLabel.Disgusted,
  "happy": FacialExpressionLabel.Happy,
  "neutral": FacialExpressionLabel.Neutral,
  "sad": FacialExpressionLabel.Sad,
  "surprised": FacialExpressionLabel.Surprised,
}

INVERSE_FACIAL_EXPRESSION_MAPPER: dict[FacialExpressionLabel, str] = {v:k for k, v in FACIAL_EXPRESSION_MAPPER.items()}

def extract_faces(img: cv.typing.MatLike, *, canvas: Optional[cv.typing.MatLike] = None)->tuple[Sequence[cv.typing.MatLike], Sequence[Rectangle]]:
  face_positions = haar_detect(img)
  faces = tuple(
    img[pos.slice]
    for pos in face_positions
  )

  # retina.debug.imdebug(retina.debug.draw_rectangles(img, face_positions))

  saved_faces: list[cv.typing.MatLike] = []
  saved_face_positions: list[Rectangle] = []
  for i in range(len(faces)):
    face = faces[i]
    rect = face_positions[i]
    is_overlapping = False
    for j in range(0, i):
      other_rect = face_positions[j]
      # Don't grab overlapping squares
      IOU = rect.intersection_with_union(other_rect)
      if IOU > 0.4:
        is_overlapping = True
        break

    if not is_overlapping:
      saved_faces.append(face)
      saved_face_positions.append(rect)

  if canvas is not None:
    for facepos in saved_face_positions:
      cv.rectangle(canvas, facepos.tuple, (0, 255, 0), 1)
  return saved_faces, saved_face_positions

def face_alignment(img: cv.typing.MatLike, landmark: FaceLandmark):
  # https://pyimagesearch.com/2017/05/22/face-alignment-with-opencv-and-python/
  desired_left_eye = FACE_DIMENSIONS.sample(0.22, 0.25)
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


def face2vec(original: cv.typing.MatLike)->Optional[npt.NDArray]:
  img = retina.cvutil.resize_image(original, STANDARD_DIMENSIONS) # Resize
  img = cv.cvtColor(img, cv.COLOR_BGR2GRAY) # Grayscale
  img = retina.colors.clahe(img) # Contrast adjustment

  faces, face_rects = extract_faces(img)

  features: list[npt.NDArray] = []
  for face in faces:
    face = cv.resize(face, FACE_DIMENSIONS.tuple, interpolation=cv.INTER_CUBIC)
    landmark = face_landmark_detection(face)
    face = face_alignment(face, landmark)
    feature_vector = grid_lbp(face)
    features.append(feature_vector)

  if len(features) == 0:
    return None
  
  return np.array(features)