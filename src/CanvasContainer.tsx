import { useRef, useState} from 'react';
import React from 'react';
import { Button, Grid, Slider, Text} from '@mantine/core'
import RequestSimulation from "./RequestSimulation";
import SelectSimulation from './SelectSimulation';

export default function CanvasContainer() {
  const [displayID, setDisplayID] = useState("0");
  const [zoom, setZoom] = useState(1); 
  const [time, setTime] = useState(1);
  const [simIDS, setSimIDS] = useState(["0", "1"]);

  async function addSimID(id: string) {
    setSimIDS([...simIDS, id]);
  }
  
  let domID = useRef(null);
  let cache = useRef(new Map([
    ["0", [[[0, 0], [50, 50]], [[25, 25], [75, 75]]]],
    ["1", [[[50, 0], [50, 50]], [[0, 25], [150, 75]]]]
  ]));
  let requestId: number;
  let zero: DOMHighResTimeStamp;

  //Render the simulation
  React.useEffect(() => {
    const canvas: HTMLCanvasElement = domID.current!;
    const canvasContex = canvas.getContext("2d")!;
    if (cache.current.has(displayID)) {
      const frameCount = cache.current.get(displayID)!.length;
      const frameDuration = (time*1000) / frameCount;
      const render = (timeStamp: DOMHighResTimeStamp) => {
        let currentTime = (timeStamp - zero) %  (time*1000);
        let frameNumber = Math.floor(currentTime / frameDuration);
        let currentFrame = cache.current.get(displayID)![frameNumber];
        canvasContex.clearRect(0, 0, canvasContex.canvas.width, canvasContex.canvas.height);
        for (var particle of currentFrame) {
          canvasContex.fillRect(
            zoom * particle[0] + canvasContex.canvas.width/2,
            zoom * particle[1] + canvasContex.canvas.height/2,
            10, 10);
        }
        requestId = requestAnimationFrame(render);
      }
      zero = document.timeline.currentTime! as DOMHighResTimeStamp;
      requestAnimationFrame(render);
    } else {
      canvasContex.clearRect(0, 0, canvasContex.canvas.width, canvasContex.canvas.height);
    }
    return () => {
      cancelAnimationFrame(requestId);
    }
  }, [displayID, zoom,time]);

  return (
    <>
      <Grid>
        <Grid.Col span="content">
          <canvas ref={domID} id="tutorial" width="800" height="800"></canvas>
          <Button onClick={() => setZoom(zoom / 2)} variant="filled">Zoom out</Button>
          <Button onClick={() => setZoom(zoom * 2)} variant="filled">Zoom in</Button>
          <Text>Simulation Timespan</Text>
          <Slider min={1}  max={10} onChangeEnd={ (value) => setTime(value) } ></Slider>
          <SelectSimulation
            options={simIDS}
            changeSim={(x: string) => setDisplayID(x)}
          ></SelectSimulation>
        </Grid.Col>
        <Grid.Col span="auto">
          <RequestSimulation
            addID={addSimID}
            addCache={(id: string, data: number[][][]) => cache.current.set(id, data)}
            cache={cache}
          ></RequestSimulation>
        </Grid.Col>
        <Grid.Col span={1}></Grid.Col>
      </Grid>
    </>
  );
}