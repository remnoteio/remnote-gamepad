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

export enum ButtonGroup {
	trigger = 'trigger',
	bumper = 'bumper',
	dPad = 'd-pad',
	faceButton = 'face button',
	startSelect = 'start/select',
}

export const buttonGroupCssPatterns = {
	// TODO: Add CSS patterns for each button group
	[ButtonGroup.trigger]: '/* CSS pattern for trigger button group */',
	[ButtonGroup.bumper]: '/* CSS pattern for bumper button group */',
	[ButtonGroup.dPad]: '/* CSS pattern for d-pad button group */',
	[ButtonGroup.faceButton]: '/* CSS pattern for face button group */',
	[ButtonGroup.startSelect]: '/* CSS pattern for start/select button group */',
};
export function getButtonGroup(buttonIndex: number): ButtonGroup | undefined {
	if (buttonIndex === 6 || buttonIndex === 7) {
		return ButtonGroup.trigger;
	} else if (buttonIndex === 4 || buttonIndex === 5) {
		return ButtonGroup.bumper;
	} else if (buttonIndex === 12 || buttonIndex === 13 || buttonIndex === 14 || buttonIndex === 15) {
		return ButtonGroup.dPad;
	} else if (buttonIndex === 0 || buttonIndex === 1 || buttonIndex === 2 || buttonIndex === 3) {
		return ButtonGroup.faceButton;
	} else if (buttonIndex === 8 || buttonIndex === 9) {
		return ButtonGroup.startSelect;
	}
}

export function getButtonsFromGroup(group: ButtonGroup): number[] {
	switch (group) {
		case ButtonGroup.trigger:
			return [6, 7];
		case ButtonGroup.bumper:
			return [4, 5];
		case ButtonGroup.dPad:
			return [12, 13, 14, 15];
		case ButtonGroup.faceButton:
			return [0, 1, 2, 3];
		case ButtonGroup.startSelect:
			return [8, 9];
		default:
			return [];
	}
}
