import bleach


ALLOWED_RICH_TEXT_TAGS = {
    'a',
    'blockquote',
    'br',
    'code',
    'em',
    'h2',
    'h3',
    'h4',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'ul',
}

ALLOWED_RICH_TEXT_ATTRIBUTES = {
    'a': ['href', 'rel', 'target', 'title'],
}


def sanitize_plain_text(value):
    return bleach.clean(value or '', tags=[], attributes={}, strip=True).strip()


def sanitize_rich_text(value):
    return bleach.clean(
        value or '',
        tags=ALLOWED_RICH_TEXT_TAGS,
        attributes=ALLOWED_RICH_TEXT_ATTRIBUTES,
        protocols={'http', 'https', 'mailto'},
        strip=True,
    ).strip()
