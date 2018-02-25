// https://stackoverflow.com/a/2480939/2603925
function getColumns(numItems, ratio) {
  return Math.sqrt(numItems * ratio);
}

function getRows(numItems, ratio) {
  return Math.sqrt(numItems / ratio);
}

function pickProperLayout(numItems, col, row) {
  const arr =
  [{ n: Math.floor(col) * Math.ceil(row), col: Math.floor(col), row: Math.ceil(row) },
   { n: Math.ceil(col) * Math.floor(row), col: Math.ceil(col), row: Math.floor(row) },
   { n: Math.ceil(col) * Math.ceil(row), col: Math.ceil(col), row: Math.ceil(row) }]
   .filter(a => a.n !== 0)
   .filter(a => a.n >= numItems)
   // Priviledge layout with more columns than rows
   .sort((a, b) => a.n > b.n || (a.n === b.n && a.col < b.col))
  return arr[0];
}

function appendRow(div) {
  const newRowElement = document.createElement('div');
  newRowElement.className = 'sg-row';
  div.appendChild(newRowElement);
  return newRowElement;
}

function appendItem(row, item) {
  item.className += ' sg-source';
  const newItemElement = document.createElement('div');
  newItemElement.className = 'sg-item';
  newItemElement.appendChild(item);
  row.appendChild(newItemElement);
}

function createGrid(div, items, numCols, numRows) {
  console.log(numCols, numRows);
  for (let i = 0; i < numRows; ++i) {
    const row = appendRow(div);
    for (let j = 0; j < numCols; ++j) {
      if (((i * numCols) + j) < items.length)
        appendItem(row, items[(i * numCols) + j]);
      else
        appendItem(row, document.createElement('div'));
    }
  }
}

function getClientMaxSize(div, divName) {
  const originalWidth = div.style.width;
  const originalHeight = div.style.height;
  div.style.width = '100%';
  div.style.height = '100%';
  // Retrieve client size if it was maximized
  const width = div.clientWidth;
  const height = div.clientHeight;
  // Restore original size
  div.style.width = originalWidth;
  div.style.height = originalHeight;
  // If 0 is found, there is a problem somewhere
  console.log(width, height);
  if (width === 0 || height === 0) {
    throw new Error(`width and height of container shall be set`);
  }
  return {
    width: width,
    height: height,
  };
}

function updateGrid(div, items) {
  if (items.length <= 0) return;
  containerSize = getClientMaxSize(div, 'sg-container');
  const ratio = (containerSize.width / containerSize.height) /
    (items[0].naturalWidth / items[0].naturalHeight);
  const numCols = getColumns(items.length, ratio);
  const numRows = getRows(items.length, ratio);
  const layout = pickProperLayout(items.length, numCols, numRows);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  createGrid(div, items, layout.col, layout.row);
}

if (window.module !== undefined)
  module.exports = updateGrid;
