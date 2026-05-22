(function () {
    function button(label, command, value) {
        const control = document.createElement('button');
        control.type = 'button';
        control.textContent = label;
        control.dataset.command = command;

        if (value) {
            control.dataset.value = value;
        }

        return control;
    }

    function sync(source, editor) {
        source.value = editor.innerHTML;
    }

    function link(editor) {
        const href = window.prompt('Link URL');

        if (href) {
            editor.focus();
            document.execCommand('createLink', false, href);
        }
    }

    function editorFor(source) {
        if (source.dataset.richTextReady) {
            return;
        }

        source.dataset.richTextReady = 'true';

        const shell = document.createElement('div');
        shell.className = 'rich-text-shell';

        const toolbar = document.createElement('div');
        toolbar.className = 'rich-text-toolbar';

        const format = document.createElement('select');
        [
            ['p', 'Paragraph'],
            ['h2', 'Heading 2'],
            ['h3', 'Heading 3'],
            ['h4', 'Heading 4'],
        ].forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            format.append(option);
        });

        toolbar.append(
            format,
            button('Bold', 'bold'),
            button('Italic', 'italic'),
            button('Bullets', 'insertUnorderedList'),
            button('Numbers', 'insertOrderedList'),
            button('Quote', 'formatBlock', 'blockquote'),
            button('Link', 'link'),
            button('Remove style', 'removeFormat'),
        );

        const editor = document.createElement('div');
        editor.className = 'rich-text-editor';
        editor.contentEditable = 'true';
        editor.innerHTML = source.value;
        editor.setAttribute('role', 'textbox');
        editor.setAttribute('aria-multiline', 'true');
        editor.setAttribute('aria-label', 'Rich text content');

        format.addEventListener('change', () => {
            editor.focus();
            document.execCommand('formatBlock', false, format.value);
            sync(source, editor);
        });

        toolbar.addEventListener('click', event => {
            const control = event.target.closest('button');

            if (!control) {
                return;
            }

            editor.focus();

            if (control.dataset.command === 'link') {
                link(editor);
            } else {
                document.execCommand(control.dataset.command, false, control.dataset.value || null);
            }

            sync(source, editor);
        });

        editor.addEventListener('input', () => sync(source, editor));
        source.form.addEventListener('submit', () => sync(source, editor));

        shell.append(toolbar, editor);
        source.after(shell);
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.rich-text-source').forEach(editorFor);
    });
})();
