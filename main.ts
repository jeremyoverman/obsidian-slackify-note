import slackifyMarkdown from 'slackify-markdown';
import { Editor, MarkdownView, Plugin } from 'obsidian';

export default class SlackifyNote extends Plugin {
	private convertMdToSlack(md: string) {
		const slackMarkdown = slackifyMarkdown(md)

		// Replace Slack links with Markdown links. Obsidian already had this right, but slackify-markdown breaks it.
		let result = slackMarkdown.replace(/<(.*?)\|(.*?)>/g, '[$2]($1)')

		// Replace callouts with quotes
		result = result.replace(/\[\!\w+\][-+]?\s+/, '')

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
			}
		});
	}

	onunload() {

	}
}
