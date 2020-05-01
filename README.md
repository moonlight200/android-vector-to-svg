# Android Vector to SVG

A JavaScript converter to convert android vector drawables to SVG files.

## Usage

```js
var androidVector = '<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="...';
var svgDoc = Converter.convertVD2SVG(androidVector);
console.log(new XMLSerializer().serializeToString(svgDoc));
```
