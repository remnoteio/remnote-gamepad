import { QueueInteractionScore } from '@remnote/plugin-sdk';
import { buttonMapping, buttonToScoreMapping } from './buttonMapping';

function addButtonMapping(score: QueueInteractionScore, buttonIndex: number) {
	// Add the button index to the array of indices for the given score
	buttonMapping[score].push(buttonIndex);

	// Update the button to score mapping
	buttonToScoreMapping[buttonIndex] = score;
}
function removeButtonMapping(score: QueueInteractionScore, buttonIndex: number) {
	// Remove the button index from the array of indices for the given score
	buttonMapping[score] = buttonMapping[score].filter((index) => index !== buttonIndex);

	// Update the button to score mapping
	delete buttonToScoreMapping[buttonIndex];
}
export function changeButtonMapping(
	oldScore: QueueInteractionScore,
	newScore: QueueInteractionScore,
	buttonIndex: number
) {
	// Remove the button index from the array of indices for the old score
	buttonMapping[oldScore] = buttonMapping[oldScore].filter((index) => index !== buttonIndex);

	// Add the button index to the array of indices for the new score
	buttonMapping[newScore].push(buttonIndex);

	// Update the button to score mapping
	buttonToScoreMapping[buttonIndex] = newScore;
}
