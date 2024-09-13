import { renderWidget, usePlugin } from '@remnote/plugin-sdk';
import { useState, useEffect } from 'react';
import {
	ControllerMapping,
	DEFAULT_MAPPING,
	deleteOrSwapButtonMapping,
	QueueInteraction,
	QueueInteractionPrettyName,
} from './funcs/buttonMapping';
import { logMessage, LogType } from './funcs/logging';
import { mapQueueInteractionToEmoji } from './funcs/getResponseButtonUIforGCButtonPressed';
import useGamepadInput from './funcs/gamePadInput';

function GamePadSettingsUI() {
	const plugin = usePlugin();
	// State to hold the current mappings
	const [mappings, setMappings] = useState<ControllerMapping>([]);
	const [feedback, setFeedback] = useState<string | null>(null);
	const { buttonIndex, buttonPressed, buttonReleased, setButtonPressed, setButtonReleased } =
		useGamepadInput();
	const [waitingButton, setWaitingButton] = useState<QueueInteraction | null>(null);

	// Load mappings from plugin storage or use default mappings
	useEffect(() => {
		async function loadMappings() {
			const storedMappings = await plugin.storage.getSynced('controllerMapping');
			setMappings(Array.isArray(storedMappings) ? storedMappings : DEFAULT_MAPPING);
		}
		loadMappings();
	}, [waitingButton, plugin]);

	// Add the handler function for button clicks
	const handleQueueInteractionClick = (interaction: QueueInteraction) => {
		setWaitingButton(interaction);
		logMessage(plugin, LogType.Info, false, 'Action to be configured:', interaction);
	};

	useEffect(() => {
		async function handleButtonMapping() {
			if (buttonIndex === -1 || waitingButton === null) {
				return;
			}

			logMessage(plugin, LogType.Info, false, 'Chosen Button:', buttonIndex);

			await deleteOrSwapButtonMapping(plugin, buttonIndex, waitingButton, false);

			setWaitingButton(null);
		}

		handleButtonMapping();
	}, [buttonIndex, waitingButton]);

	return (
		<div className="mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">
				Button Mapping Editor (Beta - Please leave feedback on GitHub!)
			</h1>
			<p className="mb-6">Customize your gamepad button mappings for various interactions.</p>

			{feedback && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{feedback}</div>}

			<div className="space-y-4">
				<div className="flex flex-wrap gap-4">
					{Object.entries(QueueInteractionPrettyName).map(([key, value]) => (
						<button
							key={key}
							className={`rn-queue__answer-btn rn-queue__answer-btn--${key.toLowerCase()} relative accuracy-button grow active:bg-gray-10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:bg-gray-5 border border-solid rounded dark:bg-transparent `}
							onClick={() => {
								handleQueueInteractionClick(convertKeyToQueueInteraction(key));
							}}
							data-delay-show="750"
						>
							<div className="hover-active:rn-clr-background--hovered w-full h-full flex flex-col items-center justify-center gap-2 text-center p-2 box-border">
								<div className="accuracy-button__icon justify-self-start text-3xl">
									{mapQueueInteractionToEmoji(convertKeyToQueueInteraction(key))}
								</div>
								<div className="accuracy-button__label md:text-sm lg:text-base sm:inline hidden text-xs">
									{value}
								</div>
								<div className="accuracy-button__interval text-xs p-0.5 px-1 border border-solid border-gray-15 dark:border-gray-20 rounded">
									<span className="">
										<div className="flex items-center gap-1">
											{/* Display the current icons of the controller buttons that are bound to this action */}
											{mappings
												.filter(
													(mapping) =>
														mapping.queueInteraction ===
														(convertKeyToQueueInteraction(key) as QueueInteraction)
												)
												.map((mapping) => (
													<span key={mapping.buttonLabel} className="text-xs">
														{mapping.buttonLabel},
													</span>
												))}
										</div>
									</span>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

renderWidget(GamePadSettingsUI);
export function convertKeyToQueueInteraction(key: string): QueueInteraction {
	return isNaN(Number(key)) ? (key as QueueInteraction) : (Number(key) as QueueInteraction);
}
