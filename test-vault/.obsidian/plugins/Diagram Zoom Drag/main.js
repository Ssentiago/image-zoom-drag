'use strict';

var obsidian = require('obsidian');

var SupportedDiagrams;
(function (SupportedDiagrams) {
    SupportedDiagrams["Default"] = ".diagram-zoom-drag";
    SupportedDiagrams["Mermaid"] = ".mermaid";
    SupportedDiagrams["Mehrmaid"] = ".block-language-mehrmaid";
    SupportedDiagrams["PlantUML"] = ".block-language-plantuml";
    SupportedDiagrams["Graphviz"] = ".block-language-dot";
})(SupportedDiagrams || (SupportedDiagrams = {}));

class SettingsManager {
    plugin;
    constructor(plugin) {
        this.plugin = plugin;
        this.plugin = plugin;
    }
    /**
     * Retrieves the default settings for the plugin.
     * @returns {DefaultSettings} The default settings object.
     */
    get defaultSettings() {
        return {
            supported_diagrams: Object.entries(SupportedDiagrams).map(([key, value]) => ({
                name: key,
                selector: value,
                on: true,
                panels: {
                    move: {
                        on: true,
                    },
                    zoom: {
                        on: true,
                    },
                    service: {
                        on: true,
                    },
                },
            })),
            panelsConfig: {
                service: {
                    enabled: true,
                    position: {
                        top: '0px',
                        right: '0px',
                    },
                },
                move: {
                    enabled: true,
                    position: {
                        bottom: '0px',
                        right: '0px',
                    },
                },
                zoom: {
                    enabled: true,
                    position: {
                        top: '50%',
                        right: '0px',
                    },
                },
            },
            diagramsPerPage: 5,
            collapseByDefault: false,
            applySuitableSize: false,
            automaticCollapsingOnFocusChange: false,
            hideOnMouseOutDiagram: false,
            diagramExpandedWidth: 400,
            diagramExpandedHeight: 400,
            diagramCollapsedWidth: 200,
            diagramCollapsedHeight: 200,
            addHidingButton: true,
        };
    }
    /**
     * Loads and initializes the plugin settings.
     *
     * @returns {Promise<void>} A promise that resolves when settings have been successfully loaded and applied.
     */
    async loadSettings() {
        const userSettings = await this.plugin.loadData();
        const defaultSettings = this.defaultSettings;
        const settings = Object.assign({}, defaultSettings, userSettings);
        this.plugin.settings = {
            ...settings,
        };
    }
    /**
     * Saves the current plugin settings.
     *
     * @returns {Promise<void>} A promise that resolves when the settings have been successfully saved.
     */
    async saveSettings() {
        const saveData = {
            ...this.plugin.settings,
        };
        await this.plugin.saveData(saveData);
    }
    /**
     * Resets the plugin settings to their default state.
     *
     * @returns {Promise<void>} A promise that resolves when the settings have been reset and the event has been published.
     */
    async resetSettings() {
        const pluginPath = this.plugin.manifest.dir;
        if (pluginPath) {
            const configPath = obsidian.normalizePath(`${pluginPath}/data.json`);
            const existsPath = await this.plugin.app.vault.adapter.exists(configPath);
            if (existsPath) {
                await this.plugin.app.vault.adapter.remove(configPath);
            }
            await this.loadSettings();
        }
    }
}

var n,l$1,u$1,i$1,o$1,r$1,f$2,e$1,c$1,s$1,a$1,h$1={},v$2=[],p$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,y$2=Array.isArray;function d$1(n,l){for(var u in l)n[u]=l[u];return n}function w$3(n){n&&n.parentNode&&n.parentNode.removeChild(n);}function _$2(l,u,t){var i,o,r,f={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return g$3(l,f,i,o,null)}function g$3(n,t,i,o,r){var f={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:null==r?++u$1:r,__i:-1,__u:0};return null==r&&null!=l$1.vnode&&l$1.vnode(f),f}function m$2(){return {current:null}}function b$1(n){return n.children}function k$3(n,l){this.props=n,this.context=l;}function x$3(n,l){if(null==l)return n.__?x$3(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?x$3(n):null}function C$3(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return C$3(n)}}function S$1(n){(!n.__d&&(n.__d=!0)&&i$1.push(n)&&!M$2.__r++||o$1!==l$1.debounceRendering)&&((o$1=l$1.debounceRendering)||r$1)(M$2);}function M$2(){var n,u,t,o,r,e,c,s;for(i$1.sort(f$2);n=i$1.shift();)n.__d&&(u=i$1.length,o=void 0,e=(r=(t=n).__v).__e,c=[],s=[],t.__P&&((o=d$1({},r)).__v=r.__v+1,l$1.vnode&&l$1.vnode(o),O$2(t.__P,o,r,t.__n,t.__P.namespaceURI,32&r.__u?[e]:null,c,null==e?x$3(r):e,!!(32&r.__u),s),o.__v=r.__v,o.__.__k[o.__i]=o,j$3(c,o,s),o.__e!=e&&C$3(o)),i$1.length>u&&i$1.sort(f$2));M$2.__r=0;}function P$2(n,l,u,t,i,o,r,f,e,c,s){var a,p,y,d,w,_=t&&t.__k||v$2,g=l.length;for(u.__d=e,$$2(u,l,_),e=u.__d,a=0;a<g;a++)null!=(y=u.__k[a])&&(p=-1===y.__i?h$1:_[y.__i]||h$1,y.__i=a,O$2(n,y,p,i,o,r,f,e,c,s),d=y.__e,y.ref&&p.ref!=y.ref&&(p.ref&&N$1(p.ref,null,y),s.push(y.ref,y.__c||d,y)),null==w&&null!=d&&(w=d),65536&y.__u||p.__k===y.__k?e=I$2(y,e,n):"function"==typeof y.type&&void 0!==y.__d?e=y.__d:d&&(e=d.nextSibling),y.__d=void 0,y.__u&=-196609);u.__d=e,u.__e=w;}function $$2(n,l,u){var t,i,o,r,f,e=l.length,c=u.length,s=c,a=0;for(n.__k=[],t=0;t<e;t++)null!=(i=l[t])&&"boolean"!=typeof i&&"function"!=typeof i?(r=t+a,(i=n.__k[t]="string"==typeof i||"number"==typeof i||"bigint"==typeof i||i.constructor==String?g$3(null,i,null,null,null):y$2(i)?g$3(b$1,{children:i},null,null,null):void 0===i.constructor&&i.__b>0?g$3(i.type,i.props,i.key,i.ref?i.ref:null,i.__v):i).__=n,i.__b=n.__b+1,o=null,-1!==(f=i.__i=L$2(i,u,r,s))&&(s--,(o=u[f])&&(o.__u|=131072)),null==o||null===o.__v?(-1==f&&a--,"function"!=typeof i.type&&(i.__u|=65536)):f!==r&&(f==r-1?a--:f==r+1?a++:(f>r?a--:a++,i.__u|=65536))):i=n.__k[t]=null;if(s)for(t=0;t<c;t++)null!=(o=u[t])&&0==(131072&o.__u)&&(o.__e==n.__d&&(n.__d=x$3(o)),V$2(o,o));}function I$2(n,l,u){var t,i;if("function"==typeof n.type){for(t=n.__k,i=0;t&&i<t.length;i++)t[i]&&(t[i].__=n,l=I$2(t[i],l,u));return l}n.__e!=l&&(l&&n.type&&!u.contains(l)&&(l=x$3(n)),u.insertBefore(n.__e,l||null),l=n.__e);do{l=l&&l.nextSibling;}while(null!=l&&8===l.nodeType);return l}function H$2(n,l){return l=l||[],null==n||"boolean"==typeof n||(y$2(n)?n.some(function(n){H$2(n,l);}):l.push(n)),l}function L$2(n,l,u,t){var i=n.key,o=n.type,r=u-1,f=u+1,e=l[u];if(null===e||e&&i==e.key&&o===e.type&&0==(131072&e.__u))return u;if(t>(null!=e&&0==(131072&e.__u)?1:0))for(;r>=0||f<l.length;){if(r>=0){if((e=l[r])&&0==(131072&e.__u)&&i==e.key&&o===e.type)return r;r--;}if(f<l.length){if((e=l[f])&&0==(131072&e.__u)&&i==e.key&&o===e.type)return f;f++;}}return -1}function T$3(n,l,u){"-"===l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||p$1.test(l)?u:u+"px";}function A$3(n,l,u,t,i){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||T$3(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||T$3(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/(PointerCapture)$|Capture$/i,"$1")),l=l.toLowerCase()in n||"onFocusOut"===l||"onFocusIn"===l?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t?u.u=t.u:(u.u=e$1,n.addEventListener(l,o?s$1:c$1,o)):n.removeEventListener(l,o?s$1:c$1,o);else {if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!==l[4]?n.removeAttribute(l):n.setAttribute(l,"popover"==l&&1==u?"":u));}}function F$3(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u.t)u.t=e$1++;else if(u.t<t.u)return;return t(l$1.event?l$1.event(u):u)}}}function O$2(n,u,t,i,o,r,f,e,c,s){var a,h,v,p,w,_,g,m,x,C,S,M,$,I,H,L,T=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),r=[e=u.__e=t.__e]),(a=l$1.__b)&&a(u);n:if("function"==typeof T)try{if(m=u.props,x="prototype"in T&&T.prototype.render,C=(a=T.contextType)&&i[a.__c],S=a?C?C.props.value:a.__:i,t.__c?g=(h=u.__c=t.__c).__=h.__E:(x?u.__c=h=new T(m,S):(u.__c=h=new k$3(m,S),h.constructor=T,h.render=q$3),C&&C.sub(h),h.props=m,h.state||(h.state={}),h.context=S,h.__n=i,v=h.__d=!0,h.__h=[],h._sb=[]),x&&null==h.__s&&(h.__s=h.state),x&&null!=T.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=d$1({},h.__s)),d$1(h.__s,T.getDerivedStateFromProps(m,h.__s))),p=h.props,w=h.state,h.__v=u,v)x&&null==T.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),x&&null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(x&&null==T.getDerivedStateFromProps&&m!==p&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,S),!h.__e&&(null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,S)||u.__v===t.__v)){for(u.__v!==t.__v&&(h.props=m,h.state=h.__s,h.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u);}),M=0;M<h._sb.length;M++)h.__h.push(h._sb[M]);h._sb=[],h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,S),x&&null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(p,w,_);});}if(h.context=S,h.props=m,h.__P=n,h.__e=!1,$=l$1.__r,I=0,x){for(h.state=h.__s,h.__d=!1,$&&$(u),a=h.render(h.props,h.state,h.context),H=0;H<h._sb.length;H++)h.__h.push(h._sb[H]);h._sb=[];}else do{h.__d=!1,$&&$(u),a=h.render(h.props,h.state,h.context),h.state=h.__s;}while(h.__d&&++I<25);h.state=h.__s,null!=h.getChildContext&&(i=d$1(d$1({},i),h.getChildContext())),x&&!v&&null!=h.getSnapshotBeforeUpdate&&(_=h.getSnapshotBeforeUpdate(p,w)),P$2(n,y$2(L=null!=a&&a.type===b$1&&null==a.key?a.props.children:a)?L:[L],u,t,i,o,r,f,e,c,s),h.base=u.__e,u.__u&=-161,h.__h.length&&f.push(h),g&&(h.__E=h.__=null);}catch(n){if(u.__v=null,c||null!=r){for(u.__u|=c?160:128;e&&8===e.nodeType&&e.nextSibling;)e=e.nextSibling;r[r.indexOf(e)]=null,u.__e=e;}else u.__e=t.__e,u.__k=t.__k;l$1.__e(n,u,t);}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=z$3(t.__e,u,t,i,o,r,f,c,s);(a=l$1.diffed)&&a(u);}function j$3(n,u,t){u.__d=void 0;for(var i=0;i<t.length;i++)N$1(t[i],t[++i],t[++i]);l$1.__c&&l$1.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$1.__e(n,u.__v);}});}function z$3(u,t,i,o,r,f,e,c,s){var a,v,p,d,_,g,m,b=i.props,k=t.props,C=t.type;if("svg"===C?r="http://www.w3.org/2000/svg":"math"===C?r="http://www.w3.org/1998/Math/MathML":r||(r="http://www.w3.org/1999/xhtml"),null!=f)for(a=0;a<f.length;a++)if((_=f[a])&&"setAttribute"in _==!!C&&(C?_.localName===C:3===_.nodeType)){u=_,f[a]=null;break}if(null==u){if(null===C)return document.createTextNode(k);u=document.createElementNS(r,C,k.is&&k),c&&(l$1.__m&&l$1.__m(t,f),c=!1),f=null;}if(null===C)b===k||c&&u.data===k||(u.data=k);else {if(f=f&&n.call(u.childNodes),b=i.props||h$1,!c&&null!=f)for(b={},a=0;a<u.attributes.length;a++)b[(_=u.attributes[a]).name]=_.value;for(a in b)if(_=b[a],"children"==a);else if("dangerouslySetInnerHTML"==a)p=_;else if(!(a in k)){if("value"==a&&"defaultValue"in k||"checked"==a&&"defaultChecked"in k)continue;A$3(u,a,null,_,r);}for(a in k)_=k[a],"children"==a?d=_:"dangerouslySetInnerHTML"==a?v=_:"value"==a?g=_:"checked"==a?m=_:c&&"function"!=typeof _||b[a]===_||A$3(u,a,_,b[a],r);if(v)c||p&&(v.__html===p.__html||v.__html===u.innerHTML)||(u.innerHTML=v.__html),t.__k=[];else if(p&&(u.innerHTML=""),P$2(u,y$2(d)?d:[d],t,i,o,"foreignObject"===C?"http://www.w3.org/1999/xhtml":r,f,e,f?f[0]:i.__k&&x$3(i,0),c,s),null!=f)for(a=f.length;a--;)w$3(f[a]);c||(a="value","progress"===C&&null==g?u.removeAttribute("value"):void 0!==g&&(g!==u[a]||"progress"===C&&!g||"option"===C&&g!==b[a])&&A$3(u,a,g,b[a],r),a="checked",void 0!==m&&m!==u[a]&&A$3(u,a,m,b[a],r));}return u}function N$1(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u));}else n.current=u;}catch(n){l$1.__e(n,t);}}function V$2(n,u,t){var i,o;if(l$1.unmount&&l$1.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||N$1(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount();}catch(n){l$1.__e(n,u);}i.base=i.__P=null;}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&V$2(i[o],u,t||"function"!=typeof n.type);t||w$3(n.__e),n.__c=n.__=n.__e=n.__d=void 0;}function q$3(n,l,u){return this.constructor(n,u)}function B$3(u,t,i){var o,r,f,e;l$1.__&&l$1.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,f=[],e=[],O$2(t,u=(!o&&i||t).__k=_$2(b$1,null,[u]),r||h$1,h$1,t.namespaceURI,!o&&i?[i]:r?null:t.firstChild?n.call(t.childNodes):null,f,!o&&i?i:r?r.__e:t.firstChild,o,e),j$3(f,u,e);}function D$3(n,l){B$3(n,l,D$3);}function E$1(l,u,t){var i,o,r,f,e=d$1({},l.props);for(r in l.type&&l.type.defaultProps&&(f=l.type.defaultProps),u)"key"==r?i=u[r]:"ref"==r?o=u[r]:e[r]=void 0===u[r]&&void 0!==f?f[r]:u[r];return arguments.length>2&&(e.children=arguments.length>3?n.call(arguments,2):t),g$3(l.type,e,i||l.key,o||l.ref,null)}function G$2(n,l){var u={__c:l="__cC"+a$1++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=new Set,(t={})[l]=this,this.getChildContext=function(){return t},this.componentWillUnmount=function(){u=null;},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.forEach(function(n){n.__e=!0,S$1(n);});},this.sub=function(n){u.add(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u&&u.delete(n),l&&l.call(n);};}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n=v$2.slice,l$1={__e:function(n,l,u,t){for(var i,o,r;l=l.__;)if((i=l.__c)&&!i.__)try{if((o=i.constructor)&&null!=o.getDerivedStateFromError&&(i.setState(o.getDerivedStateFromError(n)),r=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),r=i.__d),r)return i.__E=i}catch(l){n=l;}throw n}},u$1=0,k$3.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=d$1({},this.state),"function"==typeof n&&(n=n(d$1({},u),this.props)),n&&d$1(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),S$1(this));},k$3.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),S$1(this));},k$3.prototype.render=b$1,i$1=[],r$1="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,f$2=function(n,l){return n.__v.__b-l.__v.__b},M$2.__r=0,e$1=0,c$1=F$3(!1),s$1=F$3(!0),a$1=0;

var t,r,u,i,o=0,f$1=[],c=l$1,e=c.__b,a=c.__r,v$1=c.diffed,l=c.__c,m$1=c.unmount,s=c.__;function d(n,t){c.__h&&c.__h(r,n,o||t),o=0;var u=r.__H||(r.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function h(n){return o=1,p(D$2,n)}function p(n,u,i){var o=d(t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):D$2(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}));}],o.__c=r,!r.u)){var f=function(n,t,r){if(!o.__c.__H)return !0;var u=o.__c.__H.__.filter(function(n){return !!n.__c});if(u.every(function(n){return !n.__N}))return !c||c.call(this,n,t,r);var i=!1;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0);}}),!(!i&&o.__c.props===n)&&(!c||c.call(this,n,t,r))};r.u=!0;var c=r.shouldComponentUpdate,e=r.componentWillUpdate;r.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u;}e&&e.call(this,n,t,r);},r.shouldComponentUpdate=f;}return o.__N||o.__}function y$1(n,u){var i=d(t++,3);!c.__s&&C$2(i.__H,u)&&(i.__=n,i.i=u,r.__H.__h.push(i));}function _$1(n,u){var i=d(t++,4);!c.__s&&C$2(i.__H,u)&&(i.__=n,i.i=u,r.__h.push(i));}function A$2(n){return o=5,T$2(function(){return {current:n}},[])}function F$2(n,t,r){o=6,_$1(function(){return "function"==typeof n?(n(t()),function(){return n(null)}):n?(n.current=t(),function(){return n.current=null}):void 0},null==r?r:r.concat(n));}function T$2(n,r){var u=d(t++,7);return C$2(u.__H,r)&&(u.__=n(),u.__H=r,u.__h=n),u.__}function q$2(n,t){return o=8,T$2(function(){return n},t)}function x$2(n){var u=r.context[n.__c],i=d(t++,9);return i.c=n,u?(null==i.__&&(i.__=!0,u.sub(r)),u.props.value):n.__}function P$1(n,t){c.useDebugValue&&c.useDebugValue(t?t(n):n);}function b(n){var u=d(t++,10),i=h();return u.__=n,r.componentDidCatch||(r.componentDidCatch=function(n,t){u.__&&u.__(n,t),i[1](n);}),[i[0],function(){i[1](void 0);}]}function g$2(){var n=d(t++,11);if(!n.__){for(var u=r.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="P"+i[0]+"-"+i[1]++;}return n.__}function j$2(){for(var n;n=f$1.shift();)if(n.__P&&n.__H)try{n.__H.__h.forEach(z$2),n.__H.__h.forEach(B$2),n.__H.__h=[];}catch(t){n.__H.__h=[],c.__e(t,n.__v);}}c.__b=function(n){r=null,e&&e(n);},c.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),s&&s(n,t);},c.__r=function(n){a&&a(n),t=0;var i=(r=n.__c).__H;i&&(u===r?(i.__h=[],r.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.i=n.__N=void 0;})):(i.__h.forEach(z$2),i.__h.forEach(B$2),i.__h=[],t=0)),u=r;},c.diffed=function(n){v$1&&v$1(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==f$1.push(t)&&i===c.requestAnimationFrame||((i=c.requestAnimationFrame)||w$2)(j$2)),t.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.i=void 0;})),u=r=null;},c.__c=function(n,t){t.some(function(n){try{n.__h.forEach(z$2),n.__h=n.__h.filter(function(n){return !n.__||B$2(n)});}catch(r){t.some(function(n){n.__h&&(n.__h=[]);}),t=[],c.__e(r,n.__v);}}),l&&l(n,t);},c.unmount=function(n){m$1&&m$1(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.forEach(function(n){try{z$2(n);}catch(n){t=n;}}),r.__H=void 0,t&&c.__e(t,r.__v));};var k$2="function"==typeof requestAnimationFrame;function w$2(n){var t,r=function(){clearTimeout(u),k$2&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);k$2&&(t=requestAnimationFrame(r));}function z$2(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t;}function B$2(n){var t=r;n.__c=n.__(),r=t;}function C$2(n,t){return !n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function D$2(n,t){return "function"==typeof t?t(n):t}

function g$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}function E(n,t){this.props=n,this.context=t;}function C$1(n,e){function r(n){var t=this.props.ref,r=t==n.ref;return !r&&t&&(t.call?t(null):t.current=null),e?!e(this.props,n)||!r:g$1(this.props,n)}function u(e){return this.shouldComponentUpdate=r,_$2(n,e)}return u.displayName="Memo("+(n.displayName||n.name)+")",u.prototype.isReactComponent=!0,u.__f=!0,u}(E.prototype=new k$3).isPureReactComponent=!0,E.prototype.shouldComponentUpdate=function(n,t){return g$1(this.props,n)||g$1(this.state,t)};var x$1=l$1.__b;l$1.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),x$1&&x$1(n);};var R$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function w$1(n){function t(t){if(!("ref"in t))return n(t,null);var e=t.ref;delete t.ref;var r=n(t,e);return t.ref=e,r}return t.$$typeof=R$1,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var k$1=function(n,t){return null==n?null:H$2(H$2(n).map(t))},I$1={map:k$1,forEach:k$1,count:function(n){return n?H$2(n).length:0},only:function(n){var t=H$2(n);if(1!==t.length)throw "Children.only";return t[0]},toArray:H$2},N=l$1.__e;l$1.__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),u.__c(n,t);N(n,t,e,r);};var M$1=l$1.unmount;function T$1(n,t,e){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c();}),n.__c.__H=null),null!=(n=function(n,t){for(var e in t)n[e]=t[e];return n}({},n)).__c&&(n.__c.__P===e&&(n.__c.__P=t),n.__c=null),n.__k=n.__k&&n.__k.map(function(n){return T$1(n,t,e)})),n}function A$1(n,t,e){return n&&e&&(n.__v=null,n.__k=n.__k&&n.__k.map(function(n){return A$1(n,t,e)}),n.__c&&n.__c.__P===t&&(n.__e&&e.appendChild(n.__e),n.__c.__e=!0,n.__c.__P=e)),n}function D$1(){this.__u=0,this.t=null,this.__b=null;}function L$1(n){var t=n.__.__c;return t&&t.__a&&t.__a(n)}function O$1(n){var e,r,u;function o(o){if(e||(e=n()).then(function(n){r=n.default||n;},function(n){u=n;}),u)throw u;if(!r)throw e;return _$2(r,o)}return o.displayName="Lazy",o.__f=!0,o}function F$1(){this.u=null,this.o=null;}l$1.unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&32&n.__u&&(n.type=null),M$1&&M$1(n);},(D$1.prototype=new k$3).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=L$1(r.__v),o=!1,i=function(){o||(o=!0,e.__R=null,u?u(c):c());};e.__R=i;var c=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=A$1(n,n.__c.__P,n.__c.__O);}var t;for(r.setState({__a:r.__b=null});t=r.t.pop();)t.forceUpdate();}};r.__u++||32&t.__u||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i);},D$1.prototype.componentWillUnmount=function(){this.t=[];},D$1.prototype.render=function(n,e){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),o=this.__v.__k[0].__c;this.__v.__k[0]=T$1(this.__b,r,o.__O=o.__P);}this.__b=null;}var i=e.__a&&_$2(b$1,null,n.fallback);return i&&(i.__u&=-33),[_$2(b$1,null,e.__a?null:n.children),i]};var U$1=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2];}};function V$1(n){return this.getChildContext=function(){return n.context},n.children}function W$1(n){var e=this,r=n.i;e.componentWillUnmount=function(){B$3(null,e.l),e.l=null,e.i=null;},e.i&&e.i!==r&&e.componentWillUnmount(),e.l||(e.i=r,e.l={nodeType:1,parentNode:r,childNodes:[],contains:function(){return !0},appendChild:function(n){this.childNodes.push(n),e.i.appendChild(n);},insertBefore:function(n,t){this.childNodes.push(n),e.i.appendChild(n);},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),e.i.removeChild(n);}}),B$3(_$2(V$1,{context:e.context},n.__v),e.l);}function P(n,e){var r=_$2(W$1,{__v:n,i:e});return r.containerInfo=e,r}(F$1.prototype=new k$3).__a=function(n){var t=this,e=L$1(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),U$1(t,n,r)):u();};e?e(o):o();}},F$1.prototype.render=function(n){this.u=null,this.o=new Map;var t=H$2(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},F$1.prototype.componentDidUpdate=F$1.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){U$1(n,e,t);});};var j$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,z$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,B$1=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,H$1=/[A-Z0-9]/g,Z$1="undefined"!=typeof document,Y$1=function(n){return ("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/:/fil|che|ra/).test(n)};function $$1(n,t,e){return null==t.__k&&(t.textContent=""),B$3(n,t),"function"==typeof e&&e(),n?n.__c:null}function q$1(n,t,e){return D$3(n,t),"function"==typeof e&&e(),n?n.__c:null}k$3.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(k$3.prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(n){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:n});}});});var G$1=l$1.event;function J$1(){}function K$1(){return this.cancelBubble}function Q$1(){return this.defaultPrevented}l$1.event=function(n){return G$1&&(n=G$1(n)),n.persist=J$1,n.isPropagationStopped=K$1,n.isDefaultPrevented=Q$1,n.nativeEvent=n};var X$1,nn={enumerable:!1,configurable:!0,get:function(){return this.class}},tn=l$1.vnode;l$1.vnode=function(n){"string"==typeof n.type&&function(n){var t=n.props,e=n.type,u={},o=-1===e.indexOf("-");for(var i in t){var c=t[i];if(!("value"===i&&"defaultValue"in t&&null==c||Z$1&&"children"===i&&"noscript"===e||"class"===i||"className"===i)){var f=i.toLowerCase();"defaultValue"===i&&"value"in t&&null==t.value?i="value":"download"===i&&!0===c?c="":"translate"===f&&"no"===c?c=!1:"o"===f[0]&&"n"===f[1]?"ondoubleclick"===f?i="ondblclick":"onchange"!==f||"input"!==e&&"textarea"!==e||Y$1(t.type)?"onfocus"===f?i="onfocusin":"onblur"===f?i="onfocusout":B$1.test(i)&&(i=f):f=i="oninput":o&&z$1.test(i)?i=i.replace(H$1,"-$&").toLowerCase():null===c&&(c=void 0),"oninput"===f&&u[i=f]&&(i="oninputCapture"),u[i]=c;}}"select"==e&&u.multiple&&Array.isArray(u.value)&&(u.value=H$2(t.children).forEach(function(n){n.props.selected=-1!=u.value.indexOf(n.props.value);})),"select"==e&&null!=u.defaultValue&&(u.value=H$2(t.children).forEach(function(n){n.props.selected=u.multiple?-1!=u.defaultValue.indexOf(n.props.value):u.defaultValue==n.props.value;})),t.class&&!t.className?(u.class=t.class,Object.defineProperty(u,"className",nn)):(t.className&&!t.class||t.class&&t.className)&&(u.class=u.className=t.className),n.props=u;}(n),n.$$typeof=j$1,tn&&tn(n);};var en=l$1.__r;l$1.__r=function(n){en&&en(n),X$1=n.__c;};var rn=l$1.diffed;l$1.diffed=function(n){rn&&rn(n);var t=n.props,e=n.__e;null!=e&&"textarea"===n.type&&"value"in t&&t.value!==e.value&&(e.value=null==t.value?"":t.value),X$1=null;};var un={ReactCurrentDispatcher:{current:{readContext:function(n){return X$1.__n[n.__c].props.value},useCallback:q$2,useContext:x$2,useDebugValue:P$1,useDeferredValue:_n,useEffect:y$1,useId:g$2,useImperativeHandle:F$2,useInsertionEffect:Sn,useLayoutEffect:_$1,useMemo:T$2,useReducer:p,useRef:A$2,useState:h,useSyncExternalStore:En,useTransition:bn}}},on="18.3.1";function cn(n){return _$2.bind(null,n)}function fn(n){return !!n&&n.$$typeof===j$1}function ln(n){return fn(n)&&n.type===b$1}function an(n){return !!n&&!!n.displayName&&("string"==typeof n.displayName||n.displayName instanceof String)&&n.displayName.startsWith("Memo(")}function sn(n){return fn(n)?E$1.apply(null,arguments):n}function hn(n){return !!n.__k&&(B$3(null,n),!0)}function vn(n){return n&&(n.base||1===n.nodeType&&n)||null}var dn=function(n,t){return n(t)},pn=function(n,t){return n(t)},mn=b$1;function yn(n){n();}function _n(n){return n}function bn(){return [!1,yn]}var Sn=_$1,gn=fn;function En(n,t){var e=t(),r=h({h:{__:e,v:t}}),u=r[0].h,o=r[1];return _$1(function(){u.__=e,u.v=t,Cn(u)&&o({h:u});},[n,e,t]),y$1(function(){return Cn(u)&&o({h:u}),n(function(){Cn(u)&&o({h:u});})},[n]),e}function Cn(n){var t,e,r=n.v,u=n.__;try{var o=r();return !((t=u)===(e=o)&&(0!==t||1/t==1/e)||t!=t&&e!=e)}catch(n){return !0}}var xn={useState:h,useId:g$2,useReducer:p,useEffect:y$1,useLayoutEffect:_$1,useInsertionEffect:Sn,useTransition:bn,useDeferredValue:_n,useSyncExternalStore:En,startTransition:yn,useRef:A$2,useImperativeHandle:F$2,useMemo:T$2,useCallback:q$2,useContext:x$2,useDebugValue:P$1,version:"18.3.1",Children:I$1,render:$$1,hydrate:q$1,unmountComponentAtNode:hn,createPortal:P,createElement:_$2,createContext:G$2,createFactory:cn,cloneElement:sn,createRef:m$2,Fragment:b$1,isValidElement:fn,isElement:gn,isFragment:ln,isMemo:an,findDOMNode:vn,Component:k$3,PureComponent:E,memo:C$1,forwardRef:w$1,flushSync:pn,unstable_batchedUpdates:dn,StrictMode:mn,Suspense:D$1,SuspenseList:F$1,lazy:O$1,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:un};

var React = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Children: I$1,
    Component: k$3,
    Fragment: b$1,
    PureComponent: E,
    StrictMode: mn,
    Suspense: D$1,
    SuspenseList: F$1,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: un,
    cloneElement: sn,
    createContext: G$2,
    createElement: _$2,
    createFactory: cn,
    createPortal: P,
    createRef: m$2,
    default: xn,
    findDOMNode: vn,
    flushSync: pn,
    forwardRef: w$1,
    hydrate: q$1,
    isElement: gn,
    isFragment: ln,
    isMemo: an,
    isValidElement: fn,
    lazy: O$1,
    memo: C$1,
    render: $$1,
    startTransition: yn,
    unmountComponentAtNode: hn,
    unstable_batchedUpdates: dn,
    useCallback: q$2,
    useContext: x$2,
    useDebugValue: P$1,
    useDeferredValue: _n,
    useEffect: y$1,
    useErrorBoundary: b,
    useId: g$2,
    useImperativeHandle: F$2,
    useInsertionEffect: Sn,
    useLayoutEffect: _$1,
    useMemo: T$2,
    useReducer: p,
    useRef: A$2,
    useState: h,
    useSyncExternalStore: En,
    useTransition: bn,
    version: on
});

function createRoot(container) {
	return {
		// eslint-disable-next-line
		render: function (children) {
			$$1(children, container);
		},
		// eslint-disable-next-line
		unmount: function () {
			hn(container);
		}
	};
}

const SettingsContext = G$2(undefined);
/**
 * Provides the Obsidian app, the plugin instance, a force reload function,
 * the reload count, the current path, and a function to set the current path
 * to its children.
 *
 * @param app The Obsidian app instance.
 * @param plugin The plugin instance.
 * @param children The children components of the provider.
 * @returns The children components wrapped in the context provider.
 */
const SettingProvider = ({ app, plugin, children, }) => {
    const [reloadCount, setReloadCount] = h(0);
    const [currentPath, setCurrentPath] = h('/diagram-section');
    const forceReload = q$2(() => {
        setReloadCount((prev) => prev + 1);
    }, []);
    const contextValue = T$2(() => ({
        app,
        plugin,
        forceReload,
        reloadCount,
        currentPath,
        setCurrentPath,
    }), [app, plugin, forceReload, reloadCount, currentPath, setCurrentPath]);
    return (xn.createElement(SettingsContext.Provider, { value: contextValue }, children));
};
/**
 * A React hook that returns the `SettingsContextProps` object.
 *
 * This hook should be used within a `SettingProvider` component. If used
 * outside of a `SettingProvider`, it will throw an error.
 *
 * @returns The `SettingsContextProps` object.
 */
const useSettingsContext = () => {
    const context = x$2(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within a SettingProvider');
    }
    return context;
};

/**
 * @remix-run/router v1.20.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}

////////////////////////////////////////////////////////////////////////////////
//#region Types and Constants
////////////////////////////////////////////////////////////////////////////////
/**
 * Actions represent the type of change to a location value.
 */
var Action;
(function (Action) {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Action["Pop"] = "POP";
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Action["Push"] = "PUSH";
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Action["Replace"] = "REPLACE";
})(Action || (Action = {}));
/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 */
function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }
  let {
    initialEntries = ["/"],
    initialIndex,
    v5Compat = false
  } = options;
  let entries; // Declare so we can access from createMemoryLocation
  entries = initialEntries.map((entry, index) => createMemoryLocation(entry, typeof entry === "string" ? null : entry.state, index === 0 ? "default" : undefined));
  let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
  let action = Action.Pop;
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key);
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in memory history: " + JSON.stringify(to));
    return location;
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref,
    createURL(to) {
      return new URL(createHref(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = Action.Push;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 1
        });
      }
    },
    replace(to, state) {
      action = Action.Replace;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 0
        });
      }
    },
    go(delta) {
      action = Action.Pop;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: nextLocation,
          delta
        });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);
    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience, so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
