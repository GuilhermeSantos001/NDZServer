!function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/public/scripts/",t(t.s=2)}([function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=function(){function e(){n(this,e),this.languages=["en_us","pt_br","es"],this.default=2,this.elements=[]}return i(e,[{key:"language",value:function(){return this.definePageLanguage()||this.languages[this.default]}},{key:"addElement",value:function(e,t){this.elements.push({getElementById:function(){return document.getElementById(e)},getElementText:function(e){if(t[e]){var r=t[e];"string"!=typeof r?r=null:"string"==typeof r&&r.length<=0&&(r=null)}return r||"???"},translate:function(e,t){e&&(e.textContent=t)}})}},{key:"addAttribute",value:function(e,t,r){this.elements.push({getElementById:function(){return document.getElementById(e)},getElementText:function(e){if(r[e]){var t=r[e];"string"!=typeof t?t=null:"string"==typeof t&&t.length<=0&&(t=null)}return t||"???"},translate:function(e,r){e&&e.hasAttribute(t)&&e.setAttribute(t,r)}})}},{key:"definePageLanguage",value:function(){if(document.getElementById("translate_default"))var e=document.getElementById("translate_default").getAttribute("translateDefault");else var e=null;return"string"==typeof e&&e.length>0?e:null}},{key:"loadPage",value:function(){var e=this.language();this.elements.forEach(function(t){var r=t.getElementById(),n=t.getElementText(e);t.translate(r,n)})}}]),e}();t.Language=new o},,function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function i(){$("#register_icon_prefix_02").val().length>=2?$("#register_icon_prefix_02").removeClass("invalid").addClass("valid"):$("#register_icon_prefix_02").val().length>0?$("#register_icon_prefix_02").removeClass("valid").addClass("invalid"):$("#register_icon_prefix_02").removeClass("valid invalid"),$("#register_icon_prefix_03, #register_icon_prefix_04").val().length>=8&&$("#register_icon_prefix_03").val()==$("#register_icon_prefix_04").val()?$("#register_icon_prefix_03, #register_icon_prefix_04").removeClass("invalid").addClass("valid"):$("#register_icon_prefix_03, #register_icon_prefix_04").val().length>0&&$("#register_icon_prefix_03").val()!=$("#register_icon_prefix_04").val()||$("#register_icon_prefix_03, #register_icon_prefix_04").val().length>0&&$("#register_icon_prefix_03").val()==$("#register_icon_prefix_04").val()?$("#register_icon_prefix_03, #register_icon_prefix_04").removeClass("valid").addClass("invalid"):$("#register_icon_prefix_03, #register_icon_prefix_04").removeClass("valid invalid");var e=$("#register_icon_prefix_01").hasClass("valid"),t=$("#register_icon_prefix_02").hasClass("valid"),r=$("#register_icon_prefix_03").hasClass("valid"),n=$("#register_icon_prefix_04").hasClass("valid");if($("#register_icon_prefix_01").hasClass("checkedEmailServer"))return $("#window_register_text_07").addClass("disabled");e&&t&&r&&n?$("#window_register_text_07").removeClass("disabled"):$("#window_register_text_07").addClass("disabled")}function o(e){var t=io.connect("http://ndzservercommunity.ddns.net:9876/",{path:"/main",forceNew:!0,reconnection:!1});t.on("connect",function(){e(t)})}function a(){o(function(e){var t=$("#register_icon_prefix_01").val(),r=String(e.id),n=(0,l.default)().compressToEncodedURIComponent((0,f.default)().stringify({email:t,socketId:r}));e.emit("emailAlreadyUsed",n),e.on("eventPage_emailChecked",function(t){t=(0,f.default)().parse((0,l.default)().decompressFromEncodedURIComponent(t));var r=Boolean(t.email),n=String(t.socketId),o=String(t.language);r&&String(e.id)==n?($("#register_icon_prefix_01").addClass("invalid checkedEmailServer"),$("#icon_page_email_01").addClass("red-text"),"pt_br"==o?Materialize.toast("Já existe uma conta com este endereço de email!",3500,"rounded"):"en_us"==o&&Materialize.toast("An account already exists with this email address!",3500,"rounded")):$("#register_icon_prefix_01").hasClass("checkedEmailServer")&&($("#register_icon_prefix_01").removeClass("invalid checkedEmailServer"),$("#icon_page_email_01").removeClass("red-text")),i(),e.disconnect()})})}var s=r(0),c=r(3),l=n(c),u=r(4),f=n(u);$(document).ready(function(){$(".modal").modal({dismissible:!1,opacity:.5,inDuration:300,outDuration:200,startingTop:"4%",endingTop:"10%"}),$("#window_login").modal("open")}),$("#register_icon_prefix_01").focusout(function(){a()}),$("#register_icon_prefix_02,     #register_icon_prefix_03,     #register_icon_prefix_04").focusout(function(){i()}).keyup(function(){i()}),$("#register_icon_password_visibility").click(function(){$("#register_icon_password_visibility").hasClass("grey-text")?($("#register_icon_password_visibility").fadeOut("fast").removeClass("grey-text").addClass("green-text").text("visibility_off").fadeIn("fast"),$("#register_icon_prefix_03, #register_icon_prefix_04").fadeOut("fast").attr("type","text").fadeIn("fast")):$("#register_icon_password_visibility").hasClass("green-text")&&($("#register_icon_password_visibility").fadeOut("fast").removeClass("green-text").addClass("grey-text").text("visibility").fadeIn("fast"),$("#register_icon_prefix_03, #register_icon_prefix_04").fadeOut("fast").attr("type","password").fadeIn("fast"))}),$("#window_login_text_04").click(function(){setTimeout(function(){$("#window_register").modal("open")},350)}),$("#window_register_text_06").click(function(){setTimeout(function(){$("#window_login").modal("open")},350)}),$("#window_register_text_07").click(function(){setTimeout(function(){$("#window_preloader").modal("open"),o(function(e){var t=s.Language.language(),r=$("#register_icon_prefix_01").val(),n=$("#register_icon_prefix_02").val(),i=$("#register_icon_prefix_03").val(),o=(0,l.default)().compressToEncodedURIComponent((0,f.default)().stringify({language:t,email:r,password:i,username:n,money:1500,level:1}));e.emit("create_account",o),e.disconnect(),$("#window_accountCreated_text_email").text(r),setTimeout(function(){$("#window_preloader").modal("destroy"),setTimeout(function(){$("#window_accountCreated").modal("open")},350)},1e3)})},350)}),$("#window_accountCreated_button_01").click(function(){setTimeout(function(){$("#window_login").modal("open")},350)})},function(e,t,r){"use strict";function n(){function e(e,t){if(!i[e]){i[e]={};for(var r=0;r<e.length;r++)i[e][e.charAt(r)]=r}return i[e][t]}var t=String.fromCharCode,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",i={},o={compressToBase64:function(e){if(null==e)return"";var t=o._compress(e,6,function(e){return r.charAt(e)});switch(t.length%4){default:case 0:return t;case 1:return t+"===";case 2:return t+"==";case 3:return t+"="}},decompressFromBase64:function(t){return null==t?"":""==t?null:o._decompress(t.length,32,function(n){return e(r,t.charAt(n))})},compressToUTF16:function(e){return null==e?"":o._compress(e,15,function(e){return t(e+32)})+" "},decompressFromUTF16:function(e){return null==e?"":""==e?null:o._decompress(e.length,16384,function(t){return e.charCodeAt(t)-32})},compressToUint8Array:function(e){for(var t=o.compress(e),r=new Uint8Array(2*t.length),n=0,i=t.length;n<i;n++){var a=t.charCodeAt(n);r[2*n]=a>>>8,r[2*n+1]=a%256}return r},decompressFromUint8Array:function(e){if(null===e||void 0===e)return o.decompress(e);for(var r=new Array(e.length/2),n=0,i=r.length;n<i;n++)r[n]=256*e[2*n]+e[2*n+1];var a=[];return r.forEach(function(e){a.push(t(e))}),o.decompress(a.join(""))},compressToEncodedURIComponent:function(e){return null==e?"":o._compress(e,6,function(e){return n.charAt(e)})},decompressFromEncodedURIComponent:function(t){return null==t?"":""==t?null:(t=t.replace(/ /g,"+"),o._decompress(t.length,32,function(r){return e(n,t.charAt(r))}))},compress:function(e){return o._compress(e,16,function(e){return t(e)})},_compress:function(e,t,r){if(null==e)return"";var n,i,o,a={},s={},c="",l="",u="",f=2,d=3,_=2,p=[],g=0,v=0;for(o=0;o<e.length;o+=1)if(c=e.charAt(o),Object.prototype.hasOwnProperty.call(a,c)||(a[c]=d++,s[c]=!0),l=u+c,Object.prototype.hasOwnProperty.call(a,l))u=l;else{if(Object.prototype.hasOwnProperty.call(s,u)){if(u.charCodeAt(0)<256){for(n=0;n<_;n++)g<<=1,v==t-1?(v=0,p.push(r(g)),g=0):v++;for(i=u.charCodeAt(0),n=0;n<8;n++)g=g<<1|1&i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i>>=1}else{for(i=1,n=0;n<_;n++)g=g<<1|i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i=0;for(i=u.charCodeAt(0),n=0;n<16;n++)g=g<<1|1&i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i>>=1}f--,0==f&&(f=Math.pow(2,_),_++),delete s[u]}else for(i=a[u],n=0;n<_;n++)g=g<<1|1&i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i>>=1;f--,0==f&&(f=Math.pow(2,_),_++),a[l]=d++,u=String(c)}if(""!==u){if(Object.prototype.hasOwnProperty.call(s,u)){if(u.charCodeAt(0)<256){for(n=0;n<_;n++)g<<=1,v==t-1?(v=0,p.push(r(g)),g=0):v++;for(i=u.charCodeAt(0),n=0;n<8;n++)g=g<<1|1&i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i>>=1}else{for(i=1,n=0;n<_;n++)g=g<<1|i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i=0;for(i=u.charCodeAt(0),n=0;n<16;n++)g=g<<1|1&i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i>>=1}f--,0==f&&(f=Math.pow(2,_),_++),delete s[u]}else for(i=a[u],n=0;n<_;n++)g=g<<1|1&i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i>>=1;f--,0==f&&(f=Math.pow(2,_),_++)}for(i=2,n=0;n<_;n++)g=g<<1|1&i,v==t-1?(v=0,p.push(r(g)),g=0):v++,i>>=1;for(;;){if(g<<=1,v==t-1){p.push(r(g));break}v++}return p.join("")},decompress:function(e){return null==e?"":""==e?null:o._decompress(e.length,32768,function(t){return e.charCodeAt(t)})},_decompress:function(e,r,n){var i,o,a,s,c,l,u,f=[],d=4,_=4,p=3,g="",v=[],m={val:n(0),position:r,index:1};for(i=0;i<3;i+=1)f[i]=i;for(a=0,c=Math.pow(2,2),l=1;l!=c;)s=m.val&m.position,m.position>>=1,0==m.position&&(m.position=r,m.val=n(m.index++)),a|=(s>0?1:0)*l,l<<=1;switch(a){case 0:for(a=0,c=Math.pow(2,8),l=1;l!=c;)s=m.val&m.position,m.position>>=1,0==m.position&&(m.position=r,m.val=n(m.index++)),a|=(s>0?1:0)*l,l<<=1;u=t(a);break;case 1:for(a=0,c=Math.pow(2,16),l=1;l!=c;)s=m.val&m.position,m.position>>=1,0==m.position&&(m.position=r,m.val=n(m.index++)),a|=(s>0?1:0)*l,l<<=1;u=t(a);break;case 2:return""}for(f[3]=u,o=u,v.push(u);;){if(m.index>e)return"";for(a=0,c=Math.pow(2,p),l=1;l!=c;)s=m.val&m.position,m.position>>=1,0==m.position&&(m.position=r,m.val=n(m.index++)),a|=(s>0?1:0)*l,l<<=1;switch(u=a){case 0:for(a=0,c=Math.pow(2,8),l=1;l!=c;)s=m.val&m.position,m.position>>=1,0==m.position&&(m.position=r,m.val=n(m.index++)),a|=(s>0?1:0)*l,l<<=1;f[_++]=t(a),u=_-1,d--;break;case 1:for(a=0,c=Math.pow(2,16),l=1;l!=c;)s=m.val&m.position,m.position>>=1,0==m.position&&(m.position=r,m.val=n(m.index++)),a|=(s>0?1:0)*l,l<<=1;f[_++]=t(a),u=_-1,d--;break;case 2:return v.join("")}if(0==d&&(d=Math.pow(2,p),p++),f[u])g=f[u];else{if(u!==_)return null;g=o+o.charAt(0)}v.push(g),f[_++]=o+g.charAt(0),d--,o=g,0==d&&(d=Math.pow(2,p),p++)}}};return o}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n},function(e,t,r){"use strict";function n(){var e={maxDepth:100,id:1,_generateId:function(){return e.id++},_restoreCircularReference:function(e){e.forEach(function(e){var t=e[0],r=e[1],n=e[2];r[t]=n})},_linkCircularReference:function(e,t,r){t.forEach(function(e){var t=e[0],n=e[1],i=e[2];n[t]=r[i]})},_cleanMetadata:function(t){t&&(delete t["@"],delete t["@c"],"object"===(void 0===t?"undefined":i(t))&&Object.keys(t).forEach(function(r){var n=t[r];"object"===(void 0===n?"undefined":i(n))&&e._cleanMetadata(n)}))},_encode:function(t,r,n){if(n=n||0,++n>=e.maxDepth)throw new Error("Object too deep");var o=Object.prototype.toString.call(t);if("[object Object]"===o||"[object Array]"===o){t["@c"]=e._generateId();var a=e._getConstructorName(t);"Object"!==a&&"Array"!==a&&(t["@"]=a);for(var s in t)t.hasOwnProperty(s)&&!s.match(/^@./)&&(t[s]&&"object"===i(t[s])?t[s]["@c"]?(r.push([s,t,t[s]]),t[s]={"@r":t[s]["@c"]}):(t[s]=e._encode(t[s],r,n+1),t[s]instanceof Array&&(r.push([s,t,t[s]]),t[s]={"@c":t[s]["@c"],"@a":t[s]})):t[s]=e._encode(t[s],r,n+1))}return n--,t},_decode:function(t,r,n){var i=Object.prototype.toString.call(t);if("[object Object]"===i||"[object Array]"===i){if(n[t["@c"]]=t,t["@"]){var o=window[t["@"]];o&&(t=e._resetPrototype(t,o.prototype))}for(var a in t)if(t.hasOwnProperty(a)){if(t[a]&&t[a]["@a"]){var s=t[a]["@a"];s["@c"]=t[a]["@c"],t[a]=s}t[a]&&t[a]["@r"]&&r.push([a,t,t[a]["@r"]]),t[a]=e._decode(t[a],r,n)}}return t},_getConstructorName:function(e){var t=e.constructor.name;if(void 0===t){t=/^\s*function\s*([A-Za-z0-9_$]*)/.exec(e.constructor)[1]}return t},_resetPrototype:function(e,t){if(void 0!==Object.setPrototypeOf)Object.setPrototypeOf(e,t);else if("__proto__"in e)e.__proto__=t;else{var r=Object.create(t);for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);e=r}return e},stringify:function(t){var r=[];e.id=1;var n=JSON.stringify(e._encode(t,r,0));return e._cleanMetadata(t),e._restoreCircularReference(r),n},parse:function(t){var r=[],n={},i=e._decode(JSON.parse(t),r,n);return e._cleanMetadata(i),e._linkCircularReference(i,r,n),i},makeDeepCopy:function(t){return e.parse(e.stringify(t))}};return e}Object.defineProperty(t,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=n}]);