import { QueueInteractionScore, RNPlugin } from '@remnote/plugin-sdk';
import { LogType, logMessage } from './logging';

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

export enum ButtonGroup {
	triggerBumper = 'trigger/bumper',
	dPad = 'd-pad',
	faceButton = 'face button',
	// startSelect = 'start/select',
}

export type ButtonMapping = {
	buttonIndex: number;
	queueInteraction: QueueInteraction;
	buttonGroup: ButtonGroup;
	buttonLabel: string;
};

export type ControllerMapping = ButtonMapping[];

export const DEFAULT_MAPPING: ControllerMapping = [
	{
		buttonIndex: 3,
		queueInteraction: QueueInteraction.answerCardAsAgain,
		buttonGroup: ButtonGroup.faceButton,
		buttonLabel: 'North Button',
	},
	{
		buttonIndex: 12,
		queueInteraction: QueueInteraction.answerCardAsAgain,
		buttonGroup: ButtonGroup.dPad,
		buttonLabel: 'North D-Pad',
	},
	{
		buttonIndex: 6,
		queueInteraction: QueueInteraction.answerCardAsAgain,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Left Trigger',
	},
	{
		buttonIndex: 0,
		queueInteraction: QueueInteraction.answerCardAsEasy,
		buttonGroup: ButtonGroup.faceButton,
		buttonLabel: 'South Button',
	},
	{
		buttonIndex: 13,
		queueInteraction: QueueInteraction.answerCardAsEasy,
		buttonGroup: ButtonGroup.dPad,
		buttonLabel: 'South D-Pad',
	},
	{
		buttonIndex: 7,
		queueInteraction: QueueInteraction.answerCardAsEasy,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Right Trigger',
	},
	{
		buttonIndex: 1,
		queueInteraction: QueueInteraction.answerCardAsGood,
		buttonGroup: ButtonGroup.faceButton,
		buttonLabel: 'East Button',
	},
	{
		buttonIndex: 15,
		queueInteraction: QueueInteraction.answerCardAsGood,
		buttonGroup: ButtonGroup.dPad,
		buttonLabel: 'East D-Pad',
	},
	{
		buttonIndex: 5,
		queueInteraction: QueueInteraction.answerCardAsGood,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Right Bumper',
	},
	{
		buttonIndex: 2,
		queueInteraction: QueueInteraction.answerCardAsHard,
		buttonGroup: ButtonGroup.faceButton,
		buttonLabel: 'West Button',
	},
	{
		buttonIndex: 14,
		queueInteraction: QueueInteraction.answerCardAsHard,
		buttonGroup: ButtonGroup.dPad,
		buttonLabel: 'West D-Pad',
	},
	{
		buttonIndex: 4,
		queueInteraction: QueueInteraction.answerCardAsHard,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Left Bumper',
	},
	{
		buttonIndex: 8,
		queueInteraction: QueueInteraction.answerCardAsTooEarly,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Select Button',
	},
	{
		buttonIndex: 9,
		queueInteraction: QueueInteraction.goBackToPreviousCard,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Start Button',
	},
];

export function getPossibleButtonsFromGroup(buttonGroup: ButtonGroup): number[] {
	return DEFAULT_MAPPING.filter((mapping) => mapping.buttonGroup === buttonGroup).map(
		(mapping) => mapping.buttonIndex
	);
}

export async function writeSettingsToSyncedMapping(plugin: RNPlugin) {
	const controllerMapping: ControllerMapping = [];

	for (const button of DEFAULT_MAPPING) {
		const queueInteraction = await plugin.settings.getSetting(
			`button-mapping-${button.buttonLabel}`
		);

		if (!queueInteraction) {
			logMessage(
				plugin,
				`Button mapping for ${button.buttonLabel} is not set. Using default value.`,
				LogType.Warning,
				false
			);
			controllerMapping.push(button);
			continue;
		}

		// queueInteraction will usually be a string because of the dropdown setting. but because every now and then it might be a number that is a string we need to check for that.. HOWEVER, If it is a string that is just a number, we want to convert tht to a number
		const queueInteractionBird =
			typeof queueInteraction === 'string'
				? isNaN(Number(queueInteraction))
					? queueInteraction
					: Number(queueInteraction)
				: queueInteraction;
		if (queueInteraction) {
			controllerMapping.push({
				buttonIndex: button.buttonIndex,
				queueInteraction: queueInteractionBird, // the only thing we are actually changeing
				buttonGroup: button.buttonGroup,
				buttonLabel: button.buttonLabel,
			});
		}
	}

	if (controllerMapping != DEFAULT_MAPPING) {
		// look through and see which ones are different. If they are different, then we need log what changed. for each change, logMessage(plugin, `Button mapping for ${button.buttonLabel} has been changed to ${queueInteraction}`, LogType.Info, false);

		const changedMappings = controllerMapping.filter(
			(mapping) =>
				DEFAULT_MAPPING.find((defaultMapping) => defaultMapping.buttonIndex === mapping.buttonIndex)
					?.queueInteraction !== mapping.queueInteraction
		);

		changedMappings.forEach((mapping) => {
			logMessage(
				plugin,
				`Button mapping for ${mapping.buttonLabel} has been changed to ${QueueInteractionPrettyName[mapping.queueInteraction]}`,
				LogType.Info,
				false,
				`| Defualt is normally: ${QueueInteractionPrettyName[DEFAULT_MAPPING.find((defaultMapping) => defaultMapping.buttonIndex === mapping.buttonIndex)?.queueInteraction]}`
			);
		});
	}

	await plugin.storage.setSynced('controllerMapping', controllerMapping);
}
