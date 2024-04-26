import { useEffect, useRef, useState } from 'react';
import {
	AppEvents,
	QueueInteractionScore,
	renderWidget,
	useAPIEventListener,
	usePlugin,
} from '@remnote/plugin-sdk';
import {
	QueueInteraction,
	buttonToAction,
	getButtonAction,
	getButtonGroup,
} from './funcs/buttonMapping';

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

	useAPIEventListener(AppEvents.QueueLoadCard, undefined, async (e) => {
		setTimeout(async () => {
			const lookback = await plugin.queue.inLookbackMode();
			setIsLookback(lookback || false);
		}, 100);
	});

	useEffect(() => {
		if (buttonIndex === -1) {
			return;
		}
		const tmp = getButtonAction(buttonIndex);
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

	// Handle button press event
	useEffect(() => {
		if (buttonPressed) {
			console.log('Button pressed:', buttonIndex);
			setButtonPressed(false);
			plugin.messaging.broadcast({ buttonGroup: getButtonGroup(buttonIndex) });
		}
	}, [buttonPressed]);

	// Helper function to check if answer has been revealed
	const hasRevealedAnswer = async () => {
		return await plugin.queue.hasRevealedAnswer();
	};

	// Handle button press event
	// handle button press and the answer is shown
	useEffect(() => {
		const handleButtonPress = async () => {
			if (buttonPressed && (await hasRevealedAnswer())) {
				const className = Number(buttonToAction[buttonIndex]);
				plugin.messaging.broadcast({ changeButtonCSS: className });
			}
		};
		handleButtonPress();
	}, [buttonPressed]);

	// Handle button release event
	useEffect(() => {
		if (buttonReleased) {
			console.log('Button released:', buttonIndex);
			setButtonReleased(false);
			// TODO: handle if we need to change the UI examples to something
		}
	}, [buttonReleased]);

	// Handle lookback mode
	useEffect(() => {
		if (buttonReleased && queueActionToTake === QueueInteraction.goBackToPreviousCard) {
			plugin.queue.goBackToPreviousCard();
		}
	}, [buttonReleased]);

	// Show answer
	useEffect(() => {
		const showAnswer = async () => {
			if (buttonReleased && !(await hasRevealedAnswer()) && !isLookback) {
				plugin.queue.showAnswer();
			}
		};
		showAnswer();
	}, [buttonReleased, isLookback]);

	// Rate current card
	useEffect(() => {
		const rateCard = async () => {
			if (buttonReleased && (await hasRevealedAnswer())) {
				plugin.messaging.broadcast({ changeButtonCSS: null });
				plugin.queue.rateCurrentCard(Number(buttonToAction[buttonIndex]));
			}
		};
		rateCard();
	}, [buttonReleased]);
	return <div></div>;
}

renderWidget(GamepadInput);
