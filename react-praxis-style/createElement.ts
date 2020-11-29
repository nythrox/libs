import React, { FunctionComponent, useState } from "react";
import { isElement } from "react-dom/test-utils";
import { component } from "./component";
import ReactDOM from "react-dom";
import { childlessComponent } from "./childlessComponent";

const ul = component("ul");
const a = component("a");
const abbr = component("abbr");
const address = component("address");
const area = childlessComponent("area");
const article = component("article");
const aside = component("aside");
const audio = component("audio");
const b = component("b");
const base = childlessComponent("base");
const bdi = component("bdi");
const bdo = component("bdo");
const blockquote = component("blockquote");
const body = component("body");
const br = childlessComponent("br");
const button = component("button");
const canvas = component("canvas");
const caption = component("caption");
const cite = component("cite");
const code = component("code");
const col = childlessComponent("col");
const colgroup = component("colgroup");
const data = component("data");
const datalist = component("datalist");
const dd = component("dd");
const del = component("del");
const details = component("details");
const dfn = component("dfn");
const dialog = component("dialog");
const div = component("div");
const dl = component("dl");
const dt = component("dt");
const em = component("em");
const embed = childlessComponent("embed");
const fieldset = component("fieldset");
const figcaption = component("figcaption");
const figure = component("figure");
const footer = component("footer");
const form = component("form");
const h1 = component("h1");
const h2 = component("h2");
const h3 = component("h3");
const h4 = component("h4");
const h5 = component("h5");
const h6 = component("h6");
const head = component("head");
const header = component("header");
const hgroup = component("hgroup");
const hr = childlessComponent("hr");
const html = component("html");
const i = component("i");
const iframe = component("iframe");
const img = childlessComponent("img");
const input = childlessComponent("input");
const ins = component("ins");
const kbd = component("kbd");
const label = component("label");
const legend = component("legend");
const li = component("li");
const link = childlessComponent("link");
const main = component("main");
const map = component("map");
const mark = component("mark");
const math = component("math");
const menu = component("menu");
const menuitem = childlessComponent("menuitem");
const meta = childlessComponent("meta");
const meter = component("meter");
const nav = component("nav");
const noscript = component("noscript");
const object = component("object");
const ol = component("ol");
const optgroup = component("optgroup");
const option = component("option");
const output = component("output");
const p = component("p");
const param = childlessComponent("param");
const picture = component("picture");
const pre = component("pre");
const progress = component("progress");
const q = component("q");
const rb = component("rb");
const rp = component("rp");
const rt = component("rt");
const rtc = component("rtc");
const ruby = component("ruby");
const s = component("s");
const samp = component("samp");
const script = component("script");
const section = component("section");
const select = component("select");
const slot = component("slot");
const small = component("small");
const source = childlessComponent("source");
const span = component("span");
const strong = component("strong");
const style = component("style");
const sub = component("sub");
const summary = component("summary");
const sup = component("sup");
const svg = component("svg");
const table = component("table");
const tbody = component("tbody");
const td = component("td");
const template = component("template");
const textarea = component("textarea");
const tfoot = component("tfoot");
const th = component("th");
const thead = component("thead");
const time = component("time");
const title = component("title");
const tr = component("tr");
const track = childlessComponent("track");
const u = component("u");
const varElement = component("var");
const video = component("video");
const wbr = childlessComponent("wbr");

const Center = component(({ children }) => {
  return div(
    {
      style: {
        color: "red",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
      },
    },
    ...children
  );
});

export const Counter = component(() => {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      {Center(
        <h2
          onClick={() => {
            setCounter((c) => c + 1);
          }}
        >
          Olá! Counter: {counter}
        </h2>
      )}
    </div>
  );
});

type TitleProps = {
  title: string;
};
export const Title = component<TitleProps>(({ title }) => div(title));

const App = component(() => {
  //TODO: test eveything,
  //TODO: add a Counter.JSX and test it
  //TODO: right now u can already do counter as <Counter> (with props detection and it works), test that too
  //TODO: test whyt sometime automcomplete not working for div n stuff
  return Counter();
});

ReactDOM.render(App(), document.getElementById("#root"));
