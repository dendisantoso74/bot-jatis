import React from "react";
import { Handle, Position, useReactFlow, useNodeId, getConnectedEdges  } from "reactflow";
import CustomHandle from "../CutomHandle";
import Image from 'next/image';
import copy from '../../../public/copy.svg'
import trash from '../../../public/trash-fill.svg';

//custome node
const BotNode = ({ data, selected }) => {
  const nodeId = useNodeId();
  const { setNodes, setEdges } = useReactFlow();

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

  const deleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id))
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id ) )
  }
  
  return (
    <div
      className={`w-48 shadow-md rounded-md bg-white ${
        selected ? "border-solid border-2 border-indigo-500/100" : ""
      } `}
    >
      <div className="flex flex-col">
        <div className="px-2 py-1 text-xs text-left text-black bg-blue-700 max-h-max rounded-t-md">
          {/* {data.title ?? "Bot Chat"} */}
          Balasan Chat
        </div>
        <div className="px-3 py-2 ">
          <div className="text-xs font-normal text-black">
            {/* {data.message ?? "Bot Message"} */}
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

      <CustomHandle id="bot_target" type="target" className="w-2 h-2 rounded-full bg-slate-500" position={Position.top} isConnectable={1} />

      <Handle
        id="bot_source"
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-500 rounded-full"
      />

      { selected &&
        <div className='fixed top-0 -right-[70px]'>
        <button onClick={() => deleteNode(nodeId)} className='flex items-center gap-1 p-1 text-xs font-bold text-red-500 align-middle border border-red-500 rounded-md hover:bg-red-200'>
          <Image
            src={trash}
            alt='delete icon'
            width={12}
            className='transition-transform duration-300 h-min hover:scale-110'
          />
          Delete
        </button>
      </div>
      }
    </div>
  );
}

export default BotNode;
