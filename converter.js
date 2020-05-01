const Converter = (function () {
    const COLOR_REGEX = /^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    function convert(vdIn) {
        let parsed = _parseVd(vdIn);
        console.debug("parsed", parsed);
        return _createSvg(parsed);
    }

    function _parseVd(vdIn) {
        let parser = new DOMParser();
        let xmlVd = parser.parseFromString(vdIn, "text/xml");
        let parsed = {
            elements: []
        };

        // Get vector node
        let xmlVector = xmlVd.documentElement;
        console.debug(xmlVector);
        if (xmlVector.nodeName !== "vector") {
            throw "Root element must be a vector!";
        }

        // Parse vector attributes
        if ('android:width' in xmlVector.attributes) {
            let w = xmlVector.attributes['android:width'].value;
            parsed.width = Number(w.replace(/[^\d.]/gi, ''));
        } else {
            throw "Missing android:width!";
        }
        if ('android:height' in xmlVector.attributes) {
            let h = xmlVector.attributes['android:height'].value;
            parsed.height = Number(h.replace(/[^\d.]/gi, ''));
        } else {
            throw "Missing android:height!";
        }
        if ('android:viewportWidth' in xmlVector.attributes) {
            let vw = xmlVector.attributes['android:viewportWidth'].value;
            parsed.viewportWidth = Number(vw.replace(/[^\d.]/gi, ''));
        } else {
            parsed.viewportWidth = parsed.width;
        }
        if ('android:viewportHeight' in xmlVector.attributes) {
            let vh = xmlVector.attributes['android:viewportHeight'].value;
            parsed.viewportHeight = Number(vh.replace(/[^\d.]/gi, ''));
        } else {
            parsed.viewportHeight = parsed.height;
        }
        if ('android:tint' in xmlVector.attributes) {
            // TODO
            console.log("'android:tint' not implemented");
        }
        if ('android:tintMode' in xmlVector.attributes) {
            // TODO
            console.log("'android:tintMode' not implemented");
        }
        if ('android:autoMirrored' in xmlVector.attributes) {
            console.warn("Auto mirroring ('android:autoMirrored') not supported by SVG");
        }
        if ('android:alpha' in xmlVector.attributes) {
            let a = xmlVector.attributes['android:alpha'].value;
            parsed.alpha = Number(a.replace(/[^\d.]/gi, ''));
        }

        // Parse children
        let child;
        for (child of xmlVector.children) {
            let parsedChild = _parseVdChild(child);
            if (parsedChild) {
                parsed.elements.push(parsedChild);
            }
        }
        return parsed;
    }

    function _parseVdChild(child) {
        if (child.nodeName === 'group') {
            return _parseVdGroup(child);
        } else if (child.nodeName === 'path') {
            return _parseVdPath(child);
        } else if (child.nodeName === 'clip-path') {
            return _parseVdClipPath(child);
        } else {
            console.warn("Unknown child node '" + child.nodeName + "'");
            return false;
        }
    }

    function _parseVdGroup(vdGroup) {
        let group = {
            type: 'group',
            elements: []
        };

        if ('android:name' in vdGroup.attributes) {
            group.name = vdGroup.attributes['android:name'].value;
        }
        if ('android:rotation' in vdGroup.attributes) {
            let r = vdGroup.attributes['android:rotation'].value;
            group.rotation = Number(r.replace(/[^\d.]/gi, ''));
        }
        if ('android:pivotX' in vdGroup.attributes) {
            let px = vdGroup.attributes['android:pivotX'].value;
            group.pivotX = Number(px.replace(/[^\d.]/gi, ''));
        }
        if ('android:pivotY' in vdGroup.attributes) {
            let py = vdGroup.attributes['android:pivotY'].value;
            group.pivotY = Number(py.replace(/[^\d.]/gi, ''));
        }
        if ('android:scaleX' in vdGroup.attributes) {
            let sx = vdGroup.attributes['android:scaleX'].value;
            group.scaleX = Number(sx.replace(/[^\d.]/gi, ''));
        }
        if ('android:scaleY' in vdGroup.attributes) {
            let sy = vdGroup.attributes['android:scaleY'].value;
            group.scaleY = Number(sy.replace(/[^\d.]/gi, ''));
        }
        if ('android:translateX' in vdGroup.attributes) {
            let tx = vdGroup.attributes['android:translateX'].value;
            group.translateX = Number(tx.replace(/[^\d.]/gi, ''));
        }
        if ('android:translateY' in vdGroup.attributes) {
            let ty = vdGroup.attributes['android:translateY'].value;
            group.translateY = Number(ty.replace(/[^\d.]/gi, ''));
        }

        // Parse children
        let child;
        for (child of vdGroup.children) {
            let parsedChild = _parseVdChild(child);
            if (parsedChild) {
                group.elements.push(parsedChild);
            }
        }

        return group;
    }

    function _parseVdPath(vdPath) {
        let path = {
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
            let color = vdPath.attributes['android:fillColor'].value;
            if (color.match(COLOR_REGEX)) {
                path.fillColor = color;
            } else {
                console.warn("Unknown path fill color value '" + color + "'");
            }
        }
        if ('android:strokeColor' in vdPath.attributes) {
            let color = vdPath.attributes['android:strokeColor'].value;
            if (color.match(COLOR_REGEX)) {
                path.strokeColor = color;
            } else {
                console.warn("Unknown path stroke color value '" + color + "'");
            }
        }
        if ('android:strokeWidth' in vdPath.attributes) {
            let w = vdPath.attributes['android:strokeWidth'].value;
            path.strokeWidth = Number(w.replace(/[^\d.]/gi, ''));
        }
        if ('android:strokeAlpha' in vdPath.attributes) {
            let a = vdPath.attributes['android:strokeAlpha'].value;
            path.strokeAlpha = Number(a.replace(/[^\d.]/gi, ''));
        }
        if ('android:fillAlpha' in vdPath.attributes) {
            let a = vdPath.attributes['android:fillAlpha'].value;
            path.fillAlpha = Number(a.replace(/[^\d.]/gi, ''));
        }
        if ('android:trimPathStart' in vdPath.attributes) {
            console.log("'android:trimPathStart' not yet implemented");
        }
        if ('android:trimPathEnd' in vdPath.attributes) {
            console.log("'android:trimPathEnd' not yet implemented");
        }
        if ('android:trimPathOffset' in vdPath.attributes) {
            console.log("'android:trimPathOffset' not yet implemented");
        }
        if ('android:strokeLineCap' in vdPath.attributes) {
            console.log("'android:strokeLineCap' not yet implemented");
        }
        if ('android:strokeLineJoin' in vdPath.attributes) {
            console.log("'android:strokeLineJoin' not yet implemented");
        }
        if ('android:strokeMiterLimit' in vdPath.attributes) {
            console.log("'android:strokeMiterLimit' not yet implemented");
        }
        if ('android:fillType' in vdPath.attributes) {
            console.log("'android:fillType' not yet implemented");
        }

        return path;
    }

    function _parseVdClipPath(vdClipPath) {
        let clipPath = {
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

    function _createSvg(vectorData) {
        let svgDoc = document.implementation.createDocument(SVG_NAMESPACE, "svg", null);

        // Add attributes
        let svgElem = svgDoc.documentElement;
        svgElem.setAttribute("width", vectorData.width);
        svgElem.setAttribute("height", vectorData.height);
        svgElem.setAttribute("viewBox", "0 0 " + vectorData.viewportWidth + " " + vectorData.viewportHeight);
        // TODO tint and alpha

        let elem;
        for (elem of vectorData.elements) {
            let svgChild = _createSvgElement(elem);
            if (svgChild) {
                svgElem.appendChild(svgChild);
            }
        }

        return svgDoc;
    }

    function _createSvgElement(elementData) {
        if (elementData.type === 'group') {
            return _createSvgGroup(elementData);
        } else if (elementData.type === 'path') {
            return _createSvgPath(elementData);
        } else if (elementData.type === 'clip-path') {
            return _createSvgClipPath(elementData);
        } else {
            console.error("Unknown element type '" + elementData.type + "'");
            return false;
        }
    }

    function _createSvgGroup(groupData) {
        let svgGroup = document.createElementNS(SVG_NAMESPACE, "g");

        if ('name' in groupData) {
            svgGroup.setAttribute('id', groupData.name);
        }

        let transform = "";
        if ('translateX' in groupData || 'translateY' in groupData) {
            transform += "translate(" +
                (groupData.translateX || 0) +
                " " +
                (groupData.translateY || 0) +
                ") ";
        }
        if ('scaleX' in groupData || 'scaleY' in groupData) {
            transform += "scale(" +
                (groupData.scaleX || 1) +
                " " +
                (groupData.scaleY || 1) +
                ") ";
        }
        if ('rotation' in groupData) {
            transform += "rotate(" + groupData.rotation;
            if ('pivotX' in groupData || 'pivotY' in groupData) {
                transform += " " +
                    (groupData.pivotX || 0) +
                    " " +
                    (groupData.pivotY || 0);
            }
            transform += ") ";
        }
        if (transform) {
            svgGroup.setAttribute('transform', transform);
        }

        let elem;
        for (elem of groupData.elements) {
            let svgChild = _createSvgElement(elem);
            if (svgChild) {
                svgGroup.appendChild(svgChild);
            }
        }

        return svgGroup;
    }

    function _createSvgPath(pathData) {
        let svgPath = document.createElementNS(SVG_NAMESPACE, "path");
        svgPath.setAttribute('d', pathData.data);

        if ('name' in pathData) {
            svgPath.setAttribute('id', pathData.name);
        }
        if ('fillColor' in pathData) {
            svgPath.setAttribute('fill', pathData.fillColor);
        }
        if ('strokeColor' in pathData) {
            svgPath.setAttribute('stroke', pathData.strokeColor);
        }
        if ('strokeWidth' in pathData) {
            svgPath.setAttribute('stroke-width', pathData.strokeWidth);
        }
        if ('fillAlpha' in pathData) {
            svgPath.setAttribute('opacity', pathData.fillAlpha);
        }

        return svgPath;
    }

    function _createSvgClipPath(clipPathData) {
        let svgClipPath = document.createElementNS(SVG_NAMESPACE, "clipPath");
        // TODO

        return svgClipPath;
    }

    return {
        convertVD2SVG: convert
    };
})();
