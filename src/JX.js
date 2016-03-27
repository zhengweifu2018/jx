THREE.JX = {
	version : "1.0.0"
};

/**
 * [getTextSize description]
 * @param  {[type]} text    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
THREE.JX.getTextSize = function(text, options) {
	options = options || {};
    options.font = options.font || 'Times';
    options.fontSize = options.fontSize || '16pt';
    options.fontWeight = options.fontWeight || 'normal';

	var result = {w: 0, h: 0};

	if(!THREE.JX.JX_MEASURE_DIV) {
		THREE.JX.JX_MEASURE_DIV = document.createElement('div');
		document.body.appendChild(THREE.JX.JX_MEASURE_DIV);
		THREE.JX.JX_MEASURE_DIV.style.position = "absolute";
		THREE.JX.JX_MEASURE_DIV.style.visibility = 'hidden';
		THREE.JX.JX_MEASURE_DIV.style.left = -10000;
		THREE.JX.JX_MEASURE_DIV.style.top = THREE.JX.JX_MEASURE_DIV.style.left;
		THREE.JX.JX_MEASURE_DIV.style.width = 'auto';
    	THREE.JX.JX_MEASURE_DIV.style.height = 'auto';
	}

	var _div = THREE.JX.JX_MEASURE_DIV;
	_div.style.fontSize = options.fontSize;
	_div.style.fontFamily = options.font;
	_div.style.fontWeight = options.fontWeight;

	_div.innerHTML = text;

	result.w = _div.offsetWidth;
	result.h = _div.offsetHeight;

	if(!THREE.JX.JX_CANVAS_CONTEXT) {
		var _canvas = document.createElement('canvas');
		THREE.JX.JX_CANVAS_CONTEXT = _canvas.getContext('2d');
	}

	if(THREE.JX.JX_CANVAS_CONTEXT) {
		THREE.JX.JX_CANVAS_CONTEXT.font = options.fontSize + " " + options.font + " " + options.fontWeight;
		result.w = THREE.JX.JX_CANVAS_CONTEXT.measureText(text).width;
	}

	return result;
};

/**
 * [pointInPolygon description]
 * @param  {[type]} point  [THREE.Vector2]
 * @param  {[type]} points [THREE.Vector2 array]
 * @return {[type]}        [bool]
 */
THREE.JX.pointInPolygon = function(point, points) {
	var i, p1, p2;
	var nCross = 0, nCount = points.length;
	for(i=0; i<nCount; i++) {
		p1 = points[i];
		p2 = points[(i+1)%nCount];
		if(p1.y == p2.y) {
			continue;
		}

		if(point.y < Math.min(p1.y, p2.y)) {
			continue;
		}

		if(point.y >= Math.max(p1.y, p2.y)) {
			continue;
		}

		var x = (point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;

		if(x > point.x) nCross++;
	}

	return (nCross % 2 == 1);

};

THREE.JX.vector2ApplyMatrix4 = function(v2, m4) {
	var e = m4.elements;
	var x = v2.x, y = v2.y;

	v2.x = e[ 0 ] * x + e[ 4 ] * y + e[ 12 ];
	v2.y = e[ 1 ] * x + e[ 5 ] * y + e[ 13 ];

	return v2;
};

THREE.JX.box2ApplyMatrix4 = function(b2, m4) {
	THREE.JX.vector2ApplyMatrix4(b2.min);
	THREE.JX.vector2ApplyMatrix4(b2.max);
	return b2;
};

THREE.JX.box2FromObjects = function(b2, objects, applyMatrix) {
	applyMatrix = !!applyMatrix;
	var v2Array = [], i, j, l=objects.length;
	for(i=0; i<l; i++) {
		objects[i].update();
		v2Array.push(new THREE.Vector2(objects[i].boundingBox.min.x, objects[i].boundingBox.max.y));
		v2Array.push(new THREE.Vector2(objects[i].boundingBox.min.x, objects[i].boundingBox.min.y));
		v2Array.push(new THREE.Vector2(objects[i].boundingBox.max.x, objects[i].boundingBox.min.y));
		v2Array.push(new THREE.Vector2(objects[i].boundingBox.max.x, objects[i].boundingBox.max.y));
		if(applyMatrix) {
			for(j=0; j<4; j++) {
				THREE.JX.vector2ApplyMatrix4(v2Array[i * 4 + j], objects[i].matrix);
			}
		}
	}

	return b2.setFromPoints(v2Array);
};

THREE.JX.getMousePosition = function(dom, x, y) { // x = event.clientX, y = event.clientY, 转element坐标
	var rect = dom.getBoundingClientRect();
	// return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
	return [ x - rect.left, y - rect.top ];
};

THREE.JX.getDeckardCoordinate = function(dom, x, y) { // x = event.clientX, y = event.clientY, 转迪卡坐标
	var rect = dom.getBoundingClientRect();
	return [ x - rect.left - rect.width * 0.5, rect.height * 0.5 - y + rect.top ];
}

// swap array elements
THREE.JX.swapArrayElements = function(arr, index1, index2) {
	arr[index1] = arr.splice(index2, 1, arr[index1])[0];
	return arr;
}

// get element indexOf array 
THREE.JX.elementIndexOfArray = function(arr, element) {
	for(var i=0, l=arr.length; i<l; i++) {
		if(arr[i] === element) {
			return i;
		}
	}

	return -1;
};

// element move up
THREE.JX.moveUpArrayElement = function(arr, element) {
	var index = THREE.JX.elementIndexOfArray(arr, element);
	if(index > 0) {
		THREE.JX.swapArrayElements(arr, index-1, index);
	}
};

// element move down
THREE.JX.moveDownArrayElement = function(arr, element) {
	var index = THREE.JX.elementIndexOfArray(arr, element);
	if(index > -1 && index < arr.length - 1) {
		THREE.JX.swapArrayElements(arr, index, index+1);
	}
};