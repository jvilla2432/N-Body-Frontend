import { Button, Select, Slider, NumberInput, Text, TextInput } from '@mantine/core'
import { useRef } from 'react';

export default function RequestSimulation({ addID, addCache, cache} : {addID : any, addCache:any, cache:any}) {
  const serverURL = "http://localhost:3001";
  let simOptions = useRef({
    name: "sim",
    frames: 1,
    bodies: 1,
    smooth: 100,
    timestep: 10000,
    initial: 0,
    stepsPerFrame: 1
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
      <TextInput label = "Simulation Name"  onChange={ (event) => simOptions.current.name = event.currentTarget.value}></TextInput>
      <Text mt = "md">Frame Count: The number of frames in the simulation</Text>
      <Slider min={1} max = {120} onChangeEnd={(value) => simOptions.current.frames = value }></Slider>
      <Text mt = "md">Body Count: The number of bodies in the simulation</Text>
      <Slider min={1}  max={2000} onChangeEnd={(value) => simOptions.current.bodies = value} ></Slider>
      <Text mt = "md">Steps Per Frame: The amount of physics steps between each frame</Text>
      <Slider min={1}  max={200} onChangeEnd={ (value) => simOptions.current.stepsPerFrame = value } ></Slider>
      <NumberInput label="Time step: How much time passes between each frame" allowNegative={false}
        value = {10000}
        onChange={(value) => simOptions.current.timestep = parseInt(value.toString())}></NumberInput>
      <NumberInput label="Smooth factor: Decreases effect of close collisions" allowNegative={false}
        value = {100}
        onChange={(value) => simOptions.current.smooth = parseInt(value.toString())}></NumberInput>
      <Select
        label="Starting frame"
        data = {initialFrames.current}
        allowDeselect={false}
        value = {"Circle"}
        onChange={(_value, option) => {simOptions.current.initial = initialFramesIDS.current.get(_value!)!}}
      >
      </Select>
      <Button onClick={handleClick} variant="filled">Submit simulation</Button>
    </>
  );
} 