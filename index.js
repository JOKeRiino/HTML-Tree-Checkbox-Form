import dfgOptions from './dfgOptions.js';

const entryPoint = document.getElementById('dfgSelectorEntry');
const selectionResultEntry = document.getElementById('selection-result');
const form = document.getElementById('dfg-form');

// Building the HTML structure from the given data object
dfgOptions.forEach((sience, index) => {
	let sienceHeader = document.createElement("div");
	let sienceDiv = document.createElement("div");

	// <div class="sience" id="s1">Wissenschaft</div>
	sienceHeader.innerText = `▶︎ ${sience.sienceTitle}`;
	sienceHeader.classList.add("sience");
	sienceHeader.id = `s${index + 1}`;

	// <div class="sience-div no-display" id="s1-div">
	sienceDiv.classList.add("sience-div");
	sienceDiv.classList.add("no-display");
	sienceDiv.id = `s${index + 1}-div`;

	sience.boards.forEach(board => {
		// <div class="first-layer">
		//		<div class="first-layer-flex"></div>
		// </div>
		let firstLayerDiv = document.createElement("div");
		firstLayerDiv.classList.add("first-layer");
		let firstLayerFlexDiv = document.createElement("div");
		firstLayerFlexDiv.classList.add("first-layer-flex");

		// <button type="button" class="expand-btn" id="p1-expand">▷</button>
		// <input type="checkbox" id="p1" value="1">
		// <label for="01">Section 1</label>
		let boardExpandButton = document.createElement("button");
		let boardInput = document.createElement("input");
		let boardInputLabel = document.createElement("label");

		boardExpandButton.type = "button";
		boardExpandButton.classList.add("expand-btn");
		boardExpandButton.id = `${board.value}-expand`;
		boardExpandButton.innerText = "▶︎";

		boardInput.type = "checkbox";
		boardInput.id = `${board.value}`;
		boardInput.value = board.value;

		boardInputLabel.htmlFor = boardInput.id;
		boardInputLabel.classList.add("input-label");
		boardInputLabel.innerText = `${board.value} - ${board.boardTitle}`;

		//<div class="second-layer no-display" id="p1-expand-div"></div>
		let secondLayerDiv = document.createElement("div");
		secondLayerDiv.classList.add("second-layer");
		secondLayerDiv.classList.add("no-display");
		secondLayerDiv.id = `${boardExpandButton.id}-div`;

		board.subjects.forEach(subject => {
			// <div class="selection">
			// <input type="checkbox" id="c11" value="11">
			// <label for="011">S1 - Child 1</label>
			// </div>
			let selectionDiv = document.createElement("div");
			selectionDiv.classList.add("selection");

			let subjectInput = document.createElement("input");
			subjectInput.type = "checkbox";
			subjectInput.id = subject.value;
			subjectInput.value = subject.value;

			let subjectInputLabel = document.createElement("label");
			subjectInputLabel.htmlFor = subjectInput.id;
			subjectInputLabel.classList.add("input-label");
			subjectInputLabel.innerText = `${subject.value} - ${subject.subjectTitle}`;

			selectionDiv.appendChild(subjectInput);
			selectionDiv.appendChild(subjectInputLabel);

			secondLayerDiv.appendChild(selectionDiv);
		})

		firstLayerFlexDiv.appendChild(boardExpandButton);
		firstLayerFlexDiv.appendChild(boardInput);
		firstLayerFlexDiv.appendChild(boardInputLabel);

		firstLayerDiv.appendChild(firstLayerFlexDiv);
		firstLayerDiv.appendChild(secondLayerDiv);

		sienceDiv.appendChild(firstLayerDiv);
	})

	entryPoint.appendChild(sienceHeader);
	entryPoint.appendChild(sienceDiv);

})


const checkboxes = document.querySelectorAll("input[type = 'checkbox']");
const expandButtons = document.querySelectorAll(".expand-btn");
const targetDivs = document.querySelectorAll(".second-layer");
const sienceButtons = document.querySelectorAll(".sience");
const sienceDivs = document.querySelectorAll(".sience-div");
const parentCheckboxes = []
checkboxes.forEach(cb => {
	if (cb.id.length === 3) {
		parentCheckboxes.push(cb)
	}
})

