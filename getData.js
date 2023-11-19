export async function getData(URL) {
  return await fetch(URL)
    .then(response => response.json())
    .then(data => data);
}