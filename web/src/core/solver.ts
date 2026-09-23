/**
 * Core Mathematical Solver for PVC Photodegradation Kinetics & HALS Stabilization.
 * Based on University of Moratuwa Research (MT2230 - Group 1, Premakumara H.P.S.)
 *
 * Implements:
 * 1. 8-species stiff ODE solution with Quasi-Steady-State Approximation (QSSA) + RK4 integration.
 * 2. Unstabilized baseline ODE degradation model (Report pg 21).
 * 3. Bisection/Binary search optimization engine for target lifespan.
 * 4. Sensitivity batch table generation.
 */

import {
  DEFAULT_RATE_CONSTANTS,
  OUTDOOR_HOURS_SCALING_FACTOR,
  STABILIZER_WT_MULTIPLIER,
  DEFAULT_TARGET_PVC_RETENTION,
  SPECIES_KEYS
} from './constants';

export interface SimulationPoint {
  timeHours: number;
  timeSeconds: number;
  PVC: number;
  R_N_H: number;
  Cl_rad: number;
  R_N_OH: number;
  R_N_O_R: number;
  R_NO_rad: number;
  R_rad: number;
  R_OO_rad: number;
}

export interface SimulationResult {
  times: number[];
  pvc: number[];
  species: Record<string, number[]>;
  points: SimulationPoint[];
  finalPVC: number;
  initialStabilizer: number;
  initialWtPercent: number;
  durationHours: number;
  scaledHours: number;
  retentionPercent: number;
  isPassed: boolean;
  threshold: number;
}

export interface OptimizationResult {
  status: 'SAFE_WITHOUT_STABILIZER' | 'OPTIMUM_FOUND' | 'EXCEEDS_MAX_LIFETIME';
  outdoorHours: number;
  scaledHours: number;
  recommendedWtPercent: number;
  recommendedRawConc: number;
  compoundingGPerKg: number;
  finalPvcRetention: number;
  message: string;
  isSuccess: boolean;
  targetThreshold: number;
  simulation?: SimulationResult;
  executionTimeMs: number;
}

export interface BatchItem {
  id: number;
  wtPercent: number;
  rawConc: number;
  compoundingGPerKg: number;
  finalRetentionPct: number;
  degradationPct: number;
  lossReductionPct: number;
  status: 'SAFE' | 'MARGINAL' | 'FAILED';
}

/**
 * Solves the coupled 8-species degradation system.
 */
