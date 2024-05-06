import React, {useEffect, useState} from "react";
import Modal from 'react-modal';
import Image from 'next/image';
import send from '../../public/send-filled.svg'

export default function Sidebar({
  nodes,
  edges
}) {
  
  const [openModal, setOpenModal] = useState(false);
  const [tempClientChat, setTempClientChat] = useState('');
  const [clientChat, setClientChat] = useState([]);
  const [keywordChat, setKeywordChat] = useState([{data:{message:''}}]);
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

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleSend = (chat) => {
    if (clientChat.length === 0) {
      setClientChat([...clientChat, chat])
      setServertChatTemp([...serverChatTemp, serverChat[0]])
    }
    if (keywordChat.some(v => v.data.message === chat) && clientChat) {
      // setClientChat([...clientChat, chat])
      keywordChat.forEach((v) => {
        if (v.data.message === chat) {
          const temp = v.id
          localEdges.forEach((edge) => {
            if (edge.source === temp) {
              const answer = serverChat.find(node => node.id === edge.target);
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
    setKeywordChat([{data:{message:''}}])
    setServertChat([])
    setServertChatTemp([])
    setLocalEdges([{data:{source:''}}])
    setOpenModal(!openModal)
  };

  const handleMinimizeModal = () => {
    setOpenModal(!openModal)
  };

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

  return (
    <>
      <aside className="w-64 h-screen p-4 text-sm text-black bg-blue-100 border-r-2 border-blue-200">
        <button className='w-full px-4 py-2 mb-3 font-bold bg-blue-300 border shadow-sm hover:bg-blue-600 rounded-xl hover:text-white' onClick={() => setOpenModal(true)}>Simulation Chat</button>
          <>
            <h3 className="mb-4 text-xl text-blue-900">Nodes Panel</h3>
            <div
              className="flex items-center justify-center p-3 text-blue-500 transition-colors duration-200 bg-white border-2 border-teal-300 rounded cursor-move hover:bg-teal-300 hover:text-white"
              onDragStart={(event) => onDragStart(event, "usernode")}
              draggable
            >
              User Message Node
            </div>

            <div
              className="flex items-center justify-center p-3 mt-5 text-blue-500 transition-colors duration-200 bg-white border-2 border-blue-500 rounded cursor-move hover:bg-blue-500 hover:text-white"
              onDragStart={(event) => onDragStart(event, "botnode")}
              draggable
            >
              Bot Message Node
            </div>
            <p className="mt-3 text-base"><span className="mr-1 text-lg text-red-500">*</span>Drag and drop to add user or bot message node</p>
          </>
      </aside>

      {/* chat simulation */}
      <Modal
        isOpen={openModal}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <div className="flex justify-between mb-2">
          <p className="text-xl font-bold text-black">Chatbot Simulation</p>
          <div className="flex">
            <button className="flex mr-5 text-sm font-bold text-black -top-10" onClick={() => handleMinimizeModal()}>➖</button>
            <button className="flex text-sm font-bold text-black -top-10" onClick={() => handleCloseModal()}>✖️</button>
          </div>
        </div>
        <div className="mb-8 text-black">Send a message to start conversation</div>
        <div className="relative h-full overflow-auto max-h-[80vh]">
          <div className="relative flex flex-col justify-end flex-grow pb-3 text-black rounded-md bg-stone-200">
            <div className="relative flex items-center w-full mb-3 bg-zinc-700 h-14 rounded-t-md px-7">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-200">
                <span className="text-xl font-bold">CS</span>
              </div>
              <p className="ml-2 font-semibold text-white">Coster Studio</p>
            </div>
            
            {clientChat.map((v, i) => (
              <>
                {/* chat from user */}
                <div
                    key={i}
                    className="relative flex flex-col p-2 mx-8 my-1 ml-auto text-sm bg-green-300 rounded-lg rounded-tr-none speech-bubble-right">
                    <p className="">{v}</p>
                    <p className="mt-1 text-xs leading-none text-right text-gray-600">8:00 AM</p>
                </div>

                {/* balasan chat bot from node*/}
                  <div key={i} className="relative flex flex-col p-2 mx-8 my-1 mr-auto text-sm bg-white rounded-lg rounded-tl-none speech-bubble-left">
                    <p>{serverChatTemp[i].data.message}</p>
                    <p className="mt-1 text-xs leading-none text-right text-gray-600">8:00 AM</p>
                  </div>
              </>
            ))}

            <div className="flex justify-between w-full gap-3 px-8 mt-8">
              <input value={tempClientChat} placeholder="Message" className="w-full pl-5 rounded-3xl" onChange={e => setTempClientChat(e.target.value)}/>
              <button onClick={() => handleSend(tempClientChat)} className="p-3 bg-green-600 rounded-full">
                <Image
                  src={send}
                  alt="icon send"
                />
              </button>
            </div>
          </div>
        </div>


      </Modal>
    </>
  );
}
