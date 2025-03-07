import {
	AppEvents,
	QueueInteractionScore,
	renderWidget,
	useAPIEventListener,
	usePlugin,
} from '@remnote/plugin-sdk';
import { ControllerMapping, DEFAULT_MAPPING, QueueInteraction } from './funcs/buttonMapping';
import { checkNonCardSlide } from './funcs/checkNonCardSlide';
import { logMessage, LogType } from './funcs/logging';
import { useEffect, useState } from 'react';
import useGamepadInput from './funcs/gamePadInput';

function GamepadInput() {
	const plugin = usePlugin();
	const {
		buttonIndex,
		buttonPressed,
		buttonReleased,
		setButtonPressed,
		setButtonReleased,
		releasedButtonIndex,
		controllerMapping,
	} = useGamepadInput();
	const [queueActionToTake, setQueueActionToTake] = useState<QueueInteraction | undefined>(
		undefined
	);
	const [isLookback, setIsLookback] = useState(false);
	const [isNonCardSlide, setIsCardSlide] = useState(false);
	const [isPracticeLaterPage, setIsPracticeLaterPage] = useState(false);
	const getSessionStatus = async () => {
		return await plugin.storage.getSession('settingsUiShown');
	};

	useEffect(() => {
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
		if (buttonPressed) {
			logMessage(plugin, LogType.Info, false, `Button pressed: ${buttonIndex}`);
			setButtonPressed(false);
			plugin.messaging.broadcast({ buttonGroup: getButtonGroup(buttonIndex, controllerMapping) });
		}
	}, [buttonPressed]);

	const fetchCardSlide = async () => {
		const cardSlide = await plugin.queue.getCurrentQueueScreenType();
		if (cardSlide === undefined) {
			return;
		}
		setIsCardSlide(checkNonCardSlide(cardSlide!));
		setIsPracticeLaterPage(cardSlide === 'PracticeLater');
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
	}, []);

	// Helper function to check if answer has been revealed
	const hasRevealedAnswer = async () => {
		return await plugin.queue.hasRevealedAnswer();
	};

	useEffect(() => {
		getSessionStatus().then((status) => {
			if (status) {
				return;
			}
		});
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
			logMessage(plugin, LogType.Info, false, `Button released: ${releasedButtonIndex}`);
			setButtonReleased(false);
		}
	}, [buttonReleased]);

	// Show answer
	useEffect(() => {
		getSessionStatus().then((status) => {
			if (status) {
				return;
			}
		});
		const showAnswer = async () => {
			if (buttonReleased && !(await hasRevealedAnswer()) && !isLookback && !isNonCardSlide && !isPracticeLaterPage) {
				plugin.queue.showAnswer();
			}
		};
		showAnswer();
	}, [buttonReleased, isLookback, isNonCardSlide, isPracticeLaterPage]);

	// Rate current card
	useEffect(() => {
		getSessionStatus().then((status) => {
			if (status) {
				return;
			}
		});
		if (buttonReleased && queueActionToTake === QueueInteraction.goBackToPreviousCard) {
			plugin.queue.goBackToPreviousCard();
			return;
		}
		const rateCard = async () => {
			if (buttonReleased && ((await hasRevealedAnswer()) || isNonCardSlide || isPracticeLaterPage)) {
				logMessage(
					plugin,
					LogType.Info,
					false,
					`Rating card as ${getActionFromButton(releasedButtonIndex, controllerMapping)}`
				);
				plugin.queue.rateCurrentCard(getActionFromButton(releasedButtonIndex, controllerMapping));
			}
		};
		plugin.messaging.broadcast({ changeButtonCSS: null });
		rateCard();
	}, [buttonReleased, isNonCardSlide, isPracticeLaterPage]);
	return <div></div>;
}

renderWidget(GamepadInput);

function getButtonAction(buttonIndex: number, controllerMapping: ControllerMapping) {
	return controllerMapping.find((mapping) => mapping.buttonIndex === buttonIndex)?.queueInteraction;
}

function getButtonGroup(buttonIndex: number, controllerMapping: ControllerMapping) {
	return controllerMapping.find((mapping) => mapping.buttonIndex === buttonIndex)?.buttonGroup;
}

export function getActionFromButton(
	buttonIndex: number,
	controllerMapping: ControllerMapping
): any {
	return controllerMapping.find((mapping) => mapping.buttonIndex === buttonIndex)?.queueInteraction;
}
