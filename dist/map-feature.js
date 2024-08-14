/*! @maps4html/web-map-custom-element 14-08-2024 */

class MapFeature extends HTMLElement{static get observedAttributes(){return["zoom","min","max"]}#hasConnected;get zoom(){let t={},e=this.getMeta("zoom");return e&&(t=M._metaContentToObject(e.getAttribute("content"))),"MAP-LINK"===this._parentEl.nodeName?+(this.hasAttribute("zoom")?this.getAttribute("zoom"):t.value||t.max||this._initialZoom):+(this.hasAttribute("zoom")?this.getAttribute("zoom"):this._initialZoom)}set zoom(t){t=parseInt(t,10);!isNaN(t)&&t>=this.min&&t<=this.max&&this.setAttribute("zoom",t)}get min(){let t={},e=this.getMeta("zoom");e&&(t=M._metaContentToObject(e.getAttribute("content")));return"MAP-LINK"===this._parentEl.nodeName?+(this.hasAttribute("min")?this.getAttribute("min"):t.min||this._parentEl.getZoomBounds().minZoom):+(this.hasAttribute("min")?this.getAttribute("min"):t.min||0)}set min(t){var e=parseInt(t,10),t=this.getLayerEl().extent.zoom;isNaN(e)||(e>=t.minZoom&&e<=t.maxZoom?this.setAttribute("min",e):this.setAttribute("min",t.minZoom))}get max(){let t={},e=this.getMeta("zoom");e&&(t=M._metaContentToObject(e.getAttribute("content")));var o=this.getMapEl()._map.options.crs.options.resolutions.length-1;return"MAP-LINK"===this._parentEl.nodeName?+(this.hasAttribute("max")?this.getAttribute("max"):t.max||this._parentEl.getZoomBounds().maxZoom):+(this.hasAttribute("max")?this.getAttribute("max"):t.max||o)}set max(t){var e=parseInt(t,10),t=this.getLayerEl().extent.zoom;isNaN(e)||(e>=t.minZoom&&e<=t.maxZoom?this.setAttribute("max",e):this.setAttribute("max",t.maxZoom))}get extent(){if(this.isConnected)return this._getFeatureExtent||(this._getFeatureExtent=this._memoizeExtent()),this._getFeatureExtent()}getMapEl(){return M.getClosest(this,"mapml-viewer,map[is=web-map]")}getLayerEl(){return M.getClosest(this,"layer-")}attributeChangedCallback(t,e,o){if(this.#hasConnected)switch(t){case"min":case"max":case"zoom":e!==o&&this.reRender(this._featureLayer)}}constructor(){super()}connectedCallback(){this.#hasConnected=!0,this._initialZoom=this.getMapEl().zoom,this._parentEl="LAYER-"===this.parentNode.nodeName.toUpperCase()||"MAP-LINK"===this.parentNode.nodeName.toUpperCase()?this.parentNode:this.parentNode.host,this.getLayerEl().hasAttribute("data-moving")||this._parentEl.parentElement?.hasAttribute("data-moving")||(this._observer=new MutationObserver(t=>{for(var e of t){if("attributes"===e.type&&e.target===this)return;this.reRender(this._featureLayer)}}),this._observer.observe(this,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,characterData:!0}))}disconnectedCallback(){this.getLayerEl()?.hasAttribute("data-moving")||this._parentEl.parentElement?.hasAttribute("data-moving")||(this._observer.disconnect(),this._featureLayer&&this.removeFeature(this._featureLayer))}reRender(e){if(this._groupEl.isConnected){var o=this._getFallbackCS();let t=document.createElement("span");this._groupEl.insertAdjacentElement("beforebegin",t),e._staticFeature&&e._removeFromFeaturesList(this._geometry),e.removeLayer(this._geometry),this._geometry=e.createGeometry(this,o).addTo(e),t.replaceWith(this._geometry.options.group),e._validateRendering(),delete this._getFeatureExtent,this._setUpEvents()}}removeFeature(t){t.removeLayer(this._geometry),t._staticFeature&&t._removeFromFeaturesList(this._geometry),t.options.properties=null,delete this._geometry,this._getFeatureExtent&&delete this._getFeatureExtent}addFeature(t){this._featureLayer=t;var e,o=this.getLayerEl();this.querySelector("map-geometry")&&(e=this._getFallbackCS(),o.src&&o.shadowRoot,this._geometry=t.createGeometry(this,e),this._geometry&&(t.addLayer(this._geometry),this._setUpEvents()))}_setUpEvents(){["click","focus","blur","keyup","keydown"].forEach(o=>{this._groupEl.addEventListener(o,e=>{if("click"===o){let t=new PointerEvent(o,{cancelable:!0});t.originalEvent=e,this.dispatchEvent(t)}else if("keyup"===o||"keydown"===o){let t=new KeyboardEvent(o,{cancelable:!0});t.originalEvent=e,this.dispatchEvent(t)}else{let t=new FocusEvent(o,{cancelable:!0});t.originalEvent=e,this.dispatchEvent(t)}})})}_getFallbackCS(){let e;if("MAP-LINK"===this._parentEl.nodeName)e=this._parentEl.shadowRoot.querySelector("map-meta[name=cs][content]")||this._parentEl.parentElement.getMeta("cs");else{let t=this.getLayerEl();e=(t.src?t.shadowRoot:t).querySelector("map-meta[name=cs][content]")}return e?M._metaContentToObject(e.getAttribute("content")).content:"gcrs"}_memoizeExtent(){let p;return function(){if(p&&this._getFeatureExtent)return p;{let i=this.getMapEl()._map,t=this.querySelector("map-geometry"),e=t.getAttribute("cs")||this._getFallbackCS(),o=this.zoom,r=t.querySelectorAll("map-point, map-linestring, map-polygon, map-multipoint, map-multilinestring"),n=[1/0,1/0,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY];for(var a of r){var m=a.querySelectorAll("map-coordinates");for(let t=0;t<m.length;++t)n=function(t,e,o){var r=e.innerHTML.trim().replace(/<[^>]+>/g,"").replace(/\s+/g," ").split(/[<>\ ]/g);switch(t.tagName.toUpperCase()){case"MAP-POINT":o=M._updateExtent(o,+r[0],+r[1]);break;case"MAP-LINESTRING":case"MAP-POLYGON":case"MAP-MULTIPOINT":case"MAP-MULTILINESTRING":for(let t=0;t<r.length;t+=2)o=M._updateExtent(o,+r[t],+r[t+1])}return o}(a,m[t],n)}var l=L.point(n[0],n[1]),h=L.point(n[2],n[3]);let s=M.boundsToPCRSBounds(L.bounds(l,h),o,i.options.projection,e);if(1===r.length&&"MAP-POINT"===r[0].tagName.toUpperCase()){let t=i.options.projection,e=this.hasAttribute("max")?+this.getAttribute("max"):M[t].options.resolutions.length-1,o=M[t].options.crs.tile.bounds.getCenter(),r=M[t].transformation.transform(s.min,M[t].scale(+this.zoom||e));s=M.pixelToPCRSBounds(L.bounds(r.subtract(o),r.add(o)),this.zoom||e,t)}h=Object.assign(M._convertAndFormatPCRS(s,i.options.crs,i.options.projection),{zoom:this._getZoomBounds()});return p=h}}}_getZoomBounds(){return{minZoom:this.min,maxZoom:this.max,minNativeZoom:this.zoom,maxNativeZoom:this.zoom}}getZoomToZoom(){var t=this.extent.topLeft.pcrs,e=this.extent.bottomRight.pcrs,o=L.bounds(L.point(t.horizontal,t.vertical),L.point(e.horizontal,e.vertical)),r=this.getMapEl()._map.options.projection,t=this.getLayerEl().extent.zoom,e=t.minZoom||0,r=t.maxZoom||M[r].options.resolutions.length-1;let i;return this.hasAttribute("zoom")?i=this.zoom:(i=M.getMaxZoom(o,this.getMapEl()._map,e,r),this.max<i?i=this.max:this.min>i&&(i=this.min)),i<e?i=e:i>r&&(i=r),i}getMeta(t){var e=t.toLowerCase();if("cs"===e||"zoom"===e||"projection"===e){var o=this._parentEl.shadowRoot.querySelector(`map-meta[name=${e}][content]`);return"MAP-LINK"===this._parentEl.nodeName?o||this._parentEl.parentElement.getMeta(t):(this._parentEl.src?this._parentEl.shadowRoot:this._parentEl).querySelector(`map-meta[name=${e}][content]`)}}mapml2geojson(t){t=Object.assign({},{propertyFunction:null,transform:!0},t);let e={type:"Feature",properties:{},geometry:{}},o=this.querySelector("map-properties");o?"function"==typeof t.propertyFunction?e.properties=t.propertyFunction(o):o.querySelector("table")?(a=o.querySelector("table").cloneNode(!0),e.properties=M._table2properties(a)):e.properties={prop0:o.innerHTML.replace(/(<([^>]+)>)/gi,"").replace(/\s/g,"")}:e.properties=null;let r=null,i=null,n=this.getMapEl()._map;t.transform&&(r=new proj4.Proj(n.options.crs.code),i=new proj4.Proj("EPSG:4326"),"EPSG:3857"!==n.options.crs.code&&"EPSG:4326"!==n.options.crs.code||(t.transform=!1));var s=this.querySelector("map-geometry").querySelector("map-geometrycollection"),a=this.querySelector("map-geometry").querySelectorAll("map-point, map-polygon, map-linestring, map-multipoint, map-multipolygon, map-multilinestring");if(s){e.geometry.type="GeometryCollection",e.geometry.geometries=[];for(var m of a)e.geometry.geometries.push(M._geometry2geojson(m,r,i,t.transform))}else e.geometry=M._geometry2geojson(a[0],r,i,t.transform);return e}click(){let t=this._groupEl,e=t.getBoundingClientRect();var o=new MouseEvent("click",{clientX:e.x+e.width/2,clientY:e.y+e.height/2,button:0}),r=this.querySelector("map-properties");if("link"===t.getAttribute("role"))for(var i of t.children)i.mousedown.call(this._geometry,o),i.mouseup.call(this._geometry,o);let n=new PointerEvent("click",{cancelable:!0});if(n.originalEvent=o,this.dispatchEvent(n),r&&this.isConnected){let t=this._geometry,e=t._layers;for(var s in e)e[s].isPopupOpen()&&e[s].closePopup();t.isPopupOpen()?t.closePopup():n.originalEvent.cancelBubble||t.openPopup()}}focus(t){this._groupEl.focus(t)}blur(){document.activeElement.shadowRoot?.activeElement!==this._groupEl&&document.activeElement.shadowRoot?.activeElement.parentNode!==this._groupEl||(this._groupEl.blur(),this.getMapEl()._map.getContainer().focus())}zoomTo(){let t=this.extent,e=this.getMapEl()._map,o=t.topLeft.pcrs,r=t.bottomRight.pcrs,i=L.bounds(L.point(o.horizontal,o.vertical),L.point(r.horizontal,r.vertical)),n=e.options.crs.unproject(i.getCenter(!0));e.setView(n,this.getZoomToZoom(),{animate:!1})}whenReady(){return new Promise((e,t)=>{let o,r;this.isConnected?e():(o=setInterval(function(t){t.isConnected&&(clearInterval(o),clearTimeout(r),e())},200,this),r=setTimeout(function(){clearInterval(o),clearTimeout(r),t("Timeout reached waiting for feature to be ready")},5e3))})}}export{MapFeature};
//# sourceMappingURL=map-feature.js.map