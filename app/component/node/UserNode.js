import React, { useCallback } from 'react';
import { Handle, Position } from "reactflow";
import CustomHandle from '../CutomHandle';

//custome node
function UserNode({ data, selected }) {

  const onChange = useCallback((e, selected) => {
    console.log(e.target.value, "selected", selected);
  }, []);

  return (
    <div
      className={`w-40  shadow-md rounded-md bg-white   ${
        selected ? "border-solid border-2 border-indigo-500/100" : ""
      } `}
    >
      <div className="flex flex-col">
        <div className="px-2 py-1 text-xs text-left text-black bg-teal-300 max-h-max rounded-t-md">
          {/* {data.title ?? "Keyword User Chat"} */}
          Keyword User Chat
        </div>
        <div className="px-3 py-2 ">
          <div className="text-xs font-normal text-black">
            {data.message ?? "User Message"}
            {/* <textarea onChange={(e) => onChange(e, data)} placeholder='Input mesage...'  className="w-full text-black border border-gray-300 rounded-sm nodrag" /> */}
          </div>
        </div>
      </div>

      {/* <Handle
        id="a"
        type="target"
        position={Position.top}
        className="w-1 rounded-full bg-slate-500"
      /> */}
      <CustomHandle id="a" type="target" className="w-2 h-2 rounded-full bg-slate-500" position={Position.top} isConnectable={1} />
      <CustomHandle id="b" type="source" className="w-2 h-2 rounded-full bg-slate-500" position={Position.Bottom} isConnectable={2} />


      {/* <Handle
        id="b"
        type="source"
        position={Position.Bottom}
        className="w-1 bg-gray-500 rounded-full"
      /> */}

    </div>
  );
}

export default UserNode;
