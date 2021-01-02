// const coven = (() => {
//   let currentComponent: Component = undefined;
//   const isComponentSymbol = Symbol("___isComponent___");

//   class Component<T extends Object = Object> {
//     subscribedBy: Component[] = [];
//     subscribedTo: Component[] = [];
//     parent: Component;
//     children: Component[] = [];
//     element: Element;
//     state: T = {} as any;
//     options: defaultOptions = {};
//     build: () => HTMLElement;
//     constructor(build: () => HTMLElement) {
//       this[isComponentSymbol] = true;
//       this.build = () => {
//         currentComponent = this;
//         const element = build();
//         currentComponent = undefined;
//         return element;
//       };
//     }
//     dispose() {
//       this.subscribedTo.forEach((component) => {
//         this.removeSubscription(component);
//       });
//     }

//     notifySubscribers() {
//       this.subscribedBy.forEach((o) => o.build());
//     }
//     subscribeTo(component: Component) {
//       component.subscribedBy.push(this);
//       this.subscribedTo.push(component);
//     }
//     removeSubscription(component: Component) {
//       const index = component.subscribedBy.indexOf(this);
//       if (index > -1) {
//         component.subscribedBy.splice(index, 1);
//       }
//       const localIndex = this.subscribedTo.indexOf(component);
//       if (localIndex > -1) {
//         this.subscribedBy.splice(localIndex, 1);
//       }
//     }
//   }

//   function buildTree(c: Component) {
//     const element = c.build();
//     addStyles(c.options.style, element);
//     addHtmlOptions(c.options.html, element);
//     addEventListeners(c.options.events, element);
//     element.append(...c.children.map((child) => this.buildTree(child)));
//     c.element = element;
//     return element;
//   }

//   function getSelf() {
//     return currentComponent;
//   }

//   function reload() {
//     console.log("trying to realod");
//     //   const newChild = app();
//     //   root.replaceChild(newChild, a);
//     //   a = newChild;
//   }

//   function run({
//     target = "#root",
//     app,
//   }: {
//     target: string;
//     app: () => Component;
//   }) {
//     const element = this.buildTree(app());
//     document.querySelector(target).appendChild(element);
//   }

//   type props = {
//     id?: string;
//     children?: (Component | string)[];
//     options?: defaultOptions;
//     name: keyof HTMLElementTagNameMap;
//   };

//   type defaultOptions = {
//     events?: Partial<GlobalEventHandlers & DocumentAndElementEventHandlers>;
//     style?: Partial<CSSStyleDeclaration>;
//     html?: Partial<WritablePart<HTMLElement>>;
//   };

//   const addEventListeners = (
//     events: Partial<GlobalEventHandlers> = {},
//     element: HTMLElement
//   ) => {
//     Object.keys(events).forEach((event) => {
//       element.addEventListener(event.replace("on", ""), events[event]);
//     });
//   };

//   const addStyles = (
//     style: Partial<CSSStyleDeclaration> = {},
//     element: HTMLElement
//   ) => {
//     const properties = Object.keys(style);
//     properties.forEach((p) => {
//       element.style[p] = style[p];
//     });
//   };
//   const addHtmlOptions = (
//     options: Partial<WritablePart<HTMLElement>> = {},
//     element: HTMLElement
//   ) => {
//     const properties = Object.keys(options);
//     properties.forEach((p) => {
//       element[p] = options[p];
//     });
//   };

//   type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X
//     ? 1
//     : 2) extends <T>() => T extends Y ? 1 : 2
//     ? A
//     : B;

//   type WritableKeys<T> = {
//     [P in keyof T]-?: IfEquals<
//       { [Q in P]: T[P] },
//       { -readonly [Q in P]: T[P] },
//       P
//     >;
//   }[keyof T];

//   type FunctionKeys<T> = {
//     [P in keyof T]: T[P] extends Function ? never : P;
//   }[keyof T];

//   type WritablePart<T> = Pick<T, WritableKeys<T> & FunctionKeys<HTMLElement>>;

//   const text = (text: string) => {
//     const div = document.createElement("div");
//     const data = document.createTextNode(text);
//     div.appendChild(data);
//     return new Component(() => div);
//   };
//   function element({ name = "div", children = [], options = {} }: props) {
//     const transformedChildren = children.map((c) => {
//       if (typeof c === "string") {
//         return text(c);
//       }
//       return c;
//     });
//     const obj = new Component(() => document.createElement(name));
//     obj.children.push(...transformedChildren);
//     obj.children.forEach((c) => (c.parent = obj));
//     obj.options = options;
//     //   console.log(currentComponent);
//     //   classes &&
//     //     classes.forEach((c) => {
//     //       obj.classList.add(c);
//     //     });
//     //   if (id) obj.id = id;

//     //   addStyles(style, obj.element);
//     //   addEventListeners(events, obj.element);
//     //   addHtmlOptions(htmlOptions, obj.element);
//     return obj;
//   }

//   const isNotOptions = (obj): obj is child => {
//     if (typeof obj == "string") return true;
//     return !!(obj as Component)[isComponentSymbol];
//   };

//   function getChildren(args: (child | defaultOptions)[]) {
//     let children = [];
//     if (args.length > 0) {
//       const lastItem = args[args.length - 1];
//       children = isNotOptions(lastItem) ? args : [];
//       if (args.length > 1) {
//         children = isNotOptions(lastItem) ? args : args.slice(0, -1);
//       }
//       return children as child[];
//     }
//   }

//   function getOptions<T>(args: (child | defaultOptions)[]) {
//     let options: defaultOptions = {};
//     if (args.length > 0) {
//       const lastItem = args[args.length - 1];
//       options = isNotOptions(lastItem) ? {} : lastItem;
//     }
//     return options as defaultOptions & T;
//   }
//   type child = string | Component;
//   const childOrChildren = (name) => {
//     return (...args: (child | defaultOptions)[]) => {
//       const options = getOptions(args);
//       const children = getChildren(args);
//       return element({
//         name,
//         children,
//         options,
//       });
//     };
//   };
//   const div = childOrChildren("div");
//   const ul = childOrChildren("ul");
//   const p = childOrChildren("p");
//   const li = childOrChildren("li");

//   type component<T = {}> = (
//     ...args: (child | (T & defaultOptions))[]
//   ) => Component;

//   function widget<T>(
//     f: (args: { options: T & defaultOptions; children: child[] }) => Component
//   ): component<T> {
//     return (...args) => {
//       const children = getChildren(args);
//       const options = getOptions<T>(args);
//       return f({ children, options });
//     };
//   }
// })();
