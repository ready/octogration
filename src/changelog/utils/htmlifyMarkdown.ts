import { marked } from 'marked'

/**
 * Parses a markdown message and returns the HTML equivalent
 * @param message - a string in markdown
 * @returns html verion of the message
 */
export default function htmlifyMarkdown (message: string): string {
  return marked.parseInline(message)
}
