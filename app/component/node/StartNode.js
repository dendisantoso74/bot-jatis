import React from "react";
import { Handle, Position } from "reactflow";

//custome node
function StartNode({ data, selected }) {
  return (
    <div
      className={`w-40  shadow-md rounded-md bg-white   ${
        selected ? "border-solid border-2 border-indigo-500/100" : ""
      } `}
    >
      <div className="flex flex-col">
        <div className="px-2 py-1 text-xs font-bold text-left text-black bg-blue-700 max-h-max rounded-t-md">
          {data.title ?? "init title"}
        </div>
        <div className="px-3 py-2 ">
          <div className="text-xs font-normal text-black">
            {data.label ?? "Text Node"}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col">
        <div className="px-2 py-1 text-xs font-bold text-left text-black bg-teal-300 max-h-max rounded-t-md">
          ▶️ Start ✉️ send message
        </div>
        <div className="px-3 py-2 ">
          <div className="text-xs font-normal text-black">
            {data.label ?? "Text Node"}
          </div>
        </div>
      </div> */}
      
      <Handle
        id="b"
        type="source"
        position={Position.Bottom}
        className="w-1 bg-gray-500 rounded-full"
      />
    </div>
  );
}

export default StartNode;
