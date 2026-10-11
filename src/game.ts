import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  MATCHOVER_ITEMS,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLES,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PADDLE_H,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  SPIN_CLAMP,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";
export type Mode = "solo" | "versus";
export type Side = "left" | "right";
export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}
export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}
export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}
export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}
export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}
export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
  readonly muted: boolean;
}
export interface Snapshot {
  version: number;
  screen: Screen;
  mode: Mode;
  menuIndex: number;
  titleIndex: number;
  resumeScreen: "countdown" | "playing";
  score: { p1: number; p2: number };
  winner: Side | null;
  muted: boolean;
  paddles: { left: PaddleState; right: PaddleState };
  ai: AiState;
  receiver: Side;
  ball: (BallState & { speed: number }) | null;
  obstacles: readonly ObstacleState[];
  simTime: number;
}
export interface CaromDebugApi {
  version: number;
  clearWorld(s: DeepReadonly<CaromState>): CaromState;
  spawnBall(s: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(s: DeepReadonly<CaromState>, index: number): CaromState;
  reset(s: DeepReadonly<CaromState>): CaromState;
  reconcile(s: DeepReadonly<CaromState>): CaromState;
  setScreen(s: DeepReadonly<CaromState>, v: Screen): CaromState;
  setMode(s: DeepReadonly<CaromState>, v: Mode): CaromState;
  setMenuIndex(s: DeepReadonly<CaromState>, v: number): CaromState;
  setTitleIndex(s: DeepReadonly<CaromState>, v: number): CaromState;
  setResumeScreen(
    s: DeepReadonly<CaromState>,
    v: "countdown" | "playing",
  ): CaromState;
  setScore(s: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(s: DeepReadonly<CaromState>, v: Side | null): CaromState;
  setReceiver(s: DeepReadonly<CaromState>, v: Side): CaromState;
  setPaddleCy(s: DeepReadonly<CaromState>, side: Side, v: number): CaromState;
  setPaddleVy(s: DeepReadonly<CaromState>, side: Side, v: number): CaromState;
  setPaddleDriven(
    s: DeepReadonly<CaromState>,
    side: Side,
    v: boolean,
  ): CaromState;
  setBallPosition(
    s: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    s: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(s: DeepReadonly<CaromState>, v: number): CaromState;
  setBallHeld(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setBallHoldTimer(s: DeepReadonly<CaromState>, v: number): CaromState;
  setBallServeSign(s: DeepReadonly<CaromState>, v: 1 | -1): CaromState;
  drawBallServeSign(s: DeepReadonly<CaromState>): CaromState;
  setAiTracking(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setAiMovement(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setMuted(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  snapshot(s: DeepReadonly<CaromState>): Snapshot;
  menuItemRect(
    s: DeepReadonly<CaromState>,
    index: number,
  ): { x: number; y: number; w: number; h: number } | null;
}
export const BACKGROUND = "#07111f";
const COLORS = {
  ink: "#07111f",
  panel: "#0c1c2e",
  line: "#234157",
  white: "#e9f5fa",
  muted: "#8ba6b5",
  cyan: "#53e0d0",
  orange: "#ffb36b",
  pink: "#ff6f91",
  obstacle: "#a6bdd0",
};
const initialBall = (): BallState => ({
  x: FIELD_CX,
  y: FIELD_CY,
  vx: 0,
  vy: 0,
  spin: 0,
  held: true,
  holdTimer: HOLD_TIME,
  serveSign: Math.random() < 0.5 ? 1 : -1,
  trail: [],
});
const initial = (muted = false): CaromState => ({
  screen: "title",
  mode: "solo",
  menuIndex: 0,
  titleIndex: 0,
  resumeScreen: "playing",
  score: { p1: 0, p2: 0 },
  winner: null,
  paddles: {
    left: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
    right: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
  },
  ai: { tracking: true, movement: true },
  receiver: "left",
  ball: initialBall(),
  obstacles: OBSTACLE_CENTERS.map((p, index) => ({ index, cx: p.x, cy: p.y })),
  simTime: 0,
  muted,
});
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rect = (screen: Screen, index: number) => {
  const count =
    screen === "title"
      ? 3
      : screen === "howto"
        ? 1
        : screen === "paused"
          ? 3
          : screen === "matchover"
            ? 2
            : 0;
  if (index < 0 || index >= count) return null;
  const y =
    screen === "title"
      ? 390 + index * 66
      : screen === "howto"
        ? 570
        : screen === "paused"
          ? 370 + index * 66
          : 400 + index * 66;
  return { x: FIELD_CX - 190, y: y - 25, w: 380, h: 50 };
};
const park = (): BallState => ({
  ...initialBall(),
  serveSign: Math.random() < 0.5 ? 1 : -1,
});
const movePaddle = (p: PaddleState, vy: number, dt: number): PaddleState => {
  const cy = clamp(p.cy + vy * dt, PADDLE_MIN_CY, PADDLE_MAX_CY);
  return { ...p, cy, vy: dt > 0 && cy !== p.cy ? (cy - p.cy) / dt : vy };
};
function startMatch(s: DeepReadonly<CaromState>, mode = s.mode): CaromState {
  return {
    ...s,
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: park(),
    paddles: {
      left: { ...s.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...s.paddles.right, cy: FIELD_CY, vy: 0 },
    },
  };
}
function menuAction(s: CaromState, index = s.menuIndex): CaromState {
  if (s.screen === "title") {
    if (index === 0) return startMatch({ ...s, titleIndex: index }, "solo");
    if (index === 1) return startMatch({ ...s, titleIndex: index }, "versus");
    return { ...s, titleIndex: index, screen: "howto", menuIndex: 0 };
  }
  if (s.screen === "howto")
    return { ...s, screen: "title", menuIndex: s.titleIndex };
  if (s.screen === "paused") {
    if (index === 0) return { ...s, screen: s.resumeScreen };
    if (index === 1) return startMatch(s);
    return {
      ...initial(s.muted),
      titleIndex: s.titleIndex,
      menuIndex: s.titleIndex,
      simTime: s.simTime,
    };
  }
  if (s.screen === "matchover") {
    if (index === 0) return startMatch(s);
    return {
      ...initial(s.muted),
      titleIndex: s.titleIndex,
      menuIndex: s.titleIndex,
      simTime: s.simTime,
    };
  }
  return s;
}
function collide(
  ball: BallState,
  box: { x0: number; y0: number; x1: number; y1: number },
): { ball: BallState; face: string } | null {
  if (
    ball.x <= box.x0 - BALL_R ||
    ball.x >= box.x1 + BALL_R ||
    ball.y <= box.y0 - BALL_R ||
    ball.y >= box.y1 + BALL_R
  )
    return null;
  const depths = [
    ball.x - (box.x0 - BALL_R),
    box.x1 + BALL_R - ball.x,
    ball.y - (box.y0 - BALL_R),
    box.y1 + BALL_R - ball.y,
  ];
  const i = depths.indexOf(Math.min(...depths));
  if (i === 0)
    return {
      ball: {
        ...ball,
        x: box.x0 - BALL_R,
        vx: ball.vx > 0 ? -ball.vx : ball.vx,
      },
      face: "left",
    };
  if (i === 1)
    return {
      ball: {
        ...ball,
        x: box.x1 + BALL_R,
        vx: ball.vx < 0 ? -ball.vx : ball.vx,
      },
      face: "right",
    };
  if (i === 2)
    return {
      ball: {
        ...ball,
        y: box.y0 - BALL_R,
        vy: ball.vy > 0 ? -ball.vy : ball.vy,
      },
      face: "top",
    };
  return {
    ball: { ...ball, y: box.y1 + BALL_R, vy: ball.vy < 0 ? -ball.vy : ball.vy },
    face: "bottom",
  };
}
export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>) {
    for (const name of ACTIONS)
      api.input.register(name, { keys: [...BINDINGS[name]] });
    const freqs = [500, 360, 260, 720];
    [CUES.paddleHit, CUES.wallBounce, CUES.obstacleBounce, CUES.score].forEach(
      (cue, i) =>
        api.audio.define(cue, {
          wave: i === 3 ? "square" : "sine",
          freq: freqs[i],
          freqTo: freqs[i] * 0.65,
          gain: 0.12,
          durationMs: 70,
        }),
    );
    for (const [name, read] of Object.entries({
      screen: (s: DeepReadonly<CaromState>) => s.screen,
      mode: (s: DeepReadonly<CaromState>) => s.mode,
      score: (s: DeepReadonly<CaromState>) => `${s.score.p1} : ${s.score.p2}`,
      ball: (s: DeepReadonly<CaromState>) =>
        s.ball ? `${s.ball.x.toFixed(0)},${s.ball.y.toFixed(0)}` : "absent",
      velocity: (s: DeepReadonly<CaromState>) =>
        s.ball ? `${s.ball.vx.toFixed(0)},${s.ball.vy.toFixed(0)}` : "—",
      speed: (s: DeepReadonly<CaromState>) =>
        s.ball ? Math.hypot(s.ball.vx, s.ball.vy).toFixed(0) : "—",
      spin: (s: DeepReadonly<CaromState>) => s.ball?.spin.toFixed(0) ?? "—",
      p1: (s: DeepReadonly<CaromState>) =>
        `${s.paddles.left.cy.toFixed(0)} / ${s.paddles.left.vy.toFixed(0)}`,
      p2: (s: DeepReadonly<CaromState>) =>
        `${s.paddles.right.cy.toFixed(0)} / ${s.paddles.right.vy.toFixed(0)}`,
    }))
      api.diagnostics.register(name, read);
    const requireBall = (s: DeepReadonly<CaromState>) => {
      if (!s.ball) throw new Error("Carom debug: no ball");
      return s.ball;
    };
    const debug: CaromDebugApi = {
      version: CAROM_DEBUG_VERSION,
      clearWorld: (s) => ({ ...s, ball: null, obstacles: [] }),
      spawnBall: (s) => ({ ...s, ball: park() }),
      spawnObstacle: (s, index) => {
        if (index !== 0 && index !== 1)
          throw new Error(`Carom debug: invalid obstacle ${index}`);
        return {
          ...s,
          obstacles: [
            ...s.obstacles.filter((o) => o.index !== index),
            {
              index,
              cx: OBSTACLE_CENTERS[index]!.x,
              cy: OBSTACLE_CENTERS[index]!.y,
            },
          ].sort((a, b) => a.index - b.index),
        };
      },
      reset: (s) => ({
        ...initial(s.muted),
        titleIndex: s.titleIndex,
        menuIndex: s.titleIndex,
        simTime: s.simTime,
      }),
      reconcile: (s) => ({ ...s }),
      setScreen: (s, screen) => ({ ...s, screen }),
      setMode: (s, mode) => ({ ...s, mode }),
      setMenuIndex: (s, menuIndex) => ({ ...s, menuIndex }),
      setTitleIndex: (s, titleIndex) => ({ ...s, titleIndex }),
      setResumeScreen: (s, resumeScreen) => ({ ...s, resumeScreen }),
      setScore: (s, p1, p2) => ({ ...s, score: { p1, p2 } }),
      setWinner: (s, winner) => ({ ...s, winner }),
      setReceiver: (s, receiver) => ({ ...s, receiver }),
      setPaddleCy: (s, side, cy) => ({
        ...s,
        paddles: { ...s.paddles, [side]: { ...s.paddles[side], cy } },
      }),
      setPaddleVy: (s, side, drivenVy) => ({
        ...s,
        paddles: { ...s.paddles, [side]: { ...s.paddles[side], drivenVy } },
      }),
      setPaddleDriven: (s, side, driven) => ({
        ...s,
        paddles: { ...s.paddles, [side]: { ...s.paddles[side], driven } },
      }),
      setBallPosition: (s, x, y) => ({
        ...s,
        ball: { ...requireBall(s), x, y },
      }),
      setBallVelocity: (s, vx, vy) => ({
        ...s,
        ball: { ...requireBall(s), vx, vy },
      }),
      setBallSpin: (s, spin) => ({ ...s, ball: { ...requireBall(s), spin } }),
      setBallHeld: (s, held) => ({ ...s, ball: { ...requireBall(s), held } }),
      setBallHoldTimer: (s, holdTimer) => ({
        ...s,
        ball: {
          ...requireBall(s),
          holdTimer,
          ...(holdTimer === 0 ? { held: false } : {}),
        },
      }),
      setBallServeSign: (s, serveSign) => ({
        ...s,
        ball: { ...requireBall(s), serveSign },
      }),
      drawBallServeSign: (s) => ({
        ...s,
        ball: { ...requireBall(s), serveSign: Math.random() < 0.5 ? 1 : -1 },
      }),
      setAiTracking: (s, tracking) => ({ ...s, ai: { ...s.ai, tracking } }),
      setAiMovement: (s, movement) => ({ ...s, ai: { ...s.ai, movement } }),
      setMuted: (s, muted) => ({ ...s, muted }),
      snapshot: (s) =>
        ({
          ...s,
          version: CAROM_DEBUG_VERSION,
          ball: s.ball
            ? { ...s.ball, speed: Math.hypot(s.ball.vx, s.ball.vy) }
            : null,
        }) as Snapshot,
      menuItemRect: (s, index) => rect(s.screen, index),
    };
    return [initial(false), debug];
  },
  update(state, api: UpdateApi, dt) {
    let s = {
      ...state,
      simTime: state.simTime + dt,
      score: { ...state.score },
      paddles: {
        left: { ...state.paddles.left },
        right: { ...state.paddles.right },
      },
      ai: { ...state.ai },
      obstacles: [...state.obstacles],
      ball: state.ball ? { ...state.ball, trail: [...state.ball.trail] } : null,
    } as CaromState;
    if (api.input.pressed("mute")) {
      s = { ...s, muted: !api.audio.muted() };
      api.audio.setMuted(s.muted);
    }
    const began = state.screen;
    if (["title", "howto", "paused", "matchover"].includes(began)) {
      const up = api.input.pressed("p1-up") || api.input.pressed("p2-up"),
        down = api.input.pressed("p1-down") || api.input.pressed("p2-down"),
        confirm = api.input.pressed("confirm"),
        back = api.input.pressed("back"),
        pause = api.input.pressed("pause");
      if (began === "howto" && (confirm || back)) s = menuAction(s);
      else if (began === "paused" && (pause || back))
        s = { ...s, screen: s.resumeScreen };
      else if (began === "matchover" && back)
        s = {
          ...initial(s.muted),
          titleIndex: s.titleIndex,
          menuIndex: s.titleIndex,
          simTime: s.simTime,
        };
      else {
        const n =
          began === "title"
            ? 3
            : began === "paused"
              ? 3
              : began === "matchover"
                ? 2
                : 1;
        if (up) s = { ...s, menuIndex: (s.menuIndex + n - 1) % n };
        else if (down) s = { ...s, menuIndex: (s.menuIndex + 1) % n };
        if (confirm) s = menuAction(s);
      }
      const samples = api.input.pointerSamples();
      const regions = (screen: Screen) =>
        screen === "title"
          ? 3
          : screen === "howto"
            ? 1
            : screen === "paused"
              ? 3
              : screen === "matchover"
                ? 2
                : 0;
      let hover = -1;
      for (const p of samples) {
        if (p.type === "move" || p.type === "down") {
          for (let i = 0; i < regions(s.screen); i++) {
            const r = rect(s.screen, i);
            if (
              r &&
              p.x >= r.x &&
              p.x <= r.x + r.w &&
              p.y >= r.y &&
              p.y <= r.y + r.h
            )
              hover = i;
          }
        }
      }
      if (hover >= 0) s = { ...s, menuIndex: hover };
      const pointer = api.input.pointer();
      const pointerDown = api.input.pointerPressed();
      const pointerUp = api.input.pointerReleased();
      if ((pointerDown || pointerUp) && pointer.x >= 0) {
        for (let i = 0; i < regions(s.screen); i++) {
          const r = rect(s.screen, i);
          if (
            r &&
            pointer.x >= r.x &&
            pointer.x <= r.x + r.w &&
            pointer.y >= r.y &&
            pointer.y <= r.y + r.h
          ) {
            s = { ...s, menuIndex: i };
            if (pointerUp) s = menuAction(s, i);
            break;
          }
        }
      }
    } else {
      const pause = api.input.pressed("pause");
      api.input.pressed("back");
      if (pause) {
        s = {
          ...s,
          resumeScreen: s.screen as "countdown" | "playing",
          screen: "paused",
          menuIndex: 0,
        };
      }
    }
    if (api.input.pressed("back") && began === "matchover")
      s = {
        ...initial(s.muted),
        titleIndex: s.titleIndex,
        menuIndex: s.titleIndex,
        simTime: s.simTime,
      };
    if (s.screen === "countdown" || s.screen === "playing") {
      const dtSafe = Math.max(dt, 1e-9);
      const movement = (side: Side) => {
        const p = s.paddles[side];
        if (p.driven) return p.drivenVy;
        if (side === "right" && s.mode === "solo") {
          if (!s.ai.movement) return 0;
          let target = AI_HOME_Y,
            dead = AI_HOME_DEADZONE;
          if (
            s.ai.tracking &&
            s.screen === "playing" &&
            s.ball &&
            s.ball.vx > 0
          ) {
            target = s.ball.y - s.ball.vy * AI_REACT;
            dead = AI_DEADZONE;
          }
          const diff = target - p.cy;
          return Math.abs(diff) <= dead
            ? 0
            : Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dtSafe);
        }
        const p1 = s.mode === "solo" || side === "left";
        const up =
            api.input.value(p1 ? "p1-up" : "p2-up") +
            api.input.value(p1 ? "p2-up" : "p1-up"),
          down =
            api.input.value(p1 ? "p1-down" : "p2-down") +
            api.input.value(p1 ? "p2-down" : "p1-down");
        return clamp(down, 0, 1) - clamp(up, 0, 1);
      };
      // Correct the single-player bindings: all four keys control the left paddle.
      const leftVy = s.paddles.left.driven
        ? s.paddles.left.drivenVy
        : s.mode === "solo"
          ? (api.input.value("p1-down") + api.input.value("p2-down") > 0
              ? 1
              : 0) -
            (api.input.value("p1-up") + api.input.value("p2-up") > 0 ? 1 : 0)
          : api.input.value("p1-down") - api.input.value("p1-up");
      const rightVy = s.paddles.right.driven
        ? s.paddles.right.drivenVy
        : s.mode === "versus"
          ? api.input.value("p2-down") * PADDLE_SPEED -
            api.input.value("p2-up") * PADDLE_SPEED
          : movement("right");
      s = {
        ...s,
        paddles: {
          left: movePaddle(s.paddles.left, leftVy * PADDLE_SPEED, dt),
          right: movePaddle(s.paddles.right, rightVy, dt),
        },
      };
      let b = s.ball;
      if (b) {
        if (s.screen === "countdown") {
          const timer = Math.max(
            0,
            b.holdTimer - dt <= 1e-9 ? 0 : b.holdTimer - dt,
          );
          b = { ...b, holdTimer: timer };
          if (timer === 0) {
            const dir = s.receiver === "left" ? -1 : 1;
            b = {
              ...b,
              held: false,
              holdTimer: 0,
              vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
              vy: b.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
              trail: [],
            };
            s = { ...s, screen: "playing" };
          }
        } else if (!b.held) {
          const speed = Math.hypot(b.vx, b.vy),
            n = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP)),
            h = dt / n;
          let hitCue = "";
          for (let step = 0; step < n; step++) {
            const sp = Math.hypot(b.vx, b.vy);
            if (sp > 0) {
              const a = (b.spin / sp) * h,
                c = Math.cos(a),
                sn = Math.sin(a);
              b = { ...b, vx: b.vx * c - b.vy * sn, vy: b.vx * sn + b.vy * c };
            }
            b = {
              ...b,
              spin: b.spin * Math.pow(0.5, h / SPIN_HALFLIFE),
              x: b.x + b.vx * h,
              y: b.y + b.vy * h,
            };
            if (b.y - BALL_R < 0 && b.vy < 0) {
              b = { ...b, y: BALL_R, vy: -b.vy };
              hitCue = CUES.wallBounce;
            } else if (b.y + BALL_R > FIELD_H && b.vy > 0) {
              b = { ...b, y: FIELD_H - BALL_R, vy: -b.vy };
              hitCue = CUES.wallBounce;
            }
            const paddles: [Side, number, number, number][] = [
              ["left", P1_X0, P1_X1, s.paddles.left.cy],
              ["right", P2_X0, P2_X1, s.paddles.right.cy],
            ];
            for (const [side, x0, x1, cy] of paddles) {
              const col = collide(b, {
                x0,
                y0: cy - PADDLE_HALF,
                x1,
                y1: cy + PADDLE_HALF,
              });
              if (col) {
                b = col.ball;
                if (col.face === "left" || col.face === "right") {
                  const offset = clamp((b.y - cy) / PADDLE_HALF, -1, 1),
                    theta = offset * MAX_BOUNCE_ANGLE,
                    sp = Math.min(
                      Math.hypot(b.vx, b.vy) * SPEED_MULT,
                      SPEED_CAP,
                    ),
                    dir = side === "left" ? 1 : -1;
                  b = {
                    ...b,
                    x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
                    vx: dir * sp * Math.cos(theta),
                    vy: sp * Math.sin(theta),
                    spin: clamp(
                      b.spin + s.paddles[side].vy * SPIN_FROM_PADDLE,
                      -SPIN_CLAMP,
                      SPIN_CLAMP,
                    ),
                  };
                  hitCue = CUES.paddleHit;
                } else hitCue = CUES.wallBounce;
              }
            }
            for (const o of s.obstacles) {
              const box = OBSTACLES[o.index];
              if (!box) continue;
              const col = collide(b, box);
              if (col) {
                b = col.ball;
                hitCue = CUES.obstacleBounce;
              }
            }
          }
          if (hitCue) api.audio.play(hitCue);
        }
        if (b) {
          const now = s.simTime;
          b = {
            ...b,
            trail: [...b.trail, { x: b.x, y: b.y, t: now }].filter(
              (p) => now - p.t <= TRAIL_TIME,
            ),
          };
          s = { ...s, ball: b };
          if (
            s.screen === "playing" &&
            (b.x - BALL_R > FIELD_W || b.x + BALL_R < 0)
          ) {
            const p1 = b.x - BALL_R > FIELD_W,
              score = {
                p1: s.score.p1 + (p1 ? 1 : 0),
                p2: s.score.p2 + (p1 ? 0 : 1),
              },
              win = p1
                ? score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD
                : score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD;
            api.audio.play(CUES.score);
            s = {
              ...s,
              score,
              receiver: p1 ? "right" : "left",
              ...(win
                ? {
                    winner: p1 ? "left" : ("right" as Side),
                    screen: "matchover" as Screen,
                    menuIndex: 0,
                  }
                : { ball: park(), screen: "countdown" as Screen }),
            };
          }
        }
      }
    }
    return { ...s, muted: api.audio.muted() };
  },
  render(s, api: RenderApi) {
    const c = api.ctx;
    c.fillStyle = COLORS.ink;
    c.fillRect(0, 0, FIELD_W, FIELD_H);
    c.strokeStyle = COLORS.line;
    c.lineWidth = 2;
    c.setLineDash([9, 14]);
    c.beginPath();
    c.moveTo(NET_X, 42);
    c.lineTo(NET_X, FIELD_H - 42);
    c.stroke();
    c.setLineDash([]);
    for (const o of s.obstacles) {
      c.fillStyle = COLORS.obstacle;
      c.shadowColor = COLORS.obstacle;
      c.shadowBlur = 18;
      roundRect(c, o.cx - 10, o.cy - 70, 20, 140, 10);
      c.shadowBlur = 0;
    }
    const alpha =
      s.screen === "title" || s.screen === "howto" || s.screen === "matchover"
        ? 0.6
        : 1;
    c.globalAlpha = alpha;
    drawPaddle(c, 56, s.paddles.left.cy, COLORS.cyan);
    drawPaddle(c, 1224, s.paddles.right.cy, COLORS.orange);
    if (s.ball) {
      const b = s.ball;
      if (b.trail.length > 1) {
        c.lineCap = "round";
        for (let i = 1; i < b.trail.length; i++) {
          const a = b.trail[i - 1]!,
            z = b.trail[i]!;
          c.strokeStyle = `rgba(83,224,208,${(i / b.trail.length) * 0.42})`;
          c.lineWidth = 2 + (8 * i) / b.trail.length;
          c.beginPath();
          c.moveTo(a.x, a.y);
          c.lineTo(z.x, z.y);
          c.stroke();
        }
      }
      c.fillStyle = COLORS.white;
      c.shadowColor = COLORS.cyan;
      c.shadowBlur = 22;
      c.beginPath();
      c.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;
    }
    c.globalAlpha = 1;
    if (
      s.screen === "playing" ||
      s.screen === "countdown" ||
      s.screen === "paused" ||
      s.screen === "matchover"
    ) {
      c.textAlign = "center";
      c.font = "700 58px system-ui";
      c.fillStyle = COLORS.white;
      c.fillText(String(s.score.p1), FIELD_CX - 100, 90);
      c.fillText(String(s.score.p2), FIELD_CX + 100, 90);
      c.font = "600 13px system-ui";
      c.fillStyle = COLORS.muted;
      c.fillText(
        s.mode === "solo" ? "SOLO · VS MACHINE" : "LOCAL VERSUS",
        FIELD_CX,
        118,
      );
    }
    if (s.screen === "title") {
      c.fillStyle = COLORS.white;
      c.textAlign = "center";
      c.font = "900 100px system-ui";
      c.fillText(TITLE_TEXT, FIELD_CX, 235);
      c.fillStyle = COLORS.cyan;
      c.font = "600 17px system-ui";
      c.fillText("SPIN THE LINE. OWN THE ANGLE.", FIELD_CX, 278);
      drawMenu(c, TITLE_ITEMS, s.menuIndex, 390);
      c.fillStyle = COLORS.muted;
      c.font = "14px system-ui";
      c.fillText("W / S  ·  ↑ / ↓ TO MOVE     ENTER TO SELECT", FIELD_CX, 660);
    }
    if (s.screen === "howto") {
      panelTitle(c, "HOW TO PLAY");
      c.textAlign = "center";
      c.fillStyle = COLORS.white;
      c.font = "20px system-ui";
      [
        "W / S moves the left paddle · ↑ / ↓ moves the right in Versus",
        "A moving paddle adds spin when it strikes the ball.",
        "Bank shots off the fixed obelisks to bend around your rival.",
        "First to 11, with a 2 point lead, takes the match.",
      ].forEach((t, i) => c.fillText(t, FIELD_CX, 340 + i * 42));
      drawMenu(c, ["BACK TO TITLE"], 0, 570);
    }
    if (s.screen === "paused") {
      overlay(c);
      panelTitle(c, "PAUSED");
      drawMenu(c, PAUSE_ITEMS, s.menuIndex, 370);
    }
    if (s.screen === "countdown") {
      c.fillStyle = COLORS.cyan;
      c.textAlign = "center";
      c.font = "700 20px system-ui";
      c.fillText("READY", FIELD_CX, FIELD_CY - 50);
    }
    if (s.screen === "matchover") {
      overlay(c);
      panelTitle(
        c,
        s.winner === "left" ? "PLAYER ONE WINS" : "PLAYER TWO WINS",
      );
      c.textAlign = "center";
      c.fillStyle = COLORS.white;
      c.font = "26px system-ui";
      c.fillText(`${s.score.p1}  —  ${s.score.p2}`, FIELD_CX, 320);
      drawMenu(c, MATCHOVER_ITEMS, s.menuIndex, 400);
    }
  },
};
function roundRect(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}
function drawPaddle(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) {
  c.fillStyle = color;
  c.shadowColor = color;
  c.shadowBlur = 20;
  roundRect(c, x - PADDLE_W / 2, y - PADDLE_H / 2, PADDLE_W, PADDLE_H, 8);
  c.shadowBlur = 0;
}
function overlay(c: CanvasRenderingContext2D) {
  c.fillStyle = "rgba(3,9,17,.78)";
  c.fillRect(0, 0, FIELD_W, FIELD_H);
}
function panelTitle(c: CanvasRenderingContext2D, text: string) {
  c.textAlign = "center";
  c.fillStyle = COLORS.white;
  c.font = "800 48px system-ui";
  c.fillText(text, FIELD_CX, 260);
}
function drawMenu(
  c: CanvasRenderingContext2D,
  items: readonly string[],
  selected: number,
  top: number,
) {
  items.forEach((item, i) => {
    const y = top + i * 66;
    c.fillStyle = i === selected ? COLORS.cyan : COLORS.muted;
    c.font = `${i === selected ? 700 : 500} 22px system-ui`;
    c.textAlign = "center";
    c.fillText(
      `${i === selected ? "›  " : ""}${item}${i === selected ? "  ‹" : ""}`,
      FIELD_CX,
      y,
    );
  });
}
