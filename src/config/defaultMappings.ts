import { ControllerMapping, QueueInteraction, ButtonGroup } from '../services/buttonMapping';

// Default Mapping

export const DEFAULT_MAPPING: ControllerMapping = [
	{
		buttonIndex: 3,
		queueInteraction: QueueInteraction.answerCardAsAgain,
		buttonGroup: ButtonGroup.faceButton,
		buttonLabel: 'North Button',
	},
	{
		buttonIndex: 12,
		queueInteraction: QueueInteraction.answerCardAsAgain,
		buttonGroup: ButtonGroup.dPad,
		buttonLabel: 'North D-Pad',
	},
	{
		buttonIndex: 6,
		queueInteraction: QueueInteraction.answerCardAsAgain,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Left Trigger',
	},
	{
		buttonIndex: 0,
		queueInteraction: QueueInteraction.answerCardAsEasy,
		buttonGroup: ButtonGroup.faceButton,
		buttonLabel: 'South Button',
	},
	{
		buttonIndex: 13,
		queueInteraction: QueueInteraction.answerCardAsEasy,
		buttonGroup: ButtonGroup.dPad,
		buttonLabel: 'South D-Pad',
	},
	{
		buttonIndex: 7,
		queueInteraction: QueueInteraction.answerCardAsEasy,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Right Trigger',
	},
	{
		buttonIndex: 1,
		queueInteraction: QueueInteraction.answerCardAsGood,
		buttonGroup: ButtonGroup.faceButton,
		buttonLabel: 'East Button',
	},
	{
		buttonIndex: 15,
		queueInteraction: QueueInteraction.answerCardAsGood,
		buttonGroup: ButtonGroup.dPad,
		buttonLabel: 'East D-Pad',
	},
	{
		buttonIndex: 5,
		queueInteraction: QueueInteraction.answerCardAsGood,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Right Bumper',
	},
	{
		buttonIndex: 2,
		queueInteraction: QueueInteraction.answerCardAsHard,
		buttonGroup: ButtonGroup.faceButton,
		buttonLabel: 'West Button',
	},
	{
		buttonIndex: 14,
		queueInteraction: QueueInteraction.answerCardAsHard,
		buttonGroup: ButtonGroup.dPad,
		buttonLabel: 'West D-Pad',
	},
	{
		buttonIndex: 4,
		queueInteraction: QueueInteraction.answerCardAsHard,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Left Bumper',
	},
	{
		buttonIndex: 8,
		queueInteraction: QueueInteraction.answerCardAsTooEarly,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Select Button',
	},
	{
		buttonIndex: 9,
		queueInteraction: QueueInteraction.goBackToPreviousCard,
		buttonGroup: ButtonGroup.triggerBumper,
		buttonLabel: 'Start Button',
	},
];
