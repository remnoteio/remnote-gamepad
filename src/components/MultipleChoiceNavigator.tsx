import { usePlugin } from '@remnote/plugin-sdk';
import React from 'react';
import useGamepadInput from '../hooks/useGamepadInput';

/**
 * TODO:
 * - Handle gamepad navigation for multiple choice questions
 * - Implement D-pad navigation between answer choices
 * - Add visual feedback for currently selected option
 * - Handle answer submission via gamepad button
 * - Support different multiple choice formats
 */
export default function MultipleChoiceNavigator() {
	const plugin = usePlugin();

	return (
		<div className="multiple-choice-navigator">
			<div>Multiple choice navigation component (TBD)</div>
		</div>
	);
}
