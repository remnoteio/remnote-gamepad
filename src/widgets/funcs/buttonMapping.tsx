import { QueueInteractionScore } from '@remnote/plugin-sdk';

export enum QueueInteraction {
	hideAnswer = 'hideAnswer',
	goBackToPreviousCard = 'goBackToPreviousCard',
	answerCardAsAgain = QueueInteractionScore.AGAIN,
	answerCardAsEasy = QueueInteractionScore.EASY,
	answerCardAsGood = QueueInteractionScore.GOOD,
	answerCardAsHard = QueueInteractionScore.HARD,
	answerCardAsTooEarly = QueueInteractionScore.TOO_EARLY,
	answerCardAsViewedAsLeech = QueueInteractionScore.VIEWED_AS_LEECH,
	resetCard = QueueInteractionScore.RESET,
}

export const QueueInteractionPrettyName = {
	[QueueInteraction.hideAnswer]: 'Hide Answer',
	[QueueInteraction.goBackToPreviousCard]: 'Go Back To Previous Card',
	[QueueInteraction.answerCardAsAgain]: 'Answer Card As Again',
	[QueueInteraction.answerCardAsEasy]: 'Answer Card As Easy',
	[QueueInteraction.answerCardAsGood]: 'Answer Card As Good',
	[QueueInteraction.answerCardAsHard]: 'Answer Card As Hard',
	[QueueInteraction.answerCardAsTooEarly]: 'Answer Card As Too Early',
	[QueueInteraction.answerCardAsViewedAsLeech]: 'Answer Card As Viewed As Leech',
	[QueueInteraction.resetCard]: 'Reset Card',
};

type ButtonMapping = Record<QueueInteraction, number[]>;
export const buttonMapping: ButtonMapping = {
	[QueueInteraction.answerCardAsAgain]: [3, 12, 6],
	[QueueInteraction.answerCardAsEasy]: [0, 13, 7],
	[QueueInteraction.answerCardAsGood]: [1, 15, 5],
	[QueueInteraction.answerCardAsHard]: [2, 14, 4],
	[QueueInteraction.answerCardAsTooEarly]: [8],
	[QueueInteraction.answerCardAsViewedAsLeech]: [],
	[QueueInteraction.resetCard]: [],
	[QueueInteraction.hideAnswer]: [],
	[QueueInteraction.goBackToPreviousCard]: [9],
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
	'9': 'Select Button',
	'8': 'Start Button',
};
type ButtonToAction = Record<number, QueueInteraction>;

export const buttonToAction: ButtonToAction = {};
for (const [score, indices] of Object.entries(buttonMapping)) {
	for (const index of indices) {
		buttonToAction[index] = score as QueueInteraction;
	}
}
export const dryButtonMapping: ButtonToAction = buttonToAction;

export function getButtonAction(buttonIndex: number): QueueInteraction | undefined {
	return buttonToAction[buttonIndex];
}

export function getButtonGroup(buttonIndex: number) {
	if (buttonIndex === 6 || buttonIndex === 7) {
		return 'trigger';
	} else if (buttonIndex === 4 || buttonIndex === 5) {
		return 'bumper';
	} else if (buttonIndex === 12 || buttonIndex === 13 || buttonIndex === 14 || buttonIndex === 15) {
		return 'd-pad';
	} else if (buttonIndex === 0 || buttonIndex === 1 || buttonIndex === 2 || buttonIndex === 3) {
		return 'face button';
	} else if (buttonIndex === 8 || buttonIndex === 9) {
		return 'start/select';
	}
}

export function getButtonsFromGroup(group: string): number[] {
	switch (group) {
		case 'trigger':
			return [6, 7];
		case 'bumper':
			return [4, 5];
		case 'd-pad':
			return [12, 13, 14, 15];
		case 'face button':
			return [0, 1, 2, 3];
		case 'start/select':
			return [8, 9];
		default:
			return [];
	}
}
