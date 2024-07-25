import { Button, Select, Slider, NumberInput, Text, TextInput } from '@mantine/core'
import { useRef } from 'react';

export default function RequestSimulation({ addID, addCache, cache} : {addID : any, addCache:any, cache:any}) {
  const serverURL = "http://localhost:3001";
  let simOptions = useRef({
    name: "sim",
    frames: 0,
    bodies: 1,
    smooth: 1,
    timestep: 1,
    initial: 0
  })
  const initialFrames = useRef(["Circle"])
  const initialFramesIDS = useRef(new Map([["Circle", 0]]));
  async function retrieve() {
    if (Number.isNaN(simOptions.current.timestep) || Number.isNaN(simOptions.current.smooth)) {
      alert("Simulation options are invalid.");
      return;
    }
    if (cache.current.has(simOptions.current.name)) {
      alert("Simulation name already used");
      return;
    }
    try {
      const response = await fetch(serverURL + "/startSim",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(simOptions.current)});
      if (!response.ok) {
        alert("Server error when trying to process simulation.");
      } else {
        const json = await response.json();
        var parsedResponse = JSON.parse(json);
        let simData: number[][][] = parsedResponse.data;
        let id = parsedResponse.id;
        addID(id);
        addCache(id,simData);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async function handleClick() {
    await retrieve();  
  }
  
  return (
    <>
      <TextInput label = "Simulation Name" onChange={ (event) => simOptions.current.name = event.currentTarget.value}></TextInput>
      <Text mt = "md">Frame Count</Text>
      <Slider onChangeEnd={(value) => simOptions.current.frames = value }></Slider>
      <Text mt = "md">Body Count</Text>
      <Slider onChangeEnd={ (value) => simOptions.current.bodies = value } ></Slider>
      <NumberInput label="Time step" allowNegative={false}
        value = {10000}
        onChange={(value) => simOptions.current.timestep = parseInt(value.toString())}></NumberInput>
      <NumberInput label="Smooth factor" allowNegative={false}
        value = {100}
        onChange={(value) => simOptions.current.smooth = parseInt(value.toString())}></NumberInput>
      <Select
        label="Starting frame"
        data = {initialFrames.current}
        allowDeselect={false}
        onChange={(_value, option) => {simOptions.current.initial = initialFramesIDS.current.get(_value!)!}}
      >
      </Select>
      <Button onClick={handleClick} variant="filled">Submit simulation</Button>
    </>
  );
} 