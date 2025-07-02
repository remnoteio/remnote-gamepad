import { useEffect, useState } from 'react';
import { AppEvents, usePlugin } from '@remnote/plugin-sdk';
import { ControllerMapping } from '../services/buttonMapping';
import { DEFAULT_MAPPING } from '../config/defaultMappings';
import { logMessage, LogType } from '../services/loggingService';
import GamepadInputManager, {
	GamepadEventPayload,
	GamepadInputEvent,
} from '../services/GamepadInputManager';

function useGamepadInput() {
	const plugin = usePlugin();
	const [buttonPressed, setButtonPressed] = useState(false);
	const [buttonIndex, setButtonIndex] = useState(-1);
	const [releasedButtonIndex, setReleasedButtonIndex] = useState(-1);
	const [buttonReleased, setButtonReleased] = useState(false);
	const [controllerMapping, setControllerMapping] = useState<ControllerMapping>(DEFAULT_MAPPING);

	// Fetch controller mapping from plugin storage
	useEffect(() => {
		const fetchControllerMapping = async () => {
			const mapping = (await plugin.storage.getSynced('controllerMapping')) as ControllerMapping;
			logMessage(plugin, LogType.Info, false, `Fetched controller mapping: `, mapping);
			setControllerMapping(mapping || DEFAULT_MAPPING);
		};
		fetchControllerMapping();

		// Listen for controller mapping updates
		plugin.event.addListener(AppEvents.MessageBroadcast, undefined, async (message) => {
			if (message.message.type === 'controllerMappingUpdated') {
				logMessage(plugin, LogType.Info, false, 'Received controller mapping update event');
				fetchControllerMapping();
			}
		});
	}, []);

	// Set up gamepad input listeners
	useEffect(() => {
		// Handler for button press events
		const handleButtonPressed = (payload: GamepadEventPayload) => {
			if (payload.buttonIndex !== undefined) {
				setButtonIndex(payload.buttonIndex);
				setButtonPressed(true);
			}
		};

		// Handler for button release events
		const handleButtonReleased = (payload: GamepadEventPayload) => {
			if (payload.buttonIndex !== undefined) {
				setReleasedButtonIndex(payload.buttonIndex);
				setButtonIndex(-1);
				setButtonReleased(true);
			}
		};

		// Register listeners
		const removeButtonPressedListener = GamepadInputManager.addListener(
			'buttonPressed',
			handleButtonPressed
		);
		const removeButtonReleasedListener = GamepadInputManager.addListener(
			'buttonReleased',
			handleButtonReleased
		);

		// Cleanup listeners on hook unmount
		return () => {
			removeButtonPressedListener();
			removeButtonReleasedListener();
		};
	}, [plugin]);

	return {
		buttonIndex,
		buttonPressed,
		buttonReleased,
		setButtonPressed,
		setButtonReleased,
		releasedButtonIndex,
		controllerMapping,
	};
}

export default useGamepadInput;
