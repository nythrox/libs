// import { AssertQuxIsLast, StringToNumber, LastIndex } from "./types";

// const root = document.getElementById("root");

// // class Element extends HTMLElement {
// //   constructor() {
// //   }
// // }
// const isElementSymbol = Symbol("___isElement___");

// // type HTMLElement = {
// //   element: HTMLElement;
// //   [isElementSymbol]: true;
// // };

// type props = {
//   id?: string;
//   htmlOptions?: Partial<WritablePart<HTMLElement>>;
//   children?: (HTMLElement | string)[];
//   classes?: string[];
//   events?: Partial<GlobalEventHandlers>;
//   name: keyof HTMLElementTagNameMap;
//   style?: Partial<CSSStyleDeclaration>;
// };
// export type defaultOptions = {
//   events?: Partial<GlobalEventHandlers & DocumentAndElementEventHandlers>;
//   style?: Partial<CSSStyleDeclaration>;
//   html?: Partial<WritablePart<HTMLElement>>;
// };

// const addEventListeners = (
//   events: Partial<GlobalEventHandlers>,
//   element: HTMLElement
// ) => {
//   Object.keys(events).forEach((event) => {
//     element.addEventListener(event.replace("on", ""), events[event]);
//   });
// };

// const addStyles = (
//   style: Partial<CSSStyleDeclaration>,
//   element: HTMLElement
// ) => {
//   const properties = Object.keys(style);
//   properties.forEach((p) => {
//     element.style[p] = style[p];
//   });
// };
// const addHtmlOptions = (
//   options: Partial<WritablePart<HTMLElement>>,
//   element: HTMLElement
// ) => {
//   const properties = Object.keys(options);
//   properties.forEach((p) => {
//     element[p] = options[p];
//   });
// };

// type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
//   T
// >() => T extends Y ? 1 : 2
//   ? A
//   : B;

// type WritableKeys<T> = {
//   [P in keyof T]-?: IfEquals<
//     { [Q in P]: T[P] },
//     { -readonly [Q in P]: T[P] },
//     P
//   >;
// }[keyof T];

// type FunctionKeys<T> = {
//   [P in keyof T]: T[P] extends Function ? never : P;
// }[keyof T];

// type WritablePart<T> = Pick<T, WritableKeys<T> & FunctionKeys<HTMLElement>>;

// function element({
//   name = "div",
//   children = [],
//   classes,
//   style = {},
//   id,
//   htmlOptions = {},
//   events = {},
// }: props) {
//   const obj = document.createElement(name);
//   children && obj.append(...children);
//   classes &&
//     classes.forEach((c) => {
//       obj.classList.add(c);
//     });
//   if (id) obj.id = id;
//   addStyles(style, obj);
//   addEventListeners(events, obj);
//   addHtmlOptions(htmlOptions, obj);
//   // const proxy = new Proxy(obj, {
//   //   get: (target, property, receiver) => {
//   //     const value = target[property];
//   //     if (value) return value;
//   //     return target.element.dataset[property]
//   //   },
//   //   set: (target, property, value, receiver) => {

//   //   },
//   //   // getPrototypeOf? (target: T): object | null,
//   //   // setPrototypeOf? (target: T, v: any): boolean,
//   //   // isExtensible? (target: T): boolean,
//   //   // preventExtensions? (target: T): boolean,
//   //   // getOwnPropertyDescriptor? (target: T, p: PropertyKey): PropertyDescriptor | undefined,
//   //   // has? (target: T, p: PropertyKey): boolean,
//   //   // deleteProperty? (target: T, p: PropertyKey): boolean,
//   //   // defineProperty? (target: T, p: PropertyKey, attributes: PropertyDescriptor): boolean,
//   //   // enumerate? (target: T): PropertyKey[],
//   //   // ownKeys? (target: T): PropertyKey[],
//   //   // apply? (target: T, thisArg: any, argArray?: any): any,
//   //   // construct? (target: T, argArray: any, newTarget?: any): object,
//   // })
//   return obj;
// }

// // const createElement = (elementName = "div") => {
// //   const element = document.createElement(elementName);
// //   const { proxy, revoke } = Proxy.revocable(element, {
// //     get: function (target, prop, receiver) {
// //       return target[prop];
// //     },
// //     set: function (obj, prop, value) {
// //       obj[prop] = value;
// //       return element;
// //     },
// //     apply: function (target, thisArg, argumentsList) {
// //       target(...argumentsList);
// //       return element;
// //     },
// //   });
// //   proxy.originalElement = element;
// //   return proxy;
// // };
// const isNotOptions = (obj): obj is child => {
//   if (typeof obj == "string") return true;
//   return !!(obj as HTMLElement).ELEMENT_NODE;
// };

// function getChildren(args: (child | defaultOptions)[]) {
//   let children = [];
//   if (args.length > 0) {
//     const lastItem = args[args.length - 1];
//     children = isNotOptions(lastItem) ? args : [];
//     if (args.length > 1) {
//       children = isNotOptions(lastItem) ? args : args.slice(0, -1);
//     }
//     return children as child[];
//   }
// }

// function getOptions<T>(args: (child | defaultOptions)[]) {
//   let options: defaultOptions = {};
//   if (args.length > 0) {
//     const lastItem = args[args.length - 1];
//     options = isNotOptions(lastItem) ? {} : lastItem;
//   }
//   return options as defaultOptions & T;
// }
// export type child = string | HTMLElement;
// const childOrChildren = (name) => {
//   return (...args: (child | defaultOptions)[]) => {
//     const options = getOptions(args);
//     const children = getChildren(args);
//     return element({
//       name,
//       children,
//       style: options.style ?? {},
//       events: options.events ?? {},
//     });
//   };
// };

// const div = childOrChildren("div");
// const ul = childOrChildren("ul");
// const p = childOrChildren("p");
// const li = childOrChildren("li");

// type component<T = {}> = (
//   ...args: (child | (T & defaultOptions))[]
// ) => HTMLElement;

// function widget<T>(
//   f: (args: {
//     options: T & defaultOptions;
//     children: child[];
//   }) => HTMLElement
// ): component<T> {
//   return (...args) => {
//     const children = getChildren(args);
//     const options = getOptions<T>(args);
//     return f({ children, options });
//   };
// }

// type textProps = {
//   color: string;
// };

// const text = widget<textProps>((props) => {
//   return p(...props.children, {
//     style: {
//       padding: "30px",
//       color: props.options.color,
//       ...props.options.style,
//     },
//   });
// });

// let counter = 1;
// const app = () => {
//   return div(
//     ul(
//       text("hi", {
//         color: "red",
//       }),
//       div("hi", {
//         html: {},
//         style: {
//           padding: "25px",
//           background: "blue",
//         },
//       }),
//       li(`counter ${counter}`, {
//         events: {
//           onclick: (e) => {
//             counter++;
//             reload();
//           },
//         },
//         style: {
//           background: "red",
//           height: "50px",
//           userSelect: "none",
//         },
//       }),
//       li("my name is pedro", {})
//     )
//   );
// };

// let a = root.appendChild(app());

// function reload() {
//   const newChild = app();
//   root.replaceChild(newChild, a);
//   a = newChild;
// }
