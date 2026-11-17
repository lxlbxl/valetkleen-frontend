"use server";

/**
 * Server Actions that client components call. They run on the server, so mock state stays in one
 * place and, once wired to the backend, session cookies and secrets never reach the browser.
 */
import * as api from "./index";

export async function joinWaitlist(...args: Parameters<typeof api.joinWaitlist>) {
  return api.joinWaitlist(...args);
}

export async function getPickupWindows(...args: Parameters<typeof api.getPickupWindows>) {
  return api.getPickupWindows(...args);
}

export async function createBooking(...args: Parameters<typeof api.createBooking>) {
  return api.createBooking(...args);
}

export async function applyPromo(...args: Parameters<typeof api.applyPromo>) {
  return api.applyPromo(...args);
}

export async function rateOrder(...args: Parameters<typeof api.rateOrder>) {
  return api.rateOrder(...args);
}

export async function reportProblem(...args: Parameters<typeof api.reportProblem>) {
  return api.reportProblem(...args);
}

export async function cancelOrder(...args: Parameters<typeof api.cancelOrder>) {
  return api.cancelOrder(...args);
}

export async function updateSubscription(...args: Parameters<typeof api.updateSubscription>) {
  return api.updateSubscription(...args);
}

export async function updateProfile(...args: Parameters<typeof api.updateProfile>) {
  return api.updateProfile(...args);
}

export async function signIn(...args: Parameters<typeof api.signIn>) {
  return api.signIn(...args);
}

export async function signUp(...args: Parameters<typeof api.signUp>) {
  return api.signUp(...args);
}

export async function requestPasswordReset(...args: Parameters<typeof api.requestPasswordReset>) {
  return api.requestPasswordReset(...args);
}

export async function addDriver(...args: Parameters<typeof api.addDriver>) {
  return api.addDriver(...args);
}

export async function assignTrip(...args: Parameters<typeof api.assignTrip>) {
  return api.assignTrip(...args);
}

export async function suggestAssignments(...args: Parameters<typeof api.suggestAssignments>) {
  return api.suggestAssignments(...args);
}

export async function sendOnTheWayText(...args: Parameters<typeof api.sendOnTheWayText>) {
  return api.sendOnTheWayText(...args);
}

export async function recordHandoff(...args: Parameters<typeof api.recordHandoff>) {
  return api.recordHandoff(...args);
}

export async function submitWeighIn(...args: Parameters<typeof api.submitWeighIn>) {
  return api.submitWeighIn(...args);
}

export async function addZip(...args: Parameters<typeof api.addZip>) {
  return api.addZip(...args);
}

export async function decideSuggestion(...args: Parameters<typeof api.decideSuggestion>) {
  return api.decideSuggestion(...args);
}

export async function resolveClaim(...args: Parameters<typeof api.resolveClaim>) {
  return api.resolveClaim(...args);
}

export async function markWeekPaid(...args: Parameters<typeof api.markWeekPaid>) {
  return api.markWeekPaid(...args);
}