export function solvePVCDegradation(
  stabilizerConc: number,
  scaledHours: number,
  rateConstants: number[] = DEFAULT_RATE_CONSTANTS,
  samplePoints: number = 200
): SimulationResult {
  const tEnd = Math.max(scaledHours * 3600.0, 1e-4);
  const [k1, k2, k3, k4, k5, k6, k7, k8, k9] = rateConstants;

  // QSSA state vector: [pvc, r_n_h, cl_rad, r_n_oh, r_n_o_r, r_no_rad]
  let state = [1.0, Math.max(stabilizerConc, 0.0), 0.0, 0.0, 0.0, 0.0];

  const calcDerivatives = (y: number[]): [number[], number, number] => {
    const [pvc, r_n_h, cl_rad, r_n_oh, r_n_o_r, r_no_rad] = y;

    // Quasi-Steady-State for ultra-short-lived radical intermediates:
    // d[R•]/dt ≈ 0  =>  [R•] = (k6 * pvc) / (k7 + k3 * r_no_rad)
    const denomR = k7 + k3 * Math.max(r_no_rad, 0);
    const r_rad = denomR > 0 ? (k6 * Math.max(pvc, 0)) / denomR : 0.0;

    // d[ROO•]/dt ≈ 0  =>  [ROO•] = (k7 * [R•]) / (k8*[PVC] + k1*[>NH] + k2*[>NOH] + k4*[>NOR])
    const denomROO =
      k8 * Math.max(pvc, 0) +
      k1 * Math.max(r_n_h, 0) +
      k2 * Math.max(r_n_oh, 0) +
      k4 * Math.max(r_n_o_r, 0);
    const r_oo_rad = denomROO > 0 ? (k7 * r_rad) / denomROO : 0.0;

    // ODE derivatives for key measurable & matrix species
    const d_pvc = -k6 * pvc - k8 * pvc * r_oo_rad - k9 * cl_rad * pvc;
    const d_cl = k6 * pvc + k8 * pvc * r_oo_rad;
    const d_r_n_h = -k1 * r_oo_rad * r_n_h;
    const d_r_n_oh = k1 * r_oo_rad * r_n_h + k5 * r_n_o_r - k2 * r_n_oh * r_oo_rad;
    const d_r_n_o_r = k3 * r_no_rad * r_rad - k5 * r_n_o_r - k4 * r_n_o_r * r_oo_rad;
    const d_r_no_rad = k4 * r_n_o_r * r_oo_rad + k2 * r_oo_rad * r_n_oh - k3 * r_rad * r_no_rad;

    return [[d_pvc, d_r_n_h, d_cl, d_r_n_oh, d_r_n_o_r, d_r_no_rad], r_rad, r_oo_rad];
  };

  const dt = Math.min(2.0, tEnd / samplePoints);
  const totalSubSteps = Math.ceil(tEnd / dt);
  const recordInterval = Math.max(1, Math.floor(totalSubSteps / samplePoints));

  const times: number[] = [];
  const pvcArr: number[] = [];
  const species: Record<string, number[]> = {};
  SPECIES_KEYS.forEach((k) => (species[k] = []));
  const points: SimulationPoint[] = [];

  let curTime = 0.0;

  const pushState = (tSec: number, y: number[], r_rad: number, r_oo_rad: number) => {
    const tHr = (tSec / 3600.0) * OUTDOOR_HOURS_SCALING_FACTOR;
    times.push(tHr);
    pvcArr.push(Math.max(0, y[0]));

    species['PVC'].push(Math.max(0, y[0]));
    species['R_N_H'].push(Math.max(0, y[1]));
    species['Cl_rad'].push(Math.max(0, y[2]));
    species['R_N_OH'].push(Math.max(0, y[3]));
    species['R_N_O_R'].push(Math.max(0, y[4]));
    species['R_NO_rad'].push(Math.max(0, y[5]));
    species['R_rad'].push(r_rad);
    species['R_OO_rad'].push(r_oo_rad);

    points.push({
      timeHours: tHr,
      timeSeconds: tSec,
      PVC: Math.max(0, y[0]),
      R_N_H: Math.max(0, y[1]),
      Cl_rad: Math.max(0, y[2]),
      R_N_OH: Math.max(0, y[3]),
      R_N_O_R: Math.max(0, y[4]),
      R_NO_rad: Math.max(0, y[5]),
      R_rad: r_rad,
      R_OO_rad: r_oo_rad
    });
  };

  // Initial step
  const [, initR, initROO] = calcDerivatives(state);
  pushState(0, state, initR, initROO);

  for (let step = 1; step <= totalSubSteps; step++) {
    const actualDt = Math.min(dt, tEnd - curTime);
    if (actualDt <= 0) break;

    // 4th Order Runge-Kutta step
    const [k_1] = calcDerivatives(state);
    const s2 = state.map((v, i) => v + 0.5 * actualDt * k_1[i]);
    const [k_2] = calcDerivatives(s2);
    const s3 = state.map((v, i) => v + 0.5 * actualDt * k_2[i]);
    const [k_3] = calcDerivatives(s3);
    const s4 = state.map((v, i) => v + actualDt * k_3[i]);
    const [k_4] = calcDerivatives(s4);

    state = state.map((v, i) => v + (actualDt / 6.0) * (k_1[i] + 2 * k_2[i] + 2 * k_3[i] + k_4[i]));
    curTime += actualDt;

    if (step % recordInterval === 0 || step === totalSubSteps) {
      const [, r_rad, r_oo_rad] = calcDerivatives(state);
      pushState(curTime, state, r_rad, r_oo_rad);
    }
  }

  const finalPVC = pvcArr[pvcArr.length - 1];
  const initialWtPercent = stabilizerConc * STABILIZER_WT_MULTIPLIER;
  const durationHours = scaledHours * OUTDOOR_HOURS_SCALING_FACTOR;

  return {
    times,
    pvc: pvcArr,
    species,
    points,
    finalPVC,
    initialStabilizer: stabilizerConc,
    initialWtPercent,
    durationHours,
    scaledHours,
    retentionPercent: Number((finalPVC * 100).toFixed(2)),
    isPassed: finalPVC >= DEFAULT_TARGET_PVC_RETENTION,
    threshold: DEFAULT_TARGET_PVC_RETENTION
  };
}

/**
 * Solves Unstabilized PVC Degradation (Report Page 21).
 * Shows rapid loss of polymer integrity without HALS.
 */
