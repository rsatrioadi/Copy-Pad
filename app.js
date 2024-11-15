const textInput = document.getElementById('textInput');
const addButton = document.getElementById('addButton');
const saveButton = document.getElementById('saveButton');
const openButton = document.getElementById('openButton');
const copyButton = document.getElementById('copyButton');
const selectAllButton = document.getElementById('selectAllButton');
const deselectAllButton = document.getElementById('deselectAllButton');
const checkboxList = document.getElementById('checkboxList');

// Detect command/control based on OS
let useMetaKey = false;
if (navigator.userAgentData) {
	useMetaKey = navigator.userAgentData.platform === 'macOS';
} else {
	useMetaKey = /Mac/i.test(navigator.userAgent);
}
const cmdOrCtrl = useMetaKey ? 'metaKey' : 'ctrlKey';

// Add a new checkbox with the checkbox on the left side of the label
function addCheckbox(text = '') {
	const checkboxContainer = document.createElement('div');

	const label = document.createElement('label');
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.className = 'checkbox-item';

	label.appendChild(checkbox);
	label.appendChild(document.createTextNode(text));

	// Create delete button
	const deleteButton = document.createElement('button');
	deleteButton.className = 'delete-button';
	deleteButton.textContent = '╳';

	// Delete button functionality
	deleteButton.addEventListener('click', () => {
		checkboxList.removeChild(checkboxContainer);
	});

	checkboxContainer.appendChild(label);
	checkboxContainer.appendChild(deleteButton);
	checkboxList.appendChild(checkboxContainer);
}

// Handle Add button or Enter key
function handleAdd() {
	addCheckbox(textInput.value);
	textInput.value = '';
}

// Copy selected text to clipboard (no message box)
async function copyToClipboard() {
	const checkedText = [...document.querySelectorAll('.checkbox-item:checked')]
		.map(checkbox => checkbox.parentElement.textContent)
		.join('\n');
	try {
		await navigator.clipboard.writeText(checkedText);
	} catch (error) {
		console.error('Failed to copy:', error);
	}
}

// Save list to a text file
function saveListToFile() {
	const items = [...checkboxList.querySelectorAll('label')].map(label => label.textContent);
	const textContent = items.join('\n');

	const blob = new Blob([textContent], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = 'CopyPad.txt';
	a.click();

	URL.revokeObjectURL(url);
}

// Load list from a text file
function loadListFromFile(event) {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function (event) {
		checkboxList.innerHTML = '';  // Clear the list first
		const text = event.target.result;
		const items = text.split(/\r?\n/);  // Split by newline

		items.forEach(item => {
			addCheckbox(item);  // Add non-empty lines
		});
	};
	reader.readAsText(file);
}

// Select All checkboxes
function selectAllCheckboxes() {
	document.querySelectorAll('.checkbox-item').forEach(checkbox => {
		checkbox.checked = true;
	});
}

// Deselect All checkboxes
function deselectAllCheckboxes() {
	document.querySelectorAll('.checkbox-item').forEach(checkbox => {
		checkbox.checked = false;
	});
}

// Handle keyboard shortcuts and checkbox toggling
document.addEventListener('keydown', event => {
	if (event[cmdOrCtrl]) {
		switch (event.key.toLowerCase()) {
			case 'c': // Cmd+C / Ctrl+C
				copyToClipboard();
				event.preventDefault();
				break;
			case 's': // Cmd+S / Ctrl+S
				saveListToFile();
				event.preventDefault();
				break;
			case 'o': // Cmd+O / Ctrl+O
				openButton.click();  // Trigger file input click
				event.preventDefault();
				break;
			case 'a': // Cmd+A / Ctrl+A
				selectAllCheckboxes();
				event.preventDefault();
				break;
			case 'd': // Cmd+D / Ctrl+D
				deselectAllCheckboxes();
				event.preventDefault();
				break;
		}
	} else if (event.key === 'Enter' && document.activeElement === textInput) {
		handleAdd();
	} else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
		// Move focus between checkboxes
		const checkboxes = [...checkboxList.querySelectorAll('.checkbox-item')];
		const currentIndex = checkboxes.indexOf(document.activeElement);

		if (event.key === 'ArrowUp') {
			if (currentIndex === 0) textInput.focus();
			else if (currentIndex > 0) checkboxes[currentIndex - 1].focus();
		} else if (event.key === 'ArrowDown') {
			if (currentIndex === -1) checkboxes[0]?.focus();
			else if (currentIndex < checkboxes.length - 1) checkboxes[currentIndex + 1].focus();
		}
	} else if (event.key === ' ') {
		// Toggle checkbox state with spacebar
		if (document.activeElement.classList.contains('checkbox-item')) {
			document.activeElement.checked = !document.activeElement.checked;
			event.preventDefault();
		}
	} else if (event.key === 'Escape') {
		textInput.focus();
	}
});

// Event listeners
addButton.addEventListener('click', handleAdd);
copyButton.addEventListener('click', copyToClipboard);
saveButton.addEventListener('click', saveListToFile);

// Open button triggers file input click for loading file
openButton.addEventListener('click', () => {
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = 'text/plain';
	fileInput.addEventListener('change', loadListFromFile);
	fileInput.click();
});

// Select All / Deselect All functionality
selectAllButton.addEventListener('click', selectAllCheckboxes);
deselectAllButton.addEventListener('click', deselectAllCheckboxes);
