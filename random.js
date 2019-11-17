function calcIsInsideThickLineSegment(line1, line2, pnt, lineThickness) {
    var L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
    if (L2 == 0) return false;
    var r = (((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y))) / L2;
  
    //Assume line thickness is circular
    if (r < 0) {
      //Outside line1
      return (Math.sqrt(((line1.x - pnt.x) * (line1.x - pnt.x)) + ((line1.y - pnt.y) * (line1.y - pnt.y))) <= lineThickness);
    } else if ((0 <= r) && (r <= 1)) {
      //On the line segment
      var s = (((line1.y - pnt.y) * (line2.x - line1.x)) - ((line1.x - pnt.x) * (line2.y - line1.y))) / L2;
      return (Math.abs(s) * Math.sqrt(L2) <= lineThickness);
    } else {
      //Outside line2
      return (Math.sqrt(((line2.x - pnt.x) * (line2.x - pnt.x)) + ((line2.y - pnt.y) * (line2.y - pnt.y))) <= lineThickness);
    }
  }
  var pN = {
    x: 301,
    y: 300
  };
  var pL1 = {
    x: 200,
    y: 200
  };
  var pL2 = {
    x: 400,
    y: 400
  };
  ;
console.log(f.getTime());