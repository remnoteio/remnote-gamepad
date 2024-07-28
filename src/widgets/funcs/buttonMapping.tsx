import { QueueInteractionScore, RNPlugin } from '@remnote/plugin-sdk';
import { LogType, logMessage } from './logging';

// Enum for Queue Interactions
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

export const QueueInteractionPrettyName: Record<QueueInteraction, string> = {
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

// Enum for Button Groups
export enum ButtonGroup {
	triggerBumper = 'trigger/bumper',
	dPad = 'd-pad',
	faceButton = 'face button',
}

export interface ButtonMapping {
	buttonIndex: number;
	queueInteraction: QueueInteraction;
	buttonGroup: ButtonGroup;
	buttonLabel: string;
}

export type ControllerMapping = ButtonMapping[];

// Default Mapping
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

// Logging Function
function logMappingChange(
	plugin: RNPlugin,
	buttonLabel: string,
	newQueueInteraction: QueueInteraction,
	oldQueueInteraction: QueueInteraction
) {
	logMessage(
		plugin,
		`Button mapping for ${buttonLabel} has been changed to ${QueueInteractionPrettyName[newQueueInteraction]}`,
		LogType.Info,
		false,
		`| Default was: ${QueueInteractionPrettyName[oldQueueInteraction]}`
	);
}

// Write Settings to Synced Mapping
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

		// Ensuring queueInteractionParsed is of type QueueInteraction
		let queueInteractionParsed: QueueInteraction;
		if (typeof queueInteraction === 'string' && !isNaN(Number(queueInteraction))) {
			queueInteractionParsed = Number(queueInteraction) as QueueInteraction;
		} else {
			queueInteractionParsed = queueInteraction as QueueInteraction;
		}

		controllerMapping.push({
			buttonIndex: button.buttonIndex,
			queueInteraction: queueInteractionParsed,
			buttonGroup: button.buttonGroup,
			buttonLabel: button.buttonLabel,
		});
	}

	const changedMappings = controllerMapping.filter(
		(mapping) =>
			DEFAULT_MAPPING.find((defaultMapping) => defaultMapping.buttonIndex === mapping.buttonIndex)
				?.queueInteraction !== mapping.queueInteraction
	);

	changedMappings.forEach((mapping) => {
		const defaultMapping = DEFAULT_MAPPING.find(
			(defaultMapping) => defaultMapping.buttonIndex === mapping.buttonIndex
		);
		if (defaultMapping) {
			logMappingChange(
				plugin,
				mapping.buttonLabel,
				mapping.queueInteraction,
				defaultMapping.queueInteraction
			);
		}
	});

	await plugin.storage.setSynced('controllerMapping', controllerMapping);
}