checkboxes.forEach(checkbox => {
	checkbox.addEventListener('change', () => {
		// If a parent is selected, select all its children
		if (checkbox.id.length === 3 && checkbox.checked) {
			checkboxes.forEach(cb => {
				if (cb.id.includes(checkbox.id)) {
					cb.checked = true;
				}
			})
		}
		// If parent is deselected, deselect all its children
		else if (checkbox.id.length === 3 && !checkbox.checked) {
			checkboxes.forEach(cb => {
				if (cb.id.includes(checkbox.id)) {
					cb.checked = false;
				}
			})
		}
		// If all checkboxes but one of a child are selected, deselect the parent if it is selected
		checkboxes.forEach(cb => {
			if (cb.id.length > 3 && !cb.checked) {
				parentCheckboxes.forEach(parent => {
					if (parent.id === cb.id.substring(0, 3) && parent.checked) {
						parent.checked = false;
					}
				})
			}
		})
		// Get the highest order checkbox id (first three digits of id)
		const highOrderId = checkbox.id.substring(0, 3)
		// find all children of the highOrderId Checkbox
		const lowerOrderCheckboxes = Array.from(checkboxes).filter(cb => cb.id.includes(highOrderId) && cb.id.length > 3);
		// If there are no unchecked children make sure the parent is also checked
		if (!lowerOrderCheckboxes.find(cb => {
			return !cb.checked
		})) {
			parentCheckboxes.forEach(pCb => {
				if (pCb.id === highOrderId) {
					pCb.checked = true;
				}
			})
		}
		renderSelection();
	})
});

// open or close the nested, second-layer options
expandButtons.forEach((btn) => {
	btn.addEventListener('click', () => {
		targetDivs.forEach((div) => {
			if (div.id.startsWith(btn.id)) {
				if (div.classList.contains('no-display')) {
					div.classList.remove('no-display');
					btn.textContent = '▼';
				}
				else {
					div.classList.add('no-display');
					btn.textContent = '▶︎';
				}
			}
		})
	})
});

// open or close the first-layer options
sienceButtons.forEach(btn => {
	btn.addEventListener('click', () => {
		sienceDivs.forEach(div => {
			if (div.id.startsWith(btn.id)) {
				if (div.classList.contains('no-display')) {
					div.classList.remove('no-display');
					btn.textContent = `▼ ${btn.textContent.split(' ')[1]}`;
				}
				else {
					div.classList.add('no-display');
					btn.textContent = `▶︎ ${btn.textContent.split(' ')[1]}`;
				}
			}
		})
	})
})

//* Automated Submit on Change
const renderSelection = () => {
	const result = [];
	checkboxes.forEach(cb => {
		if (cb.checked && cb.id.length > 3) {
			result.push(cb.id);
		}
	})

	let resultGrid = document.createElement("div");
	resultGrid.classList.add("results-grid");
	if (result.length) {
		result.forEach(resText => {
			let resultSpan = document.createElement("span");
			resultSpan.classList.add("result-span");
			resultSpan.innerText = resText;
			resultGrid.appendChild(resultSpan);
		})
		selectionResultEntry.replaceChildren(resultGrid);
	} else {
		selectionResultEntry.innerText = "Please select something!";
	}
}

//* When a submit button is used:
//* On submit, paint selected values on screen.
// form.addEventListener('submit', event => {
// 	event.preventDefault();

// 	const result = [];
// 	checkboxes.forEach(cb => {
// 		if (cb.checked && cb.id.length > 3) {
// 			result.push(cb.id);
// 		}
// 	})

// 	const resultSpan = document.createElement("span");
// 	resultSpan.classList.add("results-array");
// 	resultSpan.innerText = result.length ? `Selection: ${result}` : '';

// 	selectionResultEntry.replaceChildren(resultSpan);
// })