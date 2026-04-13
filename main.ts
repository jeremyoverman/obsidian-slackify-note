import slackifyMarkdown from 'slackify-markdown';
import { Editor, MarkdownView, Plugin, Notice } from 'obsidian';

export default class SlackifyNote extends Plugin {
	private convertMdToSlack(md: string) {
		const slackMarkdown = slackifyMarkdown(md)

		// Replace Slack links with Markdown links. Obsidian already had this right, but slackify-markdown breaks it.
		let result = slackMarkdown.replace(/<(.*?)\|(.*?)>/g, '[$2]($1)')

		// Replace callouts with quotes
		result = result.replace(/\[\!\w+\][-+]?\s+/, '')

		// Remove zero-width spaces (U+200B) inserted by slackify-markdown around
		// bold/italic/strikethrough markers. These break Slack formatting on macOS
		// because Slack treats ZWS as a non-whitespace char that prevents marker
		// recognition at word boundaries.
		result = result.replace(/\u200B/g, '')

		return result;
	}

	async onload() {
		this.addCommand({
			id: 'slackify-note',
			name: 'Copy note as Slack Markdown',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				// Convert the note to Slack markdown
				const noteMarkdown = editor.getValue()
				const slackMarkdown = this.convertMdToSlack(noteMarkdown)

				// Copy the slackMarkdown to the clipboard
				await navigator.clipboard.writeText(slackMarkdown)

				new Notice('Copied note as Slack Markdown')
			}
		});

		this.addCommand({
			id: 'slackify-selection',
			name: 'Copy selection as Slack Markdown',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				// Convert the note to Slack markdown
				const noteMarkdown = editor.getSelection()
				const slackMarkdown = this.convertMdToSlack(noteMarkdown)

				// Copy the slackMarkdown to the clipboard
				await navigator.clipboard.writeText(slackMarkdown)

				new Notice('Copied selection as Slack Markdown')
			}
		});
	}

	onunload() {

	}
}
