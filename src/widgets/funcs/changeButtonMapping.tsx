import { QueueInteraction, buttonMapping, buttonToAction } from './buttonMapping';

function addButtonMapping(score: QueueInteraction, buttonIndex: number) {
	// Add the button index to the array of indices for the given score
	buttonMapping[score].push(buttonIndex);

	// Update the button to score mapping
	buttonToAction[buttonIndex] = score;
}
function removeButtonMapping(score: QueueInteraction, buttonIndex: number) {
	// Remove the button index from the array of indices for the given score
	buttonMapping[score] = buttonMapping[score].filter((index) => index !== buttonIndex);

	// Update the button to score mapping
	delete buttonToAction[buttonIndex];
}
export function changeButtonMapping(
	oldScore: QueueInteraction,
	newScore: QueueInteraction,
	buttonIndex: number
) {
	// Remove the button index from the array of indices for the old score
	buttonMapping[oldScore] = buttonMapping[oldScore].filter((index) => index !== buttonIndex);

	// Add the button index to the array of indices for the new score
	buttonMapping[newScore].push(buttonIndex);

	// Update the button to score mapping
	buttonToAction[buttonIndex] = newScore;
}
