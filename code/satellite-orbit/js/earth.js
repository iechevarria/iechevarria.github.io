// Created by Bjorn Sandvik - thematicmapping.org
// Modified by Ivan Echevarria - echevarria.io
// Outline code from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Outline.html

(function () {
	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth;
	var	height = window.innerHeight;

	var radius   = 1;
	var	segments = 64;

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(22.5, width / height, 1, 1000);
	camera.position.z = 6;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);


	var orbitGeometry = new THREE.Geometry();
	var vertArray = orbitGeometry.vertices;

	// Draw orbit
	for (var i = -180; i < 180; i++) {
		var lat = (0.02 * i) * (Math.PI / 180.0);
		var lon = (4 * i) * (Math.PI / 180.0);
		var alt = 1.0 + 354 / 6371;
		addVectorToOrbit(vertArray, lat, lon, alt);
	}

	var orbitMaterial = new THREE.LineBasicMaterial( { color: 0xff } );
	var orbit = new THREE.Line( orbitGeometry, orbitMaterial );
	scene.add(orbit);

  var earth = makeEarth(radius, segments);
	scene.add(earth);

	var outline = makeOutline(radius, segments);
	outline.position = earth.position;
	outline.scale.multiplyScalar(1.005);
	scene.add(outline);

	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	earth.rotation.z = -0.2;
	earth.rotation.x = 0.2;
	orbit.rotation.z = -0.2;
	orbit.rotation.x = 0.2;

	render();

	function render() {
		controls.update();
		earth.rotation.y -= 0.0005;
		orbit.rotation.y -= 0.0005;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function addVectorToOrbit(vertArray, lat, lon, alt) {
		var x = alt * Math.cos(lat) * Math.cos(-lon);
		var z = alt * Math.cos(lat) * Math.sin(-lon);
		var y = alt * Math.sin(lat);
		vertArray.push(new THREE.Vector3(x, y, z));
	}

	function makeEarth(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture('img/outlines.png'),
			})
		);
	}

	function makeOutline(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshBasicMaterial({ 
				color: 0xcccccc, 
				side: THREE.BackSide,
			})
		);
	}

}());