import { Fragment } from "react";

/** Splits text into word spans for the scroll-lit statement (rendered on the server). */
export function Words({ text }: { text: string }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.map((w, i) => (
        <Fragment key={i}>
          <span className="wd">{w}</span>
          {i < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
