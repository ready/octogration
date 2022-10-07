import testmap from '../../test/testmap'
import htmlifyMarkdown from './htmlifyMarkdown'

const markdownTests: Array<[string, string]> = [
  ['', ''],
  ['hello', 'hello'],
  ['this has spaces', 'this has spaces'],
  ['# do not convert titles', '# do not convert titles'],
  ['this is a `code` block', 'this is a <code>code</code> block'],
  ['this is `two` code `blocks`', 'this is <code>two</code> code <code>blocks</code>'],
  ['this is a `code block with spaces`', 'this is a <code>code block with spaces</code>'],
  ['an unfinished `code block', 'an unfinished `code block'],
  ['a `code` block and unfinished `code block', 'a <code>code</code> block and unfinished `code block'],
  ['some _italics_', 'some <em>italics</em>'],
  ['_two_ _italics_', '<em>two</em> <em>italics</em>'],
  ['some *italics*', 'some <em>italics</em>'],
  ['*two* *italics*', '<em>two</em> <em>italics</em>'],
  ['*different* _italics_', '<em>different</em> <em>italics</em>'],
  ['*intermingled_ _italics*', '<em>intermingled_ _italics</em>'],
  ['_intermingled* *italics_', '<em>intermingled* *italics</em>'],
  ['*intermingled_ *italics_', '*intermingled_ *italics_'],
  ['some __bold__', 'some <strong>bold</strong>'],
  ['__two__ __bold__', '<strong>two</strong> <strong>bold</strong>'],
  ['some **bold**', 'some <strong>bold</strong>'],
  ['**two** **bold**', '<strong>two</strong> <strong>bold</strong>'],
  ['**different** __bold__', '<strong>different</strong> <strong>bold</strong>'],
  ['**intermingled__ __bold**', '<strong>intermingled__ __bold</strong>'],
  ['__intermingled** **bold__', '<strong>intermingled** **bold</strong>'],
  ['**intermingled__ **bold__', '**intermingled__ **bold__']
]

const msg = 'HTMLify markdown message "%s"'
testmap(markdownTests, msg, htmlifyMarkdown)