/**
 * Creates a Location object with a unique key from the given Path
 */
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
/**
 * Creates a string URL path from the given pathname, search, and hash components.
 */
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 */
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
//#endregion

var ResultType;
(function (ResultType) {
  ResultType["data"] = "data";
  ResultType["deferred"] = "deferred";
  ResultType["redirect"] = "redirect";
  ResultType["error"] = "error";
})(ResultType || (ResultType = {}));
/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/utils/match-routes
 */
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    // Incoming pathnames are generally encoded from either window.location
    // or from router.navigate, but we want to match against the unencoded
    // paths in the route definitions.  Memory router locations won't be
    // encoded here but there also shouldn't be anything to decode so this
    // should be a safe operation.  This avoids needing matchRoutes to be
    // history-aware.
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded, allowPartial);
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === undefined ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), "Absolute route path \"" + meta.relativePath + "\" nested under path " + ("\"" + parentPath + "\" is not valid. An absolute child route path ") + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    // Add the children before adding this route to the array, so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      invariant(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      route.index !== true, "Index routes must not have child routes. Please remove " + ("all child routes from route path \"" + path + "\"."));
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    // coarse-grain check for optional params
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
/**
 * Computes all combinations of optional path segments for a given path,
 * excluding combinations that are ambiguous and of lower priority.
 *
 * For example, `/one/:two?/three/:four?/:five?` explodes to:
 * - `/one/three`
 * - `/one/:two/three`
 * - `/one/three/:four`
 * - `/one/three/:five`
 * - `/one/:two/three/:four`
 * - `/one/:two/three/:five`
 * - `/one/three/:four/:five`
 * - `/one/:two/three/:four/:five`
 */
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  // Optional path segments are denoted by a trailing `?`
  let isOptional = first.endsWith("?");
  // Compute the corresponding required segment: `foo?` -> `foo`
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    // Intepret empty string as omitting an optional segment
    // `["one", "", "three"]` corresponds to omitting `:two` from `/one/:two?/three` -> `/one/three`
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  // All child paths with the prefix.  Do this for all children before the
  // optional version for all children, so we get consistent ordering where the
  // parent optional aspect is preferred as required.  Otherwise, we can get
  // child sections interspersed where deeper optional segments are higher than
  // parent optional segments, where for example, /:two would explode _earlier_
  // then /:one.  By always including the parent as required _for all children_
  // first, we avoid this issue
  result.push(...restExploded.map(subpath => subpath === "" ? required : [required, subpath].join("/")));
  // Then, if this is an optional value, add all child versions without
  if (isOptional) {
    result.push(...restExploded);
  }
  // for absolute paths, ensure `/` instead of empty segment
  return result.map(exploded => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score // Higher score first
  : compareIndexes(a.routesMeta.map(meta => meta.childrenIndex), b.routesMeta.map(meta => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = s => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter(s => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ?
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  a[a.length - 1] - b[b.length - 1] :
  // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  0;
}
function matchRouteBranch(branch, pathname, allowPartial) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath({
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end: false
      }, remainingPathname);
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/utils/match-path
 */
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = undefined;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
  .replace(/^\/*/, "/") // Make sure it has a leading /
  .replace(/[\\.*+^${}|()[\]]/g, "\\$&") // Escape special regex chars
  .replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" // Already matched the initial /, just match the rest
    : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else if (end) {
    // When matching to the end, ignore trailing slashes
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    // If our path is non-empty and contains anything beyond an initial slash,
    // then we have _some_ form of path in our regex, so we should expect to
    // match only if we find the end of this path segment.  Look for an optional
    // non-captured trailing slash (to match a portion of the URL) or the end
    // of the path (if we've matched to the end).  We used to do this with a
    // word boundary but that gives false positives on routes like
    // /user-preferences since `-` counts as a word boundary.
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map(v => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, "The URL path \"" + value + "\" could not be decoded because it is is a " + "malformed URL segment. This is probably due to a bad percent " + ("encoding (" + error + ")."));
    return value;
  }
}
/**
 * @private
 */
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  // We want to leave trailing slash behavior in the user's control, so if they
  // specify a basename with a trailing slash, we should support it
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/utils/resolve-path
 */
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach(segment => {
    if (segment === "..") {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + "a string in <Link to=\"...\"> and the router will parse it for you.";
}
/**
 * @private
 *
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
// Return the array of pathnames for the current route matches - used to
// generate the routePathnames input for resolveTo()
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  // When v7_relativeSplatPath is enabled, use the full pathname for the leaf
  // match so we include splat values for "." links.  See:
  // https://github.com/remix-run/react-router/issues/11052#issuecomment-1836589329
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map(match => match.pathnameBase);
}
/**
 * @private
 */
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  // Routing is relative to the current pathname if explicitly requested.
  //
  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    // With relative="route" (the default), each leading .. segment means
    // "go up one route" instead of "go up one URL segment".  This is a key
    // difference from how <a href> works and a major reason we call this a
    // "to" value instead of a "href".
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  // Ensure the pathname has a trailing slash if the original "to" had one
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  // Or if this was a link to the current path which has a trailing slash
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
/**
 * @private
 */
const joinPaths = paths => paths.join("/").replace(/\/\/+/g, "/");
/**
 * @private
 */
const normalizePathname = pathname => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
/**
 * @private
 */
const normalizeSearch = search => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
/**
 * @private
 */
const normalizeHash = hash => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
/**
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response thrown from an action/loader
 */
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}

const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);

/**
 * React Router v6.27.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */

function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}

// Create react-specific types from the agnostic types in @remix-run/router to
// export from react-router
const DataRouterContext = /*#__PURE__*/G$2(null);
const DataRouterStateContext = /*#__PURE__*/G$2(null);

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level `<Router>` API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */

const NavigationContext = /*#__PURE__*/G$2(null);
const LocationContext = /*#__PURE__*/G$2(null);
const RouteContext = /*#__PURE__*/G$2({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /*#__PURE__*/G$2(null);

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/hooks/use-href
 */
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator
  } = x$2(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;

  // If we're operating within a basename, prepend it to the pathname prior
  // to creating the href.  If this is a root navigation, then just use the raw
  // basename which allows the basename to have full control over the presence
  // of a trailing slash on root links
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}

/**
 * Returns true if this component is a descendant of a `<Router>`.
 *
 * @see https://reactrouter.com/hooks/use-in-router-context
 */
function useInRouterContext() {
  return x$2(LocationContext) != null;
}

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/hooks/use-location
 */
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return x$2(LocationContext).location;
}

// Mute warnings for calls to useNavigate in SSR environments
function useIsomorphicLayoutEffect(cb) {
  let isStatic = x$2(NavigationContext).static;
  if (!isStatic) {
    // We should be able to get rid of this once react 18.3 is released
    // See: https://github.com/facebook/react/pull/26395
    // eslint-disable-next-line react-hooks/rules-of-hooks
    _$1(cb);
  }
}

/**
 * Returns an imperative method for changing the location. Used by `<Link>`s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/hooks/use-navigate
 */
function useNavigate() {
  let {
    isDataRoute
  } = x$2(RouteContext);
  // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = x$2(DataRouterContext);
  let {
    basename,
    future,
    navigator
  } = x$2(NavigationContext);
  let {
    matches
  } = x$2(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = A$2(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = q$2(function (to, options) {
    if (options === void 0) {
      options = {};
    }

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our history listener yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");

    // If we're operating within a basename, prepend it to the pathname prior
    // to handing off to history (but only if we're not in a data router,
    // otherwise it'll prepend the basename inside of the router).
    // If this is a root navigation, then we navigate to the raw basename
    // which allows the basename to have full control over the presence of a
    // trailing slash on root links
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
  }, [basename, navigator, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/hooks/use-resolved-path
 */
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = x$2(NavigationContext);
  let {
    matches
  } = x$2(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  return T$2(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an `<Outlet>` to render their child route's
 * element.
 *
 * @see https://reactrouter.com/hooks/use-routes
 */
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}

// Internal implementation with accept optional param for RouterProvider usage
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator
  } = x$2(NavigationContext);
  let {
    matches: parentMatches
  } = x$2(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    // Determine the remaining pathname by removing the # of URL segments the
    // parentPathnameBase has, instead of removing based on character count.
    // This is because we can't guarantee that incoming/outgoing encodings/
    // decodings will match exactly.
    // We decode paths before matching on a per-segment basis with
    // decodeURIComponent(), but we re-encode pathnames via `new URL()` so they
    // match what `window.location.pathname` would reflect.  Those don't 100%
    // align when it comes to encoded URI characters such as % and &.
    //
    // So we may end up with:
    //   pathname:           "/descendant/a%25b/match"
    //   parentPathnameBase: "/descendant/a%b"
    //
    // And the direct substring removal approach won't work :/
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map(match => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase])
  })), parentMatches, dataRouterState, future);

  // When a user passes in a `locationArg`, the associated routes need to
  // be wrapped in a new `LocationContext.Provider` in order for `useLocation`
  // to use the scoped location instead of the global location.
  if (locationArg && renderedMatches) {
    return /*#__PURE__*/_$2(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /*#__PURE__*/_$2(b$1, null, /*#__PURE__*/_$2("h2", null, "Unexpected Application Error!"), /*#__PURE__*/_$2("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /*#__PURE__*/_$2("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /*#__PURE__*/_$2(DefaultErrorComponent, null);
class RenderErrorBoundary extends k$3 {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error: error
    };
  }
  static getDerivedStateFromProps(props, state) {
    // When we get into an error state, the user will likely click "back" to the
    // previous page that didn't have an error. Because this wraps the entire
    // application, that will have no effect--the error page continues to display.
    // This gives us a mechanism to recover from the error when the location changes.
    //
    // Whether we're in an error state or not, we update the location in state
    // so that when we are in an error state, it gets reset when a new location
    // comes in and the user recovers from the error.
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }

    // If we're not changing locations, preserve the location but still surface
    // any new errors that may come through. We retain the existing error, we do
    // this because the error provided from the app state may be cleared without
    // the location changing.
    return {
      error: props.error !== undefined ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== undefined ? /*#__PURE__*/_$2(RouteContext.Provider, {
      value: this.props.routeContext
    }, /*#__PURE__*/_$2(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = x$2(DataRouterContext);

  // Track how deep we got in our render pass to emulate SSR componentDidCatch
  // in a DataStaticRouter
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /*#__PURE__*/_$2(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      // Don't bail if we have data router errors so we can render them in the
      // boundary.  Use the pre-matched (or shimmed) matches
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      // Don't bail if we're initializing with partial hydration and we have
      // router matches.  That means we're actively running `patchRoutesOnNavigation`
      // so we should render down the partial matches to the appropriate
      // `HydrateFallback`.  We only do this if `parentMatches` is empty so it
      // only impacts the root matches for `RouterProvider` and no descendant
      // `<Routes>`
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;

  // If we have data errors, trim matches to the highest error boundary
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(m => m.route.id && (errors == null ? void 0 : errors[m.route.id]) !== undefined);
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }

  // If we're in a partial hydration mode, detect if we need to render down to
  // a given HydrateFallback while we load the rest of the hydration data
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      // Track the deepest fallback up until the first route without data
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === undefined && (!errors || errors[match.route.id] === undefined);
        if (match.route.lazy || needsToRunLoader) {
          // We found the first route that's not ready to render (waiting on
          // lazy, or has a loader that hasn't run yet).  Flag that we need to
          // render a fallback and render up until the appropriate fallback
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    // Only data routers handle errors/fallbacks
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : undefined;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        // Note: This is a de-optimized path since React won't re-use the
        // ReactElement since it's identity changes with each new
        // React.createElement call.  We keep this so folks can use
        // `<Route Component={...}>` in `<Routes>` but generally `Component`
        // usage is only advised in `RouterProvider` when we can convert it to
        // `element` ahead of time.
        children = /*#__PURE__*/_$2(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /*#__PURE__*/_$2(RenderedRoute, {
        match: match,
        routeContext: {
          outlet,
          matches,
          isDataRoute: dataRouterState != null
        },
        children: children
      });
    };
    // Only wrap in an error boundary within data router usages when we have an
    // ErrorBoundary/errorElement on this route.  Otherwise let it bubble up to
    // an ancestor ErrorBoundary/errorElement
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /*#__PURE__*/_$2(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error: error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /*#__PURE__*/function (DataRouterHook) {
  DataRouterHook["UseBlocker"] = "useBlocker";
  DataRouterHook["UseRevalidator"] = "useRevalidator";
  DataRouterHook["UseNavigateStable"] = "useNavigate";
  return DataRouterHook;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /*#__PURE__*/function (DataRouterStateHook) {
  DataRouterStateHook["UseBlocker"] = "useBlocker";
  DataRouterStateHook["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook["UseActionData"] = "useActionData";
  DataRouterStateHook["UseRouteError"] = "useRouteError";
  DataRouterStateHook["UseNavigation"] = "useNavigation";
  DataRouterStateHook["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook["UseMatches"] = "useMatches";
  DataRouterStateHook["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook["UseRouteId"] = "useRouteId";
  return DataRouterStateHook;
}(DataRouterStateHook$1 || {});
function useDataRouterContext$1(hookName) {
  let ctx = x$2(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = x$2(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = x$2(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}

// Internal version with hookName-aware debugging
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}

/**
 * Returns the nearest ancestor Route error, which could be a loader/action
 * error or a render error.  This is intended to be called from your
 * ErrorBoundary/errorElement to display a proper error message.
 */
function useRouteError() {
  var _state$errors;
  let error = x$2(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook$1.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook$1.UseRouteError);

  // If this was a render error, we put it in a RouteError context inside
  // of RenderErrorBoundary
  if (error !== undefined) {
    return error;
  }

  // Otherwise look for errors from our data router state
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}

/**
 * Stable version of useNavigate that is used when we are in the context of
 * a RouterProvider.
 */
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext$1(DataRouterHook$1.UseNavigateStable);
  let id = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = A$2(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = q$2(function (to, options) {
    if (options === void 0) {
      options = {};
    }

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our router subscriber yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id
      }, options));
    }
  }, [router, id]);
  return navigate;
}

/**
  Webpack + React 17 fails to compile on any of the following because webpack
  complains that `startTransition` doesn't exist in `React`:
  * import { startTransition } from "react"
  * import * as React from from "react";
    "startTransition" in React ? React.startTransition(() => setState()) : setState()
  * import * as React from from "react";
    "startTransition" in React ? React["startTransition"](() => setState()) : setState()

  Moving it to a constant such as the following solves the Webpack/React 17 issue:
  * import * as React from from "react";
    const START_TRANSITION = "startTransition";
    START_TRANSITION in React ? React[START_TRANSITION](() => setState()) : setState()

  However, that introduces webpack/terser minification issues in production builds
  in React 18 where minification/obfuscation ends up removing the call of
  React.startTransition entirely from the first half of the ternary.  Grabbing
  this exported reference once up front resolves that issue.

  See https://github.com/remix-run/react-router/issues/10579
*/
const START_TRANSITION = "startTransition";
const startTransitionImpl = React[START_TRANSITION];
/**
 * A `<Router>` that stores all entries in memory.
 *
 * @see https://reactrouter.com/router-components/memory-router
 */
function MemoryRouter(_ref3) {
  let {
    basename,
    children,
    initialEntries,
    initialIndex,
    future
  } = _ref3;
  let historyRef = A$2();
  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory({
      initialEntries,
      initialIndex,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = h({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = q$2(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  _$1(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/_$2(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future: future
  });
}
/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/components/route
 */
function Route(_props) {
  invariant(false) ;
}
/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a `<Router>` directly. Instead, you'll render a
 * router that is more specific to your environment such as a `<BrowserRouter>`
 * in web browsers or a `<StaticRouter>` for server rendering.
 *
 * @see https://reactrouter.com/router-components/router
 */
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;

  // Preserve trailing slashes on basename, so we can let the user control
  // the enforcement of trailing slashes throughout the app
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = T$2(() => ({
    basename,
    navigator,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = T$2(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /*#__PURE__*/_$2(NavigationContext.Provider, {
    value: navigationContext
  }, /*#__PURE__*/_$2(LocationContext.Provider, {
    children: children,
    value: locationContext
  }));
}
/**
 * A container for a nested tree of `<Route>` elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/components/routes
 */
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
new Promise(() => {});

///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/utils/create-routes-from-children
 */
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  I$1.forEach(children, (element, index) => {
    if (! /*#__PURE__*/fn(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === b$1) {
      // Transparently support React.Fragment and its children.
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}

/**
 * React Router DOM v6.27.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && (
  // Ignore everything but left clicks
  !target || target === "_self") &&
  // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // Ignore clicks with modifier keys
  ;
}

const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"],
  _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"];
// HEY YOU! DON'T TOUCH THIS VARIABLE!
//
// It is replaced with the proper version at build time via a babel plugin in
// the rollup config.
//
// Export a global property onto the window for React Router detection by the
// Core Web Vitals Technology Report.  This way they can configure the `wappalyzer`
// to detect and properly classify live websites as being built with React Router:
// https://github.com/HTTPArchive/wappalyzer/blob/main/src/technologies/r.json
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
  // no-op
}
const ViewTransitionContext = /*#__PURE__*/G$2({
  isTransitioning: false
});
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
/**
 * The public API for rendering a history-aware `<a>`.
 */
const Link = /*#__PURE__*/w$1(function LinkWithRef(_ref7, ref) {
  let {
      onClick,
      relative,
      reloadDocument,
      replace,
      state,
      target,
      to,
      preventScrollReset,
      viewTransition
    } = _ref7,
    rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = x$2(NavigationContext);
  // Rendered into <a href> for absolute URLs
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    // Render the absolute href server- and client-side
    absoluteHref = to;
    // Only check for external origins client-side
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          // Strip the protocol/origin/basename for same-origin absolute URLs
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
      }
    }
  }
  // Rendered into <a href> for relative URLs
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    _$2("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref: ref,
      target: target
    }))
  );
});
/**
 * A `<Link>` wrapper that knows if it's "active" or not.
 */
const NavLink = /*#__PURE__*/w$1(function NavLinkWithRef(_ref8, ref) {
  let {
      "aria-current": ariaCurrentProp = "page",
      caseSensitive = false,
      className: classNameProp = "",
      end = false,
      style: styleProp,
      to,
      viewTransition,
      children
    } = _ref8,
    rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = x$2(DataRouterStateContext);
  let {
    navigator,
    basename
  } = x$2(NavigationContext);
  let isTransitioning = routerState != null &&
  // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && viewTransition === true;
  let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  // If the `to` has a trailing slash, look at that exact spot.  Otherwise,
  // we're looking for a slash _after_ what's in `to`.  For example:
  //
  // <NavLink to="/users"> and <NavLink to="/users/">
  // both want to look for a / at index 6 to match URL `/users/matt`
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : undefined;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    // If the className prop is not a function, we use a default `active`
    // class for <NavLink />s that are active. In v5 `active` was the default
    // value for `activeClassName`, but we are removing that API and can still
    // use the old default behavior for a cleaner upgrade path and keep the
    // simple styling rules working as they currently do.
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /*#__PURE__*/_$2(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className: className,
    ref: ref,
    style: style,
    to: to,
    viewTransition: viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Hooks
////////////////////////////////////////////////////////////////////////////////
var DataRouterHook;
(function (DataRouterHook) {
  DataRouterHook["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook["UseSubmit"] = "useSubmit";
  DataRouterHook["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook["UseFetcher"] = "useFetcher";
  DataRouterHook["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function (DataRouterStateHook) {
  DataRouterStateHook["UseFetcher"] = "useFetcher";
  DataRouterStateHook["UseFetchers"] = "useFetchers";
  DataRouterStateHook["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useDataRouterContext(hookName) {
  let ctx = x$2(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
// External hooks
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return q$2(event => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      // If the URL hasn't changed, a regular <a> will do a replace instead of
      // a push, so do the same here unless the replace prop is explicitly set
      let replace = replaceProp !== undefined ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
}
/**
 * Return a boolean indicating if there is an active view transition to the
 * given href.  You can use this value to render CSS classes or viewTransitionName
 * styles onto your elements
 *
 * @param href The destination href
 * @param [opts.relative] Relative routing type ("route" | "path")
 */
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = x$2(ViewTransitionContext);
  !(vtContext != null) ? invariant(false) : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = useResolvedPath(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  // Transition is active if we're going to or coming from the indicated
  // destination.  This ensures that other PUSH navigations that reverse
  // an indicated transition apply.  I.e., on the list view you have:
  //
  //   <NavLink to="/details/1" viewTransition>
  //
  // If you click the breadcrumb back to the list view:
  //
  //   <NavLink to="/list" viewTransition>
  //
  // We should apply the transition because it's indicated as active going
  // from /list -> /details/1 and therefore should be active on the reverse
  // (even though this isn't strictly a POP reverse)
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}

class MultiDescComponent {
    element = null;
    constructor(props) {
        if (props.containerEl) {
            this.element = props.containerEl;
        }
    }
    addDesc(desc) {
        if (this.element) {
            const div = document.createElement('div');
            div.textContent = desc;
            this.element.appendChild(div);
        }
    }
    addDescriptions(desc) {
        if (this.element) {
            desc.forEach((desc) => this.addDesc(desc));
        }
        return this;
    }
    render() {
        return null;
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */memoize(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

var MS = '-ms-';
var MOZ = '-moz-';
var WEBKIT = '-webkit-';

var COMMENT = 'comm';
var RULESET = 'rule';
var DECLARATION = 'decl';
var IMPORT = '@import';
var KEYFRAMES = '@keyframes';
var LAYER = '@layer';

/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs;

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode;

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign;

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @param {number} position
 * @return {number}
 */
function indexof (value, search, position) {
	return value.indexOf(search, position)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}

/**
 * @param {string[]} array
 * @param {RegExp} pattern
 * @return {string[]}
 */
function filter (array, pattern) {
	return array.filter(function (value) { return !match(value, pattern) })
}

var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = '';

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {object[]} siblings
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length, siblings) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: '', siblings: siblings}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return assign(node('', null, null, '', null, null, 0, root.siblings), root, {length: -root.length}, props)
}

/**
 * @param {object} root
 */
function lift (root) {
	while (root.root)
		root = copy(root.root, {children: [root]});

	append(root, root.siblings);
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? charat(characters, --position) : 0;

	if (column--, character === 10)
		column = 1, line--;

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? charat(characters, position++) : 0;

	if (column++, character === 10)
		column = 1, line++;

	return character
}

/**
 * @return {number}
 */
function peek () {
	return charat(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return substr(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = strlen(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next();
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character);
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type);
				break
			// \
			case 92:
				next();
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + from(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next();

	return slice(index, position)
}

/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return dealloc(parse('', null, null, null, [''], value = alloc(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var character = 0;
	var type = '';
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = type;

	while (scanning)
		switch (previous = character, character = next()) {
			// (
			case 40:
				if (previous != 108 && charat(characters, length - 1) == 58) {
					if (indexof(characters += replace(delimit(character), '&', '&\f'), '&\f', abs(index ? points[index - 1] : 0)) != -1)
						ampersand = -1;
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += delimit(character);
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += whitespace(previous);
				break
			// \
			case 92:
				characters += escaping(caret() - 1, 7);
				continue
			// /
			case 47:
				switch (peek()) {
					case 42: case 47:
						append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
						break
					default:
						characters += '/';
				}
				break
			// {
			case 123 * variable:
				points[index++] = strlen(characters) * ampersand;
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0;
					// ;
					case 59 + offset: if (ampersand == -1) characters = replace(characters, /\f/g, '');
						if (property > 0 && (strlen(characters) - length))
							append(property > 32 ? declaration(characters + ';', rule, parent, length - 1, declarations) : declaration(replace(characters, ' ', '') + ';', rule, parent, length - 2, declarations), declarations);
						break
					// @ ;
					case 59: characters += ';';
					// { rule/at-rule
					default:
						append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets);

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children);
							else
								switch (atrule === 99 && charat(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children);
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children);
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo;
				break
			// :
			case 58:
				length = 1 + strlen(characters), property = previous;
			default:
				if (variable < 1)
					if (character == 123)
						--variable;
					else if (character == 125 && variable++ == 0 && prev() == 125)
						continue

				switch (characters += from(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1);
						break
					// ,
					case 44:
						points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
						break
					// @
					case 64:
						// -
						if (peek() === 45)
							characters += delimit(next());

						atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
						break
					// -
					case 45:
						if (previous === 45 && strlen(characters) == 2)
							variable = 0;
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @param {object[]} siblings
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [''];
	var size = sizeof(rule);

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
			if (z = trim(j > 0 ? rule[x] + ' ' + y : replace(y, /&\f/g, rule[x])))
				props[k++] = z;

	return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length, siblings)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @param {object[]} siblings
 * @return {object}
 */
function comment (value, root, parent, siblings) {
	return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @param {object[]} siblings
 * @return {object}
 */
function declaration (value, root, parent, length, siblings) {
	return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length, siblings)
}

/**
 * @param {string} value
 * @param {number} length
 * @param {object[]} children
 * @return {string}
 */
function prefix (value, length, children) {
	switch (hash(value, length)) {
		// color-adjust
		case 5103:
			return WEBKIT + 'print-' + value + value
		// animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
		case 5737: case 4201: case 3177: case 3433: case 1641: case 4457: case 2921:
		// text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
		case 5572: case 6356: case 5844: case 3191: case 6645: case 3005:
		// mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
		case 6391: case 5879: case 5623: case 6135: case 4599: case 4855:
		// background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
		case 4215: case 6389: case 5109: case 5365: case 5621: case 3829:
			return WEBKIT + value + value
		// tab-size
		case 4789:
			return MOZ + value + value
		// appearance, user-select, transform, hyphens, text-size-adjust
		case 5349: case 4246: case 4810: case 6968: case 2756:
			return WEBKIT + value + MOZ + value + MS + value + value
		// writing-mode
		case 5936:
			switch (charat(value, length + 11)) {
				// vertical-l(r)
				case 114:
					return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb') + value
				// vertical-r(l)
				case 108:
					return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value
				// horizontal(-)tb
				case 45:
					return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'lr') + value
				// default: fallthrough to below
			}
		// flex, flex-direction, scroll-snap-type, writing-mode
		case 6828: case 4268: case 2903:
			return WEBKIT + value + MS + value + value
		// order
		case 6165:
			return WEBKIT + value + MS + 'flex-' + value + value
		// align-items
		case 5187:
			return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + 'box-$1$2' + MS + 'flex-$1$2') + value
		// align-self
		case 5443:
			return WEBKIT + value + MS + 'flex-item-' + replace(value, /flex-|-self/g, '') + (!match(value, /flex-|baseline/) ? MS + 'grid-row-' + replace(value, /flex-|-self/g, '') : '') + value
		// align-content
		case 4675:
			return WEBKIT + value + MS + 'flex-line-pack' + replace(value, /align-content|flex-|-self/g, '') + value
		// flex-shrink
		case 5548:
			return WEBKIT + value + MS + replace(value, 'shrink', 'negative') + value
		// flex-basis
		case 5292:
			return WEBKIT + value + MS + replace(value, 'basis', 'preferred-size') + value
		// flex-grow
		case 6060:
			return WEBKIT + 'box-' + replace(value, '-grow', '') + WEBKIT + value + MS + replace(value, 'grow', 'positive') + value
		// transition
		case 4554:
			return WEBKIT + replace(value, /([^-])(transform)/g, '$1' + WEBKIT + '$2') + value
		// cursor
		case 6187:
			return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + '$1'), /(image-set)/, WEBKIT + '$1'), value, '') + value
		// background, background-image
		case 5495: case 3959:
			return replace(value, /(image-set\([^]*)/, WEBKIT + '$1' + '$`$1')
		// justify-content
		case 4968:
			return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + 'box-pack:$3' + MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + WEBKIT + value + value
		// justify-self
		case 4200:
			if (!match(value, /flex-|baseline/)) return MS + 'grid-column-align' + substr(value, length) + value
			break
		// grid-template-(columns|rows)
		case 2592: case 3360:
			return MS + replace(value, 'template-', '') + value
		// grid-(row|column)-start
		case 4384: case 3616:
			if (children && children.some(function (element, index) { return length = index, match(element.props, /grid-\w+-end/) })) {
				return ~indexof(value + (children = children[length].value), 'span', 0) ? value : (MS + replace(value, '-start', '') + value + MS + 'grid-row-span:' + (~indexof(children, 'span', 0) ? match(children, /\d+/) : +match(children, /\d+/) - +match(value, /\d+/)) + ';')
			}
			return MS + replace(value, '-start', '') + value
		// grid-(row|column)-end
		case 4896: case 4128:
			return (children && children.some(function (element) { return match(element.props, /grid-\w+-start/) })) ? value : MS + replace(replace(value, '-end', '-span'), 'span ', '') + value
		// (margin|padding)-inline-(start|end)
		case 4095: case 3583: case 4068: case 2532:
			return replace(value, /(.+)-inline(.+)/, WEBKIT + '$1$2') + value
		// (min|max)?(width|height|inline-size|block-size)
		case 8116: case 7059: case 5753: case 5535:
		case 5445: case 5701: case 4933: case 4677:
		case 5533: case 5789: case 5021: case 4765:
			// stretch, max-content, min-content, fill-available
			if (strlen(value) - 1 - length > 6)
				switch (charat(value, length + 1)) {
					// (m)ax-content, (m)in-content
					case 109:
						// -
						if (charat(value, length + 4) !== 45)
							break
					// (f)ill-available, (f)it-content
					case 102:
						return replace(value, /(.+:)(.+)-([^]+)/, '$1' + WEBKIT + '$2-$3' + '$1' + MOZ + (charat(value, length + 3) == 108 ? '$3' : '$2-$3')) + value
					// (s)tretch
					case 115:
						return ~indexof(value, 'stretch', 0) ? prefix(replace(value, 'stretch', 'fill-available'), length, children) + value : value
				}
			break
		// grid-(column|row)
		case 5152: case 5920:
			return replace(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function (_, a, b, c, d, e, f) { return (MS + a + ':' + b + f) + (c ? (MS + a + '-span:' + (d ? e : +e - +b)) + f : '') + value })
		// position: sticky
		case 4949:
			// stick(y)?
			if (charat(value, length + 6) === 121)
				return replace(value, ':', ':' + WEBKIT) + value
			break
		// display: (flex|inline-flex|grid|inline-grid)
		case 6444:
			switch (charat(value, charat(value, 14) === 45 ? 18 : 11)) {
				// (inline-)?fle(x)
				case 120:
					return replace(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, '$1' + WEBKIT + (charat(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + WEBKIT + '$2$3' + '$1' + MS + '$2box$3') + value
				// (inline-)?gri(d)
				case 100:
					return replace(value, ':', ':' + MS) + value
			}
			break
		// scroll-margin, scroll-margin-(top|right|bottom|left)
		case 5719: case 2647: case 2135: case 3927: case 2391:
			return replace(value, 'scroll-', 'scroll-snap-') + value
	}

	return value
}

/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = '';

	for (var i = 0; i < children.length; i++)
		output += callback(children[i], i, children, callback) || '';

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case LAYER: if (element.children.length) break
		case IMPORT: case DECLARATION: return element.return = element.return || element.value
		case COMMENT: return ''
		case KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case RULESET: if (!strlen(element.value = element.props.join(','))) return ''
	}

	return strlen(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}

/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = sizeof(collection);

	return function (element, index, children, callback) {
		var output = '';

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || '';

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element);
	}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer (element, index, children, callback) {
	if (element.length > -1)
		if (!element.return)
			switch (element.type) {
				case DECLARATION: element.return = prefix(element.value, element.length, children);
					return
				case KEYFRAMES:
					return serialize([copy(element, {value: replace(element.value, '@', '@' + WEBKIT)})], callback)
				case RULESET:
					if (element.length)
						return combine(children = element.props, function (value) {
							switch (match(value, callback = /(::plac\w+|:read-\w+)/)) {
								// :read-(only|write)
								case ':read-only': case ':read-write':
									lift(copy(element, {props: [replace(value, /:(read-\w+)/, ':' + MOZ + '$1')]}));
									lift(copy(element, {props: [value]}));
									assign(element, {props: filter(children, callback)});
									break
								// :placeholder
								case '::placeholder':
									lift(copy(element, {props: [replace(value, /:(plac\w+)/, ':' + WEBKIT + 'input-$1')]}));
									lift(copy(element, {props: [replace(value, /:(plac\w+)/, ':' + MOZ + '$1')]}));
									lift(copy(element, {props: [replace(value, /:(plac\w+)/, MS + 'input-$1')]}));
									lift(copy(element, {props: [value]}));
									assign(element, {props: filter(children, callback)});
									break
							}

							return ''
						})
			}
}

var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

var f="undefined"!=typeof process&&void 0!==process.env&&(process.env.REACT_APP_SC_ATTR||process.env.SC_ATTR)||"data-styled",m="active",y="data-styled-version",v="6.1.13",g="/*!sc*/\n",S="undefined"!=typeof window&&"HTMLElement"in window,w=Boolean("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==process.env&&void 0!==process.env.REACT_APP_SC_DISABLE_SPEEDY&&""!==process.env.REACT_APP_SC_DISABLE_SPEEDY?"false"!==process.env.REACT_APP_SC_DISABLE_SPEEDY&&process.env.REACT_APP_SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==process.env&&void 0!==process.env.SC_DISABLE_SPEEDY&&""!==process.env.SC_DISABLE_SPEEDY?"false"!==process.env.SC_DISABLE_SPEEDY&&process.env.SC_DISABLE_SPEEDY:"production"!=="production"),_=Object.freeze([]),C=Object.freeze({});function I(e,t,n){return void 0===n&&(n=C),e.theme!==n.theme&&e.theme||t||n.theme}var A=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),O=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,D=/(^-|-$)/g;function R(e){return e.replace(O,"-").replace(D,"")}var T=/(a)(d)/gi,k=52,j=function(e){return String.fromCharCode(e+(e>25?39:97))};function x(e){var t,n="";for(t=Math.abs(e);t>k;t=t/k|0)n=j(t%k)+n;return (j(t%k)+n).replace(T,"$1-$2")}var V,F=5381,M=function(e,t){for(var n=t.length;n;)e=33*e^t.charCodeAt(--n);return e},z=function(e){return M(F,e)};function $(e){return x(z(e)>>>0)}function B(e){return e.displayName||e.name||"Component"}function L(e){return "string"==typeof e&&("production"==="production")}var G="function"==typeof Symbol&&Symbol.for,Y=G?Symbol.for("react.memo"):60115,W=G?Symbol.for("react.forward_ref"):60112,q={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},H={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},U={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},J=((V={})[W]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},V[Y]=U,V);function X(e){return ("type"in(t=e)&&t.type.$$typeof)===Y?U:"$$typeof"in e?J[e.$$typeof]:q;var t;}var Z=Object.defineProperty,K=Object.getOwnPropertyNames,Q=Object.getOwnPropertySymbols,ee=Object.getOwnPropertyDescriptor,te=Object.getPrototypeOf,ne=Object.prototype;function oe(e,t,n){if("string"!=typeof t){if(ne){var o=te(t);o&&o!==ne&&oe(e,o,n);}var r=K(t);Q&&(r=r.concat(Q(t)));for(var s=X(e),i=X(t),a=0;a<r.length;++a){var c=r[a];if(!(c in H||n&&n[c]||i&&c in i||s&&c in s)){var l=ee(t,c);try{Z(e,c,l);}catch(e){}}}}return e}function re(e){return "function"==typeof e}function se(e){return "object"==typeof e&&"styledComponentId"in e}function ie(e,t){return e&&t?"".concat(e," ").concat(t):e||t||""}function ae(e,t){if(0===e.length)return "";for(var n=e[0],o=1;o<e.length;o++)n+=e[o];return n}function ce(e){return null!==e&&"object"==typeof e&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function le(e,t,n){if(void 0===n&&(n=!1),!n&&!ce(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(var o=0;o<t.length;o++)e[o]=le(e[o],t[o]);else if(ce(t))for(var o in t)e[o]=le(e[o],t[o]);return e}function ue(e,t){Object.defineProperty(e,"toString",{value:t});}function he(t){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(t," for more information.").concat(n.length>0?" Args: ".concat(n.join(", ")):""))}var fe=function(){function e(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e;}return e.prototype.indexOfGroup=function(e){for(var t=0,n=0;n<e;n++)t+=this.groupSizes[n];return t},e.prototype.insertRules=function(e,t){if(e>=this.groupSizes.length){for(var n=this.groupSizes,o=n.length,r=o;e>=r;)if((r<<=1)<0)throw he(16,"".concat(e));this.groupSizes=new Uint32Array(r),this.groupSizes.set(n),this.length=r;for(var s=o;s<r;s++)this.groupSizes[s]=0;}for(var i=this.indexOfGroup(e+1),a=(s=0,t.length);s<a;s++)this.tag.insertRule(i,t[s])&&(this.groupSizes[e]++,i++);},e.prototype.clearGroup=function(e){if(e<this.length){var t=this.groupSizes[e],n=this.indexOfGroup(e),o=n+t;this.groupSizes[e]=0;for(var r=n;r<o;r++)this.tag.deleteRule(n);}},e.prototype.getGroup=function(e){var t="";if(e>=this.length||0===this.groupSizes[e])return t;for(var n=this.groupSizes[e],o=this.indexOfGroup(e),r=o+n,s=o;s<r;s++)t+="".concat(this.tag.getRule(s)).concat(g);return t},e}(),ye=new Map,ve=new Map,ge=1,Se=function(e){if(ye.has(e))return ye.get(e);for(;ve.has(ge);)ge++;var t=ge++;return ye.set(e,t),ve.set(t,e),t},we=function(e,t){ge=t+1,ye.set(e,t),ve.set(t,e);},be="style[".concat(f,"][").concat(y,'="').concat(v,'"]'),Ee=new RegExp("^".concat(f,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),Ne=function(e,t,n){for(var o,r=n.split(","),s=0,i=r.length;s<i;s++)(o=r[s])&&e.registerName(t,o);},Pe=function(e,t){for(var n,o=(null!==(n=t.textContent)&&void 0!==n?n:"").split(g),r=[],s=0,i=o.length;s<i;s++){var a=o[s].trim();if(a){var c=a.match(Ee);if(c){var l=0|parseInt(c[1],10),u=c[2];0!==l&&(we(u,l),Ne(e,u,c[3]),e.getTag().insertRules(l,r)),r.length=0;}else r.push(a);}}},_e=function(e){for(var t=document.querySelectorAll(be),n=0,o=t.length;n<o;n++){var r=t[n];r&&r.getAttribute(f)!==m&&(Pe(e,r),r.parentNode&&r.parentNode.removeChild(r));}};function Ce(){return "undefined"!=typeof __webpack_nonce__?__webpack_nonce__:null}var Ie=function(e){var t=document.head,n=e||t,o=document.createElement("style"),r=function(e){var t=Array.from(e.querySelectorAll("style[".concat(f,"]")));return t[t.length-1]}(n),s=void 0!==r?r.nextSibling:null;o.setAttribute(f,m),o.setAttribute(y,v);var i=Ce();return i&&o.setAttribute("nonce",i),n.insertBefore(o,s),o},Ae=function(){function e(e){this.element=Ie(e),this.element.appendChild(document.createTextNode("")),this.sheet=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets,n=0,o=t.length;n<o;n++){var r=t[n];if(r.ownerNode===e)return r}throw he(17)}(this.element),this.length=0;}return e.prototype.insertRule=function(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return !1}},e.prototype.deleteRule=function(e){this.sheet.deleteRule(e),this.length--;},e.prototype.getRule=function(e){var t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:""},e}(),Oe=function(){function e(e){this.element=Ie(e),this.nodes=this.element.childNodes,this.length=0;}return e.prototype.insertRule=function(e,t){if(e<=this.length&&e>=0){var n=document.createTextNode(t);return this.element.insertBefore(n,this.nodes[e]||null),this.length++,!0}return !1},e.prototype.deleteRule=function(e){this.element.removeChild(this.nodes[e]),this.length--;},e.prototype.getRule=function(e){return e<this.length?this.nodes[e].textContent:""},e}(),De=function(){function e(e){this.rules=[],this.length=0;}return e.prototype.insertRule=function(e,t){return e<=this.length&&(this.rules.splice(e,0,t),this.length++,!0)},e.prototype.deleteRule=function(e){this.rules.splice(e,1),this.length--;},e.prototype.getRule=function(e){return e<this.length?this.rules[e]:""},e}(),Re=S,Te={isServer:!S,useCSSOMInjection:!w},ke=function(){function e(e,n,o){void 0===e&&(e=C),void 0===n&&(n={});var r=this;this.options=__assign(__assign({},Te),e),this.gs=n,this.names=new Map(o),this.server=!!e.isServer,!this.server&&S&&Re&&(Re=!1,_e(this)),ue(this,function(){return function(e){for(var t=e.getTag(),n=t.length,o="",r=function(n){var r=function(e){return ve.get(e)}(n);if(void 0===r)return "continue";var s=e.names.get(r),i=t.getGroup(n);if(void 0===s||!s.size||0===i.length)return "continue";var a="".concat(f,".g").concat(n,'[id="').concat(r,'"]'),c="";void 0!==s&&s.forEach(function(e){e.length>0&&(c+="".concat(e,","));}),o+="".concat(i).concat(a,'{content:"').concat(c,'"}').concat(g);},s=0;s<n;s++)r(s);return o}(r)});}return e.registerId=function(e){return Se(e)},e.prototype.rehydrate=function(){!this.server&&S&&_e(this);},e.prototype.reconstructWithOptions=function(n,o){return void 0===o&&(o=!0),new e(__assign(__assign({},this.options),n),this.gs,o&&this.names||void 0)},e.prototype.allocateGSInstance=function(e){return this.gs[e]=(this.gs[e]||0)+1},e.prototype.getTag=function(){return this.tag||(this.tag=(e=function(e){var t=e.useCSSOMInjection,n=e.target;return e.isServer?new De(n):t?new Ae(n):new Oe(n)}(this.options),new fe(e)));var e;},e.prototype.hasNameForId=function(e,t){return this.names.has(e)&&this.names.get(e).has(t)},e.prototype.registerName=function(e,t){if(Se(e),this.names.has(e))this.names.get(e).add(t);else {var n=new Set;n.add(t),this.names.set(e,n);}},e.prototype.insertRules=function(e,t,n){this.registerName(e,t),this.getTag().insertRules(Se(e),n);},e.prototype.clearNames=function(e){this.names.has(e)&&this.names.get(e).clear();},e.prototype.clearRules=function(e){this.getTag().clearGroup(Se(e)),this.clearNames(e);},e.prototype.clearTag=function(){this.tag=void 0;},e}(),je=/&/g,xe=/^\s*\/\/.*$/gm;function Ve(e,t){return e.map(function(e){return "rule"===e.type&&(e.value="".concat(t," ").concat(e.value),e.value=e.value.replaceAll(",",",".concat(t," ")),e.props=e.props.map(function(e){return "".concat(t," ").concat(e)})),Array.isArray(e.children)&&"@keyframes"!==e.type&&(e.children=Ve(e.children,t)),e})}function Fe(e){var t,n,o,r=C,s=r.options,i=void 0===s?C:s,a=r.plugins,c=void 0===a?_:a,l=function(e,o,r){return r.startsWith(n)&&r.endsWith(n)&&r.replaceAll(n,"").length>0?".".concat(t):e},u=c.slice();u.push(function(e){e.type===RULESET&&e.value.includes("&")&&(e.props[0]=e.props[0].replace(je,n).replace(o,l));}),i.prefix&&u.push(prefixer),u.push(stringify);var p=function(e,r,s,a){void 0===r&&(r=""),void 0===s&&(s=""),void 0===a&&(a="&"),t=a,n=r,o=new RegExp("\\".concat(n,"\\b"),"g");var c=e.replace(xe,""),l=compile(s||r?"".concat(s," ").concat(r," { ").concat(c," }"):c);i.namespace&&(l=Ve(l,i.namespace));var p=[];return serialize(l,middleware(u.concat(rulesheet(function(e){return p.push(e)})))),p};return p.hash=c.length?c.reduce(function(e,t){return t.name||he(15),M(e,t.name)},F).toString():"",p}var Me=new ke,ze=Fe(),$e=xn.createContext({shouldForwardProp:void 0,styleSheet:Me,stylis:ze});$e.Consumer;xn.createContext(void 0);function Ge(){return x$2($e)}var We=function(){function e(e,t){var n=this;this.inject=function(e,t){void 0===t&&(t=ze);var o=n.name+t.hash;e.hasNameForId(n.id,o)||e.insertRules(n.id,o,t(n.rules,o,"@keyframes"));},this.name=e,this.id="sc-keyframes-".concat(e),this.rules=t,ue(this,function(){throw he(12,String(n.name))});}return e.prototype.getName=function(e){return void 0===e&&(e=ze),this.name+e.hash},e}(),qe=function(e){return e>="A"&&e<="Z"};function He(e){for(var t="",n=0;n<e.length;n++){var o=e[n];if(1===n&&"-"===o&&"-"===e[0])return e;qe(o)?t+="-"+o.toLowerCase():t+=o;}return t.startsWith("ms-")?"-"+t:t}var Ue=function(e){return null==e||!1===e||""===e},Je=function(t){var n,o,r=[];for(var s in t){var i=t[s];t.hasOwnProperty(s)&&!Ue(i)&&(Array.isArray(i)&&i.isCss||re(i)?r.push("".concat(He(s),":"),i,";"):ce(i)?r.push.apply(r,__spreadArray(__spreadArray(["".concat(s," {")],Je(i),!1),["}"],!1)):r.push("".concat(He(s),": ").concat((n=s,null==(o=i)||"boolean"==typeof o||""===o?"":"number"!=typeof o||0===o||n in unitlessKeys||n.startsWith("--")?String(o).trim():"".concat(o,"px")),";")));}return r};function Xe(e,t,n,o){if(Ue(e))return [];if(se(e))return [".".concat(e.styledComponentId)];if(re(e)){if(!re(s=e)||s.prototype&&s.prototype.isReactComponent||!t)return [e];var r=e(t);return Xe(r,t,n,o)}var s;return e instanceof We?n?(e.inject(n,o),[e.getName(o)]):[e]:ce(e)?Je(e):Array.isArray(e)?Array.prototype.concat.apply(_,e.map(function(e){return Xe(e,t,n,o)})):[e.toString()]}function Ze(e){for(var t=0;t<e.length;t+=1){var n=e[t];if(re(n)&&!se(n))return !1}return !0}var Ke=z(v),Qe=function(){function e(e,t,n){this.rules=e,this.staticRulesId="",this.isStatic=(void 0===n||n.isStatic)&&Ze(e),this.componentId=t,this.baseHash=M(Ke,t),this.baseStyle=n,ke.registerId(t);}return e.prototype.generateAndInjectStyles=function(e,t,n){var o=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,n):"";if(this.isStatic&&!n.hash)if(this.staticRulesId&&t.hasNameForId(this.componentId,this.staticRulesId))o=ie(o,this.staticRulesId);else {var r=ae(Xe(this.rules,e,t,n)),s=x(M(this.baseHash,r)>>>0);if(!t.hasNameForId(this.componentId,s)){var i=n(r,".".concat(s),void 0,this.componentId);t.insertRules(this.componentId,s,i);}o=ie(o,s),this.staticRulesId=s;}else {for(var a=M(this.baseHash,n.hash),c="",l=0;l<this.rules.length;l++){var u=this.rules[l];if("string"==typeof u)c+=u;else if(u){var p=ae(Xe(u,e,t,n));a=M(a,p+l),c+=p;}}if(c){var d=x(a>>>0);t.hasNameForId(this.componentId,d)||t.insertRules(this.componentId,d,n(c,".".concat(d),void 0,this.componentId)),o=ie(o,d);}}return o},e}(),et=xn.createContext(void 0);et.Consumer;var rt={},st=new Set;function it(e,r,s){var i=se(e),a=e,c=!L(e),p=r.attrs,d=void 0===p?_:p,h=r.componentId,f=void 0===h?function(e,t){var n="string"!=typeof e?"sc":R(e);rt[n]=(rt[n]||0)+1;var o="".concat(n,"-").concat($(v+n+rt[n]));return t?"".concat(t,"-").concat(o):o}(r.displayName,r.parentComponentId):h,m=r.displayName,y=void 0===m?function(e){return L(e)?"styled.".concat(e):"Styled(".concat(B(e),")")}(e):m,g=r.displayName&&r.componentId?"".concat(R(r.displayName),"-").concat(r.componentId):r.componentId||f,S=i&&a.attrs?a.attrs.concat(d).filter(Boolean):d,w=r.shouldForwardProp;if(i&&a.shouldForwardProp){var b=a.shouldForwardProp;if(r.shouldForwardProp){var E=r.shouldForwardProp;w=function(e,t){return b(e,t)&&E(e,t)};}else w=b;}var N=new Qe(s,g,i?a.componentStyle:void 0);function O(e,r){return function(e,r,s){var i=e.attrs,a=e.componentStyle,c=e.defaultProps,p=e.foldedComponentIds,d=e.styledComponentId,h=e.target,f=xn.useContext(et),m=Ge(),y=e.shouldForwardProp||m.shouldForwardProp;var v=I(r,f,c)||C,g=function(e,n,o){for(var r,s=__assign(__assign({},n),{className:void 0,theme:o}),i=0;i<e.length;i+=1){var a=re(r=e[i])?r(s):r;for(var c in a)s[c]="className"===c?ie(s[c],a[c]):"style"===c?__assign(__assign({},s[c]),a[c]):a[c];}return n.className&&(s.className=ie(s.className,n.className)),s}(i,r,v),S=g.as||h,w={};for(var b in g)void 0===g[b]||"$"===b[0]||"as"===b||"theme"===b&&g.theme===v||("forwardedAs"===b?w.as=g.forwardedAs:y&&!y(b,S)||(w[b]=g[b],y||"development"!=="production"||isPropValid(b)||st.has(b)||!A.has(S)||(st.add(b),console.warn('styled-components: it looks like an unknown prop "'.concat(b,'" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.)')))));var E=function(e,t){var n=Ge(),o=e.generateAndInjectStyles(t,n.styleSheet,n.stylis);return o}(a,g);var N=ie(p,d);return E&&(N+=" "+E),g.className&&(N+=" "+g.className),w[L(S)&&!A.has(S)?"class":"className"]=N,w.ref=s,_$2(S,w)}(D,e,r)}O.displayName=y;var D=xn.forwardRef(O);return D.attrs=S,D.componentStyle=N,D.displayName=y,D.shouldForwardProp=w,D.foldedComponentIds=i?ie(a.foldedComponentIds,a.styledComponentId):"",D.styledComponentId=g,D.target=i?a.target:e,Object.defineProperty(D,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(e){this._foldedDefaultProps=i?function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];for(var o=0,r=t;o<r.length;o++)le(e,r[o],!0);return e}({},a.defaultProps,e):e;}}),ue(D,function(){return ".".concat(D.styledComponentId)}),c&&oe(D,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),D}function at(e,t){for(var n=[e[0]],o=0,r=t.length;o<r;o+=1)n.push(t[o],e[o+1]);return n}var ct=function(e){return Object.assign(e,{isCss:!0})};function lt(t){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];if(re(t)||ce(t))return ct(Xe(at(_,__spreadArray([t],n,!0))));var r=t;return 0===n.length&&1===r.length&&"string"==typeof r[0]?Xe(r):ct(Xe(at(r,n)))}function ut(n,o,r){if(void 0===r&&(r=C),!o)throw he(1,o);var s=function(t){for(var s=[],i=1;i<arguments.length;i++)s[i-1]=arguments[i];return n(o,r,lt.apply(void 0,__spreadArray([t],s,!1)))};return s.attrs=function(e){return ut(n,o,__assign(__assign({},r),{attrs:Array.prototype.concat(r.attrs,e).filter(Boolean)}))},s.withConfig=function(e){return ut(n,o,__assign(__assign({},r),e))},s}var pt=function(e){return ut(it,e)},dt=pt;A.forEach(function(e){dt[e]=pt(e);});

const SettingWrapper = dt.div `
    border-bottom: ${(props) => props.noBorder ? 'none' : '1px solid var(--color-base-30)'};

    &:last-child {
        border-bottom: none;
    }
`;

function isPrioritizedElement(element) {
    return undefined !== element.priority;
}
const ReactObsidianSetting = ({ name, desc, setHeading, setDisabled, setTooltip, noBorder, class: className, addToggles, addTexts, addTextAreas, addMomentFormats, addDropdowns, addSearches, addButtons, addExtraButtons, addSliders, addColorPickers, addProgressBars, addMultiDesc, setupSettingManually, }) => {
    const settingRef = xn.useRef();
    const containerRef = xn.useRef(null);
    const setupSetting = q$2((setting) => {
        if (setupSettingManually) {
            setupSettingManually(setting);
        }
        if (name) {
            setting.setName(name);
        }
        if (desc) {
            setting.setDesc(desc);
        }
        if (setTooltip) {
            setting.setTooltip(setTooltip);
        }
        if (addMultiDesc) {
            const callback = isPrioritizedElement(addMultiDesc)
                ? addMultiDesc.callback
                : addMultiDesc;
            const descContainer = document.createElement('div');
            descContainer.addClass('setting-item-description');
            if (setting.infoEl) {
                setting.infoEl.appendChild(descContainer);
            }
            const multiDesc = new MultiDescComponent({
                containerEl: descContainer,
            });
            callback(multiDesc);
        }
        if (setHeading) {
            setting.setHeading();
        }
        if (className) {
            setting.setClass(className);
        }
        const elements = [
            ...(addToggles?.map((toggle, index) => ({
                type: 'toggle',
                callback: isPrioritizedElement(toggle)
                    ? toggle.callback
                    : toggle,
                priority: isPrioritizedElement(toggle)
                    ? toggle.priority
                    : 0,
                originalIndex: index,
            })) ?? []),
            ...(addTexts?.map((text, index) => ({
                type: 'text',
                callback: isPrioritizedElement(text) ? text.callback : text,
                priority: isPrioritizedElement(text) ? text.priority : 0,
                originalIndex: index,
            })) ?? []),
            ...(addTextAreas?.map((textArea, index) => ({
                type: 'textArea',
                callback: isPrioritizedElement(textArea)
                    ? textArea.callback
                    : textArea,
                priority: isPrioritizedElement(textArea)
                    ? textArea.priority
                    : 0,
                originalIndex: index,
            })) ?? []),
            ...(addMomentFormats?.map((format, index) => ({
                type: 'momentFormat',
                callback: isPrioritizedElement(format)
                    ? format.callback
                    : format,
                priority: isPrioritizedElement(format)
                    ? format.priority
                    : 0,
                originalIndex: index,
            })) ?? []),
            ...(addDropdowns?.map((dropdown, index) => ({
                type: 'dropdown',
                callback: isPrioritizedElement(dropdown)
                    ? dropdown.callback
                    : dropdown,
                priority: isPrioritizedElement(dropdown)
                    ? dropdown.priority
                    : 0,
                originalIndex: index,
            })) ?? []),
            ...(addSearches?.map((search, index) => ({
                type: 'search',
                callback: isPrioritizedElement(search)
                    ? search.callback
                    : search,
                priority: isPrioritizedElement(search)
                    ? search.priority
                    : 0,
                originalIndex: index,
            })) ?? []),
            ...(addColorPickers?.map((colorPicker, index) => ({
                type: 'colorPicker',
                callback: isPrioritizedElement(colorPicker)
                    ? colorPicker.callback
                    : colorPicker,
                priority: isPrioritizedElement(colorPicker)
                    ? colorPicker.priority
                    : 0,
                originalIndex: index,
            })) ?? []),
            ...(addProgressBars?.map((progressBar, index) => ({
                type: 'progressBar',
                callback: isPrioritizedElement(progressBar)
                    ? progressBar.callback
                    : progressBar,
                priority: isPrioritizedElement(progressBar)
                    ? progressBar.priority
                    : 0,
                originalIndex: index,
            })) ?? []),
            ...(addButtons?.map((button, index) => ({
                type: 'button',
                callback: isPrioritizedElement(button)
                    ? button.callback
                    : button,
                priority: isPrioritizedElement(button)
                    ? button.priority
                    : 9,
                originalIndex: index,
            })) ?? []),
            ...(addExtraButtons?.map((button, index) => ({
                type: 'extraButton',
                callback: isPrioritizedElement(button)
                    ? button.callback
                    : button,
                priority: isPrioritizedElement(button)
                    ? button.priority
                    : 10,
                originalIndex: index,
            })) ?? []),
            ...(addSliders?.map((slider, index) => ({
                type: 'slider',
                callback: isPrioritizedElement(slider)
                    ? slider.callback
                    : slider,
                priority: isPrioritizedElement(slider)
                    ? slider.priority
                    : 0,
                originalIndex: index,
            })) ?? []),
        ].filter((element) => element.callback !== undefined && element.callback !== false);
        const sortedElements = elements.sort((a, b) => {
            if (a.priority === b.priority) {
                return a.originalIndex - b.originalIndex;
            }
            return a.priority - b.priority;
        });
        sortedElements.forEach((element) => {
            switch (element.type) {
                case 'toggle':
                    setting.addToggle(element.callback);
                    break;
                case 'text':
                    setting.addText(element.callback);
                    break;
                case 'textArea':
                    setting.addTextArea(element.callback);
                    break;
                case 'momentFormat':
                    setting.addMomentFormat(element.callback);
                    break;
                case 'dropdown':
                    setting.addDropdown(element.callback);
                    break;
                case 'search':
                    setting.addSearch(element.callback);
                    break;
                case 'colorPicker':
                    setting.addColorPicker(element.callback);
                    break;
                case 'progressBar':
                    setting.addProgressBar(element.callback);
                    break;
                case 'button':
                    setting.addButton(element.callback);
                    break;
                case 'extraButton':
                    setting.addExtraButton(element.callback);
                    break;
                case 'slider':
                    setting.addSlider(element.callback);
                    break;
            }
        });
        setting.setDisabled(!!setDisabled);
    }, [
        name,
        desc,
        setHeading,
        setDisabled,
        setTooltip,
        className,
        addToggles,
        addTexts,
        addTextAreas,
        addMomentFormats,
        addDropdowns,
        addSearches,
        addButtons,
        addExtraButtons,
        addSliders,
        addColorPickers,
        addProgressBars,
        addMultiDesc,
        setupSettingManually,
    ]);
    _$1(() => {
        if (!containerRef.current) {
            return;
        }
        containerRef.current.empty();
        settingRef.current = new obsidian.Setting(containerRef.current);
        setupSetting(settingRef.current);
        return () => {
            containerRef.current?.empty();
        };
    }, [[
            name,
            desc,
            setHeading,
            setDisabled,
            setTooltip,
            noBorder,
            className,
            addToggles,
            addTexts,
            addTextAreas,
            addMomentFormats,
            addDropdowns,
            addSearches,
            addButtons,
            addExtraButtons,
            addSliders,
            addColorPickers,
            addProgressBars,
            addMultiDesc,
            setupSettingManually
        ]]);
    return (xn.createElement(SettingWrapper, { noBorder: noBorder, ref: containerRef, className: `react-obsidian-settings-item ${className ?? ''}` }));
};

/**
 * The About component renders settings options for visiting the GitHub page and
 * providing feedback for the plugin. It also displays the current version and license
 * information.
 *
 * @returns A React fragment containing settings buttons and version information.
 */
const About = () => {
    const { plugin } = useSettingsContext();
    return (xn.createElement(xn.Fragment, null,
        xn.createElement(ReactObsidianSetting, { name: 'Visit GitHub page of this plugin', addButtons: [
                (button) => {
                    button.setIcon('github');
                    button.setTooltip('Go to GitHub page of this plugin');
                    button.onClick((cb) => {
                        open('https://github.com/gitcpy/diagram-zoom-drag/', undefined);
                    });
                    return button;
                },
            ] }),
        xn.createElement(ReactObsidianSetting, { name: 'Do you have any feedback?', addButtons: [
                (button) => {
                    button.setIcon('message-circle-question');
                    button.setTooltip('Leave feedback');
                    button.onClick(() => {
                        open('https://github.com/gitcpy/diagram-zoom-drag/issues', undefined);
                    });
                    return button;
                },
            ] }),
        xn.createElement("div", { style: {
                position: 'absolute',
                bottom: 10,
                left: '50%',
            } },
            xn.createElement("div", { style: {
                    fontSize: 'small',
                    color: 'gray',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                } },
                xn.createElement("div", null,
                    "Current version: ",
                    plugin.manifest.version),
                xn.createElement("div", null,
                    "\u2022",
                    ' ',
                    xn.createElement("a", { href: "https://github.com/gitcpy/diagram-zoom-drag/blob/main/LICENSE", target: "_blank" }, "MIT License"))))));
};

var ComponentType;
(function (ComponentType) {
    ComponentType["Collapsed"] = "collapsed";
    ComponentType["Expanded"] = "expanded";
})(ComponentType || (ComponentType = {}));

/**
 * A React component that renders two settings for the diagram size:
 * one for the expanded diagram and one for the collapsed diagram.
 *
 * It uses the `ReactObsidianSetting` component to render a setting with a
 * heading and two input fields for the width and height of the diagram.
 *
 * The component also handles the saving of the new values to the plugin
 * settings and updates the CSS properties.
 *
 * @returns The React component for the diagram size settings.
 */
const DiagramSizes = () => {
    const { plugin } = useSettingsContext();
    const [expandedHeight, setExpandedHeight] = h(plugin.settings.diagramExpandedHeight);
    const [expandedWidth, setExpandedWidth] = h(plugin.settings.diagramExpandedWidth);
    const [collapsedHeight, setCollapsedHeight] = h(plugin.settings.diagramCollapsedHeight);
    const [collapsedWidth, setCollapsedWidth] = h(plugin.settings.diagramCollapsedWidth);
    const [applySuitableSize, setApplySuitableSize] = h(plugin.settings.applySuitableSize);
    const isDimensionInValidRange = (dimension) => {
        const n = parseInt(dimension, 10);
        return n >= 100 && n <= 1000;
    };
    const isValidNumber = (dimension) => dimension.match(/^\d+$/);
    const createSettingInputs = (componentType) => {
        const prefix = componentType === ComponentType.Collapsed
            ? 'Collapsed'
            : 'Expanded';
        const height = componentType === ComponentType.Collapsed
            ? collapsedHeight
            : expandedHeight;
        const width = componentType === ComponentType.Collapsed
            ? collapsedWidth
            : expandedWidth;
        return (xn.createElement(ReactObsidianSetting, { name: `${prefix} diagram container size`, addMultiDesc: (multiDesc) => {
                multiDesc.addDescriptions([
                    `Set the container dimensions for ${prefix.toLowerCase()} state in pixels.`,
                    'Click Save button to apply changes.',
                ]);
                return multiDesc;
            }, addTexts: [
                (inputHeight) => {
                    inputHeight.setValue(height.toString());
                    inputHeight.inputEl.id = `input${prefix.toLowerCase()}Height`;
                    inputHeight.inputEl.type = 'number';
                    inputHeight.inputEl.min = '100';
                    inputHeight.inputEl.max = '1000';
                    inputHeight.inputEl.ariaLabel = `${prefix} height in pixels`;
                    inputHeight.inputEl.onblur = () => {
                        if (!isValidNumber(inputHeight.inputEl.value)) {
                            plugin.showNotice('Please enter valid number');
                            return;
                        }
                        if (!isDimensionInValidRange(inputHeight.inputEl.value)) {
                            plugin.showNotice('Invalid range. Please enter number in range 100-1000px');
                        }
                    };
                    return inputHeight;
                },
                (inputWidth) => {
                    inputWidth.setValue(width.toString());
                    inputWidth.inputEl.id = `input${prefix.toLowerCase()}Width`;
                    inputWidth.inputEl.type = 'number';
                    inputWidth.inputEl.min = '100';
                    inputWidth.inputEl.max = '1000';
                    inputWidth.inputEl.ariaLabel = `${prefix} width in pixels`;
                    inputWidth.inputEl.onblur = () => {
                        if (!isValidNumber(inputWidth.inputEl.value)) {
                            plugin.showNotice('Please enter valid number');
                            return;
                        }
                        if (!isDimensionInValidRange(inputWidth.inputEl.value)) {
                            plugin.showNotice('Invalid range. Please enter number in range 100-1000px');
                        }
                    };
                    return inputWidth;
                },
            ], addButtons: [
                (button) => {
                    button.setIcon('save');
                    button.onClick(async (cb) => {
                        const inputWidth = document.querySelector(`#input${prefix.toLowerCase()}Width`);
                        const inputHeight = document.querySelector(`#input${prefix.toLowerCase()}Height`);
                        if (!inputWidth || !inputHeight) {
                            return;
                        }
                        if (!isValidNumber(inputWidth.value) ||
                            !isValidNumber(inputHeight.value)) {
                            plugin.showNotice('Please enter valid numbers');
                            return;
                        }
                        if (!isDimensionInValidRange(inputWidth.value) ||
                            !isDimensionInValidRange(inputHeight.value)) {
                            plugin.showNotice('Invalid range. Please enter number in range 100-1000px');
                            return;
                        }
                        const width = parseInt(inputWidth.value, 10);
                        const height = parseInt(inputHeight.value, 10);
                        if (componentType === ComponentType.Collapsed) {
                            setCollapsedWidth(width);
                            setCollapsedHeight(height);
                            plugin.settings.diagramCollapsedHeight = height;
                            plugin.settings.diagramCollapsedWidth = width;
                        }
                        else {
                            setExpandedWidth(width);
                            setExpandedHeight(height);
                            plugin.settings.diagramExpandedHeight = height;
                            plugin.settings.diagramExpandedWidth = width;
                        }
                        await plugin.settingsManager.saveSettings();
                        plugin.updateCssProperties();
                        plugin.showNotice('Saved successfully');
                    });
                    return button;
                },
            ], noBorder: true, setDisabled: applySuitableSize, setTooltip: applySuitableSize
                ? "Diagram size settings are disabled because 'Apply suitable size' is enabled"
                : undefined }));
    };
    return (xn.createElement(xn.Fragment, null,
        xn.createElement(ReactObsidianSetting, { name: 'Diagram Size', setHeading: true }),
        xn.createElement(ReactObsidianSetting, { name: 'Apply suitable size for diagram?', addToggles: [
                (toggle) => {
                    toggle.setValue(plugin.settings.applySuitableSize);
                    toggle.onChange(async (value) => {
                        toggle.setValue(value);
                        plugin.settings.applySuitableSize = value;
                        setApplySuitableSize(value);
                        await plugin.settingsManager.saveSettings();
                        plugin.settings = { ...plugin.settings };
                    });
                    return toggle;
                },
            ], addMultiDesc: (multidesc) => {
                multidesc.addDescriptions([
                    'The size of the chart itself will be used as the container size.',
                    'Note that this setting will override the size settings of the chart itself.',
                ]);
                return multidesc;
            } }),
        createSettingInputs(ComponentType.Expanded),
        createSettingInputs(ComponentType.Collapsed)));
};

/**
 * A React component that renders a settings page for diagrams.
 *
 * This component uses `ReactObsidianSetting` to create toggles for collapsing
 * diagrams by default and for automatically collapsing diagrams on focus change.
 *
 * It also renders a component for setting the size of the diagram.
 *
 * @returns A React element for the settings page.
 */
const DiagramsSettings = () => {
    const { plugin } = useSettingsContext();
    return (xn.createElement(xn.Fragment, null,
        xn.createElement(ReactObsidianSetting, { name: 'Collapse diagram', setHeading: true }),
        xn.createElement(ReactObsidianSetting, { name: "Collapse diagrams by default?", addToggles: [
                (toggle) => {
                    toggle
                        .setValue(plugin.settings.collapseByDefault)
                        .onChange(async (value) => {
                        plugin.settings.collapseByDefault = value;
                        await plugin.settingsManager.saveSettings();
                    });
                    return toggle;
                },
            ] }),
        xn.createElement(ReactObsidianSetting, { name: "Automatically collapse diagrams on focus change?", addToggles: [
                (toggle) => {
                    toggle
                        .setValue(plugin.settings.automaticCollapsingOnFocusChange)
                        .onChange(async (value) => {
                        plugin.settings.automaticCollapsingOnFocusChange =
                            value;
                        await plugin.settingsManager.saveSettings();
                    });
                    return toggle;
                },
            ] }),
        xn.createElement(DiagramSizes, null)));
};

/**
 * The Application component renders the user guide content, including a video
 * tutorial and instructions on how to use the plugin.
 *
 * This component is part of the UserGuide modal and utilizes
 * `ReactObsidianSetting` to display information and instructions about the
 * plugin's functionality.
 *
 * It handles loading the user guide video from the plugin's assets directory
 * and displays it within the component. It also provides step-by-step
 * instructions for finding CSS selectors for diagrams using DevTools.
 *
 * @param {Object} props - The component props.
 * @param {UserGuide} props.modal - The modal instance of the user guide.
 *
 * @returns {JSX.Element} The rendered JSX element for the user guide.
 */
const Application$1 = ({ modal }) => {
    const pluginPath = modal.plugin.manifest.dir;
    const [isLoading, setIsLoading] = h(true);
    const [videoUrl, setVideoUrl] = h('');
    const videoPath = A$2(obsidian.normalizePath(`${pluginPath}/assets/user-guide-video.mp4`));
    y$1(() => {
        const getVideoData = async () => {
            try {
                const arrayBuffer = await modal.app.vault.adapter.readBinary(videoPath.current);
                const buffer = Buffer.from(arrayBuffer);
                const base64 = buffer.toString('base64');
                setVideoUrl(`data:video/mp4;base64,${base64}`);
            }
            catch (error) {
                console.error(error);
                modal.plugin.showNotice('Something went wrong. The video is missing.');
            }
            finally {
                setIsLoading(false);
            }
        };
        setIsLoading(true);
        modal
            .loadVideo()
            .then((exists) => {
            exists && getVideoData();
        })
            .catch((err) => console.error(err));
    }, [modal]);
    return (xn.createElement(xn.Fragment, null,
        xn.createElement(ReactObsidianSetting, { name: 'How this plugin does work', setHeading: true }),
        xn.createElement(ReactObsidianSetting, { addMultiDesc: (multiDesc) => {
                multiDesc.addDesc('This plugin stores data related to your selected elements.');
                multiDesc.addDesc('When you open another Markdown file with a diagram code in it and switch to preview mode, ' +
                    'the plugin attempts to find the corresponding diagram in preview.');
                multiDesc.addDesc('If a matching diagram is found, the plugin creates a container, applies CSS styles, ' +
                    'and enables diagram movement, zooming, and adds a control panel.');
                return multiDesc;
            } }),
        xn.createElement(ReactObsidianSetting, { name: 'How to find selectors in DevTool', setHeading: true, desc: 'To identify the CSS selectors for diagrams on this page, follow these steps below using your browser’s DevTools:' }),
        xn.createElement(ReactObsidianSetting, { name: 'Steps to find selectors:', addMultiDesc: (multiDesc) => {
                multiDesc.addDesc('1. Open the markdown file in Obsidian where the diagram is. You should switch to preview mode.');
                multiDesc.addDesc('2. Open the DevTools window. You can do it by pressing CTRL + SHIFT + I.');
                multiDesc.addDesc('3. Click the "Select an element on this page to inspect it" button (usually a arrow icon) in the top-left corner of the DevTools window. You can also press CTRL + SHIFT + C');
                multiDesc.addDesc('4. Move your cursor over the diagram and click on it to select the element.');
                multiDesc.addDesc('5. In the Elements tab of DevTools, you will see the HTML element corresponding to the diagram highlighted.');
                multiDesc.addDesc('6. Look at the classes applied to this element in the DevTools panel to identify the CSS selectors you need.');
                return multiDesc;
            } }),
        isLoading && xn.createElement("p", null, "Loading video..."),
        !isLoading && videoUrl && (xn.createElement("video", { src: videoUrl, controls: true, autoPlay: false, style: { width: '100%', maxHeight: '400px' } }))));
};

class UserGuide extends obsidian.Modal {
    plugin;
    root = undefined;
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.setTitle('Guide');
    }
    /**
     * This function is called when the modal is opened.
     * It creates a React root and renders the Application component inside of it.
     * @returns A promise that resolves when the modal has been fully opened.
     */
    async onOpen() {
        const { contentEl } = this;
        this.root = createRoot(contentEl.createEl('div'));
        this.root.render(xn.createElement(Application$1, { modal: this }));
    }
    /**
     * This function is called when the modal is closed.
     * It unmounts the React root and empties the content element.
     * @returns nothing
     */
    onClose() {
        this.root?.unmount();
        this.contentEl.empty();
    }
    /**
     * This function is called when the user guide modal is opened.
     * It downloads the user guide video to the plugin's assets directory if it is not already there.
     * @returns A promise that resolves with true if the video is successfully downloaded, and false otherwise.
     */
    async loadVideo() {
        const isFirstPluginStart = await this.plugin.pluginStateChecker.isFirstPluginStart();
        const pluginDir = this.plugin.manifest.dir;
        if (!pluginDir) {
            return false;
        }
        const assetsPath = obsidian.normalizePath(`${pluginDir}/assets`);
        const videoPath = obsidian.normalizePath(`${assetsPath}/user-guide-video.mp4`);
        const existsAssetsPath = await this.app.vault.adapter.exists(assetsPath);
        if (!existsAssetsPath) {
            await this.app.vault.adapter.mkdir(assetsPath);
        }
        if (isFirstPluginStart) {
            await this.downloadVideo(videoPath);
        }
        else {
            const exist = await this.app.vault.adapter.exists(videoPath);
            if (!exist) {
                await this.downloadVideo(videoPath);
            }
        }
        return this.app.vault.adapter.exists(videoPath);
    }
    /**
     * Downloads the user guide video from GitHub to the plugin's assets directory.
     * @param videoPath The path to the video file.
     * @returns A promise that resolves with true if the video is successfully downloaded, and false otherwise.
     * @private
     */
    async downloadVideo(videoPath) {
        try {
            const url = 'https://raw.githubusercontent.com/gitcpy/diagram-zoom-drag/main/assets/videos/find-class.mp4';
            const response = await obsidian.requestUrl(url);
            if (!(response.status === 200)) {
                throw new Error(`Error downloading video: ${response.status}`);
            }
            await this.app.vault.adapter.writeBinary(videoPath, response.arrayBuffer);
            return true;
        }
        catch (err) {
            console.error('Error downloading video:', err);
            return false;
        }
    }
}

var EventID;
(function (EventID) {
    EventID["PanelsChangedVisibility"] = "PanelsChangedVisibility";
    EventID["VisibilityOptionChanged"] = "VisibilityOptionChanged";
    EventID["ItemsPerPageChanged"] = "ItemsPerPageChanged";
})(EventID || (EventID = {}));

const ButtonContainer = dt.div `
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding-bottom: 20px;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background-color: var(--color-base-30);
        margin-top: 20px;
    }
`;
const PaginationButton = dt.button `
    &:disabled {
        background-color: var(--color-base-50);
        cursor: not-allowed;
    }
`;

const diagramR = /^[\w-]+$/;
const selectorR = /^[.#][\w\s._>+~-]+$/;
/**
 * Checks if the diagram already exists.
 *
 * @param plugin - An instance of the `DiagramZoomDragPlugin` class.
 * @param nameInput - The input element for the diagram name.
 * @param selectorInput - The input element for the diagram selector.
 * @param diagramArray - An array of the existing diagrams.
 * @returns A boolean indicating whether the diagram already exists or not.
 *
 * If the diagram already exists, the function will add a shake effect to the input elements,
 * show a notification with the message 'Diagram already exists!' and return `false`.
 * If the diagram does not exist, the function will return `true`.
 */
function preEndCheckExistingDiagram(plugin, nameInput, selectorInput, diagramArray) {
    const name = nameInput.value;
    const selector = selectorInput.value;
    const isAlreadyExist = diagramArray.find((d) => d.name === name || d.selector === selector);
    if (isAlreadyExist) {
        nameInput.addClass('shake');
        selectorInput.addClass('shake');
        setTimeout(() => {
            nameInput.removeClass('shake');
            selectorInput.removeClass('shake');
        }, 500);
        plugin.showNotice('Diagram already exists!');
        return false;
    }
    return true;
}
/**
 * Checks if the input values are valid.
 *
 * @param plugin - An instance of the `DiagramZoomDragPlugin` class.
 * @param nameInput - The input element for the diagram name.
 * @param selectorInput - The input element for the diagram selector.
 * @returns A boolean indicating whether the input values are valid or not.
 *
 * If either of the input values is not valid, the function will add a shake effect to the input elements,
 * show a notification with the message 'Input is not valid!' and return `false`.
 * If the input values are valid, the function will return `true`.
 */
function preEndCheckInputs(plugin, nameInput, selectorInput) {
    const name = nameInput.value;
    const selector = selectorInput.value;
    if (!diagramR.test(name) || !selectorR.test(selector)) {
        plugin.showNotice('Input is not valid!');
        nameInput.addClass('snake');
        selectorInput.addClass('snake');
        setTimeout(() => {
            nameInput.removeClass('shake');
            selectorInput.removeClass('shake');
        }, 500);
        return false;
    }
    return true;
}
/**
 * Checks if the input values are valid and does not already exist in the array.
 *
 * @param plugin - An instance of the `DiagramZoomDragPlugin` class.
 * @param nameInput - The input element for the diagram name.
 * @param selectorInput - The input element for the diagram selector.
 * @param diagramArray - An array of existing diagrams.
 * @returns A boolean indicating whether the input values are valid and do not already exist.
 */
function preEndValidateDiagram(plugin, nameInput, selectorInput, diagramArray) {
    const valid = preEndCheckInputs(plugin, nameInput, selectorInput);
    const notExists = preEndCheckExistingDiagram(plugin, nameInput, selectorInput, diagramArray);
    return valid && notExists;
}
/**
 * Validates the diagram name input.
 *
 * If the input is empty, removes the 'invalid' class and clears the aria-label.
 * If the input is not empty, checks if it matches the allowed characters and toggles
 * the 'invalid' class and sets a corresponding aria-label.
 *
 * @param plugin - An instance of the `DiagramZoomDragPlugin` class.
 * @param nameInput - The input element for the diagram name.
 */
function validateName(plugin, nameInput) {
    const text = nameInput.value;
    const dTest = diagramR.test(text);
    if (!text) {
        nameInput.removeClass('invalid');
        nameInput.ariaLabel = '';
    }
    else {
        nameInput.toggleClass('invalid', !dTest);
        nameInput.ariaLabel = !dTest
            ? 'Incorrect input. Should be only `A-Za-z0-9-`'
            : '';
    }
}
/**
 * Validates the CSS selector input.
 *
 * If the input is empty, removes the 'invalid' class and clears the aria-label.
 * If the input is not empty, checks if it matches the valid CSS selector pattern
 * and toggles the 'invalid' class and sets a corresponding aria-label.
 *
 * @param plugin - An instance of the `DiagramZoomDragPlugin` class.
 * @param selectorInput - The input element for the diagram selector.
 */
function validateSelector(plugin, selectorInput) {
    const text = selectorInput.value;
    const sTest = selectorR.test(text);
    if (!text) {
        selectorInput.removeClass('invalid');
        selectorInput.ariaLabel = '';
    }
    else {
        selectorInput.toggleClass('invalid', !sTest);
        selectorInput.ariaLabel = !sTest
            ? 'Input incorrect. It seems to be not a valid CSS selector?'
            : '';
    }
}

class SwitchConfirm extends obsidian.Modal {
    onSubmit;
    constructor(app, diagramName, onSubmit) {
        super(app);
        this.onSubmit = onSubmit;
        this.setTitle(`Editing ${diagramName}...`);
    }
    /**
     * This function is called when the modal is opened.
     * It renders a confirmation dialogue that asks the user if they want to switch the page without saving any unsaved changes.
     * It also provides a button to save the changes and continue to the next page.
     * @returns nothing
     */
    onOpen() {
        new obsidian.Setting(this.contentEl)
            .setName('Are you sure you want to switch the page? You will lose your unsaved changes.')
            .setHeading()
            .addButton((button) => {
            button.setButtonText('Proceed without saving');
            button.onClick((cb) => {
                this.onSubmit('Yes');
                this.close();
            });
        })
            .addButton((button) => {
            button.setButtonText('Cancel');
            button.onClick((cb) => {
                this.onSubmit('No');
                this.close();
            });
        })
            .addButton((button) => {
            button.setButtonText('Save and continue');
            button.onClick((cb) => {
                this.onSubmit('Save');
                this.close();
            });
        });
    }
    /**
     * This method is called when the modal is closed.
     * It empties the content element to prevent a memory leak.
     * @returns nothing
     */
    onClose() {
        this.contentEl.empty();
    }
}

class DiagramSetConfrols extends obsidian.Modal {
    name;
    initial;
    callback;
    constructor(app, name, initial, callback) {
        super(app);
        this.name = name;
        this.initial = initial;
        this.callback = callback;
        this.setTitle(`Set diagram controls for ${this.name} diagram`);
    }
    /**
     * Called when the modal is opened.
     *
     * Renders a settings interface for the user to control which panels are
     * visible on the diagram. The user is presented with a toggle for each of
     * "Move panel", "Zoom panel", and "Service panel". The state of these
     * toggles is initially set based on the `initial` object passed to the
     * constructor.
     *
     * When the user changes the state of a toggle, the `callback` function is
     * called with an object whose `on` property is the new state of the toggle
     * and whose `panel` property is one of `"move"`, `"zoom"`, or `"service"`.
     */
    onOpen() {
        const { contentEl } = this;
        new obsidian.Setting(contentEl).setDesc(`These settings will only apply to this diagram.`);
        new obsidian.Setting(contentEl).setName('Move panel').addToggle((toggle) => {
            toggle.setValue(this.initial.move.on);
            toggle.onChange(async (value) => {
                await this.callback({
                    on: value,
                    panel: 'move',
                });
            });
        });
        new obsidian.Setting(contentEl).setName('Zoom panel').addToggle((toggle) => {
            toggle.setValue(this.initial.zoom.on);
            toggle.onChange(async (value) => {
                await this.callback({
                    on: value,
                    panel: 'zoom',
                });
            });
        });
        new obsidian.Setting(contentEl).setName('Service panel').addToggle((toggle) => {
            toggle.setValue(this.initial.service.on);
            toggle.onChange(async (value) => {
                await this.callback({
                    on: value,
                    panel: 'service',
                });
            });
        });
    }
    /**
     * This method is called when the modal is closed.
     *
     * It empties the content element to prevent a memory leak.
     * @returns nothing
     */
    hide() {
        this.contentEl.empty();
    }
}

/**
 * The `DiagramPagination` component is used to show a paginated list of diagrams to the user.
 * It allows the user to navigate through the list of diagrams, and to edit or delete the diagrams.
 *
 * @param props - The props passed to the component.
 * @returns The JSX element representing the component.
 */
const DiagramPagination = () => {
    const { app, plugin } = useSettingsContext();
    const [editingIndex, setEditingIndex] = h(undefined);
    const [diagrams, setDiagrams] = h(plugin.settings.supported_diagrams);
    const [diagramsPerPage, setDiagramsPerPage] = h(plugin.settings.diagramsPerPage);
    y$1(() => {
        const handler = async () => {
            setDiagramsPerPage(plugin.settings.diagramsPerPage);
        };
        plugin.observer.subscribe(app.workspace, EventID.ItemsPerPageChanged, handler);
        return () => {
            plugin.observer.unsubscribeFromEvent(app.workspace, EventID.ItemsPerPageChanged);
        };
    }, [app.workspace, plugin.settings]);
    const [currentPage, setCurrentPage] = h(1);
    const totalPages = Math.ceil(diagrams.length / diagramsPerPage);
    const startIndex = (currentPage - 1) * diagramsPerPage;
    const endIndex = startIndex + diagramsPerPage;
    const handleDelete = async (index) => {
        debugger;
        const newDiagrams = [...diagrams];
        newDiagrams.splice(index, 1);
        setDiagrams(newDiagrams);
        plugin.settings.supported_diagrams = newDiagrams;
        await plugin.settingsManager.saveSettings();
        if (currentPage > 1 && startIndex >= newDiagrams.length) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const handleSaveEditing = async (index) => {
        const editingNameInput = document.querySelector('#editing-name-input');
        const editingSelectorInput = document.querySelector('#editing-selector-input');
        if (!editingNameInput || !editingSelectorInput) {
            return;
        }
        const validated = preEndValidateDiagram(plugin, editingNameInput, editingSelectorInput, diagrams.slice(0, index).concat(diagrams.slice(index + 1)));
        if (validated) {
            diagrams[index].name = editingNameInput.value;
            diagrams[index].selector = editingSelectorInput.value;
            setDiagrams([...diagrams]);
            plugin.settings.supported_diagrams = diagrams;
            await plugin.settingsManager.saveSettings();
            editingNameInput.removeAttribute('id');
            editingSelectorInput.removeAttribute('id');
            setEditingIndex(undefined);
        }
        return validated;
    };
    const actualIndex = (index) => startIndex + index;
    const navigateToPage = (delta) => {
        setCurrentPage((prev) => Math.min(totalPages, Math.max(prev + delta, 1)));
    };
    const changePage = (delta) => {
        if (editingIndex !== undefined) {
            new SwitchConfirm(app, diagrams[actualIndex(editingIndex)].name, async (result) => {
                if (result === 'Yes') {
                    setEditingIndex(undefined);
                    navigateToPage(delta);
                }
                else if (result === 'Save') {
                    const validated = await handleSaveEditing(actualIndex(editingIndex));
                    if (!validated) {
                        plugin.showNotice('Could not save diagram');
                    }
                    navigateToPage(delta);
                }
            }).open();
        }
        else {
            navigateToPage(delta);
        }
    };
    return (xn.createElement(xn.Fragment, null,
        xn.createElement(ButtonContainer, null,
            xn.createElement(PaginationButton, { onClick: () => changePage(-1), disabled: currentPage === 1 }, "\u2190"),
            `Page ${currentPage} of ${totalPages} (Total diagrams: ${diagrams.length})`,
            xn.createElement(PaginationButton, { onClick: () => changePage(1), disabled: currentPage === totalPages }, "\u2192")),
        plugin.settings.supported_diagrams
            .slice(startIndex, endIndex)
            .map((diagram, index) => {
            const { name, selector } = diagram;
            return editingIndex === index ? (xn.createElement(ReactObsidianSetting, { addTexts: [
                    (nameInput) => {
                        nameInput.setValue(diagrams[actualIndex(index)].name);
                        nameInput.inputEl.id = 'editing-name-input';
                        nameInput.onChange((value) => {
                            validateName(plugin, nameInput.inputEl);
                        });
                        return nameInput;
                    },
                    (selectorInput) => {
                        selectorInput.setValue(diagrams[actualIndex(index)].selector);
                        selectorInput.inputEl.id =
                            'editing-selector-input';
                        selectorInput.onChange((value) => {
                            validateSelector(plugin, selectorInput.inputEl);
                        });
                        return selectorInput;
                    },
                ], addButtons: [
                    (button) => {
                        button.setIcon('circle-x');
                        button.setTooltip('Cancel operation? All changes will be lost.');
                        button.onClick((cb) => {
                            setEditingIndex(undefined);
                        });
                        return button;
                    },
                    (button) => {
                        button.setIcon('save');
                        button.setTooltip(`Save changes for ${diagrams[actualIndex(index)].name}?`);
                        button.onClick(async (cb) => {
                            await handleSaveEditing(actualIndex(index));
                        });
                        return button;
                    },
                ] })) : (xn.createElement(ReactObsidianSetting, { name: name, desc: selector, addToggles: [
                    (toggle) => {
                        toggle.setValue(diagrams[actualIndex(index)].on);
                        toggle.setTooltip(`${diagrams[actualIndex(index)].on ? 'Disable' : 'Enable'} ${diagrams[actualIndex(index)].name} diagram`);
                        toggle.onChange(async (value) => {
                            diagrams[actualIndex(index)].on = value;
                            setDiagrams([...diagrams]);
                            plugin.settings.supported_diagrams =
                                diagrams;
                            await plugin.settingsManager.saveSettings();
                        });
                        return toggle;
                    },
                ], addButtons: [
                    diagrams[actualIndex(index)].name !==
                        'Default' &&
                        ((button) => {
                            button.setIcon('edit');
                            button.setTooltip(`Edit ${diagrams[actualIndex(index)].name} diagram`);
                            button.onClick(async () => {
                                setEditingIndex(index);
                            });
                            return button;
                        }),
                    diagrams[actualIndex(index)].name !==
                        'Default' &&
                        ((button) => {
                            button.setIcon('trash');
                            button.setTooltip(`Delete ${diagrams[actualIndex(index)].name} diagram`);
                            button.onClick(async () => {
                                await handleDelete(actualIndex(index));
                            });
                            return button;
                        }),
                ], addExtraButtons: [
                    (button) => {
                        button.setTooltip(`Set what controls will be active for ${diagrams[actualIndex(index)].name} diagram`);
                        button.onClick(() => {
                            const initial = diagrams[actualIndex(index)].panels;
                            new DiagramSetConfrols(app, diagrams[actualIndex(index)].name, initial, async (result) => {
                                const dPanels = diagrams[actualIndex(index)]
                                    .panels;
                                dPanels[result.panel].on =
                                    result.on;
                                await plugin.settingsManager.saveSettings();
                            }).open();
                        });
                        return button;
                    },
                ] }));
        })));
};

/**
 * DiagramManagement component is responsible for managing the configuration of diagrams
 * with enhanced controls and UI in the application.
 *
 * It provides functionalities for:
 * - Adding new diagram types through a form with input fields for name and CSS selector.
 * - Validating inputs and ensuring the diagram does not already exist.
 * - Displaying notifications when a new diagram is successfully added.
 * - Managing the list of available diagrams and the number of diagrams displayed per page.
 *
 * The component uses the `useSettingsContext` hook to access application and plugin settings,
 * allowing dynamic updates and persistent storage of configuration changes.
 *
 * It utilizes `ReactObsidianSetting` for rendering settings sections and `DiagramPagination`
 * for handling pagination of the diagrams list.
 *
 * @returns {JSX.Element} The management panel for configuring diagram settings.
 */
const DiagramManagement = () => {
    const { app, plugin } = useSettingsContext();
    const [_, forceReload] = p((x) => x + 1, 0);
    const handleAddDiagram = async (nameInput, selectorInput) => {
        if (!preEndValidateDiagram(plugin, nameInput, selectorInput, plugin.settings.supported_diagrams)) {
            return;
        }
        plugin.settings.supported_diagrams.push({
            name: nameInput.value,
            selector: selectorInput.value,
            on: true,
            panels: {
                move: {
                    on: true,
                },
                zoom: {
                    on: true,
                },
                service: {
                    on: true,
                },
            },
        });
        await plugin.settingsManager.saveSettings();
        plugin.showNotice('New diagram was added');
        forceReload();
    };
    return (xn.createElement(xn.Fragment, null,
        xn.createElement(ReactObsidianSetting, { name: 'Add new diagram', setHeading: true, noBorder: true, desc: "Here you can configure which diagrams will receive enhanced controls and UI.", addMultiDesc: (multiDesc) => {
                multiDesc.addDescriptions([
                    'Adding a Diagram Type:',
                    '1. Enter a unique name using only Latin letters, numbers and `-` (A-Z, a-z, 0-9, -)',
                    '2. Specify a valid CSS selector for your diagram',
                    'Once added, matching diagrams will get:',
                    '• Mouse and keyboard navigation',
                    '• Additional control buttons',
                    'Note: Red border indicates invalid input - hover to see details',
                ]);
                return multiDesc;
            } }),
        xn.createElement(ReactObsidianSetting, { addTexts: [
                (name) => {
                    name.inputEl.id = 'diagram-name';
                    name.setPlaceholder('Example Diagram');
                    name.onChange((text) => {
                        name.setValue(text);
                        validateName(plugin, name.inputEl);
                    });
                    return name;
                },
                (selectorInput) => {
                    selectorInput.inputEl.id = 'diagram-selector';
                    selectorInput.setPlaceholder('.example-diagram');
                    selectorInput.onChange((text) => {
                        selectorInput.setValue(text);
                        validateSelector(plugin, selectorInput.inputEl);
                    });
                    return selectorInput;
                },
            ], addButtons: [
                (button) => {
                    button.setIcon('save');
                    button.setTooltip('Add this diagram');
                    button.onClick(async () => {
                        const nameInput = document.querySelector('#diagram-name');
                        const selectorInput = document.querySelector('#diagram-selector');
                        if (!nameInput || !selectorInput) {
                            return;
                        }
                        await handleAddDiagram(nameInput, selectorInput);
                    });
                    return button;
                },
            ], addExtraButtons: [
                obsidian.Platform.isDesktopApp &&
                    ((extra) => {
                        extra.setIcon('info');
                        extra.setTooltip('Click for more information on how the plugin works and' +
                            ' how you can find diagram selectors');
                        extra.onClick(() => {
                            new UserGuide(app, plugin).open();
                        });
                        return extra;
                    }),
            ] }),
        xn.createElement(ReactObsidianSetting, { name: "Available diagrams", setHeading: true }),
        xn.createElement(ReactObsidianSetting, { name: "Diagrams per page", addSliders: [
                (slider) => {
                    slider.setValue(plugin.settings.diagramsPerPage);
                    slider.setDynamicTooltip();
                    slider.setLimits(1, 50, 1);
                    slider.onChange(async (value) => {
                        plugin.settings.diagramsPerPage = value;
                        await plugin.settingsManager.saveSettings();
                        plugin.publisher.publish({
                            emitter: app.workspace,
                            eventID: EventID.ItemsPerPageChanged,
                            timestamp: new Date(),
                        });
                    });
                    return slider;
                },
            ] }),
        xn.createElement(DiagramPagination, null)));
};

/**
 * DiagramSection component renders a section with navigation and routing for diagram settings and management.
 *
 * It includes two navigation buttons, "Settings" and "Diagram Management", which navigate to their respective routes.
 * The active button is visually distinguished based on the current route.
 * This component uses React Router's `Route` and `Routes` to render the `DiagramsSettings` and `DiagramManagement` components
 * based on the selected route.
 *
 * @returns A React element containing the navigation and routed content for diagram settings and management.
 */
const DiagramSection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (xn.createElement("div", null,
        xn.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-base-30)',
                marginTop: '20px',
            } },
            xn.createElement(ReactObsidianSetting, { addButtons: [
                    (button) => {
                        button.setIcon('settings');
                        button.setTooltip('Settings');
                        button.onClick(() => {
                            navigate('/diagram-section/settings');
                        });
                        if (location.pathname === '/diagram-section' ||
                            location.pathname ===
                                '/diagram-section/settings') {
                            button.setClass('button-active');
                        }
                        return button;
                    },
                    (button) => {
                        button.setIcon('folder-plus');
                        button.setTooltip('Diagram Management');
                        button.onClick(() => {
                            navigate('/diagram-section/management');
                        });
                        if (location.pathname ===
                            '/diagram-section/management') {
                            button.setClass('button-active');
                        }
                        return button;
                    },
                ] })),
        xn.createElement(Routes, null,
            xn.createElement(Route, { index: true, element: xn.createElement(DiagramsSettings, null) }),
            xn.createElement(Route, { path: "settings", element: xn.createElement(DiagramsSettings, null) }),
            xn.createElement(Route, { path: "management", element: xn.createElement(DiagramManagement, null) }))));
};

const DiagramSetup = dt.div `
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
const DiagramPreview = dt.div `
    position: relative;
    width: 400px;
    height: 300px;
    border: 2px solid var(--color-base-30);
    margin: 0 auto;
`;
const PanelPreview = dt.div `
    position: absolute;
    width: 60px;
    height: 40px; 
    padding: 8px;
    background: var(--color-base-20);
    border-radius: 4px;
    font-size: 0.9em;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: move;
    opacity: ${({ dragging }) => (dragging ? 0.5 : 1)};
    transition: ${({ dragging }) => (dragging ? 'all 0.3s ease' : 'none')}}
`;
const FoldPanel$1 = dt(PanelPreview) `
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    text-align: justify;
`;
const PanelControl = dt.div `
    display: flex;
    justify-content: center;
    gap: 20px;
`;
const PanelToggle = dt.label `
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.9em;
`;

/**
 * A component that renders a diagram of the panel layout and allows the user
 * to drag and drop panels to change their positions and enable or disable them
 *
 * @returns A `DiagramSetup` component that contains a `DiagramPreview` and a
 * `PanelControl`.
 */
const PanelLayout = () => {
    const { plugin } = useSettingsContext();
    const [positions, setPositions] = h(plugin.settings.panelsConfig);
    const [draggedPanel, setDraggedPanel] = h(null);
    const containerRef = A$2(null);
    y$1(() => {
        setPositions(plugin.settings.panelsConfig);
    }, [plugin.settings]);
    const saveSettings = async (newPositions) => {
        setPositions(newPositions);
        plugin.settings.panelsConfig = newPositions;
        await plugin.settingsManager.saveSettings();
    };
    const togglePanelState = async (panelName) => {
        const newPositions = {
            ...positions,
            [panelName]: {
                ...positions[panelName],
                enabled: !positions[panelName].enabled,
            },
        };
        await saveSettings(newPositions);
    };
    const handleDragStart = (e, panelName) => {
        const panel = e.currentTarget;
        const rect = panel.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        e.dataTransfer.setData('application/json', JSON.stringify({
            panelName,
            offsetX,
            offsetY,
        }));
        setDraggedPanel(panelName);
    };
    const calculatePosition = (x, y, containerRect) => {
        const position = {};
        const PANEL_WIDTH = 60;
        const PANEL_HEIGHT = 40;
        const SNAP_THRESHOLD = 30;
        // Coordinates of the panel edges
        const panelLeft = x;
        const panelRight = x + PANEL_WIDTH;
        const panelTop = y;
        const panelBottom = y + PANEL_HEIGHT;
        // Distances from the edges of the panel to the edges of the container
        const distanceToLeft = panelLeft;
        const distanceToRight = containerRect.width - panelRight;
        const distanceToTop = panelTop;
        const distanceToBottom = containerRect.height - panelBottom;
        // Find the minimum distance to the edge
        const distances = [
            { edge: 'left', value: distanceToLeft },
            { edge: 'right', value: distanceToRight },
            { edge: 'top', value: distanceToTop },
            { edge: 'bottom', value: distanceToBottom },
        ];
        const closestEdge = distances.reduce((a, b) => Math.abs(a.value) < Math.abs(b.value) ? a : b);
        // Attach to the nearest edge if in the attraction zone
        if (Math.abs(closestEdge.value) <= SNAP_THRESHOLD) {
            switch (closestEdge.edge) {
                case 'left':
                    position.left = '0px';
                    // Calculate vertical position
                    if (panelTop <= SNAP_THRESHOLD) {
                        position.top = '0px';
                    }
                    else if (containerRect.height - panelBottom <=
                        SNAP_THRESHOLD) {
                        position.bottom = '0px';
                    }
                    else {
                        position.top = `${((panelTop / containerRect.height) * 100).toFixed(1)}%`;
                    }
                    break;
                case 'right':
                    position.right = '0px';
                    if (panelTop <= SNAP_THRESHOLD) {
                        position.top = '0px';
                    }
                    else if (containerRect.height - panelBottom <=
                        SNAP_THRESHOLD) {
                        position.bottom = '0px';
                    }
                    else {
                        position.top = `${((panelTop / containerRect.height) * 100).toFixed(1)}%`;
                    }
                    break;
                case 'top':
                    position.top = '0px';
                    if (panelLeft <= SNAP_THRESHOLD) {
                        position.left = '0px';
                    }
                    else if (containerRect.width - panelRight <=
                        SNAP_THRESHOLD) {
                        position.right = '0px';
                    }
                    else {
                        position.left = `${((panelLeft / containerRect.width) * 100).toFixed(1)}%`;
                    }
                    break;
                case 'bottom':
                    position.bottom = '0px';
                    if (panelLeft <= SNAP_THRESHOLD) {
                        position.left = '0px';
                    }
                    else if (containerRect.width - panelRight <=
                        SNAP_THRESHOLD) {
                        position.right = '0px';
                    }
                    else {
                        position.left = `${((panelLeft / containerRect.width) * 100).toFixed(1)}%`;
                    }
                    break;
            }
        }
        else {
            // If not in the attraction zone, use exact coordinates
            position.left = `${((panelLeft / containerRect.width) * 100).toFixed(1)}%`;
            position.top = `${((panelTop / containerRect.height) * 100).toFixed(1)}%`;
        }
        return position;
    };
    const handleDrop = async (e) => {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const containerRect = container.getBoundingClientRect();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const x = e.clientX - containerRect.left - data.offsetX;
        const y = e.clientY - containerRect.top - data.offsetY;
        const position = calculatePosition(x, y, containerRect);
        const newPositions = { ...positions };
        newPositions[data.panelName] = {
            ...positions[data.panelName],
            position,
        };
        await saveSettings(newPositions);
        setDraggedPanel(null);
    };
    const handleTouchStart = (e, panelName) => {
        const touch = e.touches[0];
        const panel = e.target;
        const rect = panel.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        setDraggedPanel(panelName);
        panel.dataset.dragData = JSON.stringify({
            panelName,
            offsetX,
            offsetY,
        });
    };
    const handleTouchMove = (e) => {
        const container = containerRef.current;
        if (!container || !draggedPanel) {
            return;
        }
        e.preventDefault();
        const touch = e.touches[0];
        const panel = e.currentTarget;
        const dragData = JSON.parse(panel.dataset.dragData ?? '{}');
        const containerRect = container.getBoundingClientRect();
        const x = touch.clientX - containerRect.left - dragData.offsetX;
        const y = touch.clientY - containerRect.top - dragData.offsetY;
        const position = calculatePosition(x, y, containerRect);
        panel.style.left = position.left;
        panel.style.top = position.top;
    };
    const handleTouchEnd = async (e) => {
        const container = containerRef.current;
        if (!container || !draggedPanel) {
            return;
        }
        const panel = e.currentTarget;
        const dragData = JSON.parse(panel.dataset.dragData ?? '{}');
        const touch = e.changedTouches[0];
        const containerRect = container.getBoundingClientRect();
        const x = touch.clientX - containerRect.left - dragData.offsetX;
        const y = touch.clientY - containerRect.top - dragData.offsetY;
        const position = calculatePosition(x, y, containerRect);
        const newPositions = { ...positions };
        newPositions[dragData.panelName] = {
            ...positions[dragData.panelName],
            position,
        };
        await saveSettings(newPositions);
        setDraggedPanel(null);
    };
    const panelProps = (name) => obsidian.Platform.isDesktop
        ? {
            draggable: true,
            onDragStart: (e) => handleDragStart(e, name),
        }
        : {
            onTouchStart: (e) => handleTouchStart(e, name),
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        };
    return (xn.createElement(DiagramSetup, null,
        xn.createElement(DiagramPreview, { ref: containerRef, onDragOver: (e) => e.preventDefault(), onDrop: handleDrop },
            Object.entries(positions).map(([name, config]) => config.enabled && (xn.createElement(PanelPreview, { key: name, dragging: draggedPanel === name, style: {
                    ...config.position,
                }, ...panelProps(name) }, name))),
            xn.createElement(FoldPanel$1, null, "fold")),
        xn.createElement(PanelControl, null, Object.entries(positions).map(([name, config]) => (xn.createElement(PanelToggle, { key: name },
            xn.createElement("input", { type: "checkbox", checked: config.enabled, onChange: () => togglePanelState(name) }),
            name))))));
};

/**
 * A React component that renders the Panel Management page in the settings
 * dialog of the Diagram Zoom Drag plugin for Obsidian.
 *
 * This component is responsible for displaying the settings for customizing
 * the control panels on diagrams. It displays a heading, a description, and
 * two `ReactObsidianSetting` components for presenting the available panels
 * and instructions on how to customize them.
 *
 * The component also includes a `PanelLayout` component, which is responsible
 * for rendering the actual control panels and their associated settings.
 *
 */
const PanelManagement = () => (xn.createElement(xn.Fragment, null,
    xn.createElement(ReactObsidianSetting, { name: "Panel configuration", desc: "Configure the visibility and position of control panels on your diagrams", setHeading: true, noBorder: true }),
    xn.createElement(ReactObsidianSetting, { name: "Available panels", addMultiDesc: (multiDesc) => {
            multiDesc.addDesc('• Move Panel: By default located at bottom right - Contains 8 directional buttons for diagram movement');
            multiDesc.addDesc('• Zoom Panel: By default located at center right - Features zoom in/out and reset controls');
            multiDesc.addDesc('• Service Panel: By default located at upper right - Contains additional functionality buttons');
            return multiDesc;
        }, noBorder: true }),
    xn.createElement(ReactObsidianSetting, { name: "How to customize panels", addMultiDesc: (multiDesc) => {
            multiDesc.addDesc('1. Use checkboxes below to toggle panel visibility on/off');
            multiDesc.addDesc('2. Click and drag any panel to reposition it on the diagram');
            multiDesc.addDesc('3. Panel positions are saved automatically');
            multiDesc.addDesc('4. Reload the view to see your changes take effect');
            return multiDesc;
        }, noBorder: true }),
    xn.createElement(PanelLayout, null)));

/**
 * PanelSettings component provides a user interface for configuring panel-related settings
 * in the application. It allows users to customize panel behavior, specifically in relation
 * to mouse interactions and visibility options.
 *
 * This component is applicable only for the desktop platform and offers the following settings:
 * - Toggle to hide panels when the mouse exits the diagram area.
 * - Option to add a hiding button to the service panel.
 *
 * The settings are managed through the `ReactObsidianSetting` component, which handles
 * the rendering of toggle switches and updates the plugin configuration asynchronously
 * upon user interaction.
 *
 * @returns A React fragment containing the settings UI components.
 */
const PanelSettings = () => {
    const { plugin } = useSettingsContext();
    return (xn.createElement(xn.Fragment, null, obsidian.Platform.isDesktopApp && (xn.createElement(xn.Fragment, null,
        xn.createElement(ReactObsidianSetting, { name: "Panels behavior", desc: "Configure how panels interact with mouse movement", setHeading: true }),
        xn.createElement(ReactObsidianSetting, { name: "Hide panels when mouse leaves diagram?", addToggles: [
                (toggle) => {
                    toggle.setValue(plugin.settings.hideOnMouseOutDiagram);
                    toggle.onChange(async (value) => {
                        plugin.settings.hideOnMouseOutDiagram =
                            value;
                        await plugin.settingsManager.saveSettings();
                    });
                    return toggle;
                },
            ] }),
        xn.createElement(ReactObsidianSetting, { name: 'Serivce panel', setHeading: true }),
        xn.createElement(ReactObsidianSetting, { name: 'Add a hiding button to service panel?', addToggles: [
                (toggle) => {
                    toggle.setValue(plugin.settings.addHidingButton);
                    toggle.onChange(async (value) => {
                        plugin.settings.addHidingButton = value;
                        await plugin.settingsManager.saveSettings();
                    });
                    return toggle;
                },
            ] })))));
};

/**
 * `PanelSection` component renders a section with navigation and routing for panel settings and management.
 *
 * It includes two navigation buttons, "Panels Settings" and "Panels Management", which navigate to their respective routes.
 * The active button is visually distinguished based on the current route.
 * This component uses React Router's `Route` and `Routes` to render the `PanelSettings` and `PanelManagement` components
 * based on the selected route.
 *
 * @returns A React element containing the navigation and routed content for panel settings and management.
 */
const PanelSection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (xn.createElement("div", null,
        xn.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-base-30)',
                marginTop: '20px',
            } }, obsidian.Platform.isDesktopApp && (xn.createElement(ReactObsidianSetting, { addButtons: [
                (button) => {
                    button.setIcon('settings');
                    button.setTooltip('Panels Settings');
                    button.onClick(() => {
                        navigate('/panel-section/settings');
                    });
                    if (location.pathname ===
                        '/panel-section/settings' ||
                        location.pathname === '/panel-section') {
                        button.setClass('button-active');
                    }
                    return button;
                },
                (button) => {
                    button.setIcon('layout-grid');
                    button.setTooltip('Panels Management');
                    button.onClick(() => {
                        navigate('/panel-section/management');
                    });
                    if (location.pathname ===
                        '/panel-section/management') {
                        button.setClass('button-active');
                    }
                    return button;
                },
            ] }))),
        xn.createElement(Routes, null,
            xn.createElement(Route, { index: true, element: obsidian.Platform.isDesktopApp ? (xn.createElement(PanelSettings, null)) : (xn.createElement(PanelManagement, null)) }),
            xn.createElement(Route, { path: 'settings', element: xn.createElement(PanelSettings, null) }),
            xn.createElement(Route, { path: 'management', element: xn.createElement(PanelManagement, null) }))));
};

const NavbarContainer = dt.nav `
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    border-bottom: 2px solid var(--background-modifier-border);
`;
const NavbarTabs = dt.div `
    display: flex;
    gap: 16px;
`;
const NavbarTab = dt.button `
    display: flex;
    align-items: center;
    background: none;
    border: none;
    text-decoration: none;
    color: var(--text-normal);
    font-size: 16px;
    padding: 8px 12px;
    gap: 10px;
    border-radius: 4px;
    transition:
        background-color 0.3s,
        color 0.3s;
    cursor: pointer;
    position: relative;

    &:hover {
        background-color: var(--background-modifier-hover);
        color: var(--text-accent-hover);
    }

    &.active {
        background-color: var(--background-modifier-active-hover);
        color: var(--text-accent);
    }

    &.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 3px;
        background-color: var(--text-accent);
        border-radius: 2px 2px 0 0;
    }
`;

/**
 * A simple navigation bar component.
 *
 * This component renders a horizontal navigation bar with three
 * links: one to the diagram section, one to the panel section, and
 * one to the about page. The links are styled as tabs and are
 * responsive to the active route.
 *
 * @returns The rendered navigation bar element.
 */
const Navbar = () => (xn.createElement(NavbarContainer, null,
    xn.createElement(NavbarTabs, null,
        xn.createElement(NavbarTab, { as: NavLink, to: '/diagram-section' }, "Diagram"),
        xn.createElement(NavbarTab, { as: NavLink, to: '/panel-section' }, "Panel"),
        xn.createElement(NavbarTab, { as: NavLink, to: '/about' }, "About"))));

/**
 * A React component that renders a button to reset settings to their default values.
 *
 * This component uses `ReactObsidianSetting` to add a button with an icon and
 * tooltip. When clicked, it resets the plugin settings, reloads the settings,
 * updates the CSS properties, and displays a notice to the user.
 *
 * It also updates the current path in the settings context based on the current
 * location.
 *
 * @returns A React element for resetting settings.
 */
const ResetSettings = () => {
    const { plugin, forceReload, setCurrentPath } = useSettingsContext();
    const location = useLocation();
    return (xn.createElement(ReactObsidianSetting, { addButtons: [
            (button) => {
                button.setIcon('rotate-ccw');
                button.setTooltip('Reset settings to default');
                button.onClick(async () => {
                    setCurrentPath(location.pathname);
                    await plugin.settingsManager.resetSettings();
                    forceReload();
                    plugin.updateCssProperties();
                    new obsidian.Notice('Settings have been reset to default.');
                });
                return button;
            },
        ] }));
};

/**
 * The settings page toolbar.
 *
 * On desktop, it displays the navbar in the center of the page and the reset
 * settings button on the right. On mobile, it displays the reset settings button
 * on the right and the navbar below it.
 * @returns The toolbar element.
 */
const Toolbar = () => {
    if (obsidian.Platform.isDesktopApp) {
        return (xn.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                width: '100%',
            } },
            xn.createElement("div", null),
            xn.createElement(Navbar, null),
            xn.createElement("div", { style: {
                    justifySelf: 'end',
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '35px',
                } },
                xn.createElement(ResetSettings, null))));
    }
    return (xn.createElement(xn.Fragment, null,
        xn.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '-50px',
                marginRight: '0px',
                padding: 0,
                width: '100%',
                marginBottom: 0,
            } },
            xn.createElement(ResetSettings, null)),
        xn.createElement(Navbar, null)));
};

/**
 * The main component for the settings page.
 *
 * This component renders a `MemoryRouter` and `Routes` component, which
 * manage the client-side routing of the settings page. The `Toolbar` is
 * rendered above the routes, and the `DiagramSection`, `PanelSection`, and
 * `About` components are rendered depending on the current route.
 *
 * The `MemoryRouter` is given the current path from the settings context as
 * its initial entry, and the reload count is used as the `key` prop to
 * force a re-render of the `MemoryRouter` when the settings are reloaded.
 *
 * @returns The main component for the settings page.
 */
const SettingsPage = () => {
    const { reloadCount, currentPath } = useSettingsContext();
    return (xn.createElement(MemoryRouter, { initialEntries: [currentPath], key: reloadCount },
        xn.createElement(Toolbar, null),
        xn.createElement(Routes, null,
            xn.createElement(Route, { path: "/diagram-section/*", element: xn.createElement(DiagramSection, null) }),
            xn.createElement(Route, { path: "/panel-section/*", element: xn.createElement(PanelSection, null) }),
            xn.createElement(Route, { path: '/about', element: xn.createElement(About, null) }))));
};

/**
 * The root component of the settings UI.
 *
 * This component is responsible for rendering the settings page. It also provides
 * a context for the settings page to access the app and the plugin.
 *
 * @param app The Obsidian app instance.
 * @param plugin The instance of the DiagramZoomDragPlugin.
 */
const Application = ({ app, plugin }) => (xn.createElement(SettingProvider, { app: app, plugin: plugin },
    xn.createElement(SettingsPage, null)));

class SettingsTab extends obsidian.PluginSettingTab {
    app;
    plugin;
    root = undefined;
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
        this.containerEl.addClass('diagram-zoom-drag-settings');
    }
    /**
     * Displays the settings tab.
     *
     * This method creates a new root element within the container and renders
     * the React application with the provided app and plugin properties.
     *
     * @returns A promise that resolves when the display is complete.
     */
    async display() {
        const root = this.containerEl.createDiv();
        this.root = createRoot(root);
        this.root.render(xn.createElement(Application, { app: this.app, plugin: this.plugin }));
    }
    /**
     * Hides the settings tab.
     *
     * This method unmounts the React root component and clears the container element.
     */
    hide() {
        this.root?.unmount();
        this.containerEl.empty();
    }
}

class PluginStateChecker {
    plugin;
    constructor(plugin) {
        this.plugin = plugin;
    }
    /**
     * Determines if the plugin is being opened for the first time.
     *
     * Compares current plugin metadata with stored metadata in local storage. Updates local storage if it's the first launch.
     *
     * @returns `true` if it's the first time the plugin is opened, otherwise `false`.
     */
    async isFirstPluginStart() {
        const pluginMetadata = await this.getPluginMetadata();
        const localStoragePluginMetadata = localStorage.getItem('diagram-zoom-drag-metadata');
        if (!localStoragePluginMetadata) {
            localStorage.setItem('diagram-zoom-drag-metadata', pluginMetadata.toString());
            return true;
        }
        const localStoragePluginMetadataNumber = parseInt(localStoragePluginMetadata, 10);
        if (isNaN(localStoragePluginMetadataNumber) ||
            pluginMetadata !== localStoragePluginMetadataNumber) {
            localStorage.setItem('diagram-zoom-drag-metadata', pluginMetadata.toString());
            return true;
        }
        return false;
    }
    /**
     * Retrieves metadata for the plugin based on its directory creation time.
     *
     * Constructs the path to the plugin directory, retrieves its stats, and returns the directory's creation time in milliseconds.
     *
     * @returns {Promise<number>} A promise that resolves to the plugin directory's creation time in milliseconds.
     * @throws {Error} Throws an error if the plugin directory is not found.
     */
    async getPluginMetadata() {
        const { dir: pluginDir } = this.plugin.manifest;
        if (!pluginDir) {
            throw new Error('No plugin dir found.');
        }
        const pluginDirStat = await this.plugin.app.vault.adapter.stat(pluginDir);
        return pluginDirStat?.ctime ?? 0;
    }
}

/**
 * Abstract class representing a Publisher.
 */
class Publisher {
    plugin;
    constructor(plugin) {
        this.plugin = plugin;
    }
}
/**
 * Publisher for DiagramZoomDrag eventHandlers.
 */
class EventPublisher extends Publisher {
    constructor(plugin) {
        super(plugin);
    }
    /**
     * Publishes an DiagramZoomDrag event.
     * @param event - the DiagramZoomDragEvent object.
     */
    publish(event) {
        event.emitter.trigger(event.eventID, event);
    }
}
/**
 * Abstract class representing an Observer.
 */
class Observer {
    plugin;
    constructor(plugin) {
        this.plugin = plugin;
    }
}
/**
 * Observer for handling DiagramZoomDrag eventHandlers.
 */
class EventObserver extends Observer {
    subscriptions = new Map();
    constructor(plugin) {
        super(plugin);
    }
    /**
     * Subscribes to an DiagramZoomDrag event.
     * @param emitter - The event emitter object.
     * @param eventID - The ID of the event to subscribe to.
     * @param handler - The asynchronous callback function to handle the event.
     * @typeparam T - The specific type of DiagramZoomDragEvent being subscribed to.
     */
    subscribe(emitter, eventID, handler) {
        const eventRef = emitter.on(eventID, async (...data) => {
            const event = data[0];
            await handler(event);
        });
        if (!this.subscriptions.has(emitter)) {
            this.subscriptions.set(emitter, new Map());
        }
        const emitterSubs = this.subscriptions.get(emitter);
        if (!emitterSubs.has(eventID)) {
            emitterSubs.set(eventID, []);
        }
        emitterSubs.get(eventID).push(() => emitter.offref(eventRef));
    }
    /**
     * Subscribes to an event in the context of a specific view.
     * The subscription will be automatically cleaned up when the view is unloaded.
     * @param view - The view context
     * @param emitter - The event emitter object
     * @param eventID - The ID of the event to subscribe to
     * @param handler - The asynchronous callback function to handle the event
     */
    subscribeForView(view, emitter, eventID, handler) {
        this.subscribe(emitter, eventID, handler);
        view.register(() => this.unsubscribeFromEvent(emitter, eventID));
    }
    /**
     * Unsubscribes from all events on all emitters
     */
    unsubscribeAll() {
        this.subscriptions.forEach((emitterSubs, emitter) => {
            emitterSubs.forEach((handlers) => {
                handlers.forEach((unsubscribe) => unsubscribe());
            });
        });
        this.subscriptions.clear();
    }
    /**
     * Unsubscribes from all events on a specific emitter
     * @param emitter - The event emitter object
     */
    unsubscribeFromEmitter(emitter) {
        const emitterSubs = this.subscriptions.get(emitter);
        if (emitterSubs) {
            emitterSubs.forEach((handlers) => {
                handlers.forEach((unsubscribe) => unsubscribe());
            });
            this.subscriptions.delete(emitter);
        }
    }
    /**
     * Unsubscribes from a specific event on a specific emitter
     * @param emitter - The event emitter object
     * @param eventID - The ID of the event to unsubscribe from
     */
    unsubscribeFromEvent(emitter, eventID) {
        const emitterSubs = this.subscriptions.get(emitter);
        if (emitterSubs) {
            const handlers = emitterSubs.get(eventID);
            if (handlers) {
                handlers.forEach((unsubscribe) => unsubscribe());
                emitterSubs.delete(eventID);
            }
            if (emitterSubs.size === 0) {
                this.subscriptions.delete(emitter);
            }
        }
    }
}

function publishPanelsStateEvent(plugin, visible) {
    plugin.publisher.publish({
        eventID: EventID.PanelsChangedVisibility,
        timestamp: new Date(),
        emitter: plugin.app.workspace,
        data: {
            visible: visible,
        },
    });
}
/**
 * Updates an HTML button element with a given icon and/or title
 * @param button the HTML button element to update
 * @param icon the icon to set on the button (optional)
 * @param title the title to set on the button (optional)
 * @returns void
 */
function updateButton(button, icon, title) {
    if (icon) {
        obsidian.setIcon(button, icon);
    }
    if (title) {
        button.ariaLabel = title;
    }
}

class State {
    diagram;
    data = new Map();
    constructor(diagram) {
        this.diagram = diagram;
        Object.defineProperties(this.diagram, {
            dx: {
                get: () => this.dx,
                set: (value) => {
                    this.dx = value;
                },
            },
            dy: {
                get: () => this.dy,
                set: (value) => {
                    this.dy = value;
                },
            },
            scale: {
                get: () => this.scale,
                set: (value) => {
                    this.scale = value;
                },
            },
            nativeTouchEventsEnabled: {
                get: () => this.nativeTouchEventsEnabled,
                set: (value) => {
                    this.nativeTouchEventsEnabled = value;
                },
            },
            source: {
                get: () => this.source,
                set: (value) => {
                    this.source = value;
                },
            },
            panelsData: {
                get: () => this.panelsData,
                set: (value) => {
                    this.panelsData = value;
                },
            },
            livePreviewObserver: {
                get: () => this.livePreviewObserver,
                set: (observer) => {
                    this.livePreviewObserver = observer;
                },
            },
        });
    }
    /**
     * Initializes the leaf data for the specified leaf ID.
     *
     * This method checks if the given leaf ID already exists in the data map.
     * If it does not exist, it adds the leaf ID with an empty containers
     * object as its value, initializing the data structure for future use.
     *
     * @param leafID - The ID of the leaf to initialize.
     */
    initializeLeafData(leafID) {
        if (!this.data.get(leafID)) {
            this.data.set(leafID, {
                containers: {},
            });
        }
    }
    /**
     * Initializes the container state with default values and sets the source of the diagram.
     *
     * If the leaf ID is not already in the `data` map, it will be added with an empty object as its value.
     * Then, it initializes the dx, dy, scale, and other properties to their default values.
     *
     * @param containerID - The ID of the container to initialize.
     * @param source - The source of the diagram to be set.
     */
    initializeContainer(containerID, source) {
        const leafID = this.diagram.plugin.leafID;
        const viewData = this.data.get(leafID);
        if (viewData) {
            viewData.containers[containerID] = {
                dx: 0,
                dy: 0,
                scale: 1,
                nativeTouchEventsEnabled: true,
                panelsData: {},
                source: source,
            };
        }
    }
    /**
     * Initializes the panels data for the control panel and its associated panels.
     *
     * This method assigns the control panel and its associated panels (move, fold, zoom, and service)
     * to the panels data object, which is then stored in the state.
     *
     * @param controlPanel - The control panel to assign to the panels data.
     * @param movePanel - The move panel to assign to the panels data.
     * @param foldPanel - The fold panel to assign to the panels data.
     * @param zoomPanel - The zoom panel to assign to the panels data.
     * @param servicePanel - The service panel to assign to the panels data.
     */
    initializeContainerPanels(controlPanel, movePanel, foldPanel, zoomPanel, servicePanel) {
        this.panelsData = {
            panels: {
                move: movePanel,
                fold: foldPanel,
                zoom: zoomPanel,
                service: servicePanel,
            },
            controlPanel: controlPanel,
        };
    }
    async cleanupContainers() {
        const data = this.data.get(this.diagram.plugin.leafID);
        if (!data) {
            return;
        }
        const currentFileCtime = this.diagram.plugin.view?.file?.stat.ctime;
        const containersIds = Object.keys(data);
        for (const containerId of containersIds) {
            const containerFileCtime = parseInt(containerId.split('-')[1], 10);
            if (currentFileCtime !== containerFileCtime) {
                delete data.containers[containerId];
            }
        }
    }
    /**
     * Removes the view data associated with the given leaf ID.
     *
     * @param field - The leaf ID of the view data to remove.
     */
    cleanupData(field) {
        const data = this.data.get(field);
        data?.livePreviewObserver?.disconnect();
        this.data.delete(field);
    }
    /**
     * Gets the value of the given field from the view data for the active
     * container and leaf.
     *
     * @param field - The field to get the value for.
     * @returns The value of the given field from the view data for the active
     * container and leaf, or `undefined` if no view data is available.
     */
    getData(field) {
        const activeContainer = this.diagram.activeContainer;
        if (!activeContainer) {
            return;
        }
        const leafID = this.diagram.plugin.leafID;
        if (!leafID) {
            return;
        }
        const data = this.data.get(leafID);
        if (data?.containers[activeContainer.id]) {
            return data?.containers[activeContainer.id][field];
        }
    }
    /**
     * Sets the value of the given field in the view data for the active
     * container and leaf.
     *
     * @param field - The field to set the value for.
     * @param value - The value to set for the given field.
     */
    setData(field, value) {
        const activeContainer = this.diagram.activeContainer;
        if (!activeContainer) {
            return;
        }
        const leafID = this.diagram.plugin.leafID;
        if (!leafID) {
            return;
        }
        const viewData = this.data.get(leafID);
        if (!viewData) {
            return;
        }
        if (viewData.containers[activeContainer.id]) {
            viewData.containers[activeContainer.id][field] = value;
        }
    }
    /**
     * The horizontal distance from the origin of the active container that the
     * diagram is currently translated. If the view data is not available, this
     * property returns 0.
     */
    get dx() {
        return this.getData('dx') ?? 0;
    }
    /**
     * Sets the horizontal distance from the origin of the active container that the
     * diagram is currently translated.
     *
     * @param value - The new horizontal distance from the origin of the active container.
     */
    set dx(value) {
        this.setData('dx', value);
    }
    /**
     * The vertical distance from the origin of the active container that the
     * diagram is currently translated. If the view data is not available, this
     * property returns 0.
     */
    get dy() {
        return this.getData('dy') ?? 0;
    }
    /**
     * Sets the vertical distance from the origin of the active container that the
     * diagram is currently translated.
     *
     * @param value - The new vertical distance from the origin of the active container.
     */
    set dy(value) {
        this.setData('dy', value);
    }
    /**
     * The current zoom factor of the diagram in the active container.
     *
     * If the view data is not available, this property returns 1.
     */
    get scale() {
        return this.getData('scale') ?? 1;
    }
    /**
     * Sets the current zoom factor of the diagram in the active container.
     *
     * @param value - The new zoom factor of the diagram in the active container.
     */
    set scale(value) {
        this.setData('scale', value);
    }
    /**
     * Whether native touch eventHandlers are currently enabled for the diagram in the
     * active container.
     *
     * If the view data is not available, this property returns `true`.
     */
    get nativeTouchEventsEnabled() {
        return this.getData('nativeTouchEventsEnabled') ?? true;
    }
    /**
     * Sets whether native touch eventHandlers are currently enabled for the diagram in the
     * active container.
     *
     * @param value - The new value for whether native touch eventHandlers are enabled.
     */
    set nativeTouchEventsEnabled(value) {
        this.setData('nativeTouchEventsEnabled', value);
    }
    /**
     * The source string of the diagram in the active container.
     *
     * If source is not available, this property returns 'No source available'.
     */
    get source() {
        return this.getData('source') ?? 'No source available';
    }
    /**
     * Sets the source string of the diagram in the active container.
     *
     * @param source - The new source string for the diagram.
     */
    set source(source) {
        this.setData('source', source);
    }
    /**
     * Gets the panels data for the active container and leaf.
     *
     * This data includes information about the control panel and its associated panels,
     * such as move, fold, zoom, and service panels.
     *
     * @returns The panels data for the active container and leaf, or an empty object
     * if no panels data is available.
     */
    get panelsData() {
        return this.getData('panelsData') ?? {};
    }
    /**
     * Sets the panels data for the active container and leaf.
     *
     * This data includes information about the control panel and its associated panels,
     * such as move, fold, zoom, and service panels.
     *
     * @param panelsData - The new panels data to set for the active container and leaf.
     */
    set panelsData(panelsData) {
        this.setData('panelsData', panelsData);
    }
    /**
     * Gets the MutationObserver instance for the active leaf if it exists.
     *
     * This observer is used to detect changes to the diagram container in the active
     * leaf, and is only available if the leaf is in live preview mode.
     *
     * @returns The MutationObserver instance for the active leaf, or `undefined`
     * if no observer is available.
     */
    get livePreviewObserver() {
        const data = this.data.get(this.diagram.plugin.leafID);
        return data?.livePreviewObserver;
    }
    /**
     * Sets the MutationObserver instance for the active leaf.
     *
     * This observer is used to detect changes to the diagram container in the active
     * leaf, and is only available if the leaf is in live preview mode.
     *
     * @param observer - The MutationObserver instance to set for the active leaf.
     */
    set livePreviewObserver(observer) {
        const data = this.data.get(this.diagram.plugin.leafID);
        if (data) {
            data.livePreviewObserver = observer;
        }
    }
}

class MovePanel {
    diagram;
    diagramControlPanel;
    panel;
    constructor(diagram, diagramControlPanel) {
        this.diagram = diagram;
        this.diagramControlPanel = diagramControlPanel;
    }
    /**
     * Initializes the move panel.
     *
     * This method creates the HTML element of the move panel and assigns it to the `panel` property.
     */
    initialize() {
        this.panel = this.createPanel();
    }
    /**
     * Returns an array of objects representing the buttons in the move panel.
     *
     * The buttons are objects with the following properties:
     * - `icon`: The icon to display in the button.
     * - `action`: The action to perform when the button is clicked.
     * - `title`: The title of the button.
     * - `active`: Whether the button is active or not.
     * - `id`: The id of the button.
     *
     * The move panel has 8 buttons, each of which moves the container in a different direction.
     *
     * @param container The container to which the move panel is attached.
     * @returns An array of objects representing the buttons in the move panel.
     */
    getButtons(container) {
        return [
            {
                icon: 'arrow-up-left',
                action: () => this.diagram.actions.moveElement(container, 50, 50, true),
                title: 'Move up left',
            },
            {
                icon: 'arrow-up',
                action: () => this.diagram.actions.moveElement(container, 0, 50, true),
                title: 'Move up',
            },
            {
                icon: 'arrow-up-right',
                action: () => this.diagram.actions.moveElement(container, -50, 50, true),
                title: 'Move up right',
            },
            {
                icon: 'arrow-left',
                action: () => this.diagram.actions.moveElement(container, 50, 0, true),
                title: 'Move left',
            },
            {
                icon: '',
                action: () => { },
                title: '',
                active: false,
                id: '',
            },
            {
                icon: 'arrow-right',
                action: () => this.diagram.actions.moveElement(container, -50, 0, true),
                title: 'Move right',
            },
            {
                icon: 'arrow-down-left',
                action: () => this.diagram.actions.moveElement(container, 50, -50, true),
                title: 'Move down left',
            },
            {
                icon: 'arrow-down',
                action: () => this.diagram.actions.moveElement(container, 0, -50, true),
                title: 'Move down',
            },
            {
                icon: 'arrow-down-right',
                action: () => this.diagram.actions.moveElement(container, -50, -50, true),
                title: 'Move down right',
            },
        ];
    }
    /**
     * Creates the HTML element of the move panel.
     *
     * The move panel is a container with absolute positioning that is placed at the bottom right of the diagram.
     * It contains 8 buttons that move the currently selected container in the diagram.
     * The buttons are created using the `getButtons` method and are then appended to the panel.
     *
     * @returns The HTML element of the move panel.
     */
    createPanel() {
        const panel = this.diagramControlPanel.createPanel('diagram-move-panel', {
            ...this.diagram.plugin.settings.panelsConfig.move.position,
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
        });
        const moveButtons = this.getButtons(this.diagram.activeContainer);
        moveButtons.forEach((btn) => panel.appendChild(this.diagramControlPanel.createButton(btn.icon, btn.action, btn.title, btn.active, btn.id)));
        return panel;
    }
}

class ZoomPanel {
    diagram;
    diagramControlPanel;
    panel;
    constructor(diagram, diagramControlPanel) {
        this.diagram = diagram;
        this.diagramControlPanel = diagramControlPanel;
    }
    /**
     * Initializes the zoom panel.
     *
     * This method creates the HTML element of the zoom panel and assigns it to the `panel` property.
     */
    initialize() {
        this.panel = this.createPanel();
    }
    /**
     * Returns an array of objects representing the buttons in the zoom panel.
     *
     * The buttons are objects with the following properties:
     * - `icon`: The icon to display in the button.
     * - `action`: The action to perform when the button is clicked.
     * - `title`: The title of the button.
     * - `active`: Whether the button is active or not.
     * - `id`: The id of the button.
     *
     * The zoom panel has 3 buttons:
     * - A button to zoom in.
     * - A button to reset zoom and move to the default state.
     * - A button to zoom out.
     *
     * @param container The container to which the zoom panel is attached.
     * @returns An array of objects representing the buttons in the zoom panel.
     */
    getButtons(container) {
        return [
            {
                icon: 'zoom-in',
                action: () => this.diagram.actions.zoomElement(container, 1.1, true),
                title: 'Zoom In',
            },
            {
                icon: 'refresh-cw',
                action: () => this.diagram.actions.resetZoomAndMove(container, true),
                title: 'Reset Zoom and Position',
            },
            {
                icon: 'zoom-out',
                action: () => this.diagram.actions.zoomElement(container, 0.9, true),
                title: 'Zoom Out',
            },
        ];
    }
    /**
     * Creates the HTML element of the zoom panel.
     *
     * The zoom panel is a container with absolute positioning that is placed at the right middle of the diagram.
     * It contains 3 buttons that zoom in, reset zoom and position, and zoom out the diagram.
     * The buttons are created using the `getButtons` method and are then appended to the panel.
     *
     * @returns The HTML element of the zoom panel.
     */
    createPanel() {
        const zoomPanel = this.diagramControlPanel.createPanel('diagram-zoom-panel', {
            ...this.diagram.plugin.settings.panelsConfig.zoom.position,
            transform: 'translateY(-50%)',
            gridTemplateColumns: '1fr',
        });
        const zoomButtons = this.getButtons(this.diagram.activeContainer);
        zoomButtons.forEach((btn) => zoomPanel.appendChild(this.diagramControlPanel.createButton(btn.icon, btn.action, btn.title, true)));
        return zoomPanel;
    }
}

class FoldPanel {
    diagram;
    diagramControlPanel;
    panel;
    constructor(diagram, diagramControlPanel) {
        this.diagram = diagram;
        this.diagramControlPanel = diagramControlPanel;
    }
    /**
     * Initialize the fold panel.
     *
     * This method creates the HTML element of the fold panel and assigns it to the `panel` property.
     */
    initialize() {
        this.panel = this.createPanel();
    }
    /**
     * Return an array of objects representing the buttons in the fold panel.
     *
     * The buttons are objects with the following properties:
     * - `icon`: The icon to display in the button.
     * - `action`: The action to perform when the button is clicked.
     * - `title`: The title of the button.
     * - `active`: Whether the button is active or not.
     * - `id`: The id of the button.
     *
     * The fold panel has only one button, which toggles the folded state of the container.
     *
     * @param container The container to which the fold panel is attached.
     * @returns An array of objects representing the buttons in the fold panel.
     */
    getButtons(container) {
        const isFolded = this.diagram.activeContainer.hasClass('folded');
        return [
            {
                icon: isFolded ? 'unfold-vertical' : 'fold-vertical',
                action: () => {
                    container.classList.toggle('folded');
                    if (this.diagram.plugin.livePreview) {
                        container.parentElement?.classList.toggle('folded');
                    }
                    this.diagram.updateDiagramSizeBasedOnStatus(container);
                },
                title: isFolded ? 'Expand diagram' : 'Fold diagram',
                id: 'diagram-fold-button',
            },
        ];
    }
    /**
     * Creates the HTML element of the fold panel.
     *
     * The fold panel is a container with absolute positioning that is placed at the bottom of the diagram.
     * It contains a single button that toggles the folded state of the container.
     * The button is created using the `getButtons` method and is then appended to the panel.
     *
     * @returns The HTML element of the fold panel.
     */
    createPanel() {
        const foldPanel = this.diagramControlPanel.createPanel('diagram-fold-panel', {
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            gridTemplateColumns: '1fr',
        });
        const foldButtons = this.getButtons(this.diagram.activeContainer);
        foldButtons.forEach((button) => {
            const btn = this.diagramControlPanel.createButton(button.icon, button.action, button.title, true, button.id);
            foldPanel.appendChild(btn);
        });
        return foldPanel;
    }
}

class ServicePanel {
    diagram;
    diagramControlPanel;
    panel;
    hiding = false;
    constructor(diagram, diagramControlPanel) {
        this.diagram = diagram;
        this.diagramControlPanel = diagramControlPanel;
    }
    /**
     * Initializes the service panel.
     *
     * This method creates the HTML element of the service panel and assigns it to the `panel` property.
     */
    initialize() {
        this.panel = this.createPanel();
        this.setupEventListeners();
    }
    /**
     * Returns an array of objects representing the buttons in the service panel.
     *
     * The buttons are objects with the following properties:
     * - `icon`: The icon to display in the button.
     * - `action`: The action to perform when the button is clicked.
     * - `title`: The title of the button.
     * - `active`: Whether the button is active or not.
     * - `id`: The id of the button.
     *
     * The service panel has the following buttons:
     * - A button to hide and show the move and zoom panels.
     * - A button to open the diagram in fullscreen mode.
     * - A button to enable and disable native touch events for the diagram.
     *
     * @param container The container to which the service panel is attached.
     * @returns An array of objects representing the buttons in the service panel.
     */
    getButtons(container) {
        const buttons = [];
        if (this.diagram.plugin.settings.addHidingButton) {
            buttons.push({
                icon: this.hiding ? 'eye-off' : 'eye',
                action: () => {
                    const panelsData = this.diagram.state.panelsData;
                    if (!panelsData?.panels) {
                        return;
                    }
                    this.hiding = !this.hiding;
                    [panelsData.panels.move, panelsData.panels.zoom].forEach((panel) => {
                        if (!panel.panel) {
                            return;
                        }
                        panel.panel.toggleClass('hidden', this.hiding);
                        panel.panel.toggleClass('visible', !this.hiding);
                    });
                    const button = this.panel.querySelector('#hide-show-button-diagram');
                    if (!button) {
                        return;
                    }
                    updateButton(button, !this.hiding ? 'eye' : 'eye-off', `${this.hiding ? 'Show' : 'Hide'} move and zoom panels`);
                },
                title: `Hide move and zoom panels`,
                id: 'hide-show-button-diagram',
            });
        }
        buttons.push({
            icon: 'maximize',
            action: async () => {
                const button = container.querySelector('#fullscreen-button');
                if (!button) {
                    return;
                }
                if (!document.fullscreenElement) {
                    container.addClass('is-fullscreen');
                    await container.requestFullscreen({
                        navigationUI: 'auto',
                    });
                    updateButton(button, 'minimize', 'Open in fullscreen mode');
                }
                else {
                    container.removeClass('is-fullscreen');
                    await document.exitFullscreen();
                    updateButton(button, 'maximize', 'Exit fullscreen mode');
                }
            },
            title: 'Open in fullscreen mode',
            id: 'fullscreen-button',
        });
        if (obsidian.Platform.isMobileApp) {
            buttons.push({
                icon: this.diagram.nativeTouchEventsEnabled
                    ? 'circle-slash-2'
                    : 'hand',
                action: () => {
                    this.diagram.nativeTouchEventsEnabled =
                        !this.diagram.nativeTouchEventsEnabled;
                    const btn = this.panel.querySelector('#native-touch-event');
                    if (!btn) {
                        return;
                    }
                    const nativeEvents = this.diagram.nativeTouchEventsEnabled;
                    updateButton(btn, this.diagram.nativeTouchEventsEnabled
                        ? 'circle-slash-2'
                        : 'hand', `${nativeEvents ? 'Enable' : 'Disable'} move and pinch zoom`);
                    this.diagram.plugin.showNotice(`Native touches are ${nativeEvents ? 'enabled' : 'disabled'} now. 
            You ${nativeEvents ? 'cannot' : 'can'} move and pinch zoom diagram diagram.`);
                },
                title: `${this.diagram.nativeTouchEventsEnabled ? 'Enable' : 'Disable'} move and pinch zoom`,
                id: 'native-touch-event',
            });
        }
        return buttons;
    }
    /**
     * Creates the HTML element of the service panel.
     *
     * The service panel is a container with absolute positioning that is placed at the top right of the diagram.
     * It contains buttons that provide additional functionality for the diagram.
     * The buttons are created using the `getButtons` method and are then appended to the panel.
     *
     * @returns The HTML element of the service panel.
     */
    createPanel() {
        const servicePanel = this.diagramControlPanel.createPanel('diagram-service-panel', {
            ...this.diagram.plugin.settings.panelsConfig.service.position,
            gridTemplateColumns: 'repeat(auto-fit, minmax(24px, 1fr))',
            gridAutoFlow: 'column',
        });
        const serviceButtons = this.getButtons(this.diagram.activeContainer);
        serviceButtons.forEach((btn) => servicePanel.appendChild(this.diagramControlPanel.createButton(btn.icon, btn.action, btn.title, true, btn.id)));
        return servicePanel;
    }
    /**
     * Sets up event listeners for the service panel.
     *
     * This method registers event listeners for the fullscreen and visibility change events.
     * It listens for the 'fullscreenchange' event on the diagram container to handle changes
     * in fullscreen mode. It also subscribes to the PanelsChangedVisibility event to update
     * the visibility of move and zoom panels.
     *
     * - The fullscreen button is used to toggle fullscreen mode and updates its icon and tooltip
     *   to reflect the current state.
     * - The hide/show button updates its icon and tooltip based on the visibility of the move
     *   and zoom panels.
     */
    setupEventListeners() {
        const fullscreenButton = this.panel.querySelector('#fullscreen-button');
        const container = this.diagram.activeContainer;
        if (!fullscreenButton) {
            return;
        }
        this.diagram.plugin.view?.registerDomEvent(container, 'fullscreenchange', this.onFullScreenChange.bind(this, container, fullscreenButton));
        const hidingB = this.panel.querySelector('#hide-show-button-diagram');
        this.diagram.plugin.observer.subscribe(this.diagram.plugin.app.workspace, EventID.PanelsChangedVisibility, async (e) => {
            const visible = e.data.visible;
            if (!hidingB) {
                return;
            }
            this.hiding = !visible;
            updateButton(hidingB, this.hiding ? 'eye-off' : 'eye', `${this.hiding ? 'Show' : 'Hide'} move and zoom panels`);
            obsidian.setIcon(hidingB, this.hiding ? 'eye-off' : 'eye');
        });
    }
    /**
     * Handles the change in fullscreen mode for the diagram container.
     *
     * This method is triggered when the fullscreen state of the container changes.
     * It resets the zoom and position of the diagram and updates the fullscreen
     * button's icon and tooltip based on the new fullscreen state.
     *
     * @param container - The HTML element representing the diagram container.
     * @param button - The button element to update with the corresponding icon
     * and tooltip for fullscreen mode.
     */
    onFullScreenChange(container, button) {
        if (document.fullscreenElement) {
            requestAnimationFrame(() => {
                this.diagram.actions.resetZoomAndMove(container);
            });
            updateButton(button, 'minimize', 'Exit fullscreen mode');
        }
        else {
            requestAnimationFrame(() => {
                this.diagram.actions.resetZoomAndMove(container);
            });
            updateButton(button, 'maximize', 'Open in fullscreen mode');
        }
    }
}

class ControlPanel {
    diagram;
    constructor(diagram) {
        this.diagram = diagram;
    }
    /**
     * Initializes the control panel for the diagram.
     *
     * This method creates the control panel and its associated panels (move, fold, zoom, and service).
     * It then assigns the control panel and its associated panels to the panels data object,
     * which is then stored in the state.
     *
     * @param container - The container element that will contain the control panel.
     * @param diagramData - The data for the diagram.
     */
    initialize(container, diagramData) {
        this.diagram.activeContainer = container;
        const controlPanel = container.createDiv();
        controlPanel.addClass('diagram-zoom-drag-control-panel');
        const move = new MovePanel(this.diagram, this);
        const zoom = new ZoomPanel(this.diagram, this);
        const fold = new FoldPanel(this.diagram, this);
        const service = new ServicePanel(this.diagram, this);
        this.diagram.state.initializeContainerPanels(controlPanel, move, fold, zoom, service);
        fold.initialize();
        if (this.diagram.plugin.settings.panelsConfig.move.enabled &&
            diagramData.panels.move.on) {
            move.initialize();
        }
        if (this.diagram.plugin.settings.panelsConfig.zoom.enabled &&
            diagramData.panels.zoom.on) {
            zoom.initialize();
        }
        if (this.diagram.plugin.settings.panelsConfig.service.enabled &&
            diagramData.panels.service.on) {
            service.initialize();
        }
        if (this.diagram.plugin.settings.hideOnMouseOutDiagram ||
            this.diagram.activeContainer?.hasClass('folded')) {
            [move, zoom, service].forEach((panel) => {
                panel.panel.removeClass('visible');
                panel.panel.addClass('hidden');
            });
        }
        this.diagram.activeContainer?.appendChild(controlPanel);
    }
    /**
     * Creates a new panel element with the given CSS class and styles.
     *
     * This function is used to create the various control panels used in the diagram.
     * The control panels are created by calling this function with the desired CSS class
     * (e.g. 'move-panel', 'zoom-panel', etc.) and an object containing the styles for the
     * panel.
     *
     * @param cssClass The CSS class to add to the panel element.
     * @param styles An object containing the styles for the panel.
     * @returns The created panel element.
     */
    createPanel(cssClass, styles) {
        const controlPanel = this.diagram.panelsData?.controlPanel;
        const panel = controlPanel.createEl('div');
        panel.addClass(cssClass);
        panel.addClass('diagram-zoom-drag-panel');
        panel.setCssStyles(styles);
        return panel;
    }
    /**
     * Creates a new button element with the given icon, action, title, and properties.
     *
     * This function is used to create buttons for the control panels used in the diagram.
     * The buttons are created with the given icon and title, and the action is called when the button is clicked.
     * The button is also styled according to the given properties.
     *
     * @param icon The icon to display on the button.
     * @param action The action to call when the button is clicked.
     * @param title The title of the button.
     * @param active Whether the button is active or not. If not active, the button is hidden.
     * @param id The id of the button element.
     * @returns The created button element.
     */
    createButton(icon, action, title, active = true, id = undefined) {
        const button = document.createElement('button');
        button.className = 'button';
        button.id = id ?? '';
        if (active) {
            button.setCssStyles({
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '3px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.2s ease',
            });
            updateButton(button, icon, title);
            this.diagram.plugin.view.registerDomEvent(button, 'click', action);
            this.diagram.plugin.view.registerDomEvent(button, 'mouseenter', () => {
                button.setCssStyles({
                    color: 'var(--interactive-accent)',
                });
            });
            this.diagram.plugin.view.registerDomEvent(button, 'mouseleave', () => {
                button.setCssStyles({
                    color: 'var(--text-muted)',
                });
            });
        }
        else {
            button.setCssStyles({
                visibility: 'hidden',
            });
        }
        return button;
    }
}

class MouseHandler {
    diagramEvents;
    startX;
    startY;
    initialX;
    initialY;
    isDragging = false;
    constructor(diagramEvents) {
        this.diagramEvents = diagramEvents;
    }
    /**
     * Adds mouse event listeners to the given container element.
     *
     * This function adds the following event listeners to the given container element:
     * - `wheel`: Handles the wheel event for the diagram element, zooming it in or out.
     * - `mousedown`: Handles the start of a mouse drag event for the diagram element.
     * - `mousemove`: Handles the move event for the diagram element, moving it if the drag is in progress.
     * - `mouseup`: Handles the end of a mouse drag event for the diagram element.
     * - `mouseleave`: Handles the leave event for the diagram element, stopping any drag in progress.
     *
     * @param container - The container element to add the mouse event listeners to.
     */
    initialize(container) {
        const diagramElement = container.querySelector(this.diagramEvents.diagram.compoundSelector);
        if (!diagramElement) {
            return;
        }
        if (diagramElement.hasClass('eventHandlers-bound')) {
            return;
        }
        if (!this.diagramEvents.diagram.plugin.view) {
            return;
        }
        diagramElement.addClass('eventHandlers-bound');
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'wheel', this.wheel.bind(this, container, diagramElement), { passive: true });
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'mousedown', this.mouseDown.bind(this, container, diagramElement));
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'mousemove', this.mouseMove.bind(this, container, diagramElement));
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'mouseup', this.mouseUp.bind(this, container, diagramElement));
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'mouseleave', this.mouseLeave.bind(this, container, diagramElement));
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'mouseenter', this.mouseEnterOnDiagram.bind(this, container));
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'mouseleave', this.mouseLeaveOutDiagram.bind(this, container));
    }
    /**
     * Handles the wheel event for the diagram element, zooming it in or out.
     *
     * The wheel event is only handled if the Ctrl key is pressed.
     * The zooming is done by changing the scale of the diagram element,
     * and applying a transformation to move the element to the correct
     * position.
     *
     * @param container - The container element.
     * @param diagramElement - The diagram element.
     * @param event - The wheel event.
     */
    wheel(container, diagramElement, event) {
        if (!event.ctrlKey && document.fullscreenElement !== container) {
            return;
        }
        this.diagramEvents.diagram.activeContainer = container;
        const rect = diagramElement.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const prevScale = this.diagramEvents.diagram.scale;
        this.diagramEvents.diagram.scale += event.deltaY * -0.001;
        this.diagramEvents.diagram.scale = Math.max(0.125, this.diagramEvents.diagram.scale);
        const dx = offsetX * (1 - this.diagramEvents.diagram.scale / prevScale);
        const dy = offsetY * (1 - this.diagramEvents.diagram.scale / prevScale);
        this.diagramEvents.diagram.dx += dx;
        this.diagramEvents.diagram.dy += dy;
        diagramElement.setCssStyles({
            transform: `translate(${this.diagramEvents.diagram.dx}px, ${this.diagramEvents.diagram.dy}px) scale(${this.diagramEvents.diagram.scale})`,
        });
    }
    /**
     * Handles the mouse down event for the diagram element.
     * If the left mouse button is clicked, it sets the active container to the given container,
     * focuses on the container, enables dragging, and sets initial positions and cursor style.
     *
     * @param container - The container element where the event occurred.
     * @param diagramElement - The diagram element where the event occurred.
     * @param event - The mouse event that triggered the function.
     */
    mouseDown(container, diagramElement, event) {
        if (event.button !== 0) {
            return;
        }
        this.diagramEvents.diagram.activeContainer = container;
        container.focus({ preventScroll: true });
        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.initialX = this.diagramEvents.diagram.dx;
        this.initialY = this.diagramEvents.diagram.dy;
        diagramElement.setCssStyles({
            cursor: 'grabbing',
        });
        event.preventDefault();
    }
    /**
     * Handles the mouse move event for the diagram element.
     * If dragging is active, this method updates the position of the diagram
     * element based on the mouse movement and applies the new transformation
     * to the element's CSS styles.
     *
     * @param container - The container element where the event is occurring.
     * @param diagramElement - The diagram element that is being moved.
     * @param event - The mouse event that triggered the method.
     */
    mouseMove(container, diagramElement, event) {
        if (!this.isDragging) {
            return;
        }
        this.diagramEvents.diagram.activeContainer = container;
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        this.diagramEvents.diagram.dx = this.initialX + dx;
        this.diagramEvents.diagram.dy = this.initialY + dy;
        diagramElement.setCssStyles({
            transform: `translate(${this.diagramEvents.diagram.dx}px, ${this.diagramEvents.diagram.dy}px) scale(${this.diagramEvents.diagram.scale})`,
        });
    }
    /**
     * Handles the mouse up event for the diagram element.
     * If dragging is active, this method resets the dragging state and
     * sets the cursor style to 'grab'.
     *
     * @param container - The container element where the event occurred.
     * @param diagramElement - The diagram element where the event occurred.
     * @param event - The mouse event that triggered the method.
     */
    mouseUp(container, diagramElement, event) {
        this.diagramEvents.diagram.activeContainer = container;
        this.isDragging = false;
        diagramElement.setCssStyles({ cursor: 'grab' });
    }
    /**
     * Handles the mouse leave event for the diagram element.
     * This method simulates a mouse up event when the mouse leaves
     * the diagram element, ensuring any dragging in progress is stopped
     * and the cursor style is reset.
     *
     * @param container - The container element where the event occurred.
     * @param diagramElement - The diagram element where the event occurred.
     * @param event - The mouse event that triggered the method.
     */
    mouseLeave(container, diagramElement, event) {
        this.mouseUp(container, diagramElement, event);
    }
    /**
     * Handles the mouse enter event for the diagram element when the setting is enabled.
     * If container is in a 'folded' state, this method does nothing.
     * This method shows all panels-management in the diagram when the mouse enters the diagram element.
     *
     * @param container - The container element where the event occurred.
     * @param e - The mouse event that triggered the method.
     */
    mouseEnterOnDiagram(container, e) {
        if (!this.diagramEvents.diagram.plugin.settings.hideOnMouseOutDiagram) {
            return;
        }
        if (container.hasClass('folded')) {
            return;
        }
        const panelsData = this.diagramEvents.diagram.state.panelsData;
        if (panelsData?.panels) {
            [
                panelsData.panels.move.panel,
                panelsData.panels.zoom.panel,
                panelsData.panels.service.panel,
            ].forEach((panel) => {
                panel.removeClass('hidden');
                panel.addClass('visible');
            });
        }
    }
    /**
     * Handles the mouse leave event for the diagram element when the setting is enabled.
     * If container is in a 'folded' state, this method does nothing.
     * This method hides all panels-management in the diagram when the mouse leaves the diagram element.
     *
     * @param container - The container element where the event occurred.
     * @param e - The mouse event that triggered the method.
     */
    mouseLeaveOutDiagram(container, e) {
        if (!this.diagramEvents.diagram.plugin.settings.hideOnMouseOutDiagram) {
            return;
        }
        if (container.hasClass('folded')) {
            return;
        }
        const panelsData = this.diagramEvents.diagram.state.panelsData;
        if (panelsData?.panels) {
            [
                panelsData.panels.move.panel,
                panelsData.panels.zoom.panel,
                panelsData.panels.service.panel,
            ].forEach((panel) => {
                panel.removeClass('visible');
                panel.addClass('hidden');
            });
        }
    }
}

class TouchHandler {
    diagramEvents;
    startX;
    startY;
    initialDistance;
    isDragging = false;
    isPinching = false;
    constructor(diagramEvents) {
        this.diagramEvents = diagramEvents;
    }
    /**
     * Adds touch event listeners to the given container element.
     *
     * This function registers the following touch event listeners to the given container element:
     * - `touchstart`: Handles the start of a touch event for the container element.
     * - `touchmove`: Handles the movement during a touch event for the container element.
     * - `touchend`: Handles the end of a touch event for the container element.
     *
     * @param container - The container element to add the touch event listeners to.
     */
    initialize(container) {
        if (!this.diagramEvents.diagram.plugin.view) {
            return;
        }
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'touchstart', this.touchStart.bind(this, container), { passive: false });
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'touchmove', this.touchMove.bind(this, container), { passive: false });
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'touchend', this.touchEnd.bind(this, container), { passive: false });
    }
    /**
     * Handles the `touchstart` event on the given container element.
     *
     * If native touch event handling is enabled, this function does nothing.
     *
     * Otherwise, this function sets the active container to the given container,
     * prevents the default behavior of the event, and stops the event from propagating.
     *
     * If there is only one touch point, this function sets the `isDragging` flag to
     * true and records the starting position of the touch.
     *
     * If there are two touch points, this function sets the `isPinching` flag to
     * true and records the initial distance between the two touch points.
     *
     * @param container - The container element that received the touch event.
     * @param e - The `TouchEvent` object that represents the touch event.
     */
    touchStart(container, e) {
        if (this.diagramEvents.diagram.nativeTouchEventsEnabled) {
            return;
        }
        this.diagramEvents.diagram.activeContainer = container;
        const target = e.target;
        // we got touch to a button panel - returning
        if (target.closest('.diagram-zoom-drag-panel')) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }
        else if (e.touches.length === 2) {
            this.isPinching = true;
            this.initialDistance = this.calculateDistance(e.touches);
        }
    }
    /**
     * Handles the `touchmove` event on the given container element.
     *
     * If native touch event handling is enabled, this function does nothing.
     *
     * Otherwise, this function prevents the default behavior of the event
     * and stops the event from propagating. It updates the active container
     * to the given container.
     *
     * If there is one touch point and dragging is enabled, the function
     * calculates the displacement since the last touch position and moves
     * the diagram element by that displacement.
     *
     * If there are two touch points and pinching is enabled, the function
     * calculates the scaling factor based on the change in distance between
     * the touch points and zooms the diagram element by that factor.
     *
     * @param container - The container element that received the touch event.
     * @param e - The `TouchEvent` object that represents the touch event.
     */
    touchMove(container, e) {
        if (this.diagramEvents.diagram.nativeTouchEventsEnabled) {
            return;
        }
        this.diagramEvents.diagram.activeContainer = container;
        e.preventDefault();
        e.stopPropagation();
        const element = container.querySelector(this.diagramEvents.diagram.compoundSelector);
        if (!element) {
            return;
        }
        if (this.isDragging && e.touches.length === 1) {
            const dx = e.touches[0].clientX - this.startX;
            const dy = e.touches[0].clientY - this.startY;
            this.diagramEvents.diagram.actions.moveElement(container, dx, dy);
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }
        else if (this.isPinching && e.touches.length === 2) {
            const currentDistance = this.calculateDistance(e.touches);
            const factor = currentDistance / this.initialDistance;
            this.diagramEvents.diagram.actions.zoomElement(container, factor);
            this.initialDistance = currentDistance;
        }
    }
    /**
     * Handles the `touchend` event on the given container element.
     *
     * If native touch event handling is enabled, this function does nothing.
     *
     * Otherwise, this function prevents the default behavior of the event
     * and stops the event from propagating. It updates the active container
     * to the given container. It also resets the `isDragging` and `isPinching`
     * flags to false.
     *
     * @param container - The container element that received the touch event.
     * @param e - The `TouchEvent` object that represents the touch event.
     */
    touchEnd(container, e) {
        if (this.diagramEvents.diagram.nativeTouchEventsEnabled) {
            return;
        }
        this.diagramEvents.diagram.activeContainer = container;
        const target = e.target;
        // we got touch to a button panel - returning
        if (target.closest('.diagram-zoom-drag-panel')) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = false;
        this.isPinching = false;
    }
    /**
     * Calculates the distance between the two touch points.
     *
     * @param touches - The two touch points.
     * @returns The distance between the two touch points.
     */
    calculateDistance(touches) {
        const [touch1, touch2] = [touches[0], touches[1]];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class KeyboardHandler {
    diagramEvents;
    constructor(diagramEvents) {
        this.diagramEvents = diagramEvents;
    }
    /**
     * Initializes the keyboard event handler for the given container element.
     *
     * This method adds a keydown event listener to the given container element.
     * When a keydown event occurs, the method {@link keyDown} is called with the
     * container and the event as arguments.
     *
     * @param container - The container element to add the keydown event listener to.
     */
    initialize(container) {
        if (!this.diagramEvents.diagram.plugin.view) {
            return;
        }
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'keydown', this.keyDown.bind(this, container));
    }
    /**
     * Handles key events for the diagram element.
     * If the key pressed is within the allowed keys, it performs specific actions based on the key.
     *
     * @param container - The container element where the key event occurred.
     * @param event - The keyboard event that triggered the function.
     */
    keyDown(container, event) {
        const key = event.code;
        const KEYS = [
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Equal',
            'Minus',
            'Digit0',
        ];
        if (!KEYS.includes(key)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.diagramEvents.diagram.activeContainer = container;
        switch (key) {
            case 'ArrowUp':
                this.diagramEvents.diagram.actions.moveElement(container, 0, 50, true);
                break;
            case 'ArrowDown':
                this.diagramEvents.diagram.actions.moveElement(container, 0, -50, true);
                break;
            case 'ArrowLeft':
                this.diagramEvents.diagram.actions.moveElement(container, 50, 0, true);
                break;
            case 'ArrowRight':
                this.diagramEvents.diagram.actions.moveElement(container, -50, 0, true);
                break;
        }
        if (event.ctrlKey) {
            switch (key) {
                case 'Equal':
                    this.diagramEvents.diagram.actions.zoomElement(container, 1.1, true);
                    break;
                case 'Minus':
                    this.diagramEvents.diagram.actions.zoomElement(container, 0.9, true);
                    break;
                case 'Digit0':
                    this.diagramEvents.diagram.actions.resetZoomAndMove(container, true);
                    break;
            }
        }
    }
}

class Folding {
    /**
     * Observes the given container element for changes to its 'class'
     * attribute. When the 'class' attribute changes, the
     * `handleClassChange` method is called with the container element and the
     * relevant MutationRecord.
     *
     * @param container - The container element to observe.
     */
    observe(container) {
        const foldingObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class') {
                    this.handleClassChange(container, mutation);
                }
            });
        });
        foldingObserver.observe(container, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['class'],
        });
    }
    /**
     * Handles changes to the 'class' attribute of the given container element.
     *
     * If the container element's 'class' attribute changes to include or remove
     * the 'folded' class, the following actions are taken:
     * - All child elements of the container with class 'diagram-zoom-drag-panel'
     *   and without class 'diagram-fold-panel' will have their 'hidden' and
     *   'visible' classes toggled.
     * - The element with id 'diagram-fold-button' inside the container element
     *   will have its icon and tooltip text updated.
     *
     * @param container - The container element that was observed by the
     * MutationObserver.
     * @param mutation - The MutationRecord that triggered this method call.
     */
    handleClassChange(container, mutation) {
        const target = mutation.target;
        const wasFolded = (mutation.oldValue ?? '').includes('folded');
        const isFolded = target.hasClass('folded');
        if (wasFolded !== isFolded) {
            const panels = container.querySelectorAll('.diagram-zoom-drag-panel:not(.diagram-fold-panel)');
            panels.forEach((panel) => {
                panel.toggleClass('hidden', isFolded);
                panel.toggleClass('visible', !isFolded);
            });
            const button = container.querySelector('#diagram-fold-button');
            if (button) {
                updateButton(button, isFolded ? 'unfold-vertical' : 'fold-vertical', isFolded ? 'Expand diagram' : 'Fold diagram');
            }
        }
    }
}

class FocusHandler {
    diagramEvents;
    constructor(diagramEvents) {
        this.diagramEvents = diagramEvents;
    }
    /**
     * Adds focus event listeners to the given container element.
     *
     * This function adds the following event listeners to the given container element:
     * - `focusin`: Handles the focus in event for the container element.
     * - `focusout`: Handles the focus out event for the container element.
     *
     * @param container - The container element to add the focus event listeners to.
     */
    initialize(container) {
        if (!this.diagramEvents.diagram.plugin.view) {
            return;
        }
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'focusin', this.focusIn.bind(this, container));
        this.diagramEvents.diagram.plugin.view.registerDomEvent(container, 'focusout', this.focusOut.bind(this, container));
    }
    /**
     * Handles the focus in event for the container element.
     * If automatic folding on focus change is enabled in the diagram plugin settings,
     * the 'folded' class is removed from the container element.
     * The active container is set to the given container.
     *
     * @param container - The container element where the focus in event occurred.
     */
    focusIn(container) {
        if (this.diagramEvents.diagram.plugin.settings
            .automaticCollapsingOnFocusChange) {
            container.removeClass('folded');
            if (this.diagramEvents.diagram.plugin.livePreview) {
                container.parentElement?.removeClass('folded');
            }
        }
        this.diagramEvents.diagram.activeContainer = container;
    }
    /**
     * Handles the focus out event for the container element.
     * If automatic folding on focus change is enabled in the diagram plugin settings,
     * the 'folded' class is added to the container element.
     *
     * @param container - The container element where the focus out event occurred.
     */
    focusOut(container) {
        if (this.diagramEvents.diagram.plugin.settings
            .automaticCollapsingOnFocusChange) {
            container.addClass('folded');
            if (this.diagramEvents.diagram.plugin.livePreview) {
                container.parentElement?.addClass('folded');
            }
        }
    }
}

class Events {
    diagram;
    mouse;
    touch;
    keyboard;
    focus;
    foldingObserver;
    constructor(diagram) {
        this.diagram = diagram;
        this.mouse = new MouseHandler(this);
        this.touch = new TouchHandler(this);
        this.keyboard = new KeyboardHandler(this);
        this.focus = new FocusHandler(this);
        this.foldingObserver = new Folding();
    }
    /**
     * Initializes all the event handlers and observers for the given container
     * element.
     *
     * The event handlers are initialized in the order of mouse, touch, keyboard,
     * and focus. The folding observer is initialized last.
     *
     * @param container - The container element to add the event handlers and
     * observers to.
     * @param diagramData
     */
    initialize(container, diagramData) {
        this.mouse.initialize(container);
        this.touch.initialize(container);
        this.keyboard.initialize(container);
        this.focus.initialize(container);
        this.foldingObserver.observe(container);
    }
}

class DiagramActions {
    diagram;
    constructor(diagram) {
        this.diagram = diagram;
    }
    /**
     * Moves the diagram element in the given container by the given dx and dy
     * amounts. If setAnimation is true, the element will be animated to its
     * new position. Otherwise, the element will be positioned immediately.
     * @param container - The container element that contains the diagram
     * element.
     * @param dx - The horizontal distance to move the element.
     * @param dy - The vertical distance to move the element.
     * @param setAnimation - Whether to animate the movement of the element. Defaults to undefined.
     */
    moveElement(container, dx, dy, setAnimation) {
        this.diagram.activeContainer = container;
        const element = container.querySelector(this.diagram.compoundSelector);
        if (!element) {
            return;
        }
        this.diagram.dx += dx;
        this.diagram.dy += dy;
        element.setCssStyles({
            transition: setAnimation ? 'transform 0.3s ease-out' : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
        });
        if (setAnimation) {
            this.diagram.plugin.view.registerDomEvent(element, 'transitionend', () => {
                element.setCssStyles({
                    transition: 'none',
                });
            }, { once: true });
        }
    }
    /**
     * Zooms the diagram element in the given container by the given factor.
     * If setAnimation is true, the element will be animated to its new scale.
     * Otherwise, the element will be scaled immediately.
     * @param container - The container element that contains the diagram
     * element.
     * @param factor - The zoom factor. For example, 1.5 means 150% scale.
     * @param setAnimation - Whether to animate the zooming of the element. Defaults to undefined.
     */
    zoomElement(container, factor, setAnimation) {
        this.diagram.activeContainer = container;
        const element = container.querySelector(this.diagram.compoundSelector);
        if (!element) {
            return;
        }
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        const offsetX = (centerX - this.diagram.dx) / this.diagram.scale;
        const offsetY = (centerY - this.diagram.dy) / this.diagram.scale;
        this.diagram.scale *= factor;
        this.diagram.scale = Math.max(0.125, this.diagram.scale);
        this.diagram.dx = centerX - offsetX * this.diagram.scale;
        this.diagram.dy = centerY - offsetY * this.diagram.scale;
        element.setCssStyles({
            transition: setAnimation
                ? 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
                : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
        });
        if (setAnimation) {
            this.diagram.plugin.view.registerDomEvent(element, 'transitionend', () => {
                element.setCssStyles({
                    transition: 'none',
                });
            }, { once: true });
        }
    }
    /**
     * Resets the zoom and move state of the diagram element in the given container to its
     * original state. If setAnimation is true, the element will be animated to its original state.
     * Otherwise, the element will be reset immediately.
     * @param container - The container element that contains the diagram element.
     * @param setAnimation - Whether to animate the reset of the element. Defaults to undefined.
     */
    resetZoomAndMove(container, setAnimation) {
        const element = container.querySelector(this.diagram.compoundSelector);
        if (element) {
            this.fitToContainer(element, container, setAnimation);
        }
    }
    /**
     * Fits the diagram element to its container element. The element will be scaled to fit within its container while maintaining its aspect ratio.
     * If setAnimation is true, the element will be animated to its new position and scale. Otherwise, the element will be positioned and scaled immediately.
     * @param element - The diagram element to be fitted.
     * @param container - The container element that contains the diagram element.
     * @param setAnimation - Whether to animate the fitting of the element. Defaults to undefined.
     */
    fitToContainer(element, container, setAnimation) {
        this.diagram.activeContainer = container;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const diagramWidth = element.clientWidth;
        const diagramHeight = element.clientHeight;
        this.diagram.scale = Math.min(containerWidth / diagramWidth, containerHeight / diagramHeight, 1);
        this.diagram.dx =
            (containerWidth - diagramWidth * this.diagram.scale) / 2;
        this.diagram.dy =
            (containerHeight - diagramHeight * this.diagram.scale) / 2;
        element.setCssStyles({
            transition: setAnimation
                ? 'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
                : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
            transformOrigin: 'top left',
        });
        if (setAnimation) {
            this.diagram.plugin.view.registerDomEvent(element, 'transitionend', () => {
                element.setCssStyles({
                    transition: 'none',
                });
            }, { once: true });
        }
    }
}

class Export {
    diagramContextMenu;
    constructor(diagramContextMenu) {
        this.diagramContextMenu = diagramContextMenu;
    }
    export(container) {
        const element = container.querySelector(this.diagramContextMenu.diagram.compoundSelector);
        if (!element) {
            return;
        }
        const svg = element.querySelector('svg');
        const img = element.querySelector('img');
        if (svg) {
            this.exportSVG(svg);
        }
        else if (img) {
            this.exportIMG(img);
        }
        else {
            this.diagramContextMenu.diagram.plugin.showNotice("Oops! We couldn't find any elements to export. " +
                'It seems something is wrong with this diagram?.');
        }
    }
    exportSVG(svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const preface = '<?xml version="1.0" standalone="no"?>\r\n';
        const svgBlob = new Blob([preface, svgData], {
            type: 'image/svg+xml;charset=utf-8',
        });
        this.downloadFile(svgBlob, 'svg');
    }
    exportIMG(img) {
        fetch(img.src)
            .then((response) => response.blob())
            .then((blob) => {
            debugger;
            this.downloadFile(blob, `png`);
        })
            .catch((error) => {
            this.diagramContextMenu.diagram.plugin.showNotice('Error exporting image');
            console.error('Error exporting image:', error);
        });
    }
    downloadFile(blob, extension) {
        const { diagram } = this.diagramContextMenu;
        const filename = `dzg_export_${diagram.plugin.view?.file?.basename ?? 'diagram'}_${diagram.activeContainer?.id ?? 'unknown'}}_${obsidian.moment().format('YYYYMMDDHHmmss')}.${extension}`;
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }
}

class CopyDiagram {
    diagramContextMenu;
    constructor(diagramContextMenu) {
        this.diagramContextMenu = diagramContextMenu;
    }
    async copy(container) {
        const element = container.querySelector(this.diagramContextMenu.diagram.compoundSelector);
        if (!element) {
            return;
        }
        const svg = element.querySelector('svg');
        const img = element.querySelector('img');
        if (svg) {
            await this.copySvg(svg);
            this.diagramContextMenu.diagram.plugin.showNotice('Copied');
        }
        else if (img) {
            await this.copyImg(img);
            this.diagramContextMenu.diagram.plugin.showNotice('Copied');
        }
        else {
            console.error('Neither SVG nor IMG element found in the container');
        }
    }
    async copyImg(img) {
        fetch(img.src)
            .then((response) => response.blob())
            .then(async (blob) => {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob,
                }),
            ]);
        })
            .catch((error) => console.error('Error copy image:', error));
    }
    async copySvg(svg) {
        try {
            svg.focus();
            const svgString = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgString], {
                type: 'image/svg+xml',
            });
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/svg+xml': blob,
                }),
            ]);
        }
        catch (error) {
            console.error('Failed to copy SVG:', error);
        }
    }
}

class CopyDiagramSource {
    diagramContextMenu;
    constructor(diagramContextMenu) {
        this.diagramContextMenu = diagramContextMenu;
    }
    async copy(container) {
        const source = this.diagramContextMenu.diagram.source;
        if (source) {
            await navigator.clipboard.writeText(source);
            this.diagramContextMenu.diagram.plugin.showNotice('Copied');
        }
    }
}

class ContextMenu {
    diagram;
    export;
    copy;
    copySource;
    constructor(diagram) {
        this.diagram = diagram;
        this.export = new Export(this);
        this.copy = new CopyDiagram(this);
        this.copySource = new CopyDiagramSource(this);
    }
    initialize(container, diagramData) {
        this.diagram.plugin.view?.registerDomEvent(container, 'contextmenu', () => {
            container.addEventListener('contextmenu', (event) => {
                const target = event.target;
                const isThereDiagramContainer = target.closest('.diagram-container');
                if (!isThereDiagramContainer) {
                    return;
                }
                isThereDiagramContainer.focus();
                event.preventDefault();
                event.stopPropagation();
                const menu = new obsidian.Menu();
                menu.addItem((item) => {
                    item.setTitle('Export diagram');
                    item.onClick(async () => {
                        this.export.export(this.diagram.activeContainer);
                    });
                });
                menu.addItem((item) => {
                    item.setTitle('Copy diagram');
                    item.onClick(async () => {
                        await this.copy.copy(this.diagram.activeContainer);
                    });
                });
                menu.addItem((item) => {
                    item.setTitle('Copy diagram source');
                    item.onClick(async () => {
                        await this.copySource.copy(container);
                    });
                });
                menu.showAtMouseEvent(event);
            }, true);
        });
    }
}

class Diagram {
    plugin;
    state;
    controlPanel;
    events;
    actions;
    contextMenu;
    activeContainer = undefined;
    dx;
    dy;
    scale;
    nativeTouchEventsEnabled;
    source;
    panelsData;
    livePreviewObserver;
    size;
    constructor(plugin) {
        this.plugin = plugin;
        this.state = new State(this);
        this.actions = new DiagramActions(this);
        this.events = new Events(this);
        this.controlPanel = new ControlPanel(this);
        this.contextMenu = new ContextMenu(this);
    }
    /**
     * Generates a compound CSS selector that matches all currently enabled diagrams.
     *
     * This getter constructs a comma-separated list of selectors for each diagram
     * that is enabled in the plugin's settings. The resulting string can be used
     * to apply styles or query all enabled diagram elements at once.
     *
     * @returns {string} A compound CSS selector string.
     */
    get compoundSelector() {
        const diagrams = this.plugin.settings.supported_diagrams;
        return diagrams.reduce((acc, diagram) => {
            if (diagram.on) {
                return acc ? `${acc}, ${diagram.selector}` : diagram.selector;
            }
            return acc;
        }, '');
    }
    /**
     * Initializes the diagram based on the provided element and context.
     *
     * This method determines the rendering mode by checking the presence of a context.
     * If a context is provided, it initializes the diagram in preview mode by invoking
     * the `initializePreview` method. Otherwise, it initializes in live preview mode
     * by calling `initializeLivePreview`.
     *
     * @param {HTMLElement} element - The HTML element representing the diagram container.
     * @param {MarkdownPostProcessorContext} [context] - Optional context indicating
     *        that rendering is in preview mode. If not provided, live preview mode is assumed.
     * @returns {Promise<void>} A promise that resolves once initialization is complete.
     */
    async initialize(element, context) {
        if (context) {
            await this.initializePreview(element, context);
        }
        else {
            this.initializeLivePreview(element);
        }
    }
    /**
     * Initializes the diagram in preview mode by observing the provided element for any changes.
     *
     * This method waits for any diagram-related elements to be rendered within the provided element by
     * observing its DOM mutations. Once a diagram is detected, it processes the diagrams within the
     * preview by invoking `processDiagramsInPreview`. If no diagrams are found within a certain
     * time period (5000ms), it disconnects the observer.
     *
     * @param {HTMLElement} element - The HTML element representing the diagram container.
     * @param {MarkdownPostProcessorContext} context - The context indicating that rendering is in
     *        preview mode.
     * @returns {Promise<void>} A promise that resolves once initialization in preview mode is complete.
     */
    async initializePreview(element, context) {
        const maxWaitTime = 5000;
        if (!!(await this.checkForDiagram(element))) {
            return;
        }
        const observer = new MutationObserver(async () => {
            const diagram = await this.checkForDiagram(element);
            if (diagram) {
                await this.setDiagramContainer(diagram, {
                    context: context,
                    contextElement: element,
                });
                observer.disconnect();
            }
        });
        observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: false,
        });
        setTimeout(() => {
            observer.disconnect();
        }, maxWaitTime);
    }
    /**
     * Initializes the diagram in live preview mode by observing the provided content element for any changes.
     *
     * This method observes the provided content element for any added nodes and checks if the added node is a
     * diagram-related element. If it is, it processes the diagrams within the live preview by invoking
     * `setDiagramContainer`. If not, it creates a new observer for the added node and waits for any diagram-related
     * elements to be rendered within it. Once a diagram is detected, it processes the diagrams within the live
     * preview by invoking `setDiagramContainer`. If no diagrams are found within a certain time period (5000ms), it
     * disconnects the observer.
     *
     * @param {HTMLElement} contentEl - The HTML element representing the content element.
     */
    initializeLivePreview(contentEl) {
        if (this.livePreviewObserver) {
            return;
        }
        const elementObservers = new Map();
        const createPreviewObserver = (target) => {
            const observer = new MutationObserver(async (mutations, observer) => {
                for (const mutation of mutations) {
                    const target = mutation.target;
                    if (target.tagName !== 'DIV') {
                        continue;
                    }
                    const diagram = await this.checkForDiagram(target);
                    if (!!diagram) {
                        await this.setDiagramContainer(diagram);
                        observer.disconnect();
                        elementObservers.delete(target);
                    }
                }
            });
            elementObservers.set(target, observer);
            observer.observe(target, {
                childList: true,
                subtree: true,
            });
            setTimeout(() => {
                observer.disconnect();
                elementObservers.delete(target);
            }, 5000);
            return observer;
        };
        this.livePreviewObserver = new MutationObserver(async (mutations) => {
            const isLivePreview = this.plugin.livePreview;
            if (!isLivePreview) {
                return;
            }
            for (const mutation of mutations) {
                if (mutation.type !== 'childList') {
                    continue;
                }
                for (const addedNode of Array.from(mutation.addedNodes)) {
                    const target = addedNode;
                    if (target.tagName !== 'DIV') {
                        continue;
                    }
                    if (target?.matches('.cm-preview-code-block.cm-embed-block')) {
                        const diagram = this.querySelectorWithData(target);
                        if (diagram) {
                            await this.setDiagramContainer(diagram);
                            continue;
                        }
                        createPreviewObserver(target);
                    }
                }
            }
        });
        this.livePreviewObserver.observe(contentEl, {
            childList: true,
            subtree: true,
        });
    }
    async checkForDiagram(element) {
        const diagram = this.querySelectorWithData(element);
        const svg = diagram?.element.querySelector('svg');
        const img = diagram?.element.querySelector('img');
        if (diagram && (!!svg || !!img)) {
            console.log('found diagram');
            return diagram;
        }
        console.log('did not found diagram...');
    }
    /**
     * Configures the diagram container by setting up necessary DOM elements and styles.
     *
     * This method is responsible for preparing the diagram's container element
     * by adding appropriate classes, setting up its source data, and initializing
     * various components such as control panels, event handlers, and context menus.
     * It handles both live preview and static preview modes.
     *
     * @param diagram - An object containing the diagram element and associated data.
     * @param contextData - Optional context data required to extract source information
     *                      when not in live preview mode. Includes the context element
     *                      and the Markdown post-processor context.
     * @returns A promise that resolves once the diagram container is fully set up.
     */
    async setDiagramContainer(diagram, contextData) {
        const sourceExtraction = (el) => {
            let source, lineStart, lineEnd;
            if (!this.plugin.livePreview) {
                if (!contextData) {
                    return;
                }
                const sectionsInfo = contextData.context.getSectionInfo(contextData.contextElement);
                if (!sectionsInfo) {
                    return;
                }
                const { lineStart: ls, lineEnd: le, text } = sectionsInfo;
                lineStart = ls;
                lineEnd = le;
                const lines = text.split('\n');
                source = lines.slice(lineStart, lineEnd + 1).join('\n');
            }
            else {
                const e = this.plugin.view?.editor;
                const startPos = e.cm.posAtDOM(el.parentElement);
                const data = this.plugin.view?.editor
                    .getValue()
                    .slice(startPos);
                source = data?.match(/^"?(```.+?```)/ms)?.[1] ?? 'No source';
                const endPos = startPos + source.length;
                lineStart = e.cm.state.doc.lineAt(startPos).number;
                lineEnd = e.cm.state.doc.lineAt(endPos).number;
            }
            return {
                source: source,
                lineStart: lineStart,
                lineEnd: lineEnd,
            };
        };
        const initDiagramSize = (el) => {
            const diagramSize = this.getElSize(el);
            if (!diagramSize) {
                console.log('did not found size for diagram');
                return false;
            }
            const expandedWidth = (this.plugin.settings.applySuitableSize && diagramSize.width) ||
                this.plugin.settings.diagramExpandedWidth;
            const expandedHeight = (this.plugin.settings.applySuitableSize &&
                diagramSize.height) ||
                this.plugin.settings.diagramExpandedHeight;
            const foldedWidth = (this.plugin.settings.applySuitableSize && expandedWidth / 2) ||
                this.plugin.settings.diagramCollapsedWidth;
            const foldedHeight = (this.plugin.settings.applySuitableSize &&
                expandedHeight / 2) ||
                this.plugin.settings.diagramCollapsedHeight;
            this.size = {
                expanded: {
                    width: expandedWidth,
                    height: expandedHeight,
                },
                folded: {
                    width: foldedWidth,
                    height: foldedHeight,
                },
            };
            return true;
        };
        const createDiagramWrapper = async (el, sourceData) => {
            const container = document.createElement('div');
            container.addClass('diagram-container');
            if (this.plugin.livePreview) {
                container.addClass('live-preview');
                el.parentElement?.addClass('live-preview-parent');
            }
            el.parentNode?.insertBefore(container, el);
            container.appendChild(el);
            initDiagramSize(el);
            this.updateDiagramSizeBasedOnStatus(container);
            container.id = await this.genID(sourceData.lineStart, sourceData.lineEnd, diagram.diagram);
            container.toggleClass('folded', this.plugin.settings.collapseByDefault);
            if (this.plugin.livePreview) {
                container.parentElement?.toggleClass('folded', this.plugin.settings.collapseByDefault);
            }
            container.setAttribute('tabindex', '0');
            return container;
        };
        const el = diagram.element;
        if (!el.parentElement) {
            return;
        }
        if (el.parentElement.hasClass('diagram-container')) {
            return;
        }
        if (el.hasClass('diagram-content')) {
            return;
        }
        el.addClass('centered');
        el.addClass('diagram-content');
        const sourceData = sourceExtraction(el);
        if (!sourceData) {
            return;
        }
        const container = await createDiagramWrapper(el, sourceData);
        this.activeContainer = container;
        this.state.initializeContainer(container.id, sourceData.source);
        this.controlPanel.initialize(container, diagram.diagram);
        this.events.initialize(container, diagram.diagram);
        this.contextMenu.initialize(container, diagram.diagram);
        const resizeObserver = new ResizeObserver(() => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const elementWidth = el.clientWidth;
            const elementHeight = el.clientHeight;
            if (containerWidth > 0 &&
                containerHeight > 0 &&
                elementWidth > 0 &&
                elementHeight > 0) {
                this.actions.fitToContainer(el, container);
                resizeObserver.disconnect();
            }
        });
        resizeObserver.observe(container);
        resizeObserver.observe(el);
        setTimeout(() => {
            resizeObserver.disconnect();
            if (container.clientWidth > 0 &&
                container.clientHeight > 0 &&
                el.clientWidth > 0 &&
                el.clientHeight > 0) {
                this.actions.fitToContainer(el, container);
            }
        }, 5000);
    }
    /**
     * Searches for a diagram element within the provided container element.
     *
     * This method iterates over the list of supported diagrams and checks if
     * the diagram is enabled. If the diagram is enabled, it searches for an
     * element within the container element that matches the diagram's selector.
     * If an element is found, it returns an object containing the element and
     * the diagram data. Otherwise, it returns null.
     *
     * @param container - The container element to search for the diagram.
     * @returns An object containing the diagram element and the diagram data, or
     * null if no diagram is found.
     */
    querySelectorWithData(container) {
        for (const diagram of this.plugin.settings.supported_diagrams) {
            if (!diagram.on) {
                continue;
            }
            const element = container.querySelector(diagram.selector);
            if (element) {
                return { element, diagram };
            }
        }
        return null;
    }
    /**
     * Generates a unique ID for a diagram.
     *
     * The ID is generated by encoding the diagram's name, start and end line
     * numbers as a UTF-8 string, and then hashing it using the SHA-256
     * algorithm. The hash is then concatenated with the current file's
     * modification time (in seconds since the Unix epoch) to produce a unique
     * identifier.
     *
     * @param lineStart - The starting line number of the code block containing
     * the diagram.
     * @param lineEnd - The ending line number of the code block containing the
     * diagram.
     * @param diagram - The diagram data object.
     * @returns A string representing the unique ID of the diagram.
     */
    async genID(lineStart, lineEnd, diagram) {
        const preId = `${diagram.name}:${lineStart}-${lineEnd}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(preId);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        const ctime = this.plugin.view?.file?.stat.ctime ?? 0;
        return `id-${ctime}-${hash}`;
    }
    getElSize(el) {
        const svg = el.querySelector('svg');
        const img = el.querySelector('img');
        if (svg === null && img === null) {
            return undefined;
        }
        if (svg) {
            const rect = el.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
            };
        }
        if (img) {
            const rect = img.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
            };
        }
    }
    updateDiagramSizeBasedOnStatus(el) {
        const isFolded = el.hasClass('folded');
        const size = (isFolded && this.size.folded) || this.size.expanded;
        el.style.height = `${size.height}px`;
        el.style.width = `${size.width}px`;
        if (this.plugin.livePreview) {
            el.parentElement.style.height = `${size.height}px`;
            el.parentElement.style.width = `${size.width}px`;
        }
    }
}

class DiagramZoomDragPlugin extends obsidian.Plugin {
    view = null;
    leafID;
    settings;
    settingsManager;
    pluginStateChecker;
    publisher;
    observer;
    diagram;
    livePreview = false;
    /**
     * Initializes the plugin.
     *
     * This function initializes the plugin's core components, event system, and utilities.
     * It is called when the plugin is loading.
     *
     * @returns A promise that resolves when the plugin has been successfully initialized.
     */
    async initializePlugin() {
        await this.initializeCore();
        await this.initializeUI();
        await this.initializeEventSystem();
        await this.initializeUtils();
    }
    /**
     * Initializes the plugin's core components.
     *
     * This function initializes the plugin's settings manager and adds a settings tab to the Obsidian settings panel.
     *
     * @returns A promise that resolves when the plugin's core components have been successfully initialized.
     */
    async initializeCore() {
        this.settingsManager = new SettingsManager(this);
        await this.settingsManager.loadSettings();
        this.addSettingTab(new SettingsTab(this.app, this));
        this.updateCssProperties();
    }
    /**
     * Asynchronously initializes the event system for handling events in the plugin.
     * This function sets up the EventPublisher and EventObserver instances, and registers event handlers for 'layout-change' and 'active-leaf-change' events.
     *
     * @returns A promise that resolves once the event system has been successfully initialized.
     */
    async initializeEventSystem() {
        this.publisher = new EventPublisher(this);
        this.observer = new EventObserver(this);
        this.registerMarkdownPostProcessor(async (element, context) => {
            this.initializeView();
            if (this.livePreview) {
                return;
            }
            await this.diagram.initialize(element, context);
        });
        this.registerEvent(this.app.workspace.on('layout-change', async () => {
            this.cleanupView();
            await this.diagram.state.cleanupContainers();
            this.initializeView();
            if (this.view && this.livePreview) {
                await this.diagram.initialize(this.view.contentEl);
            }
        }));
        this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
            this.cleanupView();
            this.initializeView();
        }));
    }
    /**
     * Initializes the user interface for the plugin.
     *
     * this function initializes the diagram manager and adds a command to toggle the control panel visibility of the current active diagram.
     *
     * @returns A promise that resolves once the user interface has been successfully initialized.
     */
    async initializeUI() {
        this.diagram = new Diagram(this);
        this.addCommand({
            id: 'diagram-zoom-drag-toggle-panels-management-state',
            name: 'Toggle control panel visibility of current active diagram',
            checkCallback: (checking) => {
                if (checking) {
                    return !!this.diagram.activeContainer;
                }
                const panels = this.diagram.panelsData.panels;
                if (!panels) {
                    return;
                }
                const initialState = panels.zoom.panel.hasClass('hidden');
                panels.zoom.panel.toggleClass('hidden', !initialState);
                panels.zoom.panel.toggleClass('visible', initialState);
                panels.move.panel.toggleClass('hidden', !initialState);
                panels.move.panel.toggleClass('visible', initialState);
                panels.service.panel.toggleClass('hidden', !initialState);
                panels.service.panel.toggleClass('visible', initialState);
                publishPanelsStateEvent(this, true);
            },
        });
    }
    /**
     * Initializes the plugin's utility classes.
     *
     * This function initializes the PluginStateChecker, which is responsible for
     * checking if the plugin is being opened for the first time
     *
     * @returns A promise that resolves when the plugin's utilities have been
     *          successfully initialized.
     */
    async initializeUtils() {
        this.pluginStateChecker = new PluginStateChecker(this);
    }
    /**
     * Initializes the plugin when it is loaded.
     *
     * This function is called automatically when the plugin is loaded by Obsidian.
     * It initializes the plugin by calling `initializePlugin`.
     *
     * @returns A promise that resolves when the plugin has been fully initialized.
     */
    async onload() {
        await this.initializePlugin();
    }
    /**
     * Cleans up the plugin's event subscriptions when the plugin is unloaded.
     *
     * This function is called automatically when the plugin is unloaded by
     * Obsidian. It unsubscribes from all events that the plugin has subscribed
     * to during its lifetime.
     *
     * @returns A promise that resolves when all event subscriptions have been
     *          successfully unsubscribed.
     */
    async onunload() {
        this.observer.unsubscribeAll();
    }
    /**
     * Initializes the plugin's features for the active view.
     *
     * This function initializes the plugin's features for the active view by
     * getting the active view, getting the view's leaf ID and content element,
     * and initializing the plugin's features for the content element.
     *
     * @returns {void} Void.
     */
    initializeView() {
        const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view) {
            return;
        }
        this.leafID = view.leaf.id;
        this.diagram.state.initializeLeafData(this.leafID);
        this.view = view;
        const viewState = view.getState();
        this.livePreview = !viewState.source && viewState.mode === 'source';
    }
    /**
     * Cleans up the view's diagram data when it is no longer
     * active.
     *
     * @returns {void} Void.
     */
    cleanupView() {
        if (this.leafID) {
            const isLeaf = this.app.workspace.getLeafById(this.leafID);
            if (isLeaf === null) {
                this.view = null;
                this.diagram.state.cleanupData(this.leafID);
                this.leafID = undefined;
            }
        }
    }
    /**
     * Displays a notice with the provided message for a specified duration.
     *
     * @param message - The message to display in the notice.
     * @param duration - The duration in milliseconds for which the notice should be displayed. Defaults to undefined.
     * @returns void
     */
    showNotice(message, duration) {
        new obsidian.Notice(message, duration);
    }
    /**
     * Updates the CSS properties related to the diagram container dimensions.
     *
     * This method sets the CSS custom properties for the expanded and collapsed
     * widths and heights of the diagram container according to the current settings.
     * These properties are used to adjust the layout and appearance of the diagram
     * container dynamically based on the user's configuration.
     *
     * @returns {void} Void.
     */
    updateCssProperties() {
        document.documentElement.style.setProperty('--diagram-zoom-drag-diagram-container-expanded-width', `${this.settings.diagramExpandedWidth}px`);
        document.documentElement.style.setProperty('--diagram-zoom-drag-diagram-container-expanded-height', `${this.settings.diagramExpandedHeight}px`);
        document.documentElement.style.setProperty('--diagram-zoom-drag-diagram-container-collapsed-width', `${this.settings.diagramCollapsedWidth}px`);
        document.documentElement.style.setProperty('--diagram-zoom-drag-diagram-container-collapsed-height', `${this.settings.diagramCollapsedHeight}px`);
    }
}

module.exports = DiagramZoomDragPlugin;
