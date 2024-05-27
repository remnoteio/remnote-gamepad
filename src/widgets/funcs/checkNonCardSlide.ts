import { QueueItemType } from '@remnote/plugin-sdk';

export function checkNonCardSlide(input: number | QueueItemType): boolean {
	const cardSlides = new Set([1, 2, 3, 5]);
	return !cardSlides.has(input);
}
