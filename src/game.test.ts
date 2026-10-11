import { afterEach, describe, expect, it } from "vitest";
import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { game } from "./game";
import { FIELD_H, FIELD_W, LAYOUT } from "./constants";

const engines: ReturnType<typeof createEngine>[] = [];
async function makeEngine() {
  const canvas = createCanvas(FIELD_W, FIELD_H) as unknown as HTMLCanvasElement;
  const engine = createEngine({
    canvas,
    width: FIELD_W,
    height: FIELD_H,
    game,
    layout: LAYOUT,
    clock: new ConstantClock(10),
    surface: {
      cssWidth: () => FIELD_W,
      cssHeight: () => FIELD_H,
      dpr: () => 1,
      events: () => new EventTarget(),
    },
  });
  engines.push(engine);
  await engine.initialize();
  return engine;
}
afterEach(() => {
  engines.splice(0).forEach((engine) => engine.destroy());
});

describe("Carom simulation", () => {
  it("starts with the complete title state and exposes an immutable debug surface", async () => {
    const engine = await makeEngine();
    expect(engine.debug.snapshot(engine.state)).toMatchObject({
      screen: "title",
      mode: "solo",
      score: { p1: 0, p2: 0 },
      ball: { x: 640, y: 360, held: true, holdTimer: 1, speed: 0 },
      obstacles: [
        { index: 0, cx: 490, cy: 220 },
        { index: 1, cx: 790, cy: 500 },
      ],
    });
    const before = engine.state;
    engine.apply((state) => engine.debug.setBallVelocity(state, 520, 0));
    expect(before.ball?.vx).toBe(0);
    expect(engine.debug.snapshot(engine.state).ball?.speed).toBe(520);
  });

  it("serves after the counted hold and advances the ball by elapsed time", async () => {
    const engine = await makeEngine();
    engine.apply((state) => engine.debug.setScreen(state, "countdown"));
    await engine.advance(101);
    expect(engine.state.screen).toBe("playing");
    expect(engine.state.ball?.held).toBe(false);
    expect(engine.state.simTime).toBeCloseTo(1.01);
    await engine.advance(10);
    expect(engine.state.ball?.x).toBeLessThan(640);
    expect(engine.state.ball?.trail.length).toBeGreaterThan(0);
  });

  it("scores through a goal and parks a new serve for the receiver", async () => {
    const engine = await makeEngine();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) => engine.debug.setBallPosition(state, 1270, 350));
    engine.apply((state) => engine.debug.setBallVelocity(state, 600, 0));
    await engine.advance(5);
    expect(engine.state.score.p1).toBe(1);
    expect(engine.state.screen).toBe("countdown");
    expect(engine.state.receiver).toBe("right");
    expect(engine.state.ball?.held).toBe(true);
  });
});
