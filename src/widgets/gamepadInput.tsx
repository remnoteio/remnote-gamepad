import { useEffect, useRef, useState } from 'react';
import {
	AppEvents,
	QueueInteractionScore,
	RNPlugin,
	renderWidget,
	useAPIEventListener,
	usePlugin,
} from '@remnote/plugin-sdk';
import { ControllerMapping, DEFAULT_MAPPING, QueueInteraction } from './funcs/buttonMapping';
import { LogType, logMessage } from './funcs/logging';
import { checkNonCardSlide } from './funcs/checkNonCardSlide';

function GamepadInput() {
	const gamepadIndex = useRef(-1);
	const [buttonReleased, setButtonReleased] = useState(false);
	const [buttonPressed, setButtonPressed] = useState(false);
	const [buttonIndex, setButtonIndex] = useState(-1);
	const [queueActionToTake, setQueueActionToTake] = useState<QueueInteraction | undefined>(
		undefined
	);
	const prevButtonStates = useRef<Array<boolean>>([]);
	const [isLookback, setIsLookback] = useState(false);
	const plugin = usePlugin();
	const [controllerMapping, setControllerMapping] = useState<ControllerMapping>(DEFAULT_MAPPING);
	const [isNonCardSlide, setIsCardSlide] = useState(false);

	useEffect(() => {
		const fetchControllerMapping = async () => {
			const mapping = (await plugin.storage.getSynced('controllerMapping')) as ControllerMapping;
			logMessage(plugin, `Fetched controller mapping: `, LogType.Info, false, mapping);
			setControllerMapping(mapping || DEFAULT_MAPPING);
		};
		fetchControllerMapping();
	}, []);
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
						setButtonIndex(index);
						setButtonReleased(true);
					}
					prevButtonStates.current[index] = button.pressed;
				});
			}
		}, 1);

		return () => clearInterval(interval);
	};

	const fetchCardSlide = async () => {
		const cardSlide = await plugin.queue.getCurrentQueueScreenType();
		if (cardSlide === undefined) {
			return;
		}
		setIsCardSlide(checkNonCardSlide(cardSlide!));
	};

	const fetchLookback = async () => {
		const lookback = await plugin.queue.inLookbackMode();
		setIsLookback(lookback || false);
	};

	useAPIEventListener(AppEvents.QueueLoadCard, undefined, async (e) => {
		fetchCardSlide();
		setTimeout(fetchLookback, 100);
	});

	useEffect(() => {
		fetchCardSlide();
		setTimeout(fetchLookback, 100);
	}, []); // Empty dependency array to run only on first mount

	useEffect(() => {
		logMessage(plugin, `Button index: ${buttonIndex}`, LogType.Info, false);

		if (buttonIndex === -1) {
			return;
		}
		const tmp = getButtonAction(buttonIndex, controllerMapping);
		if (tmp === undefined) {
			plugin.app.toast('⚠️ Unbound button. Please bind the button to an action in the settings.');
			return;
		}
		setQueueActionToTake(tmp);
	}, [buttonIndex]);

	useEffect(() => {
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
	}, []);

	// Helper function to check if answer has been revealed
	const hasRevealedAnswer = async () => {
		return await plugin.queue.hasRevealedAnswer();
	};

	// Handle button press event
	useEffect(() => {
		if (buttonPressed) {
			logMessage(plugin, `Button pressed: ${buttonIndex}`, LogType.Info, false);
			setButtonPressed(false);
			plugin.messaging.broadcast({ buttonGroup: getButtonGroup(buttonIndex, controllerMapping) });
		}
	}, [buttonPressed]);
	// handle button press and the answer is shown
	useEffect(() => {
		const handleButtonPress = async () => {
			if (buttonPressed && (await hasRevealedAnswer())) {
				const className = getActionFromButton(buttonIndex, controllerMapping);
				plugin.messaging.broadcast({ changeButtonCSS: className });
			}
		};
		handleButtonPress();
	}, [buttonPressed]);

	// Handle button release event
	useEffect(() => {
		if (buttonReleased) {
			logMessage(plugin, `Button released: ${buttonIndex}`, LogType.Info, false);
			setButtonReleased(false);
		}
	}, [buttonReleased]);

	// Show answer
	useEffect(() => {
		const showAnswer = async () => {
			if (buttonReleased && !(await hasRevealedAnswer()) && !isLookback && !isNonCardSlide) {
				plugin.queue.showAnswer();
			}
		};
		showAnswer();
	}, [buttonReleased, isLookback, isNonCardSlide]);

	// Rate current card
	useEffect(() => {
		if (buttonReleased && queueActionToTake === QueueInteraction.goBackToPreviousCard) {
			plugin.queue.goBackToPreviousCard();
			return;
		}
		const rateCard = async () => {
			if (buttonReleased && ((await hasRevealedAnswer()) || isNonCardSlide)) {
				logMessage(
					plugin,
					`Rating card as ${getActionFromButton(buttonIndex, controllerMapping)}`,
					LogType.Info,
					false
				);
				plugin.queue.rateCurrentCard(getActionFromButton(buttonIndex, controllerMapping));
			}
		};
		plugin.messaging.broadcast({ changeButtonCSS: null });
		rateCard();
	}, [buttonReleased, isNonCardSlide]);
	return <div></div>;
}

renderWidget(GamepadInput);

function getButtonAction(buttonIndex: number, controllerMapping: ControllerMapping) {
	return controllerMapping.find((mapping) => mapping.buttonIndex === buttonIndex)?.queueInteraction;
}

function getButtonGroup(buttonIndex: number, controllerMapping: ControllerMapping) {
	return controllerMapping.find((mapping) => mapping.buttonIndex === buttonIndex)?.buttonGroup;
}

function getActionFromButton(buttonIndex: number, controllerMapping: ControllerMapping): any {
	return controllerMapping.find((mapping) => mapping.buttonIndex === buttonIndex)?.queueInteraction;
}