export function solveUnstabilizedDegradation(
  scaledHours: number,
  rateConstants: number[] = DEFAULT_RATE_CONSTANTS,
  samplePoints: number = 200
): { times: number[]; pvc: number[]; cl_rad: number[]; retentionPercent: number } {
  const tEnd = Math.max(scaledHours * 3600.0, 1e-4);
  const [, , , , , k6, , k8, k9] = rateConstants;
  const k10 = 1.0e-3; // Radical termination coefficient

  // State: [pvc, cl_rad]
  let state = [1.0, 0.0];
  const dt = Math.min(2.0, tEnd / samplePoints);
  const totalSubSteps = Math.ceil(tEnd / dt);
  const recordInterval = Math.max(1, Math.floor(totalSubSteps / samplePoints));

  const times: number[] = [];
  const pvc: number[] = [];
  const cl_rad: number[] = [];

  const calcUnstabilizedDerivs = (y: number[]): [number, number] => {
    const [p, cl] = y;
    // Quasi-steady state without stabilizer:
    // [R•] = (k6 * p) / k7
    // [ROO•] = (k7 * [R•]) / (k8 * p) = k6 / k8
    const r_oo_rad = k8 > 0 ? k6 / k8 : 0.0;

    const d_pvc = -k6 * p - k8 * p * r_oo_rad - k9 * cl * p;
    const d_cl = k6 * p + k8 * p * r_oo_rad - k10 * cl * cl;
    return [d_pvc, d_cl];
  };

  times.push(0);
  pvc.push(1.0);
  cl_rad.push(0.0);

  let curTime = 0.0;
  for (let step = 1; step <= totalSubSteps; step++) {
    const actualDt = Math.min(dt, tEnd - curTime);
    if (actualDt <= 0) break;

    const [dp1, dc1] = calcUnstabilizedDerivs(state);
    const s2 = [state[0] + 0.5 * actualDt * dp1, state[1] + 0.5 * actualDt * dc1];
    const [dp2, dc2] = calcUnstabilizedDerivs(s2);
    const s3 = [state[0] + 0.5 * actualDt * dp2, state[1] + 0.5 * actualDt * dc2];
    const [dp3, dc3] = calcUnstabilizedDerivs(s3);
    const s4 = [state[0] + actualDt * dp3, state[1] + actualDt * dc3];
    const [dp4, dc4] = calcUnstabilizedDerivs(s4);

    state[0] += (actualDt / 6.0) * (dp1 + 2 * dp2 + 2 * dp3 + dp4);
    state[1] += (actualDt / 6.0) * (dc1 + 2 * dc2 + 2 * dc3 + dc4);
    curTime += actualDt;

    if (step % recordInterval === 0 || step === totalSubSteps) {
      const tHr = (curTime / 3600.0) * OUTDOOR_HOURS_SCALING_FACTOR;
      times.push(tHr);
      pvc.push(Math.max(0, state[0]));
      cl_rad.push(Math.max(0, state[1]));
    }
  }

  const finalPVC = pvc[pvc.length - 1];
  return {
    times,
    pvc,
    cl_rad,
    retentionPercent: Number((finalPVC * 100).toFixed(2))
  };
}

/**
 * Optimizes the required Tinuvin 770 concentration using binary search / bisection.
 */
