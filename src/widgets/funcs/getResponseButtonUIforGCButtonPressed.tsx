import { QueueInteractionScore } from '@remnote/plugin-sdk';

export function getResponseButtonUIforGCButtonPressed(buttonIndex: number): string {
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
