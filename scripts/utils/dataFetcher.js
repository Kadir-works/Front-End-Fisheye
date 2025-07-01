// scripts/utils/dataFetcher.js

export async function fetchData() {
  const response = await fetch("../../data/photographers.json");
  return await response.json();
}

export function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}