export function findOptimumStabilizer(
  expectedOutdoorHours: number,
  maxStabilizerConc: number = 0.20,
  targetRetention: number = DEFAULT_TARGET_PVC_RETENTION,
  rateConstants: number[] = DEFAULT_RATE_CONSTANTS
): OptimizationResult {
  const startTime = performance.now();
  const scaledHours = expectedOutdoorHours / OUTDOOR_HOURS_SCALING_FACTOR;

  // 1. Check baseline (0 stabilizer)
  const baseline = solvePVCDegradation(0.0, scaledHours, rateConstants, 100);
  if (baseline.finalPVC >= targetRetention) {
    const elapsed = Math.round((performance.now() - startTime) * 10) / 10;
    return {
      status: 'SAFE_WITHOUT_STABILIZER',
      outdoorHours: expectedOutdoorHours,
      scaledHours,
      recommendedWtPercent: 0.0,
      recommendedRawConc: 0.0,
      compoundingGPerKg: 0.0,
      finalPvcRetention: Number((baseline.finalPVC * 100).toFixed(2)),
      message: 'No stabilizer required! PVC retains over 80% integrity naturally for this exposure time.',
      isSuccess: true,
      targetThreshold: targetRetention,
      simulation: baseline,
      executionTimeMs: elapsed
    };
  }

  // 2. Binary search across concentration space [0 .. maxStabilizerConc]
  let low = 0.0;
  let high = maxStabilizerConc;
  let bestConc: number | null = null;
  const tolerance = 1e-5;

  for (let iter = 0; iter < 24; iter++) {
    const mid = (low + high) / 2.0;
    const sim = solvePVCDegradation(mid, scaledHours, rateConstants, 50);

    if (sim.finalPVC >= targetRetention) {
      bestConc = mid;
      high = mid; // Try smaller concentration
    } else {
      low = mid;
    }

    if (high - low < tolerance) break;
  }

  const elapsed = Math.round((performance.now() - startTime) * 10) / 10;

  if (bestConc !== null) {
    const finalSim = solvePVCDegradation(bestConc, scaledHours, rateConstants, 200);
    const wtPercent = Number((bestConc * STABILIZER_WT_MULTIPLIER).toFixed(4));
    const compoundingGPerKg = Number((wtPercent * 10.0).toFixed(2));

    return {
      status: 'OPTIMUM_FOUND',
      outdoorHours: expectedOutdoorHours,
      scaledHours,
      recommendedWtPercent: wtPercent,
      recommendedRawConc: Number(bestConc.toFixed(5)),
      compoundingGPerKg,
      finalPvcRetention: Number((finalSim.finalPVC * 100).toFixed(2)),
      message: `Optimal formulation found: Incorporate ${wtPercent} wt.% Tinuvin 770 (${compoundingGPerKg} g/kg PVC).`,
      isSuccess: true,
      targetThreshold: targetRetention,
      simulation: finalSim,
      executionTimeMs: elapsed
    };
  }

  return {
    status: 'EXCEEDS_MAX_LIFETIME',
    outdoorHours: expectedOutdoorHours,
    scaledHours,
    recommendedWtPercent: -1.0,
    recommendedRawConc: -1.0,
    compoundingGPerKg: -1.0,
    finalPvcRetention: 0.0,
    message:
      'Required lifetime cannot be achieved with single-stabilizer HALS within safe 5% wt. bounds. Consider hybrid co-stabilizers (e.g. UV Absorber Tinuvin P + Phenolic Antioxidant).',
    isSuccess: false,
    targetThreshold: targetRetention,
    executionTimeMs: elapsed
  };
}

/**
 * Generates batch sensitivity analysis across multiple stabilizer fractions.
 */
export function generateBatchSensitivity(
  outdoorHours: number,
  pointsCount: number = 10,
  maxWtPercent: number = 0.8,
  rateConstants: number[] = DEFAULT_RATE_CONSTANTS
): BatchItem[] {
  const scaledHours = outdoorHours / OUTDOOR_HOURS_SCALING_FACTOR;
  const baseline = solvePVCDegradation(0.0, scaledHours, rateConstants, 50);
  const baselineLoss = 1.0 - baseline.finalPVC;

  const items: BatchItem[] = [];
  const step = maxWtPercent / (pointsCount - 1);

  for (let i = 0; i < pointsCount; i++) {
    const wt = Number((i * step).toFixed(4));
    const rawConc = wt / STABILIZER_WT_MULTIPLIER;
    const sim = solvePVCDegradation(rawConc, scaledHours, rateConstants, 50);

    const retention = sim.finalPVC;
    const degradation = Math.max(0, 1.0 - retention);
    const lossReduction = baselineLoss > 0 ? ((baselineLoss - degradation) / baselineLoss) * 100 : 0.0;

    let status: 'SAFE' | 'MARGINAL' | 'FAILED' = 'FAILED';
    if (retention >= 0.80) {
      status = 'SAFE';
    } else if (retention >= 0.75) {
      status = 'MARGINAL';
    }

    items.push({
      id: i + 1,
      wtPercent: wt,
      rawConc: Number(rawConc.toFixed(5)),
      compoundingGPerKg: Number((wt * 10.0).toFixed(2)),
      finalRetentionPct: Number((retention * 100).toFixed(2)),
      degradationPct: Number((degradation * 100).toFixed(2)),
      lossReductionPct: Number(Math.max(0, lossReduction).toFixed(1)),
      status
    });
  }

  return items;
}
