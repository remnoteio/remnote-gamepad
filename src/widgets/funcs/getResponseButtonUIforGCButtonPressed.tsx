import { QueueInteractionScore } from '@remnote/plugin-sdk';
import { QueueInteraction } from './buttonMapping';

export function getResponseButtonUI(buttonIndex: number): string {
	return `rn-queue__answer-btn--${mapButtonNameToWord(buttonIndex)}`;
}

function mapButtonNameToWord(QueueIntScore: number) {
	switch (QueueIntScore) {
		case QueueInteractionScore.AGAIN:
			return 'forgotten';
		case QueueInteractionScore.EASY:
			return 'immediately';
		case QueueInteractionScore.HARD:
			return 'partial';
		case QueueInteractionScore.GOOD:
			return 'with-effort';
		case QueueInteractionScore.TOO_EARLY:
			return 'too-soon';
		default:
			return 'Unknown';
	}
}

export function mapQueueInteractionToEmoji(QueueIntScore: QueueInteraction) {
	switch (QueueIntScore) {
		case QueueInteraction.answerCardAsAgain:
			return '❌';
		case QueueInteraction.answerCardAsEasy:
			return '👑';
		case QueueInteraction.answerCardAsHard:
			return '😬';
		case QueueInteraction.answerCardAsGood:
			return '😄';
		case QueueInteraction.answerCardAsTooEarly:
			return '⏩';
		case QueueInteraction.answerCardAsViewedAsLeech:
			return '🦠';
		case QueueInteraction.resetCard:
			return '🔄';
		case QueueInteraction.hideAnswer:
			return '👁️';
		case QueueInteraction.goBackToPreviousCard:
			return '⏪';
		default:
			return '❓';
	}
}
