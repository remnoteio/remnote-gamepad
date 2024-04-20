import {
	AppEvents,
	declareIndexPlugin,
	QueueInteractionScore,
	ReactRNPlugin,
	RNPlugin,
	WidgetLocation,
} from '@remnote/plugin-sdk';
import { buttonToScoreMapping, buttonLabels, dryButtonMapping } from './funcs/buttonMapping';
import { changeButtonMapping } from './funcs/changeButtonMapping';

async function onActivate(plugin: ReactRNPlugin) {
	await plugin.settings.registerBooleanSetting({
		id: 'debug-mode',
		title: 'Debug Mode',
		description: 'Enables certain testing commands. Non-destructive.',
		defaultValue: false,
	});

	for (const [buttonIndex, buttonLabel] of Object.entries(buttonLabels)) {
		const rawScore = QueueInteractionScore[dryButtonMapping[parseInt(buttonIndex)]];
		const score = rawScore ? rawScore.toLowerCase() : undefined;
		if (!score) {
			continue;
		}
		const queueInteractionScore =
			QueueInteractionScore[rawScore as keyof typeof QueueInteractionScore];
		await plugin.settings.registerDropdownSetting({
			id: `button-mapping-${buttonLabel}`,
			title: `Button Mapping for ${buttonLabel}`,
			defaultValue: queueInteractionScore.toString(),
			description: `Change the response for the ${buttonLabel}.`,
			options: [
				{
					key: '0',
					value: QueueInteractionScore.AGAIN.toString(),
					label: 'Forgot',
				},
				{
					key: '1',
					value: QueueInteractionScore.EASY.toString(),
					label: 'Easily Recalled',
				},
				{
					key: '2',
					value: QueueInteractionScore.GOOD.toString(),
					label: 'Recalled with Effort',
				},
				{
					key: '3',
					value: QueueInteractionScore.HARD.toString(),
					label: 'Partially Recalled',
				},
				{
					key: '4',
					value: QueueInteractionScore.TOO_EARLY.toString(),
					label: 'Skip',
				},
				{
					key: '5',
					value: QueueInteractionScore.VIEWED_AS_LEECH.toString(),
					label: 'Viewed as Leech',
				},
				{
					key: '6',
					value: QueueInteractionScore.RESET.toString(),
					label: 'Reset',
				},
			],
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
			const oldScore = buttonToScoreMapping[parseInt(buttonIndex)];
			const newScore = Number(await plugin.settings.getSetting(buttonMappingSetting));
			if (oldScore !== newScore) {
				changeButtonMapping(oldScore, newScore as QueueInteractionScore, parseInt(buttonIndex));
			}
		}
	});

	await plugin.app.registerWidget('gamepadInput', WidgetLocation.QueueToolbar, {
		// @ts-ignore
		dimensions: { height: '0px', width: '0px' },
	});
}
async function isDebugMode(reactivePlugin: RNPlugin): Promise<boolean> {
	return await reactivePlugin.settings.getSetting('debug-mode');
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
