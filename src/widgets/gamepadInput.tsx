import { useEffect, useRef, useState } from 'react';
import {
	AppEvents,
	QueueInteractionScore,
	renderWidget,
	useAPIEventListener,
	usePlugin,
} from '@remnote/plugin-sdk';
import { buttonToScoreMapping, getButtonGroup } from './funcs/buttonMapping';

function GamepadInput() {
	// TODO: sometimes, the user can click for us, show the answer for us, but still use the gamepad to rate the card. we need to handle this case
	const gamepadIndex = useRef(-1);
	const [buttonReleased, setButtonReleased] = useState(false);
	const [buttonPressed, setButtonPressed] = useState(false);
	const [buttonIndex, setButtonIndex] = useState(-1);
	const prevButtonStates = useRef<Array<boolean>>([]);
	const [showedAnswer, setShowedAnswer] = useState(false);
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
		const handleGamepadConnected = (event: {
			gamepad: {
				mapping: string;
				index: number;
			};
		}) => {
			if (event.gamepad.mapping !== 'standard') {
				console.warn('Gamepad mapping is not standard. Please use a standard mapping.'); //TODO: SUPPORT NON-STANDARD MAPPINGS
			}
			gamepadIndex.current = event.gamepad.index;
			startGamepadInputListener();
			// TODO: set up UI examples
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

	// handle button press and the answer is shown
	useEffect(() => {
		if (buttonPressed && showedAnswer) {
			const className = Number(buttonToScoreMapping[buttonIndex]);
			plugin.messaging.broadcast({ changeButtonCSS: className });
		}
	}, [buttonPressed, showedAnswer]);

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
		if (buttonReleased && buttonIndex === 9) {
			// TODO: here, we handle lookback mode
		}
	}, [buttonReleased]);

	// Show answer
	useEffect(() => {
		if (buttonReleased && !showedAnswer && !isLookback) {
			setShowedAnswer(true);
			plugin.queue.showAnswer();
		}
	}, [buttonReleased, showedAnswer, isLookback]);

	useEffect(() => {
		if (buttonReleased && showedAnswer) {
			plugin.messaging.broadcast({ changeButtonCSS: null });
			setShowedAnswer(false);
			plugin.queue.rateCurrentCard(Number(buttonToScoreMapping[buttonIndex]));
		}
	}, [buttonReleased, showedAnswer]);

	return <div></div>;
}

renderWidget(GamepadInput);
