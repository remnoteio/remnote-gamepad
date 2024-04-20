import {
	AppEvents,
	declareIndexPlugin,
	QueueInteractionScore,
	ReactRNPlugin,
	RNPlugin,
	WidgetLocation,
} from '@remnote/plugin-sdk';
type ButtonMapping = Record<QueueInteractionScore | string, number[]>;

const buttonMapping: ButtonMapping = {
	[QueueInteractionScore.AGAIN]: [3, 12, 6],
	[QueueInteractionScore.EASY]: [0, 13, 7],
	[QueueInteractionScore.GOOD]: [1, 15, 5],
	[QueueInteractionScore.HARD]: [2, 14, 4],
	[QueueInteractionScore.TOO_EARLY]: [9],
	[QueueInteractionScore.VIEWED_AS_LEECH]: [],
	[QueueInteractionScore.RESET]: [],
	'Open Queue': [8],
};

const buttonLabels = {
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
	// '8': 'Start Button',
};

type ButtonToScoreMapping = Record<number, QueueInteractionScore>;

export const buttonToScoreMapping: ButtonToScoreMapping = {};

for (const [score, indices] of Object.entries(buttonMapping)) {
	for (const index of indices) {
		buttonToScoreMapping[index] = score as unknown as QueueInteractionScore;
	}
}
const dryButtonMapping: ButtonToScoreMapping = buttonToScoreMapping;

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

function changeButtonMapping(
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

function toTitleCase(str: string): string {
	return str
		.toLowerCase()
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

async function onActivate(plugin: ReactRNPlugin) {
	// settings

	await plugin.settings.registerBooleanSetting({
		id: 'debug-mode',
		title: 'Debug Mode',
		description: 'Enables certain testing commands. Non-destructive.',
		defaultValue: false,
	});

	for (const [buttonIndex, buttonLabel] of Object.entries(buttonLabels)) {
		// lookup what the buttonIndex is premapped to, and then use that to find the QueueInteractionScore.
		const rawScore = QueueInteractionScore[dryButtonMapping[parseInt(buttonIndex)]]; // NOTE THIS SKIPS 8
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
					label: 'Again',
				},
				{
					key: '1',
					value: QueueInteractionScore.EASY.toString(),
					label: 'Easy',
				},
				{
					key: '2',
					value: QueueInteractionScore.GOOD.toString(),
					label: 'Good',
				},
				{
					key: '3',
					value: QueueInteractionScore.HARD.toString(),
					label: 'Hard',
				},
				{
					key: '4',
					value: QueueInteractionScore.TOO_EARLY.toString(),
					label: 'Too Early',
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

	// commands
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
		// edit the button mappings IF the user changes them
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
		dimensions: { height: '0px', width: '0px' },
	});
}
async function isDebugMode(reactivePlugin: RNPlugin): Promise<boolean> {
	return await reactivePlugin.settings.getSetting('debug-mode');
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
