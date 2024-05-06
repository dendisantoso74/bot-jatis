/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  MiniMap,
  Controls,
  Background,
  MarkerType,
} from "reactflow";
import "reactflow/dist/base.css";

import "../tailwind.config.js";
import Sidebar from "./component/sidebar";
import BotNode from "./component/node/BotNode.js";
import StartNode from "./component/node/StartNode.js";
import UserNode from "./component/node/UserNode.js";

// Key for local storage
const flowKey = "flow-key";

// Function for generating unique IDs for nodes
const getId = () => `node_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;

// Initial node setup
const initialNodes = [
  {
    id: `node_init_${Math.random().toString(36).substr(2, 9)}`,
    type: "startnode",
    data: { message: "Halo ada yang bisa saya bantu?", title: "▶️ Start"},
    position: { x: 250, y: 5 }
  },
];

const App = () => {
  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      // textnode: TextNode,
      botnode: BotNode,
      usernode: UserNode,
      startnode: StartNode,
    }),
    []
  );

  // States and hooks setup
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [nodeTitle, setNodeTitle] = useState("");

  // Update nodes data when nodeName or selectedElements changes
  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              message: nodeName,
              title: nodeTitle,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName(""); // Clear nodeName when no node is selected
      setNodeTitle(""); // Clear nodeName when no node is selected
    }
  }, [nodeName, nodeTitle, selectedElements, setNodes]);

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedElements([node]);
    setNodeName(node.data.message);
    setNodeTitle(node.data.title);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  // Setup viewport
  const { setViewport } = useReactFlow();

  // Check for empty target handles
  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  // Check if any node is unconnected
  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  // Save flow to local storage
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        alert(
          "Error: More than one node has an empty target handle or there are unconnected nodes."
        );
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
        alert("Save successful!"); // Provide feedback when save is successful
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

  // Restore flow from local storage
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const addEndMarker = (edge) => ({
    ...edge,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#b1b1b7",
    },
  });

  // Handle edge connection
  const onConnect = useCallback(
    (params) => {
      if (params.sourceHandle.substr(0, 3) !== params.targetHandle.substr(0, 3)) {
        setEdges((eds) => addEdge(addEndMarker(params), eds));
      }
    },
    [setEdges]
  );

  // Enable drop effect on drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop event to add a new node
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { message: '', title: 'judul' }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const rfStyle = {
    backgroundColor: "#ffffff",
  };

  return (
    <div className="flex flex-row min-h-screen lg:flex-row">
      <div className="flex-grow h-screen" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={rfStyle}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            setSelectedElements([]); // Reset selected elements when clicking on pane
            setNodes((nodes) =>
              nodes.map((n) => ({
                ...n,
                selected: false, // Reset selected state of nodes when clicking on pane
              }))
            );
          }}
          fitView
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
          <MiniMap zoomable pannable />
          <Panel>
            <button
              className="px-4 py-2 m-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              onClick={onSave}
            >
              save flow
            </button>
            <button
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              onClick={onRestore}
            >
              restore flow
            </button>
          </Panel>
        </ReactFlow>
      </div>

      <Sidebar
        edges={edges}
        nodes={nodes}
        nodeName={nodeName}
        nodeTitle={nodeTitle}
        setNodeName={setNodeName}
        setNodeTitle={setNodeTitle}
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
      />
    </div>
  );
};

// Wrap App with ReactFlowProvider
function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
