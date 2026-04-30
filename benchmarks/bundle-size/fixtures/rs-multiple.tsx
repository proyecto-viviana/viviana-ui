// React Spectrum - Multiple Components
import * as React from "react";
import { Button, TextField, Checkbox, Picker, Item } from "@adobe/react-spectrum";

export function App() {
  return React.createElement(
    "div",
    null,
    React.createElement(Button, null, "Submit"),
    React.createElement(TextField, { label: "Email" }),
    React.createElement(Checkbox, null, "Accept terms"),
    React.createElement(
      Picker,
      { label: "Choose option" },
      React.createElement(Item, { key: "1" }, "Option 1"),
      React.createElement(Item, { key: "2" }, "Option 2"),
    ),
  );
}
