import React from "react";

export default function Sidebar({
  nodeName,
  setNodeName,
  selectedNode,
  setSelectedElements,
}) {
  const handleInputChange = (event) => {
    setNodeName(event.target.value);
  };
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 h-screen p-4 text-sm text-black bg-blue-100 border-r-2 border-blue-200">
      <button onClick={() => console.log('clicked', nodeName)}>tes</button>
      {selectedNode ? (
        //settings panel
        <div>
          <h3 className="mb-2 text-xl text-blue-900">Update Node</h3>
          <label className="block mb-2 text-sm font-medium text-blue-900">
            Node Name:
          </label>
          <input
            type="text"
            className="block w-full px-3 pt-2 pb-3 text-gray-700 bg-white border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={nodeName}
            onChange={handleInputChange}
          />
          <button
            className="p-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => setSelectedElements([])}
          >
            Go Back
          </button>
        </div>
      ) : (
        //node panel
        <>
          <h3 className="mb-4 text-xl text-blue-900">Nodes Panel</h3>
          <div
            className="flex items-center justify-center p-3 text-blue-500 transition-colors duration-200 bg-white border-2 border-blue-500 rounded cursor-move hover:bg-blue-500 hover:text-white"
            onDragStart={(event) => onDragStart(event, "textnode")}
            draggable
          >
            Message Node
          </div>
        </>
      )}
    </aside>
  );
}
