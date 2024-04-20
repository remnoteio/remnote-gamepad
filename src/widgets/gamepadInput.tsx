import { useEffect, useRef, useState } from 'react';
import {
	AppEvents,
	PageType,
	RNPlugin,
	WidgetLocation,
	renderWidget,
	useAPIEventListener,
	usePlugin,
	useRunAsync,
	useTracker,
} from '@remnote/plugin-sdk';
import React from 'react';
import { buttonToScoreMapping } from '.';
// import './../App.css';

function GamepadInput() {
	console.log('rendered');
	const gamepadIndex = useRef(-1);
	const [buttonReleased, setButtonReleased] = useState(false);
	const [buttonIndex, setButtonIndex] = useState(-1);
	const prevButtonStates = useRef<Array<boolean>>([]);
	const [showedAnswer, setShowedAnswer] = useState(false);
	const plugin = usePlugin();

	const [cardId, setCardId] = React.useState<string | null>(null);
	useTracker(async () => {
		const ctx = await plugin.widget.getWidgetContext<WidgetLocation.QueueToolbar>();
		setCardId(ctx?.cardId || null);
	}, []);

	useAPIEventListener(AppEvents.QueueCompleteCard, undefined, async (e) => {
		setTimeout(async () => {
			const ctx = await plugin.widget.getWidgetContext<WidgetLocation.QueueToolbar>();
			setCardId(ctx?.cardId || null);
		}, 100);
	});

	useEffect(() => {
		const handleGamepadConnected = (event: { gamepad: { index: number } }) => {
			console.log('Gamepad connected:', event.gamepad.index);
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

	const startGamepadInputListener = () => {
		const interval = setInterval(() => {
			const gamepads = navigator.getGamepads();
			const gamepad = gamepads[gamepadIndex.current];
			if (gamepad) {
				gamepad.buttons.forEach((button, index) => {
					// If the button is not pressed and the previous state was pressed
					if (!button.pressed && prevButtonStates.current[index]) {
						setButtonIndex(index);
						setButtonReleased(true);
					}
					// Update the previous button state
					prevButtonStates.current[index] = button.pressed;
				});
			}
		}, 1);

		return () => clearInterval(interval);
	};

	// use effect to listen for when the button is released
	useEffect(() => {
		if (buttonReleased) {
			console.log('Button released:', buttonIndex);
			setButtonReleased(false);
			// TODO: handle if we need to change the UI examples to something
			// TODO: IDEA: Since the user can't directly see what they press, let's do a cool, space like flash around the border of the screen representing the color of the button they pressed.
			if (!showedAnswer) {
				console.log('showing answer');
				setShowedAnswer(true);
				plugin.queue.showAnswer();
				return;
			}
			if (showedAnswer) {
				console.log('rating card', buttonToScoreMapping[buttonIndex]);
				setShowedAnswer(false);
				plugin.queue.rateCurrentCard(buttonToScoreMapping[buttonIndex]);
			}
		}
	}, [buttonReleased, buttonIndex]);

	return (
		<div>
			<br />
			Life can be like that sometimes, but you'll get through it.
			<br />
			Sometimes you just need to take a break and come back to it later.
			<br />
			Or maybe you need to take a break and never come back to it.
			<br />
			But you'll figure it out.
			<br />
			You always do.
			<br />
			And if you don't, that's okay too.
			<br />
			You're doing your best, and that's enough.
			<br />
			You're enough.
			<br />
			Think big.
		</div>
	);
}
renderWidget(GamepadInput);
