var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _coven = (function () {
    var _a, _b, _c, _d, _e;
    var currentComponent;
    var subscribedBySymbol = Symbol("subscribedBy");
    var subscribedToSymbol = Symbol("subscribedTo");
    var parentSymbol = Symbol("parent");
    var childrenSymbol = Symbol("children");
    var elementSymbol = Symbol("element");
    var optionsSymbol = Symbol("options");
    var buildSymbol = Symbol("build");
    var disploseSymbol = Symbol("dispose");
    var notifySubscribersSymbol = Symbol("notifySubscribers");
    var stateSymbol = Symbol("state"); //symbols so it doesnt appear in the editor
    var subscribeToSymbol = Symbol("subscribeToSymbol");
    var removeSubscriptionSymbol = Symbol("removeSubscription");
    var isComponentSymbol = Symbol("___isComponent___");
    var Component = /** @class */ (function () {
        function Component(build) {
            var _this = this;
            this[_a] = [];
            this[_b] = [];
            this[_c] = [];
            this[_d] = {};
            this[_e] = {};
            this[isComponentSymbol] = true;
            this[buildSymbol] = function () {
                currentComponent = _this;
                console.log("set current component!");
                var element = build();
                console.log(element.nodeName);
                return element;
            };
        }
        Component.prototype[(_a = subscribedBySymbol, _b = subscribedToSymbol, _c = childrenSymbol, _d = stateSymbol, _e = optionsSymbol, disploseSymbol)] = function () {
            var _this = this;
            this[subscribedToSymbol].forEach(function (component) {
                _this[removeSubscriptionSymbol](component);
            });
        };
        Component.prototype[notifySubscribersSymbol] = function () {
            this[subscribedBySymbol].forEach(function (o) { return o[buildSymbol](); });
        };
        Component.prototype[subscribeToSymbol] = function (component) {
            component[subscribedBySymbol].push(this);
            this[subscribedToSymbol].push(component);
        };
        Component.prototype[removeSubscriptionSymbol] = function (component) {
            var index = component[subscribedBySymbol].indexOf(this);
            if (index > -1) {
                component[subscribedBySymbol].splice(index, 1);
            }
            var localIndex = this[subscribedToSymbol].indexOf(component);
            if (localIndex > -1) {
                this[subscribedBySymbol].splice(localIndex, 1);
            }
        };
        return Component;
    }());
    function isHTMLElement(element) {
        return !!element.style;
    }
    function buildTree(c) {
        var element = c[buildSymbol]();
        if (isHTMLElement(element)) {
            addStyles(c[optionsSymbol].style, element);
            addHtmlOptions(c[optionsSymbol].html, element);
            addEventListeners(c[optionsSymbol].events, element);
            element.append.apply(element, c[childrenSymbol].map(function (child) { return buildTree(child); }));
        }
        c[elementSymbol] = element;
        return element;
    }
    function getSelf() {
        return currentComponent;
    }
    function reload() {
        console.log("trying to realod");
        //   const newChild = app();
        //   root.replaceChild(newChild, a);
        //   a = newChild;
    }
    function run(_f) {
        var _g = _f.target, target = _g === void 0 ? "#root" : _g, app = _f.app;
        var element = buildTree(app());
        document.querySelector(target).appendChild(element);
    }
    var addEventListeners = function (events, element) {
        if (events === void 0) { events = {}; }
        Object.keys(events).forEach(function (event) {
            element.addEventListener(event.replace("on", ""), events[event]);
        });
    };
    var addStyles = function (style, element) {
        if (style === void 0) { style = {}; }
        var properties = Object.keys(style);
        properties.forEach(function (p) {
            element.style[p] = style[p];
        });
    };
    var addHtmlOptions = function (options, element) {
        if (options === void 0) { options = {}; }
        var properties = Object.keys(options);
        properties.forEach(function (p) {
            element[p] = options[p];
        });
    };
    var text = function (text) {
        var data = document.createTextNode(text);
        var c = new Component(function () { return data; });
        return c;
    };
    function element(_f) {
        var _g;
        var _h = _f.name, name = _h === void 0 ? "div" : _h, _j = _f.children, children = _j === void 0 ? [] : _j, _k = _f.options, options = _k === void 0 ? {} : _k;
        var transformedChildren = children.map(function (c) {
            if (typeof c === "string") {
                return text(c);
            }
            return c;
        });
        var obj = new Component(function () {
            return typeof name == "string" ? document.createElement(name) : name;
        });
        (_g = obj[childrenSymbol]).push.apply(_g, transformedChildren);
        obj[childrenSymbol].forEach(function (c) { return (c[parentSymbol] = obj); });
        obj[optionsSymbol] = options;
        //   console.log(currentComponent);
        //   classes &&
        //     classes.forEach((c) => {
        //       obj.classList.add(c);
        //     });
        //   if (id) obj.id = id;
        //   addStyles(style, obj.element);
        //   addEventListeners(events, obj.element);
        //   addHtmlOptions(htmlOptions, obj.element);
        return obj;
    }
    var isNotOptions = function (obj) {
        if (typeof obj == "string")
            return true;
        return !!obj[isComponentSymbol];
    };
    function getChildren(args) {
        var children = [];
        if (args.length > 0) {
            var lastItem = args[args.length - 1];
            children = isNotOptions(lastItem) ? args : [];
            if (args.length > 1) {
                children = isNotOptions(lastItem) ? args : args.slice(0, -1);
            }
            return children;
        }
    }
    function getOptions(args) {
        var options = {};
        if (args.length > 0) {
            var lastItem = args[args.length - 1];
            options = isNotOptions(lastItem) ? {} : lastItem;
        }
        return options;
    }
    var childessHtmlElement = function (name) {
        return function (options) {
            var c = element({
                name: name,
                options: options
            });
            return c;
        };
    };
    var htmlElement = function (name) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var options = getOptions(args);
            var children = getChildren(args);
            var c = element({
                name: name,
                children: children,
                options: options
            });
            return c;
        };
    };
    var ul = htmlElement("ul");
    var a = htmlElement("a");
    var abbr = htmlElement("abbr");
    var address = htmlElement("address");
    var area = childessHtmlElement("area");
    var article = htmlElement("article");
    var aside = htmlElement("aside");
    var audio = htmlElement("audio");
    var b = htmlElement("b");
    var base = childessHtmlElement("base");
    var bdi = htmlElement("bdi");
    var bdo = htmlElement("bdo");
    var blockquote = htmlElement("blockquote");
    var body = htmlElement("body");
    var br = childessHtmlElement("br");
    var button = htmlElement("button");
    var canvas = htmlElement("canvas");
    var caption = htmlElement("caption");
    var cite = htmlElement("cite");
    var code = htmlElement("code");
    var col = childessHtmlElement("col");
    var colgroup = htmlElement("colgroup");
    var data = htmlElement("data");
    var datalist = htmlElement("datalist");
    var dd = htmlElement("dd");
    var del = htmlElement("del");
    var details = htmlElement("details");
    var dfn = htmlElement("dfn");
    var dialog = htmlElement("dialog");
    var div = htmlElement("div");
    var dl = htmlElement("dl");
    var dt = htmlElement("dt");
    var em = htmlElement("em");
    var embed = childessHtmlElement("embed");
    var fieldset = htmlElement("fieldset");
    var figcaption = htmlElement("figcaption");
    var figure = htmlElement("figure");
    var footer = htmlElement("footer");
    var form = htmlElement("form");
    var h1 = htmlElement("h1");
    var h2 = htmlElement("h2");
    var h3 = htmlElement("h3");
    var h4 = htmlElement("h4");
    var h5 = htmlElement("h5");
    var h6 = htmlElement("h6");
    var head = htmlElement("head");
    var header = htmlElement("header");
    var hgroup = htmlElement("hgroup");
    var hr = childessHtmlElement("hr");
    var html = htmlElement("html");
    var i = htmlElement("i");
    var iframe = htmlElement("iframe");
    var img = childessHtmlElement("img");
    var input = childessHtmlElement("input");
    var ins = htmlElement("ins");
    var kbd = htmlElement("kbd");
    var label = htmlElement("label");
    var legend = htmlElement("legend");
    var li = htmlElement("li");
    var link = childessHtmlElement("link");
    var main = htmlElement("main");
    var map = htmlElement("map");
    var mark = htmlElement("mark");
    var math = htmlElement("math");
    var menu = htmlElement("menu");
    var menuitem = childessHtmlElement("menuitem");
    var meta = childessHtmlElement("meta");
    var meter = htmlElement("meter");
    var nav = htmlElement("nav");
    var noscript = htmlElement("noscript");
    var object = htmlElement("object");
    var ol = htmlElement("ol");
    var optgroup = htmlElement("optgroup");
    var option = htmlElement("option");
    var output = htmlElement("output");
    var p = htmlElement("p");
    var param = childessHtmlElement("param");
    var picture = htmlElement("picture");
    var pre = htmlElement("pre");
    var progress = htmlElement("progress");
    var q = htmlElement("q");
    var rb = htmlElement("rb");
    var rp = htmlElement("rp");
    var rt = htmlElement("rt");
    var rtc = htmlElement("rtc");
    var ruby = htmlElement("ruby");
    var s = htmlElement("s");
    var samp = htmlElement("samp");
    var script = htmlElement("script");
    var section = htmlElement("section");
    var select = htmlElement("select");
    var slot = htmlElement("slot");
    var small = htmlElement("small");
    var source = childessHtmlElement("source");
    var span = htmlElement("span");
    var strong = htmlElement("strong");
    var style = htmlElement("style");
    var sub = htmlElement("sub");
    var summary = htmlElement("summary");
    var sup = htmlElement("sup");
    var svg = htmlElement("svg");
    var table = htmlElement("table");
    var tbody = htmlElement("tbody");
    var td = htmlElement("td");
    var template = htmlElement("template");
    var textarea = htmlElement("textarea");
    var tfoot = htmlElement("tfoot");
    var th = htmlElement("th");
    var thead = htmlElement("thead");
    var time = htmlElement("time");
    var title = htmlElement("title");
    var tr = htmlElement("tr");
    var track = childessHtmlElement("track");
    var u = htmlElement("u");
    var varElement = htmlElement("var");
    var video = htmlElement("video");
    var wbr = childessHtmlElement("wbr");
    function widget(f) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var children = getChildren(args);
            var options = getOptions(args);
            return f(__assign({ children: children, options: options }, options));
        };
    }
    return {
        p: p,
        div: div,
        ul: ul,
        getSelf: getSelf,
        li: li,
        reload: reload,
        widget: widget,
        run: run
    };
})();
var p = _coven.p, div = _coven.div, ul = _coven.ul, getSelf = _coven.getSelf, li = _coven.li, reload = _coven.reload, widget = _coven.widget, run = _coven.run;
var title = widget(function (props) {
    return p.apply(void 0, __spreadArrays(props.children, [{
            html: {
                id: "ho"
            },
            events: {
                onclick: function (e) { }
            },
            style: __assign({ padding: "30px", color: props.color }, props.options.style)
        }]));
});
var Counter = widget(function () {
    var counter = 1;
    return li("counter " + counter, {
        events: {
            onclick: function (e) {
                counter++;
                reload();
            }
        },
        style: {
            background: "red",
            height: "50px",
            userSelect: "none"
        }
    });
});
var Flexbox = widget(function (_a) {
    var children = _a.children, _b = _a.wrap, wrap = _b === void 0 ? true : _b, _c = _a.alignContent, alignContent = _c === void 0 ? "center" : _c, _d = _a.justifyContent, justifyContent = _d === void 0 ? "center" : _d, options = _a.options;
    return div.apply(void 0, __spreadArrays(children, [__assign({ style: {
                flexWrap: wrap ? "wrap" : "nowrap",
                justifyContent: justifyContent,
                alignContent: alignContent,
                display: "flex"
            } }, options)]));
});
var app = function () {
    return div(Flexbox(p("hi"), p("hi"), p("hi"), p("hi"), p("hi"), p("hi"), p("hi"), p("hi")), Flexbox(p("hi"), p("hi"), p("hi"), p("hi"), p("hi"), p("hi"), p("hi"), p("hi")), {
        style: {
            display: "grid",
            gridTemplateColumns: "1fr 5fr"
        }
    });
};
run({
    target: "#root",
    app: app
});
