import { getProps, getChildren } from "./component";
import React from "react";

type ChildlessPropfulComponent<Props, Return> = {
  (props: Props): Return;
};
type ChildlessOptionalPropsComponent<Props, Return> = {
  (props?: Props): Return;
};

//html element with props
export function childlessComponent<
  P extends React.HTMLAttributes<T>,
  T extends HTMLElement
>(
  type: keyof React.ReactHTML
): ChildlessPropfulComponent<
  React.ClassAttributes<T> & P,
  React.DetailedReactHTMLElement<P, T>
>;

//svg element with props
export function childlessComponent<
  P extends React.SVGAttributes<T>,
  T extends SVGElement
>(
  type: keyof React.ReactSVG
): ChildlessPropfulComponent<
  React.ClassAttributes<T> & P,
  React.ReactSVGElement
>;

//custom html element with props
export function childlessComponent<
  P extends React.DOMAttributes<T>,
  T extends Element
>(
  type: string
): ChildlessPropfulComponent<
  React.ClassAttributes<T> & P,
  React.DOMElement<P, T>
>;

// class childlessComponent
export function childlessComponent(
  type: React.ClassType<
    {},
    React.ClassicComponent<{}, React.ComponentState>,
    React.ClassicComponentClass<{}>
  >
): ChildlessOptionalPropsComponent<
  React.ClassAttributes<React.ClassicComponent<{}, React.ComponentState>> & {},
  React.CElement<{}, React.ClassicComponent<{}, React.ComponentState>>
>;
export function childlessComponent<P>(
  type: React.ClassType<
    P,
    React.ClassicComponent<P, React.ComponentState>,
    React.ClassicComponentClass<P>
  >
): ChildlessPropfulComponent<
  React.ClassAttributes<React.ClassicComponent<P, React.ComponentState>> & P,
  React.CElement<P, React.ClassicComponent<P, React.ComponentState>>
>;

export function childlessComponent(
  type: (props: { children: React.ReactNode }) => React.ReactElement<any, any>
): ChildlessOptionalPropsComponent<
  React.Attributes,
  React.FunctionComponentElement<{}>
>;

//function childlessComponent
export function childlessComponent<P>(
  type: (
    props: P & { children: React.ReactNode }
  ) => React.ReactElement<any, any>
): ChildlessPropfulComponent<
  React.Attributes & P,
  React.FunctionComponentElement<P>
>;

//anything
export function childlessComponent<P>(
  type: React.FunctionComponent<P> | React.ComponentClass<P> | string
): ChildlessPropfulComponent<React.Attributes & P, React.ReactElement<P>>;

export function childlessComponent(type: any) {
  function functionToReactElement(...args: any) {
    const props = getProps(args);
    const children = getChildren(args);
    return React.createElement(type, props, children);
  }
  return functionToReactElement as any;
}
