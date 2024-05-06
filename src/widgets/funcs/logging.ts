import { RNPlugin, ReactRNPlugin } from '@remnote/plugin-sdk';

// Define the log types enum
export enum LogType {
	Debug = 'Debug',
	Info = 'Info',
	Warning = 'Warning',
	Error = 'Error',
	Success = 'Success',
	Fatal = 'Fatal',
	Critical = 'Critical',
}

// Define a type for the log type with emoji
type LogTypeInfo = {
	[key in LogType]: { name: key; emoji: string };
};

// Define the log type to emoji mapping
const logTypeToEmoji: LogTypeInfo = {
	Debug: { name: LogType.Debug, emoji: '🐞' },
	Info: { name: LogType.Info, emoji: 'ℹ️' },
	Warning: { name: LogType.Warning, emoji: '⚠️' },
	Error: { name: LogType.Error, emoji: '❌' },
	Success: { name: LogType.Success, emoji: '✅' },
	Fatal: { name: LogType.Fatal, emoji: '💀' },
	Critical: { name: LogType.Critical, emoji: '🚨' },
};

/**
 * Logs a message with the specified type and emits it to the console.
 * If isToast is true, it also displays the message as a toast.
 *
 * @param plugin - The ReactRNPlugin or RNPlugin instance.
 * @param message - The message to be logged.
 * @param type - The type of the log message.
 * @param isToast - Indicates whether to display the message as a toast. Default is false.
 * @param params - Optional parameters.
 */
export async function logMessage(
	plugin: ReactRNPlugin | RNPlugin,
	message: any[] | string,
	type: LogType,
	isToast: boolean,
	params?: any
) {
	const debugMode = await plugin.settings.getSetting('debug-mode');
	if (debugMode) {
		const baseplateIdentifier = `${logTypeToEmoji[type].emoji}+🎮`;
		const consoleEmitType = type.toLowerCase() as 'warn' | 'info' | 'error' | 'log';
		switch (consoleEmitType) {
			case 'warn':
				console.warn(baseplateIdentifier, message, params);
				break;
			case 'info':
				console.info(baseplateIdentifier, message, params);
				break;
			case 'error':
				console.error(baseplateIdentifier, message, params);
				break;
			default:
				console.log(baseplateIdentifier, message, params);
				break;
		}
	}
	if (isToast) {
		await plugin.app.toast(`${logTypeToEmoji[type].emoji} ${message}`);
	}
}
