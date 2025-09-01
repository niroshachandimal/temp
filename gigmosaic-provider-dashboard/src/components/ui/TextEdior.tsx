import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "quill/dist/quill.snow.css";

interface TextEditorProps {
  value: string;
  isError?: boolean;
  onChangeValue: (value: string) => void;
}

const TextEditor = ({
  onChangeValue,
  value,
  isError = false,
}: TextEditorProps) => {
  const customToolbar = (
    <span className="ql-formats">
      <select className="ql-header">
        {/* <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option> */}
        <option value="">Normal</option>
      </select>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      {/* <button className="ql-blockquote"></button>
      <button className="ql-clean"></button> */}
    </span>
  );

  return (
    <>
      <Editor
        value={value}
        onTextChange={(e) => onChangeValue(e.htmlValue || "")}
        headerTemplate={customToolbar}
        style={{
          height: "320px",
          border: isError ? "0.5px solid #B9375D" : "0.5px solid #ccc",
        }}
      />
    </>
  );
};

export default TextEditor;
