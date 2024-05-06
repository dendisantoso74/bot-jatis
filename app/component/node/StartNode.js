import React from 'react';
import { Handle, Position, useReactFlow, useNodeId  } from "reactflow";
import Image from 'next/image';
import copy from '../../../public/copy.svg'

//custome node
const StartNode = ({ data, selected }) => {
  const nodeId = useNodeId();
  const { setNodes } = useReactFlow();

  const updateData = (e) => {
    const inputVal = e.target.value;

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              message: inputVal
            }
          };
        }

        return node;
      })
    );
  };
  
  return (
    <div
      className={`w-48 shadow-md rounded-md bg-white ${
        selected ? "border-solid border-2 border-indigo-500/100" : ""
      } `}
    >
      <div className="flex flex-col">
        <div className="px-2 py-1 text-xs font-bold text-left text-black bg-blue-700 max-h-max rounded-t-md">
          {data.title ?? "init title"}
        </div>
        <div className="px-3 py-2 ">
          <div className="text-xs font-normal text-black">
            {/* {data.message ?? "Text Node"} */}
            <textarea value={data.message} onChange={(e) => updateData(e)} placeholder='Input message...'  className="min-h-[58px] p-1 w-full text-black border border-gray-300 rounded-sm nodrag" />
          </div>
          <div className='flex justify-between w-full'>
            <span className='text-xs text-gray-500'>{nodeId}</span>
            <button
              onClick={() =>
                navigator.clipboard.writeText(nodeId)
              }
            >
              <Image
                src={copy}
                alt='copy icon'
                width={12}
                className='transition-transform duration-300 h-min hover:scale-110'
              />
            </button>
          </div>
        </div>
      </div>

      <Handle
        id="bot_source"
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-500 rounded-full"
      />
    </div>
  );
}

export default StartNode;
