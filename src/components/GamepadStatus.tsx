import { usePlugin } from '@remnote/plugin-sdk';
import React, { useState, useEffect } from 'react';
import useGamepadInput from '../hooks/useGamepadInput';

/**
 * TODO:
 * - Listen for gamepad connect/disconnect events
 * - Show connection name + status icon
 * - Display current connected gamepad information
 * - Show last button pressed with visual feedback
 * - Add connection troubleshooting assistance
 */
export default function GamepadStatus() {
	const plugin = usePlugin();

	return (
		<div className="gamepad-status p-2 border rounded">
			<h3 className="text-sm font-medium mb-1">Gamepad Status</h3>
			<div>Gamepad status display (TBD)</div>
		</div>
	);
}
