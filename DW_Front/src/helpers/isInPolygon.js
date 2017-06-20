const isInPolygon = (point, polygon) => {
  const xPoint = point.lat;
  const yPoint = point.lng;

  let inside = false;
  let first; let second; let intersect;
  let xi; let xj; let yi; let yj;

  for (first = 0, second = polygon.length - 1; first < polygon.length; second = first++) {
    xi = polygon[first].lat; yi = polygon[first].lng;
    xj = polygon[second].lat; yj = polygon[second].lng;

    intersect = ((yi > yPoint) !== (yj > yPoint))
      && (xPoint < (xj - xi) * (yPoint - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};

export default isInPolygon;
