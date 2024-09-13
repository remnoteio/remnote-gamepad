import { useEffect, useRef, useState } from 'react';
import { AppEvents, usePlugin } from '@remnote/plugin-sdk';
import { ControllerMapping, DEFAULT_MAPPING } from './buttonMapping';
import { logMessage, LogType } from './logging';

function useGamepadInput() {
	const plugin = usePlugin();
	const gamepadIndex = useRef(-1);
	const [buttonReleased, setButtonReleased] = useState(false);
	const [buttonPressed, setButtonPressed] = useState(false);
	const [buttonIndex, setButtonIndex] = useState(-1);
	const prevButtonStates = useRef<Array<boolean>>([]);
	const [releasedButtonIndex, setReleasedButtonIndex] = useState(-1);
	const [controllerMapping, setControllerMapping] = useState<ControllerMapping>(DEFAULT_MAPPING);

	useEffect(() => {
		const fetchControllerMapping = async () => {
			const mapping = (await plugin.storage.getSynced('controllerMapping')) as ControllerMapping;
			logMessage(plugin, LogType.Info, false, `Fetched controller mapping: `, mapping);
			setControllerMapping(mapping || DEFAULT_MAPPING);
		};
		fetchControllerMapping();

		plugin.event.addListener(AppEvents.MessageBroadcast, undefined, async (message) => {
			if (message.message.type === 'controllerMappingUpdated') {
				logMessage(plugin, LogType.Info, false, 'Received controller mapping update event');
				fetchControllerMapping();
			}
		});
	}, []);

	useEffect(() => {
		const startGamepadInputListener = () => {
			const interval = setInterval(() => {
				const gamepads = navigator.getGamepads();
				const gamepad = gamepads[gamepadIndex.current];
				if (gamepad) {
					gamepad.buttons.forEach((button, index) => {
						if (button.pressed && !prevButtonStates.current[index]) {
							setButtonIndex(index);
							setButtonPressed(true);
						} else if (!button.pressed && prevButtonStates.current[index]) {
							setReleasedButtonIndex(index);
							setButtonIndex(-1);
							setButtonReleased(true);
						}
						prevButtonStates.current[index] = button.pressed;
					});
				}
			}, 1);

			return () => clearInterval(interval);
		};

		const handleGamepadConnected = (event: {
			gamepad: {
				mapping: string;
				index: number;
			};
		}) => {
			if (event.gamepad.mapping !== 'standard') {
				plugin.app.toast('Gamepad mapping is not standard. Please use a standard mapping.');
			}
			gamepadIndex.current = event.gamepad.index;
			startGamepadInputListener();
		};

		window.addEventListener('gamepadconnected', handleGamepadConnected);

		return () => {
			window.removeEventListener('gamepadconnected', handleGamepadConnected);
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
