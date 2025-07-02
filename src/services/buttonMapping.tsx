import { QueueInteractionScore, RNPlugin } from '@remnote/plugin-sdk';
import { LogType, logMessage } from './loggingService';
import { DEFAULT_MAPPING } from '../config/defaultMappings';

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
		LogType.Info,
		false,
		`Button mapping for ${buttonLabel} has been changed to ${QueueInteractionPrettyName[newQueueInteraction]}`,
		`| Default was: ${QueueInteractionPrettyName[oldQueueInteraction]}`
	);
}

// Delete or Swap Button Mapping for a Button (pass in the button we want to swap and the new interaction)
// the function will delete the old mapping for the button and add the new mapping, and if we are asked to swap, it will swap the old mapping's interaction with the new one
export async function deleteOrSwapButtonMapping(
	plugin: RNPlugin,
	buttonIndex: number,
	newQueueInteraction: QueueInteraction,
	swap: boolean
) {
	const controllerMapping = (await plugin.storage.getSynced(
		'controllerMapping'
	)) as ControllerMapping;

	const oldMapping = controllerMapping.find((mapping) => mapping.buttonIndex === buttonIndex);

	if (!oldMapping) {
		logMessage(
			plugin,
			LogType.Warning,
			false,
			`Button mapping for button index ${buttonIndex} does not exist. Adding new mapping.`
		);
		controllerMapping.push({
			buttonIndex,
			queueInteraction: newQueueInteraction,
			buttonGroup: DEFAULT_MAPPING.find((mapping) => mapping.buttonIndex === buttonIndex)
				?.buttonGroup!,
			buttonLabel: DEFAULT_MAPPING.find((mapping) => mapping.buttonIndex === buttonIndex)
				?.buttonLabel!,
		});
	} else {
		const oldQueueInteraction = oldMapping.queueInteraction;
		if (swap) {
			oldMapping.queueInteraction = newQueueInteraction;
			logMappingChange(plugin, oldMapping.buttonLabel, newQueueInteraction, oldQueueInteraction);
		} else {
			controllerMapping.splice(
				controllerMapping.findIndex((mapping) => mapping.buttonIndex === buttonIndex),
				1
			);
			controllerMapping.push({
				buttonIndex,
				queueInteraction: newQueueInteraction,
				buttonGroup: DEFAULT_MAPPING.find((mapping) => mapping.buttonIndex === buttonIndex)
					?.buttonGroup!,
				buttonLabel: DEFAULT_MAPPING.find((mapping) => mapping.buttonIndex === buttonIndex)
					?.buttonLabel!,
			});
		}
	}

	await plugin.storage.setSynced('controllerMapping', controllerMapping);
	plugin.messaging.broadcast({ type: 'controllerMappingUpdated' });
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
				LogType.Warning,
				false,
				`Button mapping for ${button.buttonLabel} is not set. Using default value.`
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
	plugin.messaging.broadcast({ type: 'controllerMappingUpdated' });
}
