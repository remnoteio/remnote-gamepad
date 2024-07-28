import { ReactRNPlugin, renderWidget, usePlugin } from '@remnote/plugin-sdk';
import { useState, useEffect } from 'react';
import {
	ControllerMapping,
	DEFAULT_MAPPING,
	QueueInteraction,
	QueueInteractionPrettyName,
} from './funcs/buttonMapping';
import { logMessage, LogType } from './funcs/logging';

function GamePadSettingsUI() {
	const plugin = usePlugin();
	// State to hold the current mappings
	const [mappings, setMappings] = useState<ControllerMapping>([]);
	const [feedback, setFeedback] = useState<string | null>(null);

	// Load mappings from plugin storage or use default mappings
	useEffect(() => {
		async function loadMappings() {
			const storedMappings = await plugin.storage.getSynced('controllerMapping');
			setMappings(Array.isArray(storedMappings) ? storedMappings : DEFAULT_MAPPING);
		}
		loadMappings();
	}, [plugin]);

	// Handle change in dropdown selection
	const handleMappingChange = (buttonLabel: string, newInteraction: QueueInteraction) => {
		setMappings((prevMappings) =>
			prevMappings.map((mapping) =>
				mapping.buttonLabel === buttonLabel
					? { ...mapping, queueInteraction: newInteraction }
					: mapping
			)
		);
	};

	// Save mappings to plugin storage
	const saveMappings = async () => {
		await plugin.storage.setSynced('controllerMapping', mappings);
		setFeedback('Mappings saved successfully.');
		logMessage(plugin, 'Mappings have been updated.', LogType.Info);
	};

	// Reset mappings to default values
	const resetMappings = () => {
		setMappings(DEFAULT_MAPPING);
		setFeedback('Mappings reset to default values.');
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Button Mapping Editor</h1>
			<p className="mb-6">Customize your gamepad button mappings for various interactions.</p>

			{feedback && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{feedback}</div>}

			<div className="space-y-4">
				{mappings.map((mapping) => (
					<div key={mapping.buttonLabel} className="flex items-center justify-between">
						<span className="font-semibold">{mapping.buttonLabel}</span>
						<select
							className="border border-gray-300 p-2 rounded"
							value={mapping.queueInteraction}
							onChange={(e) =>
								handleMappingChange(mapping.buttonLabel, e.target.value as QueueInteraction)
							}
						>
							{Object.entries(QueueInteractionPrettyName).map(([key, value]) => (
								<option key={key} value={key}>
									{value}
								</option>
							))}
						</select>
					</div>
				))}
			</div>

			<div className="mt-6 flex space-x-4">
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					onClick={saveMappings}
				>
					Save Mappings
				</button>
				<button
					className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
					onClick={resetMappings}
				>
					Reset to Defaults
				</button>
			</div>
		</div>
	);
}

renderWidget(GamePadSettingsUI);
