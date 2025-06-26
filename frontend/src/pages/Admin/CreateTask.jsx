import React from "react";
import { useState } from "react";
import { BsPeople } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";

const CreateTask = () => {
  const [checkList, setCheckList] = useState([]);
  const [newItem, setNewItem] = useState([]);

  const handleAddChecklistItem = () => {
    if (newItem.trim() === "") return;

    setCheckList([...checkList, newItem.trim()]);
    setNewItem("");
  };

  const handleDeleteChecklistItem = (index) => {
    const updated = [...checkList];
    updated.splice(index, 1);
    setCheckList(updated);
  };

  return (
    <div className="p-5 min-h-full w-3xl bg-white rounded-2xl">
      <form type="submit" action="#" className="flex flex-col gap-6">
        <h1 className="font-semibold text-xl">Create Task</h1>
        <div>
          <h2 className="text-gray-800">Task Title</h2>
          <input
            className="outline-none border-2 border-gray-300 h-10 p-3 w-full rounded-sm"
            type="text"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <h2 className="text-gray-800">Description</h2>
          <textarea
            className="outline-none border-2 border-gray-300 h-30 p-3 w-full rounded-sm"
            name=""
            id=""
          ></textarea>
        </div>
        <div className="flex gap-4">
          <div>
            <h2 className="text-gray-800">Priority</h2>
            <select
              className=" pl-3 h-10 border-2 border-gray-300 outline-none w-3xs rounded-sm"
              name=""
              id="priority"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <h2 className="text-gray-800">Due Date</h2>
            <input
              className="pl-3 h-10 border-2 border-gray-300 outline-none w-3xs rounded-sm"
              type="date"
            />
          </div>
          <div>
            <h2 className="text-gray-800">Assign to</h2>
            <div className="flex gap-2 justify-center items-center  pl-3 pr-3 h-10 rounded-sm bg-gray-300 cursor-pointer hover:text-blue-500 hover:bg-blue-100">
              <BsPeople className="text-xl" /> Add members
            </div>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto pr-3">
          <h2>TODO Checklist</h2>
          <div className="flex gap-4">
            <input
              className="outline-none border-2 border-gray-300 rounded-sm  w-full pl-3 h-10"
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter Task"
            />
            <button
              onClick={handleAddChecklistItem}
              className=" gap-2 flex justify-center items-center outline-none bg-gray-300 w-20 rounded-sm"
            >
              <FiPlus />
              Add
            </button>
          </div>
          <div>
            <ul className="mt-4 space-y-2">
              {checkList.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteChecklistItem(index)}
                    className="text-red-600"
                  >
                    <FaRegTrashCan />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button className="w-full bg-blue-500 h-10 text-white rounded-sm">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
