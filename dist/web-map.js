/*! @maps4html/web-map-custom-element 10-04-2024 */

import"./leaflet.js";import"./mapml.js";import{MapLayer}from"./layer.js";import{MapArea}from"./map-area.js";import{MapCaption}from"./map-caption.js";import{MapFeature}from"./map-feature.js";import{MapExtent}from"./map-extent.js";import{MapInput}from"./map-input.js";import{MapSelect}from"./map-select.js";import{MapLink}from"./map-link.js";import{MapStyle}from"./map-style.js";class WebMap extends HTMLMapElement{static get observedAttributes(){return["lat","lon","zoom","projection","width","height","controls","static","controlslist"]}get controls(){return this.hasAttribute("controls")}set controls(t){Boolean(t)?this.setAttribute("controls",""):this.removeAttribute("controls")}get controlsList(){return this._controlsList}set controlsList(t){this._controlsList.value=t,this.setAttribute("controlslist",t)}get width(){return+window.getComputedStyle(this).width.replace("px","")}set width(t){this.setAttribute("width",t)}get height(){return+window.getComputedStyle(this).height.replace("px","")}set height(t){this.setAttribute("height",t)}get lat(){return+(this.hasAttribute("lat")?this.getAttribute("lat"):0)}set lat(t){t&&this.setAttribute("lat",t)}get lon(){return+(this.hasAttribute("lon")?this.getAttribute("lon"):0)}set lon(t){t&&this.setAttribute("lon",t)}get projection(){return this.hasAttribute("projection")?this.getAttribute("projection"):"OSMTILE"}set projection(t){t&&this.whenProjectionDefined(t).then(()=>{this.setAttribute("projection",t)}).catch(()=>{throw new Error("Undefined projection:"+t)})}get zoom(){return+(this.hasAttribute("zoom")?this.getAttribute("zoom"):0)}set zoom(t){t=parseInt(t,10);!isNaN(t)&&0<=t&&t<=25&&this.setAttribute("zoom",t)}get layers(){return this.getElementsByTagName("layer-")}get areas(){return this.getElementsByTagName("area")}get extent(){let t=this._map,e=M.pixelToPCRSBounds(t.getPixelBounds(),t.getZoom(),t.options.projection),o=M._convertAndFormatPCRS(e,t.options.crs,this.projection),i=1/0,n=-1/0;for(let t=0;t<this.layers.length;t++)this.layers[t].extent&&(this.layers[t].extent.zoom.minZoom<i&&(i=this.layers[t].extent.zoom.minZoom),this.layers[t].extent.zoom.maxZoom>n&&(n=this.layers[t].extent.zoom.maxZoom));return o.zoom={minZoom:i!==1/0?i:t.getMinZoom(),maxZoom:n!==-1/0?n:t.getMaxZoom()},o}get static(){return this.hasAttribute("static")}set static(t){Boolean(t)?this.setAttribute("static",""):this.removeAttribute("static")}constructor(){super(),this._source=this.outerHTML,this._history=[],this._historyIndex=-1,this._traversalCall=!1}connectedCallback(){this.whenProjectionDefined(this.projection).then(()=>{this._initShadowRoot(),this._controlsList=new M.DOMTokenList(this.getAttribute("controlslist"),this,"controlslist",["noreload","nofullscreen","nozoom","nolayer","noscale","geolocation"]);var t=window.getComputedStyle(this),e=t.width,t=t.height,e=this.hasAttribute("width")?this.getAttribute("width"):parseInt(e.replace("px","")),t=this.hasAttribute("height")?this.getAttribute("height"):parseInt(t.replace("px",""));this._changeWidth(e),this._changeHeight(t),this._createMap(),this._toggleStatic();let o=this.querySelector("map-caption");null!==o&&setTimeout(()=>{this.getAttribute("aria-label")===o.innerHTML&&(this.mapCaptionObserver=new MutationObserver(t=>{this.querySelector("map-caption")!==o&&this.removeAttribute("aria-label")}),this.mapCaptionObserver.observe(this,{childList:!0}))},0)}).catch(()=>{throw new Error("Projection not defined")})}_initShadowRoot(){let t=document.createElement("template");t.innerHTML=`<link rel="stylesheet" href="${new URL("mapml.css",import.meta.url).href}">`;const e=document.createElement("div");e.classList.add("mapml-web-map");let o=e.attachShadow({mode:"open"});this._container=document.createElement("div");this._container.insertAdjacentHTML("beforeend","<output role='status' aria-live='polite' aria-atomic='true' class='mapml-screen-reader-output'></output>");let i=document.createElement("style");i.id="web-map-default-style",i.innerHTML='[is="web-map"] {all: initial;contain: layout size;display: inline-block;height: 150px;width: 300px;border-width: 2px;border-style: inset;box-sizing: inherit;}[is="web-map"][frameborder="0"] {border-width: 0;}[is="web-map"][hidden] {display: none!important;}[is="web-map"] .mapml-web-map {display: contents;}';let n=document.createElement("style");n.innerHTML=":host .leaflet-control-container {visibility: hidden!important;}";let s=document.createElement("style");s.innerHTML='[is="web-map"] > :not(area):not(.mapml-web-map) {display: none!important;}',this.appendChild(s),o.appendChild(n),o.appendChild(t.content.cloneNode(!0)),o.appendChild(this._container),this.appendChild(e),this.getRootNode()instanceof ShadowRoot?this.getRootNode().getElementById(i.id)||this.getRootNode().prepend(i):document.getElementById(i.id)||document.head.insertAdjacentElement("afterbegin",i)}_createMap(){var t;this._map||(this._map=L.map(this._container,{center:new L.LatLng(this.lat,this.lon),minZoom:0,maxZoom:M[this.projection].options.resolutions.length-1,projection:this.projection,query:!0,contextMenu:!0,announceMovement:M.options.announceMovement,featureIndex:!0,mapEl:this,crs:M[this.projection],zoom:this.zoom,zoomControl:!1}),this._addToHistory(),this._createControls(),this._toggleControls(),this._crosshair=M.crosshair().addTo(this._map),M.options.featureIndexOverlayOption&&(this._featureIndexOverlay=M.featureIndexOverlay().addTo(this._map)),!this.hasAttribute("name")||(t=this.getAttribute("name"))&&(this.poster=document.querySelector('img[usemap="#'+t+'"]'),this.poster&&L.Browser.gecko&&this.poster.removeAttribute("usemap")),this.poster&&this.poster.setAttribute("hidden",""),this.setAttribute("role","application"),this._container.setAttribute("role","region"),this._container.setAttribute("aria-label","Interactive map"),this._setUpEvents())}disconnectedCallback(){this._removeEvents();let t=this.querySelector(".mapml-web-map");for(;t.shadowRoot.firstChild;)t.shadowRoot.removeChild(t.shadowRoot.firstChild);t.remove(),delete this._map,this._deleteControls()}adoptedCallback(){}attributeChangedCallback(t,e,s){switch(t){case"controlslist":this._controlsList&&(!1===this._controlsList.valueSet&&(this._controlsList.value=s),this._toggleControls());break;case"controls":null!==e&&null===s?this._hideControls():null===e&&null!==s&&this._showControls();break;case"height":e!==s&&this._changeHeight(s);break;case"width":e!==s&&this._changeWidth(s);break;case"static":this._toggleStatic();break;case"projection":if(s&&this._map&&this._map.options.projection!==s){const o=(()=>{if(this._map&&this._map.options.projection!==s){let t=this.lat,e=this.lon,o=this.zoom;this._map.options.crs=M[s],this._map.options.projection=s;let i=[];this._map.announceMovement.disable();for(var n of this.querySelectorAll("layer-")){n.removeAttribute("disabled");let t=this.removeChild(n);this.appendChild(t),i.push(t.whenReady())}return Promise.allSettled(i).then(()=>{this.zoomTo(t,e,o),M.options.announceMovement&&this._map.announceMovement.enable(),setTimeout(()=>{this.dispatchEvent(new CustomEvent("map-projectionchange"))},0)})}}).bind(this);o().then(()=>{if(this._map&&this._map.options.projection!==e&&this._resetHistory(),this._debug)for(let t=0;t<2;t++)this.toggleDebug()})}}}_createControls(){let t=this._map.getSize().y,e=0;this._layerControl=M.layerControl(null,{collapsed:!0,mapEl:this}).addTo(this._map),this._map.on("movestart",this._layerControl.collapse,this._layerControl);let o=M.options.announceScale;"metric"===o&&(o={metric:!0,imperial:!1}),"imperial"===o&&(o={metric:!1,imperial:!0}),this._scaleBar||(this._scaleBar=M.scaleBar(o).addTo(this._map)),!this._zoomControl&&e+93<=t&&(e+=93,this._zoomControl=L.control.zoom().addTo(this._map)),!this._reloadButton&&e+49<=t&&(e+=49,this._reloadButton=M.reloadButton().addTo(this._map)),!this._fullScreenControl&&e+49<=t&&(e+=49,this._fullScreenControl=M.fullscreenButton().addTo(this._map)),this._geolocationButton||(this._geolocationButton=M.geolocationButton().addTo(this._map))}_toggleControls(){!1===this.controls?(this._hideControls(),this._map.contextMenu.toggleContextMenuItem("Controls","disabled")):(this._showControls(),this._map.contextMenu.toggleContextMenuItem("Controls","enabled"))}_hideControls(){this._setControlsVisibility("fullscreen",!0),this._setControlsVisibility("layercontrol",!0),this._setControlsVisibility("reload",!0),this._setControlsVisibility("zoom",!0),this._setControlsVisibility("geolocation",!0),this._setControlsVisibility("scale",!0)}_showControls(){this._setControlsVisibility("fullscreen",!1),this._setControlsVisibility("layercontrol",!1),this._setControlsVisibility("reload",!1),this._setControlsVisibility("zoom",!1),this._setControlsVisibility("geolocation",!0),this._setControlsVisibility("scale",!1),this._controlsList&&this._controlsList.forEach(t=>{switch(t.toLowerCase()){case"nofullscreen":this._setControlsVisibility("fullscreen",!0);break;case"nolayer":this._setControlsVisibility("layercontrol",!0);break;case"noreload":this._setControlsVisibility("reload",!0);break;case"nozoom":this._setControlsVisibility("zoom",!0);break;case"geolocation":this._setControlsVisibility("geolocation",!1);break;case"noscale":this._setControlsVisibility("scale",!0)}}),this._layerControl&&0===this._layerControl._layers.length&&this._layerControl._container.setAttribute("hidden","")}_deleteControls(){delete this._layerControl,delete this._zoomControl,delete this._reloadButton,delete this._fullScreenControl,delete this._geolocationButton,delete this._scaleBar}_setControlsVisibility(t,e){let o;switch(t){case"zoom":this._zoomControl&&(o=this._zoomControl._container);break;case"reload":this._reloadButton&&(o=this._reloadButton._container);break;case"fullscreen":this._fullScreenControl&&(o=this._fullScreenControl._container);break;case"layercontrol":this._layerControl&&(o=this._layerControl._container);break;case"geolocation":this._geolocationButton&&(o=this._geolocationButton._container);break;case"scale":this._scaleBar&&(o=this._scaleBar._container)}o&&(e?([...o.children].forEach(t=>{t.setAttribute("hidden","")}),o.setAttribute("hidden","")):([...o.children].forEach(t=>{t.removeAttribute("hidden")}),o.removeAttribute("hidden")))}_toggleStatic(){var t=this.hasAttribute("static");this._map&&(t?(this._map.dragging.disable(),this._map.touchZoom.disable(),this._map.doubleClickZoom.disable(),this._map.scrollWheelZoom.disable(),this._map.boxZoom.disable(),this._map.keyboard.disable(),this._zoomControl.disable()):(this._map.dragging.enable(),this._map.touchZoom.enable(),this._map.doubleClickZoom.enable(),this._map.scrollWheelZoom.enable(),this._map.boxZoom.enable(),this._map.keyboard.enable(),this._zoomControl.enable()))}_dropHandler(t){t.preventDefault();t=t.dataTransfer.getData("text");M._pasteLayer(this,t)}_dragoverHandler(t){t.preventDefault(),t.dataTransfer.dropEffect="copy"}_removeEvents(){this._map&&(this._map.off(),this.removeEventListener("drop",this._dropHandler,!1),this.removeEventListener("dragover",this._dragoverHandler,!1))}_setUpEvents(){this.addEventListener("drop",this._dropHandler,!1),this.addEventListener("dragover",this._dragoverHandler,!1),this.addEventListener("change",function(t){"LAYER-"===t.target.tagName&&this.dispatchEvent(new CustomEvent("layerchange",{details:{target:this,originalEvent:t}}))},!1);let t=this.getRootNode()instanceof ShadowRoot?this.getRootNode().host:this.parentElement;t.addEventListener("keyup",function(t){9===t.keyCode&&"mapml-web-map"===document.activeElement.className&&document.activeElement.dispatchEvent(new CustomEvent("mapfocused",{detail:{target:this}}))}),this.addEventListener("keydown",function(t){86===t.keyCode&&t.ctrlKey?navigator.clipboard.readText().then(t=>{M._pasteLayer(this,t)}):32===t.keyCode&&"INPUT"!==document.activeElement.shadowRoot.activeElement.nodeName&&(t.preventDefault(),this._map.fire("keypress",{originalEvent:t}))}),t.addEventListener("mousedown",function(t){"mapml-web-map"===document.activeElement.className&&document.activeElement.dispatchEvent(new CustomEvent("mapfocused",{detail:{target:this}}))}),this._map.on("locationfound",function(t){this.dispatchEvent(new CustomEvent("maplocationfound",{detail:{latlng:t.latlng,accuracy:t.accuracy}}))},this),this._map.on("locationerror",function(t){this.dispatchEvent(new CustomEvent("locationerror",{detail:{error:t.message}}))},this),this._map.on("load",function(){this.dispatchEvent(new CustomEvent("load",{detail:{target:this}}))},this),this._map.on("preclick",function(t){this.dispatchEvent(new CustomEvent("preclick",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("click",function(t){this.dispatchEvent(new CustomEvent("click",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("dblclick",function(t){this.dispatchEvent(new CustomEvent("dblclick",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mousemove",function(t){this.dispatchEvent(new CustomEvent("mousemove",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mouseover",function(t){this.dispatchEvent(new CustomEvent("mouseover",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mouseout",function(t){this.dispatchEvent(new CustomEvent("mouseout",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mousedown",function(t){this.dispatchEvent(new CustomEvent("mousedown",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mouseup",function(t){this.dispatchEvent(new CustomEvent("mouseup",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("contextmenu",function(t){this.dispatchEvent(new CustomEvent("contextmenu",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("movestart",function(){this.dispatchEvent(new CustomEvent("movestart",{detail:{target:this}}))},this),this._map.on("move",function(){this.dispatchEvent(new CustomEvent("move",{detail:{target:this}}))},this),this._map.on("moveend",function(){this._updateMapCenter(),this._addToHistory(),this.dispatchEvent(new CustomEvent("map-moveend",{detail:{target:this}}))},this),this._map.on("zoomstart",function(){this.dispatchEvent(new CustomEvent("zoomstart",{detail:{target:this}}))},this),this._map.on("zoom",function(){this.dispatchEvent(new CustomEvent("zoom",{detail:{target:this}}))},this),this._map.on("zoomend",function(){this._updateMapCenter(),this.dispatchEvent(new CustomEvent("zoomend",{detail:{target:this}}))},this);const e=(t=>{this.whenLayersReady().then(()=>{t&&t.layer._layerEl&&(this._map.setMaxZoom(this.extent.zoom.maxZoom),this._map.setMinZoom(this.extent.zoom.minZoom))})}).bind(this);this.whenLayersReady().then(()=>{this._map.setMaxZoom(this.extent.zoom.maxZoom),this._map.setMinZoom(this.extent.zoom.minZoom),this._map.on("layeradd layerremove",e,this)}),this.addEventListener("fullscreenchange",function(t){null===document.fullscreenElement?this._map.contextMenu.setViewFullScreenInnerHTML("view"):this._map.contextMenu.setViewFullScreenInnerHTML("exit")}),this.addEventListener("keydown",function(t){"mapml-web-map"===document.activeElement.className&&(t.ctrlKey&&82===t.keyCode?(t.preventDefault(),this.reload()):t.altKey&&39===t.keyCode?(t.preventDefault(),this.forward()):t.altKey&&37===t.keyCode&&(t.preventDefault(),this.back()))})}locate(t){this._geolocationButton&&this._geolocationButton.stop(),t?(t.zoomTo&&(t.setView=t.zoomTo,delete t.zoomTo),this._map.locate(t)):this._map.locate({setView:!0,maxZoom:16})}toggleDebug(){this._debug?(this._debug.remove(),this._debug=void 0):this._debug=M.debugOverlay().addTo(this._map)}_changeWidth(t){this._container&&(this._container.style.width=t+"px",document.querySelector('[is="web-map"]').style.width=t+"px"),this._map&&this._map.invalidateSize(!1)}_changeHeight(t){this._container&&(this._container.style.height=t+"px",document.querySelector('[is="web-map"]').style.height=t+"px"),this._map&&this._map.invalidateSize(!1)}zoomTo(t,e,o){o=Number.isInteger(+o)?+o:this.zoom;e=new L.LatLng(+t,+e);this._map.setView(e,o),this.zoom=o,this.lat=e.lat,this.lon=e.lng}_updateMapCenter(){this.lat=this._map.getCenter().lat,this.lon=this._map.getCenter().lng,this.zoom=this._map.getZoom()}_resetHistory(){this._history=[],this._historyIndex=-1,this._traversalCall=!1,this._addToHistory()}_addToHistory(){var t;0<this._traversalCall?this._traversalCall--:(t=this._map.getPixelBounds().getCenter(),t={zoom:this._map.getZoom(),x:t.x,y:t.y},this._historyIndex++,this._history.splice(this._historyIndex,0,t),this._historyIndex+1!==this._history.length&&(this._history.length=this._historyIndex+1),0===this._historyIndex?(this._map.contextMenu.toggleContextMenuItem("Back","disabled"),this._map.contextMenu.toggleContextMenuItem("Forward","disabled"),this._map.contextMenu.toggleContextMenuItem("Reload","disabled"),this._reloadButton?.disable()):(this._map.contextMenu.toggleContextMenuItem("Back","enabled"),this._map.contextMenu.toggleContextMenuItem("Forward","disabled"),this._map.contextMenu.toggleContextMenuItem("Reload","enabled"),this._reloadButton?.enable()))}back(){var t,e=this._history,o=e[this._historyIndex];0<this._historyIndex&&(this._map.contextMenu.toggleContextMenuItem("Forward","enabled"),this._historyIndex--,t=e[this._historyIndex],0===this._historyIndex&&(this._map.contextMenu.toggleContextMenuItem("Back","disabled"),this._map.contextMenu.toggleContextMenuItem("Reload","disabled"),this._reloadButton?.disable()),t.zoom!==o.zoom?(this._traversalCall=2,e=this._map.options.crs.scale(o.zoom)/this._map.options.crs.scale(t.zoom),this._map.panBy([t.x*e-o.x,t.y*e-o.y],{animate:!1}),this._map.setZoom(t.zoom)):(this._traversalCall=1,this._map.panBy([t.x-o.x,t.y-o.y])))}forward(){var t,e=this._history,o=e[this._historyIndex];this._historyIndex<e.length-1&&(this._map.contextMenu.toggleContextMenuItem("Back","enabled"),this._map.contextMenu.toggleContextMenuItem("Reload","enabled"),this._reloadButton?.enable(),this._historyIndex++,t=e[this._historyIndex],this._historyIndex+1===this._history.length&&this._map.contextMenu.toggleContextMenuItem("Forward","disabled"),t.zoom!==o.zoom?(this._traversalCall=2,e=this._map.options.crs.scale(o.zoom)/this._map.options.crs.scale(t.zoom),this._map.panBy([t.x*e-o.x,t.y*e-o.y],{animate:!1}),this._map.setZoom(t.zoom)):(this._traversalCall=1,this._map.panBy([t.x-o.x,t.y-o.y])))}reload(){var t=this._history.shift(),e=this._map.getPixelBounds().getCenter(),o={zoom:this._map.getZoom(),x:e.x,y:e.y};this._map.contextMenu.toggleContextMenuItem("Back","disabled"),this._map.contextMenu.toggleContextMenuItem("Forward","disabled"),this._map.contextMenu.toggleContextMenuItem("Reload","disabled"),this._reloadButton?.disable(),this._history=[t],this._historyIndex=0,t.zoom!==o.zoom?(this._traversalCall=2,e=this._map.options.crs.scale(o.zoom)/this._map.options.crs.scale(t.zoom),this._map.panBy([t.x*e-o.x,t.y*e-o.y],{animate:!1}),this._map.setZoom(t.zoom)):(this._traversalCall=1,this._map.panBy([t.x-o.x,t.y-o.y])),this._map.getContainer().focus()}_toggleFullScreen(){this._map.toggleFullscreen()}viewSource(){var t=new Blob([this._source],{type:"text/plain"}),t=URL.createObjectURL(t);window.open(t),URL.revokeObjectURL(t)}defineCustomProjection(t){let e=JSON.parse(t);if(!(void 0!==e&&e.proj4string&&e.projection&&e.resolutions&&e.origin&&e.bounds))throw new Error("Incomplete TCRS Definition");if(0<=e.projection.indexOf(":"))throw new Error('":" is not permitted in projection name');if(M[e.projection.toUpperCase()])return e.projection.toUpperCase();t=[256,512,1024,2048,4096].includes(e.tilesize)?e.tilesize:M.TILE_SIZE;return M[e.projection]=new L.Proj.CRS(e.projection,e.proj4string,{origin:e.origin,resolutions:e.resolutions,bounds:L.bounds(e.bounds),crs:{tcrs:{horizontal:{name:"x",min:0,max:t=>Math.round(M[e.projection].options.bounds.getSize().x/M[e.projection].options.resolutions[t])},vertical:{name:"y",min:0,max:t=>Math.round(M[e.projection].options.bounds.getSize().y/M[e.projection].options.resolutions[t])},bounds:t=>L.bounds([M[e.projection].options.crs.tcrs.horizontal.min,M[e.projection].options.crs.tcrs.vertical.min],[M[e.projection].options.crs.tcrs.horizontal.max(t),M[e.projection].options.crs.tcrs.vertical.max(t)])},pcrs:{horizontal:{name:"easting",get min(){return M[e.projection].options.bounds.min.x},get max(){return M[e.projection].options.bounds.max.x}},vertical:{name:"northing",get min(){return M[e.projection].options.bounds.min.y},get max(){return M[e.projection].options.bounds.max.y}},get bounds(){return M[e.projection].options.bounds}},gcrs:{horizontal:{name:"longitude",get min(){return M[e.projection].unproject(M.OSMTILE.options.bounds.min).lng},get max(){return M[e.projection].unproject(M.OSMTILE.options.bounds.max).lng}},vertical:{name:"latitude",get min(){return M[e.projection].unproject(M.OSMTILE.options.bounds.min).lat},get max(){return M[e.projection].unproject(M.OSMTILE.options.bounds.max).lat}},get bounds(){return L.latLngBounds([M[e.projection].options.crs.gcrs.vertical.min,M[e.projection].options.crs.gcrs.horizontal.min],[M[e.projection].options.crs.gcrs.vertical.max,M[e.projection].options.crs.gcrs.horizontal.max])}},map:{horizontal:{name:"i",min:0,max:t=>t.getSize().x},vertical:{name:"j",min:0,max:t=>t.getSize().y},bounds:t=>L.bounds(L.point([0,0]),t.getSize())},tile:{horizontal:{name:"i",min:0,max:t},vertical:{name:"j",min:0,max:t},get bounds(){return L.bounds([M[e.projection].options.crs.tile.horizontal.min,M[e.projection].options.crs.tile.vertical.min],[M[e.projection].options.crs.tile.horizontal.max,M[e.projection].options.crs.tile.vertical.max])}},tilematrix:{horizontal:{name:"column",min:0,max:t=>Math.round(M[e.projection].options.crs.tcrs.horizontal.max(t)/M[e.projection].options.crs.tile.bounds.getSize().x)},vertical:{name:"row",min:0,max:t=>Math.round(M[e.projection].options.crs.tcrs.vertical.max(t)/M[e.projection].options.crs.tile.bounds.getSize().y)},bounds:t=>L.bounds([M[e.projection].options.crs.tilematrix.horizontal.min,M[e.projection].options.crs.tilematrix.vertical.min],[M[e.projection].options.crs.tilematrix.horizontal.max(t),M[e.projection].options.crs.tilematrix.vertical.max(t)])}}}),M[e.projection.toUpperCase()]=M[e.projection],e.projection}whenReady(){return new Promise((e,t)=>{let o,i;this._map?e():(o=setInterval(function(t){t._map&&(clearInterval(o),clearTimeout(i),e())},200,this),i=setTimeout(function(){clearInterval(o),clearTimeout(i),t("Timeout reached waiting for map to be ready")},5e3))})}whenLayersReady(){let t=[];for(var e of[...this.layers])t.push(e.whenReady());return Promise.allSettled(t)}whenProjectionDefined(n){return new Promise((e,t)=>{let o,i;M[n]?e():(o=setInterval(function(t){M[t]&&(clearInterval(o),clearTimeout(i),e())},200,n),i=setTimeout(function(){clearInterval(o),clearTimeout(i),t("Timeout reached waiting for projection to be defined")},5e3))})}geojson2mapml(t,e={}){void 0===e.projection&&(e.projection=this.projection);e=M.geojson2mapml(t,e);return this.appendChild(e),e}_ready(){var t;!this.hasAttribute("name")||(t=this.getAttribute("name"))&&(this.poster=document.querySelector('img[usemap="#'+t+'"]'),this.poster&&(L.Browser.gecko&&this.poster.removeAttribute("usemap"),this._container.appendChild(this.poster)))}}window.customElements.define("web-map",WebMap,{extends:"map"}),window.customElements.define("layer-",MapLayer),window.customElements.define("map-area",MapArea,{extends:"area"}),window.customElements.define("map-caption",MapCaption),window.customElements.define("map-feature",MapFeature),window.customElements.define("map-extent",MapExtent),window.customElements.define("map-input",MapInput),window.customElements.define("map-select",MapSelect),window.customElements.define("map-link",MapLink),window.customElements.define("map-style",MapStyle);export{WebMap};
//# sourceMappingURL=web-map.js.map