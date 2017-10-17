function loadImages () {
  var minX = null;
  var maxX = null;
  var minY = null;
  var maxY = null;

  for (var key in data) {
    if (data[key].x < minX || minX == null) {
      minX = data[key].x;
    }
    if (data[key].x > maxX || maxX == null) {
      maxX = data[key].x;
    }
    if (data[key].y < minY || minY == null) {
      minY = data[key].y;
    }
    if (data[key].y > maxY || maxY == null) {
      maxY = data[key].y;
    }
  }

  if (maxX > -minX) {
    xBound = maxX;
  } else {
    xBound = -minX;
  }

  if (maxY > -minY) {
    yBound = maxY;
  } else {
    yBound = -minY;
  }

  var div = document.createElement('div');
  div.setAttribute('class', 'container');
  var htmlText = '';
  htmlText += '<table>';
  for (var i = -yBound; i <= yBound; i++) {
    htmlText += '<tr>';
    for (var j = -xBound; j <= xBound; j++) {
      isPopulated = false;

      for (var key in data) {
        if (data[key].x === j && data[key].y === i) {
          htmlText += '<td style="background-image:url(img/' + data[key].img + ');">';
          isPopulated = true;
        }
      }

      if (!isPopulated) {
        htmlText += '<td>';        
      }
      htmlText += '</td>';
    }
    htmlText += '</tr>';
  }
  htmlText += '</table>';
  div.innerHTML = htmlText;  
  document.getElementById('content').appendChild(div);
}

function scrollToMiddle () {
  window.scrollTo((document.body.scrollWidth - window.innerWidth) / 2, (document.body.scrollHeight - window.innerHeight) / 2);  
}

loadImages();
scrollToMiddle();
