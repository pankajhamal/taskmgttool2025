import React from "react";
import { BsPeople } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";

const CreateTask = () => {
  return (
    <div className="p-5 min-h-full w-3xl">
      <form action="" className="flex flex-col gap-4">
        <h1 className="font-semibold text-xl">Create Task</h1>
        <div>
          <h2 className="text-gray-500">Task Title</h2>
          <input
            className="outline-none border-2 border-gray-300 h-10 p-3 w-full rounded-sm"
            type="text"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <h2 className="text-gray-500">Description</h2>
          <textarea className="outline-none border-2 border-gray-300 h-30 p-3 w-full rounded-sm" name="" id=""></textarea>
        </div>
        <div>
          <div>
            <h2>Priority</h2>
            <select name="" id="priority">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <h2>Due Date</h2>
            <input type="date" />
          </div>
          <div>
            <h2>Assign to</h2>
            <div>
              <BsPeople className="text-2xl" /> Add members
            </div>
          </div>
        </div>
        <div>
          <h2>TODO Checklist</h2>
          <div>
            <input type="text" placeholder="Enter Task" />
            <button className="">
              <FiPlus />
              Add
            </button>
          </div>
        </div>

        <div>
          <h2>Add Attachments</h2>
          <div>
            <input type="text" placeholder="Add file link" />
            <button className="">
              <FiPlus />
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
