var Converter = (function() {
	const colorRegex = /^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

	function convert(vdIn) {
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
		var path = {
			type: 'path'
		};

		if ('android:pathData' in vdPath.attributes) {
			path.data = vdPath.attributes['android:pathData'].value;
		} else {
			throw "Missing 'android:pathData'!";
		}
		if ('android:name' in vdPath.attributes) {
			path.name = vdPath.attributes['android:name'].value;
		}
		if ('android:fillColor' in vdPath.attributes) {
			var color = vdPath.attributes['android:fillColor'].value;
			if (color.match(this.colorRegex)) {
				path.fillColor = color;
			} else {
				log.warn("Unknown path fill color value '" + color + "'");
			}
		}
		if ('android:strokeColor' in vdPath.attributes) {
			var color = vdPath.attributes['android:strokeColor'].value;
			if (color.match(this.colorRegex)) {
				path.strokeColor = color;
			} else {
				log.warn("Unknown path stroke color value '" + color + "'");
			}
		}
		if ('android:strokeWidth' in vdPath.attributes) {
			var w = vdPath.attributes['android:strokeWidth'].value;
			path.strokeWidth = Number(s.replace(/[^\d.]/gi, ''));
		}
		if ('android:strokeAlpha' in vdPath.attributes) {
			var a = vdPath.attributes['android:strokeAlpha'].value;
			path.strokeAlpha = Number(a.replace(/[^\d.]/gi, ''));
		}
		if ('android:fillAlpha' in vdPath.attributes) {
			var a = vdPath.attributes['android:fillAlpha'].value;
			path.fillAlpha = Number(a.replace(/[^\d.]/gi, ''));
		}
		if ('android:trimPathStart' in vdPath.attributes) {
			conosle.log("'android:trimPathStart' not yet implemented");
		}
		if ('android:trimPathEnd' in vdPath.attributes) {
			conosle.log("'android:trimPathEnd' not yet implemented");
		}
		if ('android:trimPathOffset' in vdPath.attributes) {
			conosle.log("'android:trimPathOffset' not yet implemented");
		}
		if ('android:strokeLineCap' in vdPath.attributes) {
			conosle.log("'android:strokeLineCap' not yet implemented");
		}
		if ('android:strokeLineJoin' in vdPath.attributes) {
			conosle.log("'android:strokeLineJoin' not yet implemented");
		}
		if ('android:strokeMiterLimit' in vdPath.attributes) {
			conosle.log("'android:strokeMiterLimit' not yet implemented");
		}
		if ('android:fillType' in vdPath.attributes) {
			conosle.log("'android:fillType' not yet implemented");
		}

		return path;
	}

	function _parseVdClipPath(vdClipPath) {
		var clipPath = {
			type: 'clip-path'
		};

		if ('android:pathData' in vdClipPath.attributes) {
			clipPath.data = vdClipPath.attributes['android:pathData'].value;
		} else {
			throw "Missing 'android:pathData'!";
		}
		if ('android:name' in vdClipPath.attributes) {
			clipPath.name = vdClipPath.attributes['android:name'].value;
		}

		return clipPath;
	}

	return {
		convertVD2SVG: convert
	};
})();