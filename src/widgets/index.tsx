import {
	AppEvents,
	declareIndexPlugin,
	QueueInteractionScore,
	ReactRNPlugin,
	RNPlugin,
	useOnMessageBroadcast,
	WidgetLocation,
} from '@remnote/plugin-sdk';
import {
	buttonToAction,
	buttonLabels,
	dryButtonMapping,
	getButtonsFromGroup,
	QueueInteraction,
	QueueInteractionPrettyName,
	ButtonGroup,
} from './funcs/buttonMapping';
import { changeButtonMapping } from './funcs/changeButtonMapping';
import { getResponseButtonUIforGCButtonPressed as getButtonClassName } from './funcs/getResponseButtonUIforGCButtonPressed';

export const QueueInteractionCSSClassName = {
	[QueueInteraction.answerCardAsAgain]: 'rn-queue-press-tooltip-forgot',
	[QueueInteraction.answerCardAsEasy]: 'rn-queue-press-tooltip-remembered',
	[QueueInteraction.answerCardAsGood]: 'rn-queue-press-tooltip-recalled-with-effort',
	[QueueInteraction.answerCardAsHard]: 'rn-queue-press-tooltip-partially-recalled',
	[QueueInteraction.answerCardAsTooEarly]: 'rn-queue-press-tooltip-skip',
};

async function onActivate(plugin: ReactRNPlugin) {
	await plugin.settings.registerBooleanSetting({
		id: 'debug-mode',
		title: 'Debug Mode',
		description: 'Enables certain testing commands. Non-destructive.',
		defaultValue: false,
	});

	for (const [buttonIndex, buttonLabel] of Object.entries(buttonLabels)) {
		const rawScore = QueueInteraction[dryButtonMapping[parseInt(buttonIndex)]];
		const score = rawScore ? rawScore.toLowerCase() : undefined;
		if (!score) {
			continue;
		}
		const queueInteractionScore = QueueInteraction[rawScore as keyof typeof QueueInteraction];

		// Generate options for the dropdown
		const options = Object.keys(QueueInteraction)
			.filter((key) => isNaN(Number(key))) // filter out numeric keys
			.map((key, index) => {
				return {
					key: index.toString(),
					value: QueueInteraction[key as keyof typeof QueueInteraction].toString(),
					label: QueueInteractionPrettyName[QueueInteraction[key as keyof typeof QueueInteraction]],
				};
			});

		await plugin.settings.registerDropdownSetting({
			id: `button-mapping-${buttonLabel}`,
			title: `Button Mapping for ${buttonLabel}`,
			defaultValue: queueInteractionScore.toString(),
			description: `Change the response for the ${buttonLabel}.`,
			options: options,
		});
	}

	plugin.track(async (reactivePlugin) => {
		await isDebugMode(reactivePlugin).then(async (debugMode) => {
			if (debugMode) {
				plugin.app.toast('Debug Mode Enabled; Registering Debug Tools');
				await plugin.app.registerCommand({
					id: 'log-values',
					name: 'Log Values',
					description: 'Log the values of certain variables',
					quickCode: 'debug log',
					action: async () => {
						// log values
					},
				});
			}
		});
		// This edits the button mapping settings - if the user modified them.
		for (const [buttonIndex, buttonLabel] of Object.entries(buttonLabels)) {
			const buttonMappingSetting = `button-mapping-${buttonLabel}`;
			const oldScore = buttonToAction[parseInt(buttonIndex)];
			const newScore = await plugin.settings.getSetting(buttonMappingSetting);
			if (oldScore !== newScore) {
				changeButtonMapping(oldScore, newScore as QueueInteraction, parseInt(buttonIndex));
			}
		}
	});

	await plugin.app.registerWidget('gamepadInput', WidgetLocation.QueueToolbar, {
		// @ts-ignore
		dimensions: { height: '0px', width: '0px' },
	});

	plugin.event.addListener(AppEvents.MessageBroadcast, undefined, async (message) => {
		if (message.message.changeButtonCSS === undefined || message.message.changeButtonCSS === null) {
			await plugin.app.registerCSS('hoverButton', '');
		}

		if (message.message.buttonGroup) {
			const oldGroup = await plugin.storage.getSession('buttonGroup');
			if (oldGroup === message.message.buttonGroup) {
				return;
			}
			await plugin.storage.setSession('buttonGroup', message.message.buttonGroup);
			// Get the CSS pattern for the current button group
			const buttonGroup = message.message.buttonGroup as ButtonGroup;

			// we're going to return the css pattern for all the response buttons.
			// the css will be populated with the mapping information we will get
			// (to find the css class, use the QueueInteractionCSSClassName object)
			// in the css class we find, do ::after { content: " ${buttonLabel}"; } (but show all the possible labels)

			let cssPattern = '';
			const buttons = getButtonsFromGroup(buttonGroup);
			for (const button of buttons) {
				const buttonLabel = buttonLabels[button];
				const buttonAction = buttonToAction[button];
				const cssClass = QueueInteractionCSSClassName[buttonAction];
				cssPattern += `
					.${cssClass}::after {
						content: " | On your Gamepad: ${buttonLabel}";
					}
				`;
			}
			// manually add the user's bindings for the start and select buttons
			cssPattern += `
				[data-cy-label="Back"] .rn-text-paragraph-medium::after {
    content: " | On your Gamepad: Start Button";
}
				.${QueueInteractionCSSClassName[QueueInteraction.answerCardAsTooEarly]}::after {
					content: " | On your Gamepad: Select Button";
				}
			`;

			// Apply the CSS pattern
			if (cssPattern) {
				await plugin.app.registerCSS('buttonGroupCSS', cssPattern);
			}
		}

		if (message.message.changeButtonCSS !== undefined && message.message.changeButtonCSS !== null) {
			const changeButtonCSS = Number(message.message.changeButtonCSS);
			await plugin.app.registerCSS('hoverButton', '');
			await plugin.app.registerCSS(
				'hoverButton',
				`.${getButtonClassName(changeButtonCSS)} { background: var(--rn-clr-background--hovered) !important;}`
			);
		}
	});
}
async function isDebugMode(reactivePlugin: RNPlugin): Promise<boolean> {
	return await reactivePlugin.settings.getSetting('debug-mode');
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
