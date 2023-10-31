import slackifyMarkdown from 'slackify-markdown';
import { Editor, MarkdownView, Plugin } from 'obsidian';

export default class SlackifyNote extends Plugin {
	private fixFormatting(md: string) {
		let result = md.replace(/<(.*?)\|(.*?)>/g, '[$2]($1)')
		result = result.replace(/\[\!\w+\][-+]?\s+/, '')

		return result;
	}

	async onload() {
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'slackify-note',
			name: 'Copy note as Slack Markdown',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				// Convert the note to Slack markdown
				const noteMarkdown = editor.getValue()
				const slackMarkdown = this.fixFormatting(slackifyMarkdown(noteMarkdown))

				// Copy the slackMarkdown to the clipboard
				await navigator.clipboard.writeText(slackMarkdown)
			}
		});
	}

	onunload() {

	}
}
