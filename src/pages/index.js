"use client";
import { handleSubmit } from "../utils/formUtils";
import { useState } from "react";
import Chart from "chart.js/auto";
import SelectAlgorithm from "./SelectAlgorithm";
import { InputNumber } from "antd";

export default function Home() {
  const [cylinderList, setCylinderList] = useState(0);
  const [initialHeadPosition, setInitialHeadPosition] = useState(0);
  const [previousHeadPosition, setpreviousHeadPosition] = useState(0);
  const [armMovement, setArmMovement] = useState(0);
  const [diskRequests, setDiskRequests] = useState("");

  const algorithmOptions = ["fifo", "sstf", "scan", "cscan", "look", "clook"];
  const [algorithm, setAlgorithm] = useState("");

  function formHandleSubmit(e) {
    e.preventDefault();
    handleSubmit(
      e,
      cylinderList,
      initialHeadPosition,
      previousHeadPosition,
      armMovement,
      diskRequests,
      setDiskRequests,
      algorithm
    );
  }

  return (
    <main className='flex flex-col-reverse items-center justify-between bg-[#F0EDEE] overflow-x-auto"'>
      <div className='w-screen p-12'>
        <div>
          <h2 className='text-[#7E3F8F] text-xl text-semibold text-center'>
            ALGORITHM:
            {algorithm && (
              <span className='text-xl font-bold uppercase'> {algorithm}</span>
            )}
          </h2>

          <hr className='my-4 mx-auto w-28 border-2 border-[#81559B]' />

          <h2 className='text-[#7E3F8F] text-xl text-center font-bold '>
            GRAPH
          </h2>
        </div>
        <canvas id='lineGraph'></canvas>

        <h2 className='text-[#7E3F8F] text-lg mt-10 '>
          Total Head Movement:{" "}
          <span
            className='font-bold'
            id='totalHeadMovement'
          ></span>
        </h2>

        <h2 className='text-[#7E3F8F] text-lg '>
          Seek Time:{" "}
          <span
            className='font-bold'
            id='seekTime'
          ></span>
        </h2>
      </div>

      <div className='w-screen h-3/4 p-4 bg-white sm:p-6 md:p-8 bg-indigo-500'>
        <form
          className='space-y-6'
          onSubmit={formHandleSubmit}
        >
          <div className=' text-center  '>
            <h1 className='text-3xl font-bold text-[#7E3F8F]'>
              DISK SCHEDULING ALGORITHM
            </h1>
            <p className='text-xl text-[#81559B] font-medium'> CALCULATOR</p>
          </div>
          <hr className='my-4 w-50 font-bold border-[#8C86AA]' />

          <SelectAlgorithm
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
          />
          {/* <div className='relative'>
            <label
              htmlFor='algorithm'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Choose Algorithm
            </label>
            <select
              name='algorithm'
              id='algorithm'
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='block py-2.5 px-3 w-full text-sm text-gray-500 bg-transparent rounded-lg border-0 border-b-2 border-gray-200 appearance-none bg-white dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
              required
            >
              <option value='fifo'>FIFO - First In First Out</option>
              <option value='sstf'>SSTF - Shortest Seek Time First</option>
              <option value='scan'>SCAN</option>
              <option value='cscan'>C-SCAN</option>
              <option value='look'>LOOK</option>
              <option value='clook'>C-LOOK</option>
            </select>
          </div> */}

          <div className='grid grid-cols-2 gap-4'>
            <div className='relative'>
              <label
                htmlFor='cylinderList'
                className='block mb-2 text-base font-medium text-gray-900 dark:text-white'
              >
                Number of Cylinder
              </label>
              <InputNumber
                min={0}
                name='cylinderList'
                id='cylinderList'
                onChange={(value) => setCylinderList(value)}
                className='block px-2.5 pb-2.5 pt-4 w-full  text-[#7E3F8F] text-base text-gray-900 bg-transparent rounded-lg border-4 border-[#7E3F8F] appearance-none focus:border-[#8C86AA] hover:border-[#8C86AA] focus:outline-none focus:ring-0 focus:border-[#8C86AA] '
                placeholder='Input Number of Cylinder'
                required
              />
            </div>
            <div className='relative'>
              <label
                htmlFor='initialHeadPosition'
                className='block mb-2 text-base font-medium text-gray-900 dark:text-white'
              >
                Starting Head Position (SP)
              </label>
              <InputNumber
                min={0}
                name='initialHeadPosition'
                id='initialHeadPosition'
                className='block px-2.5 pb-2.5 pt-4 w-full  text-[#7E3F8F] text-base text-gray-900 bg-transparent rounded-lg border-4 border-[#7E3F8F] appearance-none focus:border-[#8C86AA] hover:border-[#8C86AA] focus:outline-none focus:ring-0 focus:border-[#8C86AA] '
                onChange={(value) => setInitialHeadPosition(value)}
                placeholder='Input Starting Head Position'
                required
              />
            </div>
            <div className='relative'>
              <label
                htmlFor='previousHeadPosition'
                className='block mb-2 text-base font-medium text-gray-900 dark:text-white'
              >
                Previously Served Position (PS)
              </label>
              <InputNumber
                min={0}
                name='previousHeadPosition'
                id='previousHeadPosition'
                onChange={(value) => setpreviousHeadPosition(value)}
                className='block px-2.5 pb-2.5 pt-4 w-full  text-[#7E3F8F] text-base text-gray-900 bg-transparent rounded-lg border-4 border-[#7E3F8F] appearance-none focus:border-[#8C86AA] hover:border-[#8C86AA] focus:outline-none focus:ring-0 focus:border-[#8C86AA] '
                placeholder='Input Previous Head Position'
                required
              />
            </div>
            <div className='relative'>
              <label
                htmlFor='armMovement'
                className='block mb-2 text-base font-medium text-gray-900 dark:text-white'
              >
                Arm Movement
              </label>
              <InputNumber
                min={0}
                name='armMovement'
                id='armMovement'
                onChange={(value) => setArmMovement(value)}
                className='block px-2.5 pb-2.5 pt-4 w-full  text-[#7E3F8F] text-base text-gray-900 bg-transparent rounded-lg border-4 border-[#7E3F8F] appearance-none focus:border-[#8C86AA] hover:border-[#8C86AA] focus:outline-none focus:ring-0 focus:border-[#8C86AA] '
                placeholder='Input Arm Movement'
                required
              />
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <div className='relative'>
              <label
                htmlFor='diskRequests'
                className='block mb-2 text-base font-medium text-gray-900 dark:text-white'
              >
                Disk Requests (For separation, use space)
              </label>
              <input
                type='text'
                name='diskRequests'
                id='diskRequests'
                onChange={(e) => setDiskRequests(e.target.value)}
                className='block px-2.5 pb-2.5 pt-4 w-full text-base text-[#7E3F8F] bg-white rounded-lg border border-4 border-[#7E3F8F] appearance-none focus:border-[#8C86AA] focus:outline-none focus:ring-0'
                placeholder=' Add Jobs'
                required
              />
            </div>
          </div>

          <button
            type='submit'
            className='text-white bg-[#81559B] hover:bg-[#7E3F8F] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-6 py-3'
            style={{
              display: "block",
              margin: "auto",
              marginTop: "23px",
              width: "200px",
              height: "50px",
            }}
          >
            CALCULATE
          </button>
        </form>
      </div>
    </main>
  );
}
