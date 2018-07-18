'use strict';
(function () {

  var DragLimit = {
    X: {
      MIN: 0,
      MAX: 1200
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  var getMapPinCoords = function () {
    var mapPinPosition = {
      x: mainPin.offsetLeft + Math.floor(mainPin.offsetWidth / 2),
      y: mainPin.offsetTop + mainPin.offsetHeight
    };
    return mapPinPosition;
  };

  var onLoadSuccess = function (object) {
    window.pins.renderPin(object);
    window.filter.activate(object);
  };

  var onLoadError = function (errorMessage) {
    window.utils.renderErrorMessage(errorMessage);
  };

  var onActivateMouseup = function () {
    map.classList.remove('map--faded');
    window.backend.load(onLoadSuccess, onLoadError);
    window.form.onActivateform();
    mainPin.removeEventListener('mouseup', onActivateMouseup);
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mapPinPosition = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };
      var PinSize = document.querySelector('.map__pin').offsetWidth;
      var Border = {
        TOP: DragLimit.Y.MIN - mainPin.offsetHeight,
        BOTTOM: DragLimit.Y.MAX - mainPin.offsetHeight,
        LEFT: DragLimit.X.MIN,
        RIGHT: DragLimit.X.MAX - mainPin.offsetWidth
      };

      if (mapPinPosition.x >= Border.LEFT && mapPinPosition.x <= Border.RIGHT) {
        mainPin.style.left = mapPinPosition.x + 'px';
        DragLimit.x = mapPinPosition.x + Math.ceil(PinSize.WIDTH / 2);
      }

      if (mapPinPosition.y >= Border.TOP && mapPinPosition.y <= Border.BOTTOM) {
        mainPin.style.top = mapPinPosition.y + 'px';
        DragLimit.x = mapPinPosition.x + Math.ceil(PinSize.WIDTH / 2);
      }
      window.form.fillAddress(DragLimit.x, DragLimit.y);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    if (document.querySelector('.map').classList.contains('map--faded')) {
      onActivateMouseup();
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    getMapPinCoords: getMapPinCoords
  };
})();
