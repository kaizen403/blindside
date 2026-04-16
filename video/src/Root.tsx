import React from "react";
import { Composition } from "remotion";
import { SimultaneousBreach } from "./SimultaneousBreach";
import { SolutionVideo } from "./SolutionVideo";
import { TheShield } from "./TheShield";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SimultaneousBreach"
        component={SimultaneousBreach}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SolutionVideo"
        component={SolutionVideo}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={720}
      />
      <Composition
        id="TheShield"
        component={TheShield}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
