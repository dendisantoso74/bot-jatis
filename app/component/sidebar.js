import React, {useEffect, useState} from "react";
import Modal from 'react-modal';

export default function Sidebar({
  nodeName,
  nodeTitle,
  setNodeName,
  setNodeTitle,
  selectedNode,
  setSelectedElements,
  nodes,
  edges
}) {
  // const [title, setTitle] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [tempClientChat, setTempClientChat] = useState('');
  const [clientChat, setClientChat] = useState([]);
  const [keywordChat, setKeywordChat] = useState([{data:{label:''}}]);
  const [serverChat, setServertChat] = useState([]);
  const [serverChatTemp, setServertChatTemp] = useState([]);
  const [localEdges, setLocalEdges] = useState([{data:{source:''}}]);


  useEffect(() => {
    const botNodes = nodes.filter(node => node.type === 'startnode' || node.type === 'botnode');
    const userNodes = nodes.filter(node => node.type === 'usernode');
    setServertChat(botNodes);
    setKeywordChat(userNodes);
    setLocalEdges(edges)
  },[nodes, edges, openModal]);

  const handleInputChange = (event) => {
    setNodeName(event.target.value);
  };

  const handleTitleChange = (event) => {
    setNodeTitle(event.target.value);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const deleteItem = (itemToDelete) => {
    // Buat array baru yang tidak memuat nilai yang ingin dihapus
    const updatedItems = clientChat.filter(item => item !== itemToDelete);
    // Perbarui state dengan array baru
    setClientChat(updatedItems);
  };

  const handleSend = (chat) => {
    // if (keywordChat.includes(chat)) {
    // }
    // keywordChat.some(v => v.data.label === "tampilkan menu");
    // console.log("masuk include", keywordChat.includes(chat), 'keyword', keywordChat, 'chat', chat)
    if (clientChat.length === 0) {
      setClientChat([...clientChat, chat])
      setServertChatTemp([...serverChatTemp, serverChat[0]])
    }
    if (keywordChat.some(v => v.data.label === chat) && clientChat) {
      //need action 
      // setClientChat([...clientChat, chat])
      keywordChat.forEach((v) => {
        if (v.data.label === chat) {
          console.log("Matched keyword data:", v); // Log v.data
          const temp = v.id
          localEdges.forEach((edge) => {
            if (edge.source === temp) {
              console.log("source", edge.source, 'target', edge.target); // Log v.data
              const answer = serverChat.find(node => node.id === edge.target);
              console.log('answer', serverChat.find(node => node.id === edge.target));
              setServertChatTemp([...serverChatTemp, answer])
              setClientChat([...clientChat, chat])


            }
          });
        }
      });

    }
    setTempClientChat('')
  };

  const handleCloseModal = () => {
    setTempClientChat('')
    setClientChat([])
    setKeywordChat([{data:{label:''}}])
    setServertChat([])
    setServertChatTemp([])
    setLocalEdges([{data:{source:''}}])
    setOpenModal(!openModal)
  };

  const handleUserMessage = ({ type, content }) =>  {
      // Handle user message and provide appropriate responses
      // Example: Based on menu options, fetch data or display messages
      if (content === 'menu 1') {
        // Provide response for menu 1
      } else if (content === 'menu 2') {
        // Provide response for menu 2
      } else {
        // Handle other user inputs
      }
    }
  

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '12px',
    },
  };
  console.log("client chat", clientChat);

  console.log("log", serverChatTemp);


  return (
    <>
      <aside className="w-64 h-screen p-4 text-sm text-black bg-blue-100 border-r-2 border-blue-200">
        <button className='w-full px-4 py-2 mb-3 font-bold bg-blue-300 border shadow-sm hover:bg-blue-600 rounded-xl hover:text-white' onClick={() => setOpenModal(true)}>Simulation Chat</button>
        {selectedNode ? (
          //settings panel
          <div>
            <h3 className="mb-2 text-xl text-blue-900">Update Node</h3>
            <label className="block mb-2 text-sm font-medium text-blue-900">
              Title
            </label>
            <input
              type="text"
              className="block w-full px-3 pt-2 pb-3 text-gray-700 bg-white border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={nodeTitle}
              onChange={handleTitleChange}
            />
            
            <label className="block my-2 text-sm font-medium text-blue-900">
              Node Name
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
              onDragStart={(event) => onDragStart(event, "usernode")}
              draggable
            >
              Message Node
            </div>

            <div
              className="flex items-center justify-center p-3 mt-5 text-blue-500 transition-colors duration-200 bg-white border-2 border-blue-500 rounded cursor-move hover:bg-blue-500 hover:text-white"
              onDragStart={(event) => onDragStart(event, "botnode")}
              draggable
            >
              Bot Message Node
            </div>

          </>
          
        )}
      </aside>

      {/* chat simulation */}
      <Modal
        isOpen={openModal}
        contentLabel="Example Modal"
        style={customStyles}
      >
        {/* {console.log('edges', edges)} */}
        <div className="flex justify-between mb-2">
          <p className="text-xl font-bold text-black">Chatbot Simulation</p>
          <button className="flex text-sm font-bold text-black -top-10" onClick={() => handleCloseModal()}>✖️</button>
        </div>
        <div className="mb-8 text-black">Send a message to start conversation</div>
        <div className="relative h-full overflow-auto max-h-[80vh]">
          <div className="relative flex flex-col justify-end flex-grow pb-3 text-black rounded-md bg-stone-200">
            <div className="bg-green-950 w-full h-14 relative mb-3 rounded-t-md px-7 flex items-center">
              <div className="rounded-full h-10 w-10 bg-slate-500 flex items-center justify-center">
                <span className="font-bold text-xl">CS</span>
              </div>
              <p className="text-white font-semibold ml-2">Coster Studio</p>
            </div>
            
            {clientChat.map((v, i) => (
              <>
                {/* chat from user */}
                <div
                    key={i}
                    className="relative flex flex-col p-2 my-1 ml-auto text-sm bg-green-300 rounded-lg rounded-tr-none speech-bubble-right mx-8">
                    <p className="">{v}</p>
                    <p className="text-xs leading-none text-right text-gray-600 mt-1">8:00 AM</p>
                </div>

                {/* balasan chat bot firstime */}
                {/* {i === 0 && serverChat[i] &&
                  <div key={i} className="relative flex flex-col p-2 my-1 mr-auto text-sm bg-white rounded-lg rounded-tl-none speech-bubble-left mx-8">
                    <p>{serverChatTemp[i]?.data.label}</p>
                    <p className="text-xs leading-none text-right text-gray-600 mt-1">8:00 AM</p>
                  </div>
                } */}

                {/* balasan chat bot from node*/}
                {/* {v === keywordChat[i-1]?.data?.label && */}
                  <div key={i} className="relative flex flex-col p-2 my-1 mr-auto text-sm bg-white rounded-lg rounded-tl-none speech-bubble-left mx-8">
                    <p>{serverChatTemp[i].data.label}</p>
                    <p className="text-xs leading-none text-right text-gray-600 mt-1">8:00 AM</p>
                  </div>
                {/* } */}
              </>
            ))}

            {/* {serverChat.map((v, i) => (
              <div key={i} className="relative flex flex-col p-2 my-1 mr-auto text-sm bg-white rounded-lg rounded-tl-none speech-bubble-left">
                <p>{v}</p>
                <p className="text-xs leading-none text-right text-gray-600">8:00 AM</p>
              </div>
            ))} */}

            <div className="flex justify-between w-full gap-3 mt-8 px-8">
              <input value={tempClientChat} placeholder="Message" className="w-full pl-2 rounded-lg" onChange={e => setTempClientChat(e.target.value)}/>
              <button onClick={() => handleSend(tempClientChat)} className="p-3 bg-green-600 rounded-lg">Send</button>
            </div>
          </div>
        </div>


      </Modal>
    </>
  );
}
