import { isElement } from "react-dom/test-utils";
import React from "react";

export function getProps<T extends {}>(...args: any[]): T | null {
  let props = null;
  if (args.length > 0) {
    const firstArg = args[0];
    //first argument is a component, so all the next ones are too
    if (isElement(firstArg)) {
    }
    //first argument is props, so the next elements are children
    else {
      props = firstArg;
    }
  }
  return props;
}
export function getChildren(...args: any[]): React.ReactNode[] {
  let children: React.ReactNode[] = [];
  if (args.length > 0) {
    const firstArg = args[0];
    //first argument is a component, so all the next ones are too
    if (isElement(firstArg)) {
      children = args;
    }
    //first argument is props, so the next elements are children
    else {
      children = children.slice(1, args.length);
    }
  }
  return children;
}
type PropfulComponent<Props, Return, Children = React.ReactNode> = {
  (props: Props, ...children: Children[]): Return;
};
type OptionalPropsComponent<Props, Return, Children = React.ReactNode> = {
  (props?: Props, ...children: Children[]): Return;
  (...children: Children[]): Return;
};
//html element with props
export function component<
  P extends React.HTMLAttributes<T>,
  T extends HTMLElement
>(
  type: keyof React.ReactHTML
): OptionalPropsComponent<
  React.ClassAttributes<T> & P,
  React.DetailedReactHTMLElement<P, T>
>;

//svg element with props
export function component<
  P extends React.SVGAttributes<T>,
  T extends SVGElement
>(
  type: keyof React.ReactSVG
): OptionalPropsComponent<React.ClassAttributes<T> & P, React.ReactSVGElement>;

//custom html element with props
export function component<P extends React.DOMAttributes<T>, T extends Element>(
  type: string
): OptionalPropsComponent<React.ClassAttributes<T> & P, React.DOMElement<P, T>>;

//class component
export function component(
  type: React.ClassType<
    {},
    React.ClassicComponent<{}, React.ComponentState>,
    React.ClassicComponentClass<{}>
  >
): OptionalPropsComponent<
  React.ClassAttributes<React.ClassicComponent<{}, React.ComponentState>> & {},
  React.CElement<{}, React.ClassicComponent<{}, React.ComponentState>>
>;

// class component
export function component<P>(
  type: React.ClassType<
    P,
    React.ClassicComponent<P, React.ComponentState>,
    React.ClassicComponentClass<P>
  >
): PropfulComponent<
  React.ClassAttributes<React.ClassicComponent<P, React.ComponentState>> & P,
  React.CElement<P, React.ClassicComponent<P, React.ComponentState>>
>;

export function component(
  type: (props: { children: React.ReactNode[] }) => React.ReactElement<any, any>
): OptionalPropsComponent<React.Attributes, React.FunctionComponentElement<{}>>;

//function component
export function component<P>(
  type: (
    props: P & { children: React.ReactNode[] }
  ) => React.ReactElement<any, any>
): PropfulComponent<React.Attributes & P, React.FunctionComponentElement<P>>;

//anything
export function component<P>(
  type: React.FunctionComponent<P> | React.ComponentClass<P> | string
): PropfulComponent<React.Attributes & P, React.ReactElement<P>>;

//implementation
export function component(type: any) {
  function functionToReactElement(...args: any) {
    const props = getProps(args);
    const children = getChildren(args);
    return React.createElement(type, props, children);
  }
  return functionToReactElement as any;
}
