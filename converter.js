var Converter = (function() {function convert(vdIn) {
		var parsed = _parseVd(vdIn);
		console.debug("parsed", parsed);

		return "converted";
	}

	function _parseVd(vdIn) {
		var parser = new DOMParser();
		var xmlVd = parser.parseFromString(vdIn, "text/xml");
		var parsed = {
			elements: []
		};
		
		// Get vector node
		var xmlVector = xmlVd.documentElement;
		console.debug(xmlVector);
		if (xmlVector.nodeName != "vector") {
			throw "Root element must be a vector!";
		}

		// Parse vector attributes
		if ('android:width' in xmlVector.attributes) {
			var w = xmlVector.attributes['android:width'].value;
			parsed.width = Number(w.replace(/[^\d.]/gi, ''));
		} else {
			throw "Missing android:width!";
		}
		if ('android:height' in xmlVector.attributes) {
			var h = xmlVector.attributes['android:height'].value;
			parsed.height = Number(h.replace(/[^\d.]/gi, ''));
		} else {
			throw "Missing android:height!";
		}
		if ('android:viewportWidth' in xmlVector.attributes) {
			var vw = xmlVector.attributes['android:viewportWidth'].value;
			parsed.viewportWidth = Number(vw.replace(/[^\d.]/gi, ''));
		} else {
			parsed.viewportWidth = parsed.width;
		}
		if ('android:viewportHeight' in xmlVector.attributes) {
			var vh = xmlVector.attributes['android:viewportHeight'].value;
			parsed.viewportHeight = Number(vh.replace(/[^\d.]/gi, ''));
		} else {
			parsed.viewportHeight = parsed.height;
		}
		if ('android:tint' in xmlVector.attributes) {
			// TODO
			conosle.log("'android:tint' not implemented");
		}
		if ('android:tintMode' in xmlVector.attributes) {
			// TODO
			conosle.log("'android:tintMode' not implemented");
		}
		if ('android:autoMirrored' in xmlVector.attributes) {
			conosle.warn("Auto mirroring ('android:autoMirrored') not supported by SVG");
		}
		if ('android:alpha' in xmlVector.attributes) {
			var a = xmlVector.attributes['android:alpha'].value;
			parsed.alpha = Number(a.replace(/[^\d.]/gi, ''));
		}

		// Parse childs
		for (child of xmlVector.children) {
			var parsedChild = _parseVdChild(child);
			if (parsedChild) {
				parsed.elements.push(parsedChild);
			}
		}
		return parsed;
	}

	function _parseVdChild(child) {
		if (child.nodeName == 'group') {
			return _parseVdGroup(child);
		} else if (child.nodeName == 'path') {
			return _parseVdPath(child);
		} else if (child.nodeName == 'clip-path') {
			return _parseVdClipPath(child);
		} else {
			console.warn("Unknown child node '" + child.nodeName + "'");
			return false;
		}
	}

	function _parseVdGroup(vdGroup) {
		console.log("Groups not implemented");
	}

	function _parseVdPath(vdPath) {
		console.log("Paths not implemented");
	}

	function _parseVdClipPath(vdClipPath) {
		var clipPath = {
			type: 'clip-path'
		};

		if ('android:pathData' in vdPath.attributes) {
			clipPath.data = vdPath.attributes['android:pathData'].value;
		} else {
			throw "Missing 'android:pathData'!";
		}
		if ('android:name' in vdPath.attributes) {
			clipPath.name = vdPath.attributes['android:name'].value;
		}

		return clipPath;
	}

	return {
		convertVD2SVG: convert
	};
})();