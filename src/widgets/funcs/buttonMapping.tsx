import { QueueInteractionScore } from '@remnote/plugin-sdk';

type ButtonMapping = Record<QueueInteractionScore | string, number[]>;
export const buttonMapping: ButtonMapping = {
	[QueueInteractionScore.AGAIN]: [3, 12, 6],
	[QueueInteractionScore.EASY]: [0, 13, 7],
	[QueueInteractionScore.GOOD]: [1, 15, 5],
	[QueueInteractionScore.HARD]: [2, 14, 4],
	[QueueInteractionScore.TOO_EARLY]: [8],
	[QueueInteractionScore.VIEWED_AS_LEECH]: [],
	[QueueInteractionScore.RESET]: [],
};
export const buttonLabels = {
	'0': 'South Button',
	'1': 'East Button',
	'2': 'West Button',
	'3': 'North Button',
	'4': 'Left Bumper',
	'5': 'Right Bumper',
	'6': 'Left Trigger',
	'7': 'Right Trigger',
	'12': 'North D-Pad',
	'13': 'South D-Pad',
	'14': 'West D-Pad',
	'15': 'East D-Pad',
	// '9': 'Select Button',
	'8': 'Start Button',
};
type ButtonToScoreMapping = Record<number, QueueInteractionScore>;

export const buttonToScoreMapping: ButtonToScoreMapping = {};
for (const [score, indices] of Object.entries(buttonMapping)) {
	for (const index of indices) {
		buttonToScoreMapping[index] = score as unknown as QueueInteractionScore;
	}
}
export const dryButtonMapping: ButtonToScoreMapping = buttonToScoreMapping;
