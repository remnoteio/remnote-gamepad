import { logMessage, LogType } from './loggingService';

// Define our own event type that doesn't conflict with the browser's GamepadEvent
export type GamepadInputEvent = 'buttonPressed' | 'buttonReleased' | 'thumbstickMoved';

export interface GamepadEventPayload {
	buttonIndex?: number;
	axisValues?: { x: number; y: number };
}

type Listener = (payload: GamepadEventPayload) => void;

class GamepadInputManager {
	private listeners: Record<GamepadInputEvent, Listener[]> = {
		buttonPressed: [],
		buttonReleased: [],
		thumbstickMoved: [],
	};
	private gamepadIndex: number = -1;
	private prevButtonStates: boolean[] = [];
	private intervalId: number | null = null;
	private axisThreshold: number = 0.5;

	constructor() {
		this.setupGamepadConnection();
	}

	public addListener(event: GamepadInputEvent, callback: Listener) {
		this.listeners[event].push(callback);
		return () => this.removeListener(event, callback);
	}

	public removeListener(event: GamepadInputEvent, callback: Listener) {
		const index = this.listeners[event].indexOf(callback);
		if (index !== -1) {
			this.listeners[event].splice(index, 1);
		}
	}

	private setupGamepadConnection() {
		window.addEventListener('gamepadconnected', this.handleGamepadConnected);
		window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
	}

	private handleGamepadConnected = (event: GamepadEvent) => {
		if (event.gamepad.mapping !== 'standard') {
			console.warn('Gamepad mapping is not standard. Please use a standard mapping.');
		}
		this.gamepadIndex = event.gamepad.index;
		this.startPolling();

		// Log without using the plugin instance
		console.info(`Gamepad connected: ${event.gamepad.id}`);
	};

	private handleGamepadDisconnected = (event: GamepadEvent) => {
		if (event.gamepad.index === this.gamepadIndex) {
			this.stopPolling();
			this.gamepadIndex = -1;

			// Log without using the plugin instance
			console.info('Gamepad disconnected');
		}
	};

	private startPolling() {
		if (this.intervalId !== null) return;

		this.intervalId = window.setInterval(() => {
			const gamepads = navigator.getGamepads();
			const gamepad = gamepads[this.gamepadIndex];

			if (!gamepad) return;

			// Process buttons
			gamepad.buttons.forEach((button, index) => {
				// Button press detection
				if (button.pressed && !this.prevButtonStates[index]) {
					this.listeners.buttonPressed.forEach((listener) => listener({ buttonIndex: index }));
				}
				// Button release detection
				else if (!button.pressed && this.prevButtonStates[index]) {
					this.listeners.buttonReleased.forEach((listener) => listener({ buttonIndex: index }));
				}

				// Update previous state
				this.prevButtonStates[index] = button.pressed;
			});

			// Process axes for thumbstick movement
			if (gamepad.axes.length >= 4) {
				const leftStick = { x: gamepad.axes[0], y: gamepad.axes[1] };
				const rightStick = { x: gamepad.axes[2], y: gamepad.axes[3] };

				// Only emit if movement is beyond threshold
				if (
					Math.abs(leftStick.x) > this.axisThreshold ||
					Math.abs(leftStick.y) > this.axisThreshold
				) {
					this.listeners.thumbstickMoved.forEach((listener) => listener({ axisValues: leftStick }));
				}

				if (
					Math.abs(rightStick.x) > this.axisThreshold ||
					Math.abs(rightStick.y) > this.axisThreshold
				) {
					this.listeners.thumbstickMoved.forEach((listener) =>
						listener({ axisValues: rightStick })
					);
				}
			}
		}, 20); // 20ms polling interval
	}

	private stopPolling() {
		if (this.intervalId !== null) {
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	public cleanup() {
		this.stopPolling();
		window.removeEventListener('gamepadconnected', this.handleGamepadConnected);
		window.removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
	}
}

// Export a singleton instance
export default new GamepadInputManager();
