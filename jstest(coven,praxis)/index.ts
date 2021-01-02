const _coven = (function () {
  let currentComponent: Component;
  const subscribedBySymbol = Symbol("subscribedBy");
  const subscribedToSymbol = Symbol("subscribedTo");
  const parentSymbol = Symbol("parent");
  const childrenSymbol = Symbol("children");
  const elementSymbol = Symbol("element");
  const optionsSymbol = Symbol("options");
  const buildSymbol = Symbol("build");
  const disploseSymbol = Symbol("dispose");
  const notifySubscribersSymbol = Symbol("notifySubscribers");
  const stateSymbol = Symbol("state"); //symbols so it doesnt appear in the editor
  const subscribeToSymbol = Symbol("subscribeToSymbol");
  const removeSubscriptionSymbol = Symbol("removeSubscription");
  const isComponentSymbol = Symbol("___isComponent___");

  class Component<T extends Record<string, any> = Record<string, any>> {
    [subscribedBySymbol]: Component[] = [];
    [subscribedToSymbol]: Component[] = [];
    [parentSymbol]: Component;
    [childrenSymbol]: Component[] = [];
    [elementSymbol]: HTMLElement | Text;
    [stateSymbol]: T = {} as any;
    [optionsSymbol]: defaultOptions = {};
    [buildSymbol]: () => HTMLElement | Text;
    constructor(build: () => HTMLElement | Text) {
      this[isComponentSymbol] = true;
      this[buildSymbol] = () => {
        currentComponent = this;
        console.log("set current component!");
        const element = build();
        console.log(element.nodeName);
        return element;
      };
    }
    [disploseSymbol]() {
      this[subscribedToSymbol].forEach((component) => {
        this[removeSubscriptionSymbol](component);
      });
    }

    [notifySubscribersSymbol]() {
      this[subscribedBySymbol].forEach((o) => o[buildSymbol]());
    }
    [subscribeToSymbol](component: Component) {
      component[subscribedBySymbol].push(this);
      this[subscribedToSymbol].push(component);
    }
    [removeSubscriptionSymbol](component: Component) {
      const index = component[subscribedBySymbol].indexOf(this);
      if (index > -1) {
        component[subscribedBySymbol].splice(index, 1);
      }
      const localIndex = this[subscribedToSymbol].indexOf(component);
      if (localIndex > -1) {
        this[subscribedBySymbol].splice(localIndex, 1);
      }
    }
  }

  function isHTMLElement(element: any): element is HTMLElement {
    return !!(element as HTMLElement).style;
  }

  function buildTree(c: Component) {
    const element = c[buildSymbol]();
    if (isHTMLElement(element)) {
      addStyles(c[optionsSymbol].style, element);
      addHtmlOptions(c[optionsSymbol].html, element);
      addEventListeners(c[optionsSymbol].events, element);
      element.append(...c[childrenSymbol].map((child) => buildTree(child)));
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

  function run({
    target = "#root",
    app,
  }: {
    target: string;
    app: () => Component;
  }) {
    const element = buildTree(app());
    document.querySelector(target).appendChild(element);
  }

  type props = {
    id?: string;
    children?: (Component | string)[];
    options?: defaultOptions;
    name: keyof HTMLElementTagNameMap | HTMLElement;
  };

  type defaultOptions = {
    events?: Partial<GlobalEventHandlers & DocumentAndElementEventHandlers>;
    style?: Partial<CSSStyleDeclaration>;
    html?: Partial<WritablePart<HTMLElement>>;
  };

  const addEventListeners = (
    events: Partial<GlobalEventHandlers> = {},
    element: HTMLElement
  ) => {
    Object.keys(events).forEach((event) => {
      element.addEventListener(event.replace("on", ""), events[event]);
    });
  };

  const addStyles = (
    style: Partial<CSSStyleDeclaration> = {},
    element: HTMLElement
  ) => {
    const properties = Object.keys(style);
    properties.forEach((p) => {
      element.style[p] = style[p];
    });
  };
  const addHtmlOptions = (
    options: Partial<WritablePart<HTMLElement>> = {},
    element: HTMLElement
  ) => {
    const properties = Object.keys(options);
    properties.forEach((p) => {
      element[p] = options[p];
    });
  };

  type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X
    ? 1
    : 2) extends <T>() => T extends Y ? 1 : 2
    ? A
    : B;

  type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<
      { [Q in P]: T[P] },
      { -readonly [Q in P]: T[P] },
      P
    >;
  }[keyof T];

  type FunctionKeys<T> = {
    [P in keyof T]: T[P] extends Function ? never : P;
  }[keyof T];

  type WritablePart<T> = Pick<T, WritableKeys<T> & FunctionKeys<HTMLElement>>;

  const text = (text: string) => {
    const data = document.createTextNode(text);
    const c = new Component(() => data);
    return c;
  };
  function element({ name = "div", children = [], options = {} }: props) {
    const transformedChildren = children.map((c) => {
      if (typeof c === "string") {
        return text(c);
      }
      return c;
    });
    const obj = new Component(() =>
      typeof name == "string" ? document.createElement(name) : name
    );
    obj[childrenSymbol].push(...transformedChildren);
    obj[childrenSymbol].forEach((c) => (c[parentSymbol] = obj));
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

  const isNotOptions = (obj): obj is child => {
    if (typeof obj == "string") return true;
    return !!(obj as Component)[isComponentSymbol];
  };

  function getChildren(args: (child | defaultOptions)[]) {
    let children = [];
    if (args.length > 0) {
      const lastItem = args[args.length - 1];
      children = isNotOptions(lastItem) ? args : [];
      if (args.length > 1) {
        children = isNotOptions(lastItem) ? args : args.slice(0, -1);
      }
      return children as child[];
    }
  }

  function getOptions<T>(args: (child | defaultOptions)[]) {
    let options: defaultOptions = {};
    if (args.length > 0) {
      const lastItem = args[args.length - 1];
      options = isNotOptions(lastItem) ? {} : lastItem;
    }
    return options as defaultOptions & T;
  }
  type child = string | Component;
  const childessHtmlElement = (name) => {
    return (options: defaultOptions) => {
      const c = element({
        name,
        options,
      });
      return c;
    };
  };
  const htmlElement = (name) => {
    return (...args: (child | defaultOptions)[]) => {
      const options = getOptions(args);
      const children = getChildren(args);
      const c = element({
        name,
        children,
        options,
      });
      return c;
    };
  };
  const ul = htmlElement("ul");
  const a = htmlElement("a");
  const abbr = htmlElement("abbr");
  const address = htmlElement("address");
  const area = childessHtmlElement("area");
  const article = htmlElement("article");
  const aside = htmlElement("aside");
  const audio = htmlElement("audio");
  const b = htmlElement("b");
  const base = childessHtmlElement("base");
  const bdi = htmlElement("bdi");
  const bdo = htmlElement("bdo");
  const blockquote = htmlElement("blockquote");
  const body = htmlElement("body");
  const br = childessHtmlElement("br");
  const button = htmlElement("button");
  const canvas = htmlElement("canvas");
  const caption = htmlElement("caption");
  const cite = htmlElement("cite");
  const code = htmlElement("code");
  const col = childessHtmlElement("col");
  const colgroup = htmlElement("colgroup");
  const data = htmlElement("data");
  const datalist = htmlElement("datalist");
  const dd = htmlElement("dd");
  const del = htmlElement("del");
  const details = htmlElement("details");
  const dfn = htmlElement("dfn");
  const dialog = htmlElement("dialog");
  const div = htmlElement("div");
  const dl = htmlElement("dl");
  const dt = htmlElement("dt");
  const em = htmlElement("em");
  const embed = childessHtmlElement("embed");
  const fieldset = htmlElement("fieldset");
  const figcaption = htmlElement("figcaption");
  const figure = htmlElement("figure");
  const footer = htmlElement("footer");
  const form = htmlElement("form");
  const h1 = htmlElement("h1");
  const h2 = htmlElement("h2");
  const h3 = htmlElement("h3");
  const h4 = htmlElement("h4");
  const h5 = htmlElement("h5");
  const h6 = htmlElement("h6");
  const head = htmlElement("head");
  const header = htmlElement("header");
  const hgroup = htmlElement("hgroup");
  const hr = childessHtmlElement("hr");
  const html = htmlElement("html");
  const i = htmlElement("i");
  const iframe = htmlElement("iframe");
  const img = childessHtmlElement("img");
  const input = childessHtmlElement("input");
  const ins = htmlElement("ins");
  const kbd = htmlElement("kbd");
  const label = htmlElement("label");
  const legend = htmlElement("legend");
  const li = htmlElement("li");
  const link = childessHtmlElement("link");
  const main = htmlElement("main");
  const map = htmlElement("map");
  const mark = htmlElement("mark");
  const math = htmlElement("math");
  const menu = htmlElement("menu");
  const menuitem = childessHtmlElement("menuitem");
  const meta = childessHtmlElement("meta");
  const meter = htmlElement("meter");
  const nav = htmlElement("nav");
  const noscript = htmlElement("noscript");
  const object = htmlElement("object");
  const ol = htmlElement("ol");
  const optgroup = htmlElement("optgroup");
  const option = htmlElement("option");
  const output = htmlElement("output");
  const p = htmlElement("p");
  const param = childessHtmlElement("param");
  const picture = htmlElement("picture");
  const pre = htmlElement("pre");
  const progress = htmlElement("progress");
  const q = htmlElement("q");
  const rb = htmlElement("rb");
  const rp = htmlElement("rp");
  const rt = htmlElement("rt");
  const rtc = htmlElement("rtc");
  const ruby = htmlElement("ruby");
  const s = htmlElement("s");
  const samp = htmlElement("samp");
  const script = htmlElement("script");
  const section = htmlElement("section");
  const select = htmlElement("select");
  const slot = htmlElement("slot");
  const small = htmlElement("small");
  const source = childessHtmlElement("source");
  const span = htmlElement("span");
  const strong = htmlElement("strong");
  const style = htmlElement("style");
  const sub = htmlElement("sub");
  const summary = htmlElement("summary");
  const sup = htmlElement("sup");
  const svg = htmlElement("svg");
  const table = htmlElement("table");
  const tbody = htmlElement("tbody");
  const td = htmlElement("td");
  const template = htmlElement("template");
  const textarea = htmlElement("textarea");
  const tfoot = htmlElement("tfoot");
  const th = htmlElement("th");
  const thead = htmlElement("thead");
  const time = htmlElement("time");
  const title = htmlElement("title");
  const tr = htmlElement("tr");
  const track = childessHtmlElement("track");
  const u = htmlElement("u");
  const varElement = htmlElement("var");
  const video = htmlElement("video");
  const wbr = childessHtmlElement("wbr");

  type component<T = {}> = (
    ...args: (child | (T & defaultOptions))[]
  ) => Component;

  function widget<T = {}>(
    f: (args: { options: defaultOptions; children: child[] } & T) => Component
  ): component<T> {
    return (...args) => {
      const children = getChildren(args);
      const options = getOptions<T>(args);
      return f({ children, options, ...options });
    };
  }

  return {
    p,
    div,
    ul,
    getSelf,
    li,
    reload,
    widget,
    run,
  };
})();

const { p, div, ul, getSelf, li, reload, widget, run } = _coven;

// class Element extends HTMLElement {
//   constructor() {
//   }
// }
// type HTMLElement = {
//   element: HTMLElement;
//   [isComponentSymbol]: true;
// };

// const createElement = (elementName = "div") => {
//   const element = document.createElement(elementName);
//   const { proxy, revoke } = Proxy.revocable(element, {
//     get: function (target, prop, receiver) {
//       return target[prop];
//     },
//     set: function (obj, prop, value) {
//       obj[prop] = value;
//       return element;
//     },
//     apply: function (target, thisArg, argumentsList) {
//       target(...argumentsList);
//       return element;
//     },
//   });
//   proxy.originalElement = element;
//   return proxy;
// };

type textProps = {
  color: string;
};
const title = widget<textProps>((props) => {
  return p(...props.children, {
    html: {
      id: "ho",
    },
    events: {
      onclick(e) {},
    },
    style: {
      padding: "30px",
      color: props.color,
      ...props.options.style,
    },
  });
});
const Counter = widget(() => {
  let counter = 1;
  return li(`counter ${counter}`, {
    events: {
      onclick: (e) => {
        counter++;
        reload();
      },
    },
    style: {
      background: "red",
      height: "50px",
      userSelect: "none",
    },
  });
});

type FlexboxProps = {
  wrap?: boolean;
  alignContent?: "center" | "flex-start" | "flex-end";
  justifyContent?: "center" | "flex-start" | "flex-end";
};
const Flexbox = widget<FlexboxProps>(
  ({
    children,
    wrap = true,
    alignContent = "center",
    justifyContent = "center",
    options,
  }) => {
    return div(...children, {
      style: {
        flexWrap: wrap ? "wrap" : "nowrap",
        justifyContent,
        alignContent,
        display: "flex",
      },
      ...options,
    });
  }
);
const app = () => {
  return div(
    Flexbox(
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi")
    ),
    Flexbox(
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi"),
      p("hi")
    ),
    {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 5fr",
      },
    }
  );
};

run({
  target: "#root",
  app,
});
